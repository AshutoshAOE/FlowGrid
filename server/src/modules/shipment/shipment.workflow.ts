import { ValidationError } from '../../utils/errors/AppError';
import { ALLOWED_TRANSITIONS, ShipmentStatus } from './shipment.constants';

/**
 * Validates if a transition from currentStatus to targetStatus is allowed by the FSM.
 * Throws a ValidationError if the transition is prohibited.
 */
export const validateTransition = (currentStatus: string, targetStatus: string): void => {
  const allowedNextStates = ALLOWED_TRANSITIONS[currentStatus as ShipmentStatus] || [];
  
  if (!allowedNextStates.includes(targetStatus as ShipmentStatus)) {
    throw new ValidationError(
      `Invalid operational transition: Cannot move shipment from '${currentStatus}' to '${targetStatus}'.`
    );
  }
};
