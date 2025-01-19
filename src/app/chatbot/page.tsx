import ChatInterface from '@/components/ChatInterface';

export default function ChatbotPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AstroGuru Chat</h1>
        <p className="text-gray-400">
          Ask me anything about your horoscope and spiritual guidance
        </p>
      </div>
      <ChatInterface />
    </div>
  );
} 