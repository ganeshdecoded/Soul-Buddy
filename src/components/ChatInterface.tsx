"use client";

import { useState, useRef, useEffect } from 'react';
import { LangflowClient } from '@/lib/langflow';
import { Send } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
  error?: boolean;
}

const getTimestamp = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12) || 12;
  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([{
    text: "Hello! I'm AstroGuru, your spiritual guide. How can I assist you today?",
    isUser: false,
    timestamp: getTimestamp()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const langflowClient = new LangflowClient("default-user");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: getTimestamp(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await langflowClient.sendMessage(inputMessage);
      const botMessage: Message = {
        text: response,
        isUser: false,
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: error instanceof Error 
          ? `I apologize, but I encountered an error: ${error.message}. Please try rephrasing your question.`
          : 'I apologize, but I encountered an unexpected error. Please try again in a moment.',
        isUser: false,
        timestamp: getTimestamp(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-purple-600 text-white'
                  : message.error
                  ? 'bg-red-900/50 text-red-100'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-lg p-3 bg-gray-700 text-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your horoscope..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}