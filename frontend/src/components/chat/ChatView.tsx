/**
 * ChatView - Main chat interface (refactored from CareerChat)
 * Displays messages and input for active conversation
 */

import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../ChatMessage';
import type { Message } from '../../types/chat';

interface ChatViewProps {
  conversationId: string | null;
  apiBaseUrl: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ conversationId, apiBaseUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/chat/conversation/${convId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');

    // Add user message optimistically
    const tempUserMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      setSending(true);
      const response = await fetch(`${apiBaseUrl}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
      }

      const result = await response.json();

      // Add assistant message
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Send message error:', error);
      // Remove optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-macBg h-full relative">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full relative">
            {/* Decorative background */}
            <div className="gradient-orb absolute top-[15%] right-[25%] w-[400px] h-[400px] bg-purple-500/8"></div>
            <div className="particle absolute top-[30%] left-[20%]"></div>

            <div className="text-center max-w-2xl px-8 relative z-10 animate-scale-in">
              {/* Icon with gradient */}
              <div className="w-24 h-24 mx-auto mb-6 gradient-accent-subtle rounded-3xl flex items-center justify-center shadow-xl animate-glow-pulse">
                <svg className="w-12 h-12 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gradient mb-3">
                Hi! I'm SerenityOps AI
              </h3>
              <p className="text-base text-macSubtext mb-8 leading-relaxed">
                Your career intelligence assistant with full context of your CV, projects, and opportunities. Let's optimize your career journey together.
              </p>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {[
                  { icon: '📊', title: 'Track Projects', desc: 'Add new experiences and achievements' },
                  { icon: '✨', title: 'CV Improvements', desc: 'Get personalized recommendations' },
                  { icon: '🎯', title: 'Job Analysis', desc: 'Evaluate new opportunities' },
                  { icon: '🔍', title: 'Extract Data', desc: 'Parse text and documents' }
                ].map((item, i) => (
                  <div key={i} className="liquid-glass rounded-xl p-4 text-left hover-lift transition-all duration-300 border border-macBorder/30">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h4 className="text-sm font-semibold text-macText mb-1">{item.title}</h4>
                    <p className="text-xs text-macSubtext">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                <div
                  className={`max-w-4xl rounded-2xl px-5 py-4 backdrop-blur-md transition-all duration-300 ease-mac shadow-lg ${
                    msg.role === 'user'
                      ? 'gradient-accent text-white shadow-accent'
                      : 'liquid-glass border border-macBorder/40 text-macText'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {msg.role === 'assistant' && (
                      <div className="shrink-0 w-8 h-8 rounded-xl bg-macAccent/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <ChatMessage content={msg.content} role={msg.role} apiBaseUrl={apiBaseUrl} />
                      <p
                        className={`text-xs mt-3 ${
                          msg.role === 'user' ? 'text-white/60' : 'text-macSubtext'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="shrink-0 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start animate-slide-up">
                <div className="liquid-glass border border-macBorder/40 rounded-2xl px-5 py-4 max-w-4xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-macAccent/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-macAccent rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-macAccent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-macAccent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Enhanced */}
      <div className="px-6 py-4 border-t border-macBorder/40 liquid-glass backdrop-blur-xl">
        <div className="flex gap-3 items-end max-w-5xl mx-auto">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 px-4 py-3 liquid-glass border border-macBorder/40 rounded-xl text-macText text-sm placeholder-macSubtext focus:outline-none focus:ring-2 focus:ring-macAccent/50 focus:border-macAccent resize-none transition-all duration-300 ease-mac shadow-sm"
            rows={3}
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !inputMessage.trim()}
            className="px-6 py-3 gradient-accent text-white text-sm font-semibold rounded-xl transition-all duration-300 ease-mac disabled:opacity-50 disabled:cursor-not-allowed hover-lift shadow-lg hover:shadow-accent group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
            {sending ? (
              <svg className="animate-spin h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
