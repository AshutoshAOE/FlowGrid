export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export interface GenerateResult {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAIProvider {
  /**
   * Generates text based on a prompt.
   * This is the core abstraction that all AI providers must implement.
   */
  generateText(prompt: string, options?: GenerateOptions): Promise<GenerateResult>;
}
