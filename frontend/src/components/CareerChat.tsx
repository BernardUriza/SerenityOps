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
  }, []);

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
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Conversation History */}
      <div className={`${showHistory ? 'w-64' : 'w-12'} bg-slate-900 border-r border-slate-700 transition-all duration-300 flex flex-col`}>
        <div className="p-3 border-b border-slate-700 flex items-center justify-between">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
            title={showHistory ? 'Hide history' : 'Show history'}
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {showHistory && (
            <button
              onClick={startNewConversation}
              className="p-2 hover:bg-slate-800 rounded transition-colors"
              title="New conversation"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {showHistory && (
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <p className="text-sm text-slate-500 text-center mt-4">No conversations yet</p>
            ) : (
              <div className="space-y-2">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      conversationId === conv.id
                        ? 'bg-blue-900/30 border border-blue-700'
                        : 'hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-300 truncate">
                      Conversation
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {conv.message_count} messages
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
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
      <div className="flex-1 flex flex-col bg-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-900">
          <h2 className="text-2xl font-bold text-slate-50 flex items-center">
            <span className="text-2xl mr-3">💬</span>
            Career Chat
          </h2>
          <p className="text-slate-400 mt-1">
            Conversational AI assistant with full context of your career
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Hi! I'm SerenityOps
                </h3>
                <p className="text-slate-400 mb-4">
                  Your career intelligence assistant. I have full context of your CV, projects, and opportunities.
                </p>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-left">
                  <p className="text-sm text-slate-300 font-medium mb-2">You can ask me to:</p>
                  <ul className="space-y-1 text-sm text-slate-400">
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
                    className={`max-w-3xl rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 border border-slate-700 text-slate-100'
                    }`}
                  >
                    <div className="flex items-start">
                      {msg.role === 'assistant' && (
                        <span className="text-2xl mr-3 flex-shrink-0">🤖</span>
                      )}
                      <div className="flex-1">
                        <ChatMessage content={msg.content} role={msg.role} />
                        <p className={`text-xs mt-2 ${
                          msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'
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
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-w-3xl">
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
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
            <div className={`rounded-lg shadow-lg p-4 max-w-md border ${
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
