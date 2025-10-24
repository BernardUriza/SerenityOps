/**
 * Icon System - Public API
 * Central export point for all icon functionality
 * Follows Facade Pattern for clean interface
 */

// ===== Types =====
export type {
  IconProps,
  IconComponent,
  IconMetadata,
  IconResolver,
} from './types';

export { IconCategory, IconSize, IconVariant } from './types';

// ===== Main Components =====
export { Icon, hasIcon, withIcon } from './components/Icon';
export type { SmartIconProps } from './components/Icon';

// ===== Individual Icon Components =====
export { BriefcaseIcon } from './components/BriefcaseIcon';
export { RocketIcon } from './components/RocketIcon';
export { TargetIcon } from './components/TargetIcon';
export { ChartBarIcon } from './components/ChartBarIcon';
export { LightbulbIcon } from './components/LightbulbIcon';
export { WrenchIcon } from './components/WrenchIcon';
export { DocumentIcon } from './components/DocumentIcon';
export { CheckCircleIcon } from './components/CheckCircleIcon';
export { LightningIcon } from './components/LightningIcon';
export { FlameIcon } from './components/FlameIcon';
export { TrophyIcon } from './components/TrophyIcon';
export { GraduationCapIcon } from './components/GraduationCapIcon';
export { StarIcon } from './components/StarIcon';
export { MessageCircleIcon } from './components/MessageCircleIcon';
export { DownloadIcon } from './components/DownloadIcon';
export { UserIcon } from './components/UserIcon';
export { FileIcon } from './components/FileIcon';
export { DollarSignIcon } from './components/DollarSignIcon';
export { CreditCardIcon } from './components/CreditCardIcon';
export { FolderIcon } from './components/FolderIcon';
export { MailIcon } from './components/MailIcon';
export { SparklesIcon } from './components/SparklesIcon';
export { SearchIcon } from './components/SearchIcon';
export { BrainIcon } from './components/BrainIcon';
export { TieIcon } from './components/TieIcon';

// ===== Registry & Utilities =====
export {
  ICON_REGISTRY,
  getIconByName,
  searchIcons,
  getIconsByCategory,
  getAllIconNames,
  clearIconCache,
  getIconCacheStats,
} from './constants/iconRegistry';

// ===== Context & Providers =====
export {
  IconProvider,
  IconContext,
  useIcon,
  useIconDebug,
} from './context/IconContext';
export type {
  IconContextConfig,
  IconContextValue,
  IconProviderProps,
  IconPack,
} from './context/IconContext';

export {
  normalizeSize,
  getViewBox,
  mergeClasses,
  resolveColor,
  isValidIconName,
  emojiToIconName,
  DEFAULT_ICON_PROPS,
} from './utils/iconHelpers';

// ===== Emoji Replacement Map =====
export const EMOJI_TO_ICON_MAP = {
  '💼': 'briefcase',
  '🚀': 'rocket',
  '🎯': 'target',
  '📊': 'chart-bar',
  '💡': 'lightbulb',
  '🔧': 'wrench',
  '📝': 'document',
  '✅': 'check-circle',
  '⚡': 'lightning',
  '🔥': 'flame',
  '🏆': 'trophy',
  '🎓': 'graduation-cap',
  '🌟': 'star',
  '💬': 'message-circle',
  '📥': 'download',
  '👤': 'user',
  '📄': 'file',
  '💰': 'dollar-sign',
  '💳': 'credit-card',
  '📁': 'folder',
  '📧': 'mail',
  '✨': 'sparkles',
  '🔍': 'search',
  '🧠': 'brain',
  '👔': 'tie',
} as const;
