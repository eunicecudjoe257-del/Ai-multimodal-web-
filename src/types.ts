export type Plan = 'Free' | 'Go' | 'Pro';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: Attachment[];
  pluginUsed?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  plans: Plan[];
}

export interface AIPlugin {
  id: string;
  name: string;
  icon: string;
  description: string;
}
