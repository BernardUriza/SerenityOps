/**
 * Icon Registry - Central icon mapping
 * Single Source of Truth for all icons
 * Follows Open/Closed Principle: Easy to extend
 */

import type { IconMetadata } from '../types';
import { IconCategory } from '../types';
import { BriefcaseIcon } from '../components/BriefcaseIcon';
import { RocketIcon } from '../components/RocketIcon';
import { TargetIcon } from '../components/TargetIcon';
import { ChartBarIcon } from '../components/ChartBarIcon';
import { LightbulbIcon } from '../components/LightbulbIcon';
import { WrenchIcon } from '../components/WrenchIcon';
import { DocumentIcon } from '../components/DocumentIcon';
import { CheckCircleIcon } from '../components/CheckCircleIcon';
import { LightningIcon } from '../components/LightningIcon';
import { FlameIcon } from '../components/FlameIcon';
import { TrophyIcon } from '../components/TrophyIcon';
import { GraduationCapIcon } from '../components/GraduationCapIcon';
import { StarIcon } from '../components/StarIcon';
import { MessageCircleIcon } from '../components/MessageCircleIcon';
import { DownloadIcon } from '../components/DownloadIcon';
import { UserIcon } from '../components/UserIcon';
import { FileIcon } from '../components/FileIcon';
import { DollarSignIcon } from '../components/DollarSignIcon';
import { CreditCardIcon } from '../components/CreditCardIcon';
import { FolderIcon } from '../components/FolderIcon';
import { MailIcon } from '../components/MailIcon';
import { SparklesIcon } from '../components/SparklesIcon';
import { SearchIcon } from '../components/SearchIcon';
import { BrainIcon } from '../components/BrainIcon';
import { TieIcon } from '../components/TieIcon';

/**
 * Icon Registry Map
 * DRY: Single place to register all icons
 */
export const ICON_REGISTRY: Record<string, IconMetadata> = {
  briefcase: {
    name: 'briefcase',
    category: IconCategory.BUSINESS,
    component: BriefcaseIcon,
    keywords: ['work', 'job', 'career', 'business', 'professional', 'case'],
    defaultColor: 'text-macAccent',
  },
  rocket: {
    name: 'rocket',
    category: IconCategory.BUSINESS,
    component: RocketIcon,
    keywords: ['launch', 'startup', 'innovation', 'speed', 'growth', 'project'],
    defaultColor: 'text-purple-500',
  },
  target: {
    name: 'target',
    category: IconCategory.BUSINESS,
    component: TargetIcon,
    keywords: ['goal', 'objective', 'aim', 'focus', 'achievement'],
    defaultColor: 'text-cyan-500',
  },
  'chart-bar': {
    name: 'chart-bar',
    category: IconCategory.BUSINESS,
    component: ChartBarIcon,
    keywords: ['analytics', 'metrics', 'data', 'statistics', 'graph', 'performance'],
    defaultColor: 'text-indigo-500',
  },
  lightbulb: {
    name: 'lightbulb',
    category: IconCategory.GENERAL,
    component: LightbulbIcon,
    keywords: ['idea', 'innovation', 'creativity', 'inspiration', 'solution'],
    defaultColor: 'text-yellow-400',
  },
  wrench: {
    name: 'wrench',
    category: IconCategory.TECHNOLOGY,
    component: WrenchIcon,
    keywords: ['tool', 'settings', 'config', 'repair', 'maintenance', 'development'],
    defaultColor: 'text-gray-500',
  },
  document: {
    name: 'document',
    category: IconCategory.GENERAL,
    component: DocumentIcon,
    keywords: ['file', 'paper', 'document', 'text', 'write', 'note'],
    defaultColor: 'text-macText',
  },
  'check-circle': {
    name: 'check-circle',
    category: IconCategory.STATUS,
    component: CheckCircleIcon,
    keywords: ['success', 'complete', 'done', 'verified', 'approved', 'confirmed'],
    defaultColor: 'text-success',
  },
  lightning: {
    name: 'lightning',
    category: IconCategory.GENERAL,
    component: LightningIcon,
    keywords: ['fast', 'speed', 'energy', 'power', 'quick', 'instant'],
    defaultColor: 'text-yellow-500',
  },
  flame: {
    name: 'flame',
    category: IconCategory.STATUS,
    component: FlameIcon,
    keywords: ['hot', 'trending', 'fire', 'popular', 'active'],
    defaultColor: 'text-orange-500',
  },
  trophy: {
    name: 'trophy',
    category: IconCategory.BUSINESS,
    component: TrophyIcon,
    keywords: ['award', 'achievement', 'winner', 'success', 'prize', 'accomplishment'],
    defaultColor: 'text-amber-500',
  },
  'graduation-cap': {
    name: 'graduation-cap',
    category: IconCategory.GENERAL,
    component: GraduationCapIcon,
    keywords: ['education', 'learning', 'school', 'university', 'degree', 'academic'],
    defaultColor: 'text-indigo-500',
  },
  star: {
    name: 'star',
    category: IconCategory.GENERAL,
    component: StarIcon,
    keywords: ['favorite', 'rating', 'featured', 'important', 'highlight'],
    defaultColor: 'text-amber-400',
  },
  'message-circle': {
    name: 'message-circle',
    category: IconCategory.COMMUNICATION,
    component: MessageCircleIcon,
    keywords: ['chat', 'message', 'conversation', 'talk', 'communicate'],
    defaultColor: 'text-blue-500',
  },
  download: {
    name: 'download',
    category: IconCategory.ACTIONS,
    component: DownloadIcon,
    keywords: ['import', 'save', 'download', 'get', 'receive'],
    defaultColor: 'text-green-500',
  },
  user: {
    name: 'user',
    category: IconCategory.GENERAL,
    component: UserIcon,
    keywords: ['profile', 'person', 'account', 'avatar', 'identity'],
    defaultColor: 'text-macAccent',
  },
  file: {
    name: 'file',
    category: IconCategory.GENERAL,
    component: FileIcon,
    keywords: ['document', 'paper', 'file', 'cv', 'resume'],
    defaultColor: 'text-macText',
  },
  'dollar-sign': {
    name: 'dollar-sign',
    category: IconCategory.FINANCE,
    component: DollarSignIcon,
    keywords: ['money', 'finance', 'dollar', 'currency', 'payment', 'salary'],
    defaultColor: 'text-success',
  },
  'credit-card': {
    name: 'credit-card',
    category: IconCategory.FINANCE,
    component: CreditCardIcon,
    keywords: ['payment', 'card', 'expense', 'spending', 'transaction'],
    defaultColor: 'text-indigo-500',
  },
  folder: {
    name: 'folder',
    category: IconCategory.GENERAL,
    component: FolderIcon,
    keywords: ['directory', 'files', 'folder', 'storage', 'documents'],
    defaultColor: 'text-amber-500',
  },
  mail: {
    name: 'mail',
    category: IconCategory.COMMUNICATION,
    component: MailIcon,
    keywords: ['email', 'message', 'mail', 'envelope', 'communication'],
    defaultColor: 'text-blue-500',
  },
  sparkles: {
    name: 'sparkles',
    category: IconCategory.STATUS,
    component: SparklesIcon,
    keywords: ['magic', 'enhance', 'improve', 'special', 'new'],
    defaultColor: 'text-yellow-400',
  },
  search: {
    name: 'search',
    category: IconCategory.ACTIONS,
    component: SearchIcon,
    keywords: ['find', 'search', 'look', 'query', 'filter'],
    defaultColor: 'text-macSubtext',
  },
  brain: {
    name: 'brain',
    category: IconCategory.TECHNOLOGY,
    component: BrainIcon,
    keywords: ['ai', 'intelligence', 'memory', 'smart', 'learn'],
    defaultColor: 'text-pink-500',
  },
  tie: {
    name: 'tie',
    category: IconCategory.BUSINESS,
    component: TieIcon,
    keywords: ['professional', 'formal', 'business', 'linkedin', 'work'],
    defaultColor: 'text-indigo-600',
  },
};

/**
 * Get icon by name
 * Implements Icon Resolver interface
 */
export const getIconByName = (name: string) => {
  return ICON_REGISTRY[name.toLowerCase()] || null;
};

/**
 * Search icons by keyword
 */
export const searchIcons = (query: string): IconMetadata[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(ICON_REGISTRY).filter((icon) =>
    icon.name.includes(lowerQuery) ||
    icon.keywords.some((keyword) => keyword.includes(lowerQuery))
  );
};

/**
 * Get all icons in a category
 */
export const getIconsByCategory = (category: IconCategory): IconMetadata[] => {
  return Object.values(ICON_REGISTRY).filter((icon) => icon.category === category);
};

/**
 * Get all icon names
 */
export const getAllIconNames = (): string[] => {
  return Object.keys(ICON_REGISTRY);
};
