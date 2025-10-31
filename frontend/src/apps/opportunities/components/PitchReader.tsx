// PitchReader - Interactive Elevator Pitch Experience
// Optimized for performance and readability
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon } from '../../../icons';
import type { Opportunity } from '../types';
import type { UseClaudeActionsReturn } from '../hooks/useClaudeActions';
import { opportunitiesService } from '../services/opportunitiesService';

interface PitchReaderProps {
  opportunity: Opportunity | null;
  claudeActions: UseClaudeActionsReturn;
}

interface PitchMetadata {
  lastEdited?: string;
  source?: 'human' | 'claude' | 'mixed';
  status?: 'draft' | 'final';
  wordCount?: number;
  estimatedTime?: number; // in seconds
}

type ViewMode = 'think' | 'show' | 'present';

const PitchReader: React.FC<PitchReaderProps> = ({ opportunity: selectedOpportunity, claudeActions }) => {
  const [pitch, setPitch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('show');
  const [metadata, setMetadata] = useState<PitchMetadata>({
    status: 'draft',
    source: 'human',
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedOpportunity) {
      loadPitch();
    }
  }, [selectedOpportunity]);

  const loadPitch = async () => {
    if (!selectedOpportunity) return;

    setLoading(true);
    try {
      const pitchText = await opportunitiesService.fetchElevatorPitch(selectedOpportunity.company);
      setPitch(pitchText);
    } catch (error) {
      console.error('[PitchReader] Error loading pitch:', error);
      setPitch('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedOpportunity) return;

    setLoading(true);
    try {
      // TODO: Implement save to backend
      // await opportunitiesService.savePitch(selectedOpportunity.company, pitch);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving pitch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!selectedOpportunity || !pitch) return;

    const result = await claudeActions.improvePitch(selectedOpportunity.id, {
      current_pitch: pitch,
      job_description: selectedOpportunity.details.description || '',
    });

    if (result?.improved_pitch) {
      setPitch(result.improved_pitch);
      setSaved(false);
      setMetadata(prev => ({
        ...prev,
        source: prev.source === 'human' ? 'mixed' : 'claude',
        lastEdited: new Date().toISOString(),
      }));
    }
  };

  // Auto-calculate metadata (word count, estimated time)
  useEffect(() => {
    if (!pitch) return;

    const words = pitch.trim().split(/\s+/).length;
    const wordsPerMinute = 150; // Average speaking speed
    const estimatedSeconds = Math.ceil((words / wordsPerMinute) * 60);

    setMetadata(prev => ({
      ...prev,
      wordCount: words,
      estimatedTime: estimatedSeconds,
      lastEdited: new Date().toISOString(),
    }));
  }, [pitch]);

  // Auto-save handler with debounce
  useEffect(() => {
    if (!pitch || !selectedOpportunity) return;

    const timer = setTimeout(() => {
      // Auto-save logic here
    }, 3000);

    return () => clearTimeout(timer);
  }, [pitch, selectedOpportunity]);

  if (!selectedOpportunity) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl gradient-accent-subtle flex items-center justify-center mx-auto mb-4">
            <Icon name="document" size={40} className="text-macAccent opacity-40" />
          </div>
          <p className="text-sm text-macSubtext">Select an opportunity to view pitch</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full px-12 py-8">
      {/* Header with Semantic Hierarchy */}
      <header className="flex-shrink-0 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon name="document" size={28} className="text-macAccent" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-macText opacity-90">
                Elevator Pitch
              </h1>
              <div className="flex items-center gap-3 text-sm opacity-65">
                <span className="font-medium">{selectedOpportunity.company}</span>
                <span className="text-macSubtext">•</span>
                <span>{selectedOpportunity.role}</span>
              </div>
              {/* Audit Trail Metadata */}
              {metadata.lastEdited && (
                <div className="flex items-center gap-3 text-xs text-macSubtext mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      metadata.source === 'claude' ? 'bg-purple-400' :
                      metadata.source === 'mixed' ? 'bg-blue-400' :
                      'bg-green-400'
                    }`}></span>
                    {metadata.source === 'claude' ? 'AI Generated' :
                     metadata.source === 'mixed' ? 'Human + AI' :
                     'Human Written'}
                  </span>
                  <span className="text-macSubtext">•</span>
                  <span className={`px-2 py-0.5 rounded ${
                    metadata.status === 'final' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {metadata.status === 'final' ? 'Final' : 'Draft'}
                  </span>
                  {metadata.wordCount && (
                    <>
                      <span className="text-macSubtext">•</span>
                      <span className="flex items-center gap-1.5">
                        <Icon name="file-text" size={12} />
                        {metadata.wordCount} words
                      </span>
                    </>
                  )}
                  {metadata.estimatedTime && (
                    <>
                      <span className="text-macSubtext">•</span>
                      <span className="flex items-center gap-1.5">
                        <Icon name="clock" size={12} />
                        ~{metadata.estimatedTime}s read
                      </span>
                    </>
                  )}
                  <span className="text-macSubtext">•</span>
                  <span>
                    Last edited {new Date(metadata.lastEdited).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-success text-sm font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing && textareaRef.current) {
                  textareaRef.current.blur();
                }
              }}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isEditing
                  ? 'bg-macAccent/15 text-macAccent border-2 border-macAccent/40 shadow-lg'
                  : 'bg-macPanel/60 text-macText border-2 border-macBorder/30 hover:border-macAccent/40 hover:bg-macPanel/80'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name={isEditing ? 'eye' : 'edit'} size={16} />
                {isEditing ? 'Preview' : 'Edit'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Independent Scroll */}
      <div className="flex-1 flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macAccent"></div>
          </div>
        ) : isEditing ? (
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            {/* Editing Mode with Scroll Containment */}
            <div
              className="flex-1 min-h-0 relative"
              ref={contentRef}
            >
              <textarea
                ref={textareaRef}
                value={pitch}
                onChange={(e) => {
                  setPitch(e.target.value);
                  setSaved(false);
                  setMetadata(prev => ({ ...prev, source: 'human' }));
                }}
                onKeyDown={(e) => {
                  // Prevent scroll propagation on Enter
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                  }
                }}
                placeholder="Write your elevator pitch here...

You can use **Markdown** formatting:
- **Bold** with double asterisks
- *Italic* with single asterisks
- Lists with dashes
- Code blocks with triple backticks

Example:
```
I specialize in **full-stack development** with expertise in:
- React & TypeScript
- Node.js & Python
- Cloud architecture (AWS, GCP)
```"
                className="absolute inset-0 w-full h-full bg-macPanel/70 backdrop-blur-md border-2 border-macBorder/40 rounded-xl p-8 text-sm text-macText placeholder-macSubtext/50 focus:outline-none focus:border-macAccent/60 transition-all resize-none font-mono leading-relaxed overflow-y-auto"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(var(--mac-accent-rgb), 0.3) transparent',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading || saved}
                className="flex-1 bg-success/10 text-success border-2 border-success/30 font-semibold rounded-xl py-4 px-6 transition-all duration-300 hover:bg-success/20 hover:border-success/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <Icon name="download" size={18} />
                {saved ? 'Saved' : 'Save Changes'}
              </button>

              <button
                onClick={handleImprove}
                disabled={claudeActions.loading || !pitch}
                className="flex-1 gradient-accent text-white font-semibold rounded-xl py-4 px-6 transition-all duration-300 hover-lift shadow-lg hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {claudeActions.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Improving...
                  </>
                ) : (
                  <>
                    <Icon name="lightning" size={18} />
                    Improve with Claude
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Reading Mode with Markdown Rendering */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto liquid-glass rounded-xl border-2 border-macBorder/30 p-10"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(var(--mac-accent-rgb), 0.3) transparent',
              }}
            >
              {pitch ? (
                <article className="mx-auto prose prose-lg prose-invert max-w-none" style={{ maxWidth: '75ch' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-4 text-macText leading-relaxed" style={{ lineHeight: 1.6 }}>
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-macAccent font-semibold bg-macAccent/10 px-1 rounded">
                          {children}
                        </strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-2 my-4 list-disc list-inside text-macText">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-2 my-4 list-decimal list-inside text-macText">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="hover:text-macAccent transition-colors">
                          {children}
                        </li>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gradient mb-6 mt-8">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-macText mb-4 mt-6">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-macText mb-3 mt-4">
                          {children}
                        </h3>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className?.includes('language-');
                        return isInline ? (
                          <code className="px-2 py-1 rounded bg-macPanel/50 text-purple-300 text-sm font-mono">
                            {children}
                          </code>
                        ) : (
                          <div className="block p-4 rounded-lg bg-macPanel/70 border border-macBorder/40 text-sm font-mono overflow-x-auto">
                            <code className={className}>
                              {children}
                            </code>
                          </div>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-macAccent/40 pl-4 py-2 my-4 italic text-macSubtext bg-macAccent/5 rounded-r">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {pitch}
                  </ReactMarkdown>
                </article>
              ) : (
                <div className="text-center py-16">
                  <Icon name="document" size={56} className="text-macSubtext opacity-20 mx-auto mb-6" />
                  <p className="text-base text-macSubtext mb-2">No pitch available yet</p>
                  <p className="text-sm text-macSubtext/70">Click Edit to create one</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Version Selector Footer */}
      {pitch && !isEditing && (
        <footer className="shrink-0 mt-6 flex items-center gap-3 text-xs text-macSubtext">
          <span className="font-semibold opacity-90">Versions:</span>
          <button className="px-3 py-2 rounded-lg bg-macAccent/15 text-macAccent border-2 border-macAccent/40 font-semibold shadow-sm">
            90s (Current)
          </button>
          <button className="px-3 py-2 rounded-lg bg-macPanel/60 text-macSubtext border-2 border-macBorder/30 hover:border-macAccent/40 hover:bg-macPanel/80 transition-all">
            60s
          </button>
          <button className="px-3 py-2 rounded-lg bg-macPanel/60 text-macSubtext border-2 border-macBorder/30 hover:border-macAccent/40 hover:bg-macPanel/80 transition-all">
            30s
          </button>
        </footer>
      )}
    </div>
  );
};

export default PitchReader;
