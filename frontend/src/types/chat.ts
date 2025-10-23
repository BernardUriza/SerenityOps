/**
 * Chat type definitions for SerenityOps
 * Manages conversation metadata and messages
 */

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  message_count: number;
  created_at: string;
  last_updated: string;
  archived: boolean;
}

export type SortOption = 'date-desc' | 'date-asc' | 'name' | 'messages';

export interface ChatStore {
  // State
  chats: Chat[];
  activeChat: string | null;
  filter: string;
  sortBy: SortOption;
  isLoading: boolean;
  isSaving: boolean;
  error: string | undefined;

  // Actions
  loadChats: () => Promise<void>;
  createChat: (name?: string) => Promise<Chat>;
  renameChat: (id: string, name: string) => Promise<void>;
  duplicateChat: (id: string) => Promise<Chat>;
  deleteChat: (id: string) => Promise<void>;
  archiveChat: (id: string, archived: boolean) => Promise<void>;
  setActiveChat: (id: string | null) => void;
  setFilter: (filter: string) => void;
  setSortBy: (sort: SortOption) => void;
}

export interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onRename: (newName: string) => Promise<void>;
  onDuplicate: () => Promise<void>;
  onDelete: () => Promise<void>;
  onArchive: (archived: boolean) => Promise<void>;
}

export interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
}

export interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
