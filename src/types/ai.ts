export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  choices: LLMChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface LLMChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface LLMConfig {
  apiKey: string;
  endpoint: string;
  model: string;
  siteUrl?: string;
  siteName?: string;
}