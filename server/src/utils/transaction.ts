import mongoose from 'mongoose';
import { logger } from './logger';

/**
 * Helper utility to run MongoDB operations within a transaction.
 * If the local MongoDB is running as a standalone instance (no replica set),
 * it gracefully degrades to running the operations without a transaction,
 * allowing local development to continue seamlessly.
 */
export const runWithTransaction = async <T>(
  operation: (session: mongoose.ClientSession | undefined) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    // Check if the error is due to missing Replica Set in local dev
    if (error.message && error.message.includes('Transaction numbers are only allowed')) {
      logger.warn('⚠️ MongoDB is not a Replica Set. Falling back to non-transactional execution.');
      await session.abortTransaction().catch(() => {});
      session.endSession();
      
      // Re-run the operation without a session
      return await operation(undefined);
    }

    // Normal transaction failure
    await session.abortTransaction().catch(() => {});
    throw error;
  } finally {
    if (!session.hasEnded) {
      session.endSession();
    }
  }
};
