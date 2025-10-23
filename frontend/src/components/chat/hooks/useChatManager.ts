/**
 * Zustand store for Chat Manager
 * Handles CRUD operations, filtering, sorting, and persistence
 */

import { create } from 'zustand';
import type { ChatStore, Chat, SortOption } from '../../../types/chat';

const API_BASE_URL = 'http://localhost:8000/api';

// localStorage keys
const STORAGE_KEYS = {
  activeChat: 'serenity_active_chat_id',
  filter: 'serenity_chat_filter',
  sortBy: 'serenity_chat_sort',
};

export const useChatManager = create<ChatStore>((set) => ({
  // State
  chats: [],
  activeChat: null,
  filter: localStorage.getItem(STORAGE_KEYS.filter) || '',
  sortBy: (localStorage.getItem(STORAGE_KEYS.sortBy) as SortOption) || 'date-desc',
  isLoading: false,
  isSaving: false,
  error: undefined,

  // Load all chats
  loadChats: async () => {
    set({ isLoading: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/chat/list`);
      if (!response.ok) throw new Error('Failed to load chats');

      const data = await response.json();
      set({ chats: data.chats || [], isLoading: false });

      // Restore active chat from localStorage if exists
      const savedActiveChat = localStorage.getItem(STORAGE_KEYS.activeChat);
      if (savedActiveChat && data.chats?.some((c: Chat) => c.id === savedActiveChat)) {
        set({ activeChat: savedActiveChat });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Create new chat
  createChat: async (name?: string) => {
    set({ isSaving: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/chat/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || undefined }),
      });

      if (!response.ok) throw new Error('Failed to create chat');

      const newChat: Chat = await response.json();

      // Add to local state
      set((state) => ({
        chats: [newChat, ...state.chats],
        activeChat: newChat.id,
        isSaving: false,
      }));

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.activeChat, newChat.id);

      return newChat;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isSaving: false, error: errorMessage });
      throw error;
    }
  },

  // Rename chat
  renameChat: async (id: string, name: string) => {
    set({ isSaving: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${id}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to rename chat');

      // Update local state
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === id ? { ...chat, name, last_updated: new Date().toISOString() } : chat
        ),
        isSaving: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isSaving: false, error: errorMessage });
      throw error;
    }
  },

  // Duplicate chat
  duplicateChat: async (id: string) => {
    set({ isSaving: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to duplicate chat');

      const duplicated: Chat = await response.json();

      // Add to local state
      set((state) => ({
        chats: [duplicated, ...state.chats],
        isSaving: false,
      }));

      return duplicated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isSaving: false, error: errorMessage });
      throw error;
    }
  },

  // Delete chat
  deleteChat: async (id: string) => {
    set({ isSaving: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete chat');

      // Remove from local state
      set((state) => {
        const newActiveChat = state.activeChat === id ? null : state.activeChat;
        if (newActiveChat === null) {
          localStorage.removeItem(STORAGE_KEYS.activeChat);
        }

        return {
          chats: state.chats.filter((chat) => chat.id !== id),
          activeChat: newActiveChat,
          isSaving: false,
        };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isSaving: false, error: errorMessage });
      throw error;
    }
  },

  // Archive/unarchive chat
  archiveChat: async (id: string, archived: boolean) => {
    set({ isSaving: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived }),
      });

      if (!response.ok) throw new Error('Failed to archive chat');

      // Update local state
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === id ? { ...chat, archived, last_updated: new Date().toISOString() } : chat
        ),
        isSaving: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isSaving: false, error: errorMessage });
      throw error;
    }
  },

  // Set active chat
  setActiveChat: (id: string | null) => {
    set({ activeChat: id });
    if (id) {
      localStorage.setItem(STORAGE_KEYS.activeChat, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeChat);
    }
  },

  // Set filter
  setFilter: (filter: string) => {
    set({ filter });
    localStorage.setItem(STORAGE_KEYS.filter, filter);
  },

  // Set sort option
  setSortBy: (sortBy: SortOption) => {
    set({ sortBy });
    localStorage.setItem(STORAGE_KEYS.sortBy, sortBy);
  },
}));
