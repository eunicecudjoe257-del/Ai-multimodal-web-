import { Plan } from '../src/types';

export const ModelMapping: Record<string, Record<Plan, string>> = {
  grok: {
    Free: 'grok-free-model',
    Go: 'grok-go-model',
    Pro: 'grok-pro-model',
  },
  gemini: {
    Free: 'gemini-flash-lite',
    Go: 'gemini-flash-pro',
    Pro: 'gemini-pro-1.5',
  },
  openai: {
    Free: 'gpt-4o-mini',
    Go: 'gpt-4o',
    Pro: 'o1',
  },
  meta: {
    Free: 'llama-3.1-8b',
    Go: 'llama-3.1-70b',
    Pro: 'llama-3.1-405b',
  },
};
