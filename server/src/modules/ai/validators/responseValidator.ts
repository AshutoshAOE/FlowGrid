import { AIInsightResponse } from '../types/ai.types';
import { logger } from '../../../utils/logger';

export const validateAndParseInsightResponse = (rawResponse: string): AIInsightResponse => {
  try {
    // Attempt to parse JSON
    const parsed = JSON.parse(rawResponse);

    // Basic structure validation
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Response is not a valid JSON object');
    }

    if (typeof parsed.summary !== 'string') {
      parsed.summary = 'Operational summary could not be generated cleanly.';
    }

    if (!Array.isArray(parsed.insights)) {
      parsed.insights = [];
    }

    // Sanitize insights
    parsed.insights = parsed.insights.map((insight: any) => ({
      title: String(insight.title || 'Insight'),
      description: String(insight.description || 'Details unavailable.'),
      severity: ['info', 'warning', 'critical'].includes(insight.severity) ? insight.severity : 'info',
      category: ['inventory', 'dispatch', 'shipment', 'fleet', 'optimization', 'system'].includes(insight.category) 
        ? insight.category : 'system',
      recommendedAction: insight.recommendedAction ? String(insight.recommendedAction) : undefined
    }));

    return parsed as AIInsightResponse;

  } catch (error: any) {
    logger.error('Failed to parse AI response', { rawResponse, error: error.message });
    
    // Fallback response
    return {
      summary: 'The AI Intelligence engine encountered an issue while processing the operational data.',
      insights: [
        {
          title: 'Processing Error',
          description: 'Failed to generate structured insights. Please try again.',
          severity: 'warning',
          category: 'system'
        }
      ]
    };
  }
};
