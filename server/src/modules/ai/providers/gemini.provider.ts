import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IAIProvider, GenerateOptions, GenerateResult } from './IAIProvider';
import { env } from '../../../config/env';
import { logger } from '../../../utils/logger';

export class GeminiProvider implements IAIProvider {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    // Use the standard text model
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerateResult> {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options?.temperature ?? 0.2, // Low temperature by default for operational consistency
          maxOutputTokens: options?.maxTokens ?? 8192,
          responseMimeType: options?.responseFormat === 'json' ? 'application/json' : 'text/plain',
        },
      });

      const response = result.response;
      let text = response.text();

      // If json format is requested, we do a basic extraction just in case it's wrapped in markdown blocks
      if (options?.responseFormat === 'json') {
        text = this.extractJson(text);
      }

      return {
        text,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
        }
      };
    } catch (error: any) {
      logger.error('Gemini API Error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  private extractJson(text: string): string {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1];
    }
    return text;
  }
}
