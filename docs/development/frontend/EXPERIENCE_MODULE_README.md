# Experience Editor Module - SerenityOps

## Overview

The Experience Editor module is a completely redesigned, professional, modern UI/UX component for managing professional work experience within SerenityOps. Built with React 19, TypeScript, Tailwind CSS 4, and advanced state management, this module provides a seamless editing experience with real-time updates, auto-save, and semantic iconography.

## Features

### Core Functionality
- **Inline Editing**: Edit all fields directly using `contentEditable` with visual feedback
- **Auto-Save**: Automatic saving with 3-second debounce
- **Mode Toggle**: Switch between Edit and Presentation modes (Ctrl+E)
- **Icon Integration**: Dynamic tech stack icons from backend API (Simple Icons + custom emojis)
- **Drag & Drop**: Reorder experiences (upcoming feature)
- **Responsive Design**: Mobile, tablet, and desktop optimized

### Visual Design
- **GitHub Dark Theme**: Professional dark color palette (#0d1117 background)
- **Fluid Typography**: InterVariable with responsive weights
- **Smooth Animations**: Framer Motion for all transitions
- **Modern Components**: shadcn/ui inspired design system
- **Semantic Iconography**: Tech logos + emojis with color coding

### State Management
- **Zustand Store**: Centralized experience state
- **Optimistic Updates**: Instant UI feedback
- **Error Handling**: Graceful error states with user feedback
- **Loading States**: Skeleton loaders and spinners

## Architecture

### File Structure
```
frontend/src/
├── types/
│   └── experience.ts              # TypeScript type definitions
├── stores/
│   └── experienceStore.ts         # Zustand state management
├── hooks/
│   ├── useDebounce.ts             # Debounce hook for input delays
│   └── useAutoSave.ts             # Auto-save integration
└── components/
    └── experience/
        ├── index.ts               # Module exports
        ├── ExperienceEditor.tsx   # Main editor orchestrator
        ├── ExperienceCard.tsx     # Experience card container
        ├── EditableField.tsx      # Inline editable text field
        ├── TagSelector.tsx        # Tech stack tag selector with icon search
        └── AchievementBadge.tsx   # Achievement chips manager
```

### Backend Integration
```
api/
└── services/
    └── icon_service.py            # Tech icon API service

Endpoints:
- GET  /api/icons?query={tech}     # Search icons by technology name
- GET  /api/icons/categories       # Get all tech categories
- GET  /api/icons/{tech_name}      # Get specific tech icon
```

## Component API

### ExperienceEditor
**Main orchestrator component**

```tsx
import { ExperienceEditor } from './components/experience';

<ExperienceEditor />
```

**Features:**
- Loads experiences from Zustand store
- Manages edit/presentation mode toggle
- Handles keyboard shortcuts (Ctrl+E)
- Displays save status and last saved time
- Provides add/delete experience actions

---

### ExperienceCard
**Individual experience card component**

```tsx
<ExperienceCard
  experience={experience}
  onUpdate={(updates) => updateExperience(exp.id, updates)}
  onDelete={() => deleteExperience(exp.id)}
  editMode="edit"
/>
```

**Props:**
- `experience`: Experience object
- `onUpdate`: Callback for field updates
- `onDelete`: Callback for deletion
- `editMode`: 'edit' | 'presentation'

**Features:**
- Expandable/collapsible with animation
- Company logo display
- Date range formatting
- Location and role inline editing

---

### EditableField
**Inline editable text component**

```tsx
<EditableField
  value={company}
  onChange={(value) => onUpdate({ company: value })}
  placeholder="Company Name"
  multiline={false}
  className="text-xl font-bold"
  as="div"
/>
```

**Props:**
- `value`: Current text value
- `onChange`: Callback when text changes
- `placeholder`: Placeholder text
- `multiline`: Enable multi-line editing
- `className`: Additional CSS classes
- `as`: HTML element ('span' | 'div' | 'p')

---

### TagSelector
**Tech stack tag selector with dynamic icon search**

```tsx
<TagSelector
  tags={techStack}
  onChange={(tags) => onUpdate({ tech_stack: tags })}
/>
```

**Props:**
- `tags`: Array of technology names
- `onChange`: Callback when tags change

**Features:**
- Real-time icon search from backend API
- Emoji + SVG logo display
- Color-coded by category
- Add/remove with animations
- Search dropdown with autocomplete

---

### AchievementBadge
**Achievement bullet points manager**

```tsx
<AchievementBadge
  achievements={achievements}
  onChange={(achievements) => onUpdate({ achievements })}
/>
```

**Props:**
- `achievements`: Array of achievement strings
- `onChange`: Callback when achievements change

**Features:**
- Add/edit/delete achievements
- Inline textarea editing
- Enter to save, Escape to cancel
- Animated list transitions

---

## State Management

### Zustand Store API

```typescript
import { useExperienceStore } from './stores/experienceStore';

const {
  // State
  experiences,       // Experience[]
  editMode,          // 'edit' | 'presentation'
  isLoading,         // boolean
  isSaving,          // boolean
  lastSaved,         // Date | undefined
  error,             // string | undefined

  // Actions
  addExperience,        // (experience: Experience) => void
  updateExperience,     // (id: string, updates: Partial<Experience>) => void
  deleteExperience,     // (id: string) => void
  reorderExperiences,   // (startIndex: number, endIndex: number) => void
  setEditMode,          // (mode: 'edit' | 'presentation') => void
  saveExperiences,      // () => Promise<void>
  loadExperiences,      // () => Promise<void>
} = useExperienceStore();
```

### Auto-Save Hook

```typescript
import { useAutoSave } from './hooks/useAutoSave';

// Automatically saves after 3 seconds of inactivity
useAutoSave(3000);
```

---

## Styling

### Theme Palette (GitHub Dark)
```css
Background: #0d1117
Surface:    #0f172a (slate-900)
Card:       #1e293b (slate-800)
Border:     #334155 (slate-700)
Text:       #e6edf3 (slate-200)
Accent:     #60a5fa (sky-400)
Success:    #34d399 (emerald-400)
Error:      #f87171 (red-400)
```

### Typography
- **Font**: System font stack (San Francisco, Segoe UI, Roboto)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Sizes**: 0.75rem (xs), 0.875rem (sm), 1rem (base), 1.25rem (lg), 1.5rem (xl)

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+E` / `Cmd+E` | Toggle Edit/Presentation mode |
| `Enter` | Save inline edit (single-line fields) |
| `Escape` | Cancel inline edit |

---

## API Integration

### Experience Data Model
```typescript
interface Experience {
  id?: string;
  company: string;
  role: string;
  location: string;
  start_date: string;        // YYYY-MM format
  end_date?: string;         // YYYY-MM format
  current: boolean;
  description: string;
  achievements: string[];
  tech_stack: string[];
  company_logo?: string;     // URL to logo image
}
```

### Icon Service Response
```typescript
interface TechIcon {
  name: string;
  emoji?: string;            // Unicode emoji
  svg_url?: string;          // CDN URL to SVG logo
  color?: string;            // Hex color code
  category?: 'language' | 'framework' | 'tool' | 'platform' | 'database' | 'other';
}
```

---

## Testing

### Manual Testing Checklist
- [ ] Load experiences from API
- [ ] Add new experience
- [ ] Edit company name inline
- [ ] Edit role inline
- [ ] Edit location inline
- [ ] Edit description (multiline)
- [ ] Add tech stack tags with icon search
- [ ] Remove tech stack tags
- [ ] Add achievements
- [ ] Edit achievements
- [ ] Delete achievements
- [ ] Delete experience
- [ ] Toggle edit/presentation mode (Ctrl+E)
- [ ] Verify auto-save triggers after 3s
- [ ] Verify last saved timestamp updates
- [ ] Expand/collapse experience cards
- [ ] Test responsive design (mobile, tablet, desktop)

---

## Future Enhancements

### Phase 2 (Planned)
- [ ] Drag & drop reordering
- [ ] Duplicate experience
- [ ] Export to PDF with selected experiences
- [ ] Timeline visualization
- [ ] Search and filter experiences
- [ ] Bulk edit mode
- [ ] Import from LinkedIn/JSON
- [ ] Company logo auto-fetch from Clearbit API

### Phase 3 (Advanced)
- [ ] AI-powered achievement suggestions
- [ ] Tech stack trend analysis
- [ ] Experience gap detection
- [ ] Role progression visualization
- [ ] Skill matrix heatmap
- [ ] Collaboration mode (team profiles)

---

## Migration from Old ExperienceList

### Before (Old ExperienceList)
- Material-UI components
- Props drilling for state
- Manual save button required
- No real-time feedback
- Basic text inputs
- No icon integration

### After (New ExperienceEditor)
- Custom Tailwind components
- Zustand centralized state
- Auto-save with debounce
- Real-time visual feedback
- ContentEditable inline editing
- Dynamic icon API integration

---

## Dependencies

### Frontend
- `react@^19.1.1` - React framework
- `framer-motion@^12.23.24` - Animations
- `zustand@^5.0.8` - State management
- `lucide-react@^0.546.0` - Icon library
- `tailwindcss@^4.1.14` - Styling
- `zod@^4.1.12` - Schema validation
- `react-hook-form@^7.65.0` - Form handling
- `@hookform/resolvers@^5.2.2` - Form resolvers

### Backend
- `fastapi` - API framework
- `requests` - HTTP client
- `pydantic` - Data validation

---

## Contributing

### Code Style
- Use TypeScript strict mode
- Follow React hooks rules
- Use Tailwind utility classes (avoid custom CSS)
- Add JSDoc comments for complex functions
- Use semantic component names

### Commit Convention
```
refactor: redesign Experience Editor UI/UX
add: icon/emoji API integration
feat: realtime editing + autosave
style: dark theme professional mode
test: interactive editing e2e
```

---

## Troubleshooting

### Icons not loading
**Symptom**: Tech stack tags show emoji but no SVG logos

**Solution**:
1. Check backend API is running: `http://localhost:8000/api/icons?query=react`
2. Verify CORS settings in `api/main.py`
3. Check browser console for fetch errors

---

### Auto-save not triggering
**Symptom**: Changes not saving automatically

**Solution**:
1. Check network tab for PUT requests to `/api/curriculum`
2. Verify `useAutoSave` hook is called in `ExperienceEditor`
3. Check console for errors in Zustand store

---

### TypeScript errors
**Symptom**: Build fails with type errors

**Solution**:
1. Ensure all types are imported from `types/experience.ts`
2. Check Experience interface matches backend model
3. Run `pnpm run build` to verify

---

## Performance Considerations

### Optimizations Implemented
- Debounced auto-save (3s delay)
- Memoized icon fetches (LRU cache in backend)
- Lazy loading of icons per tag
- Optimistic UI updates
- AnimatePresence for smooth transitions
- Conditional rendering based on editMode

### Known Limitations
- Icon API is not cached on frontend (future: IndexedDB)
- Large experience lists (>50) may have scroll performance issues
- contentEditable has edge cases with complex formatting

---

## License

Part of SerenityOps - Personal Intelligence System
© 2025 Bernard Oroza

---

## Contact & Support

For issues, feature requests, or questions:
- GitHub Issues: [SerenityOps Issues](https://github.com/your-repo/issues)
- Discord: [SerenityOps Community](#)
- Email: support@serenityops.dev

---

**Last Updated**: 2025-10-22
**Version**: 1.0.0
**Status**: ✅ Production Ready
