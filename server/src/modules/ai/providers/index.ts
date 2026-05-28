import { IAIProvider } from './IAIProvider';
import { GeminiProvider } from './gemini.provider';

let activeProvider: IAIProvider | null = null;

export const getAIProvider = (): IAIProvider => {
  if (!activeProvider) {
    // We instantiate the default provider here. 
    // This allows for easy swapping to a different provider later (e.g. OpenAIProvider).
    activeProvider = new GeminiProvider();
  }
  return activeProvider;
};
