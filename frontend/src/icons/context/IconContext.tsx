/**
 * Icon Context - Provider Pattern for Icon System
 * Enables future extensibility:
 * - Switch icon packs (Lucide, Heroicons, Remix, Feather)
 * - Configure global icon defaults (size, stroke, color)
 * - Enable/disable icon caching
 * - Icon pack theming
 *
 * Design Patterns:
 * - Provider Pattern: Dependency injection for icon resolution
 * - Strategy Pattern: Pluggable icon pack selection
 * - Singleton Pattern: Single source of truth for icon config
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { IconMetadata } from '../types';
import { getIconByName, clearIconCache, getIconCacheStats } from '../constants/iconRegistry';

/**
 * Icon Pack Type - for future extensibility
 */
export type IconPack = 'serenity-custom' | 'lucide' | 'heroicons' | 'remix' | 'feather';

/**
 * Icon Context Configuration
 */
export interface IconContextConfig {
  /** Active icon pack */
  iconPack: IconPack;
  /** Default icon size */
  defaultSize: number;
  /** Default stroke width */
  defaultStrokeWidth: number;
  /** Enable icon caching (memoization) */
  enableCache: boolean;
  /** Debug mode - log icon resolutions */
  debug: boolean;
}

/**
 * Icon Context Value
 */
export interface IconContextValue extends IconContextConfig {
  /** Resolve icon by name */
  resolveIcon: (name: string) => IconMetadata | null;
  /** Clear icon cache */
  clearCache: () => void;
  /** Get cache statistics */
  getCacheStats: () => { size: number; entries: string[] };
  /** Update configuration */
  updateConfig: (config: Partial<IconContextConfig>) => void;
}

/**
 * Default Icon Configuration
 */
const DEFAULT_CONFIG: IconContextConfig = {
  iconPack: 'serenity-custom', // Uses custom icons + Lucide fallback
  defaultSize: 20,
  defaultStrokeWidth: 1.75,
  enableCache: true,
  debug: false,
};

/**
 * Icon Context
 */
const IconContext = createContext<IconContextValue>({
  ...DEFAULT_CONFIG,
  resolveIcon: getIconByName,
  clearCache: clearIconCache,
  getCacheStats: getIconCacheStats,
  updateConfig: () => {},
});

/**
 * Icon Provider Props
 */
export interface IconProviderProps {
  children: ReactNode;
  config?: Partial<IconContextConfig>;
}

/**
 * Icon Provider Component
 * Wraps application to provide icon system configuration
 *
 * Usage:
 * ```tsx
 * <IconProvider config={{ debug: true, defaultSize: 24 }}>
 *   <App />
 * </IconProvider>
 * ```
 */
export const IconProvider: React.FC<IconProviderProps> = ({
  children,
  config: initialConfig
}) => {
  const [config, setConfig] = React.useState<IconContextConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const updateConfig = React.useCallback((newConfig: Partial<IconContextConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const resolveIcon = React.useCallback(
    (name: string) => {
      if (config.debug) {
        console.log(`[IconContext] Resolving icon: "${name}"`);
      }
      return getIconByName(name);
    },
    [config.debug]
  );

  const handleClearCache = React.useCallback(() => {
    clearIconCache();
    if (config.debug) {
      console.log('[IconContext] Cache cleared');
    }
  }, [config.debug]);

  const contextValue: IconContextValue = {
    ...config,
    resolveIcon,
    clearCache: handleClearCache,
    getCacheStats: getIconCacheStats,
    updateConfig,
  };

  return (
    <IconContext.Provider value={contextValue}>
      {children}
    </IconContext.Provider>
  );
};

/**
 * Hook: useIcon
 * Access icon context from any component
 *
 * Usage:
 * ```tsx
 * const { resolveIcon, defaultSize } = useIcon();
 * const iconMetadata = resolveIcon('bar-chart');
 * ```
 */
export const useIcon = (): IconContextValue => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error('useIcon must be used within an IconProvider');
  }
  return context;
};

/**
 * Hook: useIconDebug
 * Debug utilities for icon system (development only)
 *
 * Usage:
 * ```tsx
 * const { cacheStats, clearCache } = useIconDebug();
 * console.log(`Icons in cache: ${cacheStats.size}`);
 * ```
 */
export const useIconDebug = () => {
  const { getCacheStats, clearCache, debug, updateConfig } = useIcon();

  return {
    cacheStats: getCacheStats(),
    clearCache,
    enableDebug: () => updateConfig({ debug: true }),
    disableDebug: () => updateConfig({ debug: false }),
    isDebugEnabled: debug,
  };
};

/**
 * Export context for advanced usage
 */
export { IconContext };
