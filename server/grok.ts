export async function callGrok(model: string, message: string, attachments: any[]) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error('GROK_API_KEY not configured');
  
  // Real implementation would be here
  return `Grok (${model}) response to: ${message}`;
}
