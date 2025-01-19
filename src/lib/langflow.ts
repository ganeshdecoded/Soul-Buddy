"use client";

export class LangflowClient {
  private baseURL: string;
  private flowId: string;
  private langflowId: string;
  private userId: string;

  constructor(userId: string) {
    this.baseURL = '/api/langflow';
    this.flowId = '2fca8d2a-4453-4e82-b6dc-ef9b6174e418';
    this.langflowId = '3ddc1b67-714d-4aa3-8c18-6e6c693596c5';
    this.userId = userId;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      console.log('Sending message:', message);
      
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          flowId: this.flowId,
          langflowId: this.langflowId,
          userId: this.userId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      return data.message || 'I apologize, but I was unable to process your request.';
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }
} 