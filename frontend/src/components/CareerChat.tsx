import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  date: string;
  message_count: number;
  last_updated: string;
}

interface CareerChatProps {
  apiBaseUrl: string;
}

const CareerChat: React.FC<CareerChatProps> = ({ apiBaseUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
    autoLoadLastConversation();
  }, []);

  // Save conversation ID to localStorage whenever it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('serenity_last_conversation_id', conversationId);
    }
  }, [conversationId]);

  const autoLoadLastConversation = async () => {
    try {
      // Try localStorage first
      const lastId = localStorage.getItem('serenity_last_conversation_id');

      if (lastId) {
        // Verify it still exists on backend
        const response = await fetch(`${apiBaseUrl}/api/chat/conversation/${lastId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
          setConversationId(lastId);
          return;
        }
      }

      // Fallback: load most recent from backend
      const lastResponse = await fetch(`${apiBaseUrl}/api/chat/last`);
      if (lastResponse.ok) {
        const data = await lastResponse.json();
        if (data.conversation) {
          setMessages(data.conversation.messages || []);
          setConversationId(data.conversation.session.id);
        }
      }
    } catch (error) {
      console.error('Failed to auto-load conversation:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/conversations`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/conversation/${convId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setConversationId(convId);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      showNotification('Failed to load conversation', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');

    // Add user message optimistically
    const tempUserMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      setSending(true);
      const response = await fetch(`${apiBaseUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
      }

      const result = await response.json();

      // Update conversation ID if this is a new conversation
      if (!conversationId) {
        setConversationId(result.conversation_id);
      }

      // Add assistant message
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Show action suggestion if present
      if (result.action_suggested) {
        showNotification(`Action suggested: ${result.action_suggested.type}`, 'success');
      }

      // Reload conversations list
      loadConversations();
    } catch (error) {
      console.error('Send message error:', error);
      showNotification(error instanceof Error ? error.message : 'Failed to send message', 'error');
      // Remove optimistic user message on error
      setMessages(prev => prev.slice(0, -1));
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

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setShowHistory(false);
    // Clear localStorage to start fresh
    localStorage.removeItem('serenity_last_conversation_id');
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Conversation History */}
      <div className={`${showHistory ? 'w-64' : 'w-12'} bg-macBg border-r border-macBorder/40 transition-all duration-300 ease-mac flex flex-col`}>
        <div className="p-3 border-b border-macBorder/40 flex items-center justify-between">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-macHover/60 rounded-mac transition-all duration-300 ease-mac"
            title={showHistory ? 'Hide history' : 'Show history'}
          >
            <svg className="w-5 h-5 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {showHistory && (
            <button
              onClick={startNewConversation}
              className="p-2 hover:bg-macHover/60 rounded-mac transition-all duration-300 ease-mac"
              title="New conversation"
            >
              <svg className="w-5 h-5 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {showHistory && (
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <p className="text-sm text-macSubtext text-center mt-4">No conversations yet</p>
            ) : (
              <div className="space-y-4">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-mac transition-all duration-300 ease-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] ${
                      conversationId === conv.id
                        ? 'bg-blue-900/30 border border-blue-700'
                        : 'hover:bg-macHover/60 border border-transparent'
                    }`}
                  >
                    <div className="text-sm font-medium text-macText truncate">
                      Conversation
                    </div>
                    <div className="text-xs text-macSubtext mt-1">
                      {conv.message_count} messages
                    </div>
                    <div className="text-xs text-macSubtext mt-1">
                      {new Date(conv.date).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-macBg">
        {/* Header */}
        <div className="p-6 border-b border-macBorder/40 bg-macPanel/50 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-macText flex items-center">
            <span className="text-2xl mr-3">💬</span>
            Career Chat
          </h2>
          <p className="text-macSubtext mt-1">
            Conversational AI assistant with full context of your career
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-macText mb-2">
                  Hi! I'm SerenityOps
                </h3>
                <p className="text-macSubtext mb-4">
                  Your career intelligence assistant. I have full context of your CV, projects, and opportunities.
                </p>
                <div className="bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-mac p-4 text-left shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                  <p className="text-sm text-macText font-medium mb-2">You can ask me to:</p>
                  <ul className="space-y-1 text-sm text-macSubtext">
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
                    className={`max-w-3xl rounded-mac p-4 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.2)] ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-macPanel/50 border border-macBorder/40 text-macText'
                    }`}
                  >
                    <div className="flex items-start">
                      {msg.role === 'assistant' && (
                        <span className="text-2xl mr-3 flex-shrink-0">🤖</span>
                      )}
                      <div className="flex-1">
                        <ChatMessage content={msg.content} role={msg.role} apiBaseUrl={apiBaseUrl} />
                        <p className={`text-xs mt-2 ${
                          msg.role === 'user' ? 'text-blue-200' : 'text-macSubtext'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {msg.role === 'user' && (
                        <span className="text-2xl ml-3 flex-shrink-0">👤</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-mac p-4 max-w-3xl shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-macBorder/40 bg-macPanel/50 backdrop-blur-md">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="flex-1 px-4 py-3 bg-macBg border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext focus:outline-none focus:ring-2 focus:ring-macAccent focus:border-transparent resize-none transition-all duration-300 ease-mac"
              rows={2}
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-mac transition-all duration-300 ease-mac disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {sending ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className={`rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-md p-4 max-w-md border ${
              notification.type === 'success'
                ? 'bg-emerald-900 border-emerald-700'
                : 'bg-red-900 border-red-700'
            }`}>
              <p className={`text-sm ${
                notification.type === 'success' ? 'text-emerald-100' : 'text-red-100'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerChat;
