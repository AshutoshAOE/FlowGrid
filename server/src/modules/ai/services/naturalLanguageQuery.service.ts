import mongoose from 'mongoose';
import { getAIProvider } from '../providers';
import { buildCompanyOperationalContext } from '../context/operationalContext.builder';
import { FLOWGRID_SYSTEM_PROMPT } from '../prompts/system.prompts';
import { buildNaturalLanguageQueryPrompt } from '../prompts/insight.prompts';
import { validateAndParseInsightResponse } from '../validators/responseValidator';
import { AIInsightResponse } from '../types/ai.types';
import { AppError } from '../../../utils/errors/AppError';

export const processNaturalLanguageQuery = async (companyId: mongoose.Types.ObjectId, query: string): Promise<AIInsightResponse> => {
  try {
    if (!query || query.trim().length === 0) {
      throw new AppError('Query cannot be empty', 400);
    }

    // 1. Gather structured operational context
    // In a more advanced version, this could fetch only context relevant to the query 
    // using RAG or intent classification. For now, we use the global summary context.
    const context = await buildCompanyOperationalContext(companyId);

    // 2. Build prompts
    const prompt = `${FLOWGRID_SYSTEM_PROMPT}\n\n${buildNaturalLanguageQueryPrompt(context, query)}`;

    // 3. Invoke AI Provider
    const aiProvider = getAIProvider();
    const result = await aiProvider.generateText(prompt, { 
      responseFormat: 'json',
      temperature: 0.1 // Very low temp for fact-retrieval
    });

    // 4. Validate and sanitize response
    return validateAndParseInsightResponse(result.text);

  } catch (error: any) {
    throw new AppError(`Failed to process query: ${error.message}`, 500);
  }
};
