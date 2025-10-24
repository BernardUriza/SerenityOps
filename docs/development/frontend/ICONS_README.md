# SerenityOps Icon System 🎨

Clean, scalable, and maintainable icon system following SOLID principles and DRY methodology.

## 📁 Architecture

```
icons/
├── types/              # TypeScript definitions (ISP)
├── components/         # Individual icon components (SRP)
├── constants/          # Icon registry and mappings (OCP)
├── utils/              # Helper functions (DRY)
└── index.ts           # Public API (Facade Pattern)
```

## 🎯 SOLID Principles

### Single Responsibility Principle (SRP)
Each icon component has one job: render its SVG. Utilities handle specific tasks (size normalization, color resolution, etc.).

### Open/Closed Principle (OCP)
Add new icons without modifying existing code. Just create a new component and register it.

### Liskov Substitution Principle (LSP)
All icons implement `IconProps` interface and can be swapped interchangeably.

### Interface Segregation Principle (ISP)
Clean, minimal interfaces. Icons don't depend on properties they don't use.

### Dependency Inversion Principle (DIP)
Components depend on `IconProps` abstraction, not concrete implementations.

## 🚀 Usage

### Basic Icon Usage

```tsx
import { Icon } from '@/icons';

// Simple usage
<Icon name="rocket" />

// With custom props
<Icon
  name="briefcase"
  size={32}
  color="text-purple-500"
  className="hover:scale-110"
/>

// With default color from registry
<Icon name="trophy" /> // Uses amber-500 automatically
```

### Direct Component Usage

```tsx
import { RocketIcon, TrophyIcon } from '@/icons';

<RocketIcon size={24} color="text-cyan-500" strokeWidth={2} />
<TrophyIcon size={32} className="hover:rotate-12" />
```

### Emoji Replacement

```tsx
import { Icon, EMOJI_TO_ICON_MAP } from '@/icons';

const emoji = '🚀';
const iconName = EMOJI_TO_ICON_MAP[emoji]; // 'rocket'

<Icon name={iconName} size={20} />
```

### With HOC

```tsx
import { withIcon } from '@/icons';

const EnhancedButton = withIcon(Button, 'rocket', { size: 20 });
<EnhancedButton>Launch</EnhancedButton>
```

## 📦 Available Icons

| Emoji | Icon Name | Component | Category |
|-------|-----------|-----------|----------|
| 💼 | `briefcase` | `BriefcaseIcon` | Business |
| 🚀 | `rocket` | `RocketIcon` | Business |
| 🎯 | `target` | `TargetIcon` | Business |
| 📊 | `chart-bar` | `ChartBarIcon` | Business |
| 💡 | `lightbulb` | `LightbulbIcon` | General |
| 🔧 | `wrench` | `WrenchIcon` | Technology |
| 📝 | `document` | `DocumentIcon` | General |
| ✅ | `check-circle` | `CheckCircleIcon` | Status |
| ⚡ | `lightning` | `LightningIcon` | General |
| 🔥 | `flame` | `FlameIcon` | Status |
| 🏆 | `trophy` | `TrophyIcon` | Business |
| 🎓 | `graduation-cap` | `GraduationCapIcon` | General |
| 🌟 | `star` | `StarIcon` | General |

## 🔧 Utilities

```tsx
import {
  hasIcon,
  searchIcons,
  getIconsByCategory,
  emojiToIconName,
  getAllIconNames
} from '@/icons';

// Check if icon exists
if (hasIcon('rocket')) {
  // Use it
}

// Search icons
const icons = searchIcons('speed'); // Returns lightning, rocket

// Get by category
const businessIcons = getIconsByCategory(IconCategory.BUSINESS);

// Convert emoji to icon name
const iconName = emojiToIconName('💼'); // 'briefcase'

// Get all available icons
const allIcons = getAllIconNames();
```

## ➕ Adding New Icons

1. **Create Component** (`components/NewIcon.tsx`):
```tsx
import React from 'react';
import { IconProps } from '../types';
import { normalizeSize, mergeClasses, resolveColor } from '../utils/iconHelpers';

export const NewIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  strokeWidth = 2,
  ariaLabel = 'New',
}) => {
  const iconSize = normalizeSize(size);
  const colorProps = resolveColor(color);

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colorProps.style?.color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={mergeClasses('serenity-icon', colorProps.className, className)}
      style={colorProps.style}
      role="img"
      aria-label={ariaLabel}
    >
      {/* SVG paths here */}
    </svg>
  );
};
```

2. **Register in Registry** (`constants/iconRegistry.ts`):
```tsx
import { NewIcon } from '../components/NewIcon';

export const ICON_REGISTRY: Record<string, IconMetadata> = {
  // ... existing icons
  'new': {
    name: 'new',
    category: IconCategory.GENERAL,
    component: NewIcon,
    keywords: ['new', 'fresh', 'latest'],
    defaultColor: 'text-blue-500',
  },
};
```

3. **Export** (`index.ts`):
```tsx
export { NewIcon } from './components/NewIcon';
```

4. **Update Emoji Map** (if replacing emoji):
```tsx
export const EMOJI_TO_ICON_MAP = {
  // ... existing mappings
  '🆕': 'new',
};
```

## 🎨 Design Guidelines

- **Size**: Icons are 24x24 by default
- **Stroke**: 2px stroke width for consistency
- **Style**: Outline style (not filled)
- **Accessibility**: Always include `ariaLabel`
- **Colors**: Use Tailwind classes or hex values
- **Naming**: kebab-case for multi-word icons

## 🧪 Testing

```tsx
import { render } from '@testing-library/react';
import { Icon } from '@/icons';

test('renders icon correctly', () => {
  const { container } = render(<Icon name="rocket" size={32} />);
  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('width', '32');
});
```

## 📝 Migration from Emojis

Replace emojis with icons:

```tsx
// Before
<span>🚀 Launch</span>

// After
import { Icon } from '@/icons';
<span><Icon name="rocket" size={16} /> Launch</span>
```

## 🔒 Type Safety

All components are fully typed:

```tsx
import { IconProps, IconCategory, IconSize } from '@/icons';

const myIcon: IconProps = {
  size: IconSize.LG,
  color: 'text-purple-500',
  className: 'custom-class',
  strokeWidth: 2.5,
};
```

## 📚 Best Practices

1. **Use `Icon` component** for dynamic icons
2. **Import specific components** for static usage
3. **Leverage registry** for searchable icon lists
4. **Follow color system** - use Tailwind classes
5. **Maintain accessibility** - always provide labels
6. **Keep SVGs simple** - avoid complex paths
7. **Test icon rendering** - ensure proper display

---

Built with ❤️ following Clean Architecture principles.
