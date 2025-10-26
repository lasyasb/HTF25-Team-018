'use client';

import { useState } from 'react';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { resumeChatbot } from '@/ai/flows/resume-chatbot';
import type { ChatMessage } from '@/ai/flows/resume-chatbot-types';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await resumeChatbot({ history: newMessages });
      const botMessage: ChatMessage = { role: 'model', content: response };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Card className="flex flex-col h-[70vh]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              Resume AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto space-y-4 p-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Ask me anything about building your resume!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.content}
                  </div>
                   {msg.role === 'user' && (
                    <div className="p-2 bg-muted rounded-full">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
               <div className="flex items-start gap-3 justify-start">
                  <div className="p-2 bg-primary/10 rounded-full">
                      <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                  </div>
               </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading} onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
