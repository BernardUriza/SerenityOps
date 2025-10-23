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
    <div className="flex-1 flex flex-col bg-surface h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                Hi! I'm SerenityOps
              </h3>
              <p className="text-xs text-text-secondary mb-3">
                Your career intelligence assistant. I have full context of your CV, projects, and
                opportunities.
              </p>
              <div className="bg-surface-elevated border border-border rounded p-3 text-left">
                <p className="text-xs text-text-primary font-medium mb-2">You can ask me to:</p>
                <ul className="space-y-1 text-xs text-text-secondary">
                  <li>• Track new projects and experiences</li>
                  <li>• Suggest CV improvements</li>
                  <li>• Analyze job opportunities</li>
                  <li>• Extract information from text</li>
                  <li>• Review your career progression</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded p-2 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-surface-elevated border border-border text-text-primary'
                  }`}
                >
                  <div className="flex items-start">
                    {msg.role === 'assistant' && (
                      <span className="text-lg mr-2 flex-shrink-0">🤖</span>
                    )}
                    <div className="flex-1">
                      <ChatMessage content={msg.content} role={msg.role} apiBaseUrl={apiBaseUrl} />
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-white/70' : 'text-text-tertiary'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.role === 'user' && <span className="text-lg ml-2 flex-shrink-0">👤</span>}
                  </div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-surface-elevated border border-border rounded p-2 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-2 border-t border-border bg-surface-elevated">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 px-2 py-1.5 bg-surface border border-border rounded text-text-primary text-xs placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary resize-none transition-all"
            rows={2}
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !inputMessage.trim()}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {sending ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
