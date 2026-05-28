import mongoose from 'mongoose';
import { getAIProvider } from '../providers';
import { buildCompanyOperationalContext } from '../context/operationalContext.builder';
import { FLOWGRID_SYSTEM_PROMPT } from '../prompts/system.prompts';
import { buildOperationalSummaryPrompt } from '../prompts/insight.prompts';
import { validateAndParseInsightResponse } from '../validators/responseValidator';
import { AIInsightResponse } from '../types/ai.types';
import { AppError } from '../../../utils/errors/AppError';

export const generateOperationalSummary = async (companyId: mongoose.Types.ObjectId): Promise<AIInsightResponse> => {
  try {
    // 1. Gather structured operational context
    const context = await buildCompanyOperationalContext(companyId);

    // 2. Build prompts
    const prompt = `${FLOWGRID_SYSTEM_PROMPT}\n\n${buildOperationalSummaryPrompt(context)}`;

    // 3. Invoke AI Provider
    const aiProvider = getAIProvider();
    const result = await aiProvider.generateText(prompt, { 
      responseFormat: 'json',
      temperature: 0.3 // Keep it relatively analytical
    });

    // 4. Validate and sanitize response
    return validateAndParseInsightResponse(result.text);

  } catch (error: any) {
    throw new AppError(`Failed to generate operational insights: ${error.message}`, 500);
  }
};
