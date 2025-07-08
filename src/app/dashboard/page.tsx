'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { psychologicalSupportAssistant } from '@/ai/flows/psychological-support-assistant';
import { Skeleton } from '@/components/ui/skeleton';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export default function DashboardPage() {
  const { surveyData, translations } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with a welcoming message from the AI
    setMessages([{ sender: 'ai', text: translations.chatWelcome }]);
  }, [translations.chatWelcome]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, newUserMessage]
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join('\n');
      
      const surveyDataString = surveyData ? JSON.stringify(surveyData) : 'No survey data available.';

      const response = await psychologicalSupportAssistant({
        surveyData: surveyDataString,
        conversationHistory,
        userMessage: input,
      });
      
      if (response && response.aiResponse) {
        setMessages(prev => [...prev, { sender: 'ai', text: response.aiResponse }]);
      }
    } catch (error) {
      console.error("Error with AI assistant:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having some trouble right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-4">
      <div className="flex-1 flex flex-col bg-card/50 border rounded-xl shadow-sm overflow-hidden">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-4', { 'justify-end': message.sender === 'user' })}
              >
                {message.sender === 'ai' && (
                  <Avatar className="border-2 border-primary/50">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-2xl px-4 py-3 text-base md:text-sm shadow-md',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  )}
                >
                  <p style={{fontFamily: "'Alegreya', serif"}} className="leading-relaxed">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="border-2 border-accent/50">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                 <Avatar className="border-2 border-primary/50">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-md rounded-2xl px-4 py-3 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-background">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={translations.chatPlaceholder}
              className="flex-1"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{translations.chatSend}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
