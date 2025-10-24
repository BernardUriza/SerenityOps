// PitchReader - Elevator Pitch Viewer and Editor
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { Opportunity } from '../types';
import type { UseClaudeActionsReturn } from '../hooks/useClaudeActions';
import { opportunitiesService } from '../services/opportunitiesService';

interface PitchReaderProps {
  opportunity: Opportunity | null;
  claudeActions: UseClaudeActionsReturn;
}

const PitchReader: React.FC<PitchReaderProps> = ({ opportunity: selectedOpportunity, claudeActions }) => {
  const [pitch, setPitch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (selectedOpportunity) {
      loadPitch();
    }
  }, [selectedOpportunity]);

  const loadPitch = async () => {
    if (!selectedOpportunity) {
      console.log('[PitchReader] No selected opportunity');
      return;
    }

    console.log('[PitchReader] Loading pitch for:', selectedOpportunity.company);
    setLoading(true);
    try {
      const pitchText = await opportunitiesService.fetchElevatorPitch(selectedOpportunity.company);
      console.log('[PitchReader] Pitch loaded, length:', pitchText?.length);
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
    }
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
            <Icon name="document" size={24} className="text-macAccent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient">Elevator Pitch</h2>
            <p className="text-xs text-macSubtext">{selectedOpportunity.company} - {selectedOpportunity.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-success text-xs font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </motion.div>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isEditing
                ? 'bg-macAccent/10 text-macAccent border border-macAccent/30'
                : 'bg-macPanel/60 text-macText border border-macBorder/30 hover:border-macAccent/30'
            }`}
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-macAccent"></div>
        </div>
      ) : isEditing ? (
        <div className="space-y-4">
          <textarea
            value={pitch}
            onChange={(e) => {
              setPitch(e.target.value);
              setSaved(false);
            }}
            placeholder="Write your elevator pitch here..."
            className="w-full h-96 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-xl p-6 text-sm text-macText placeholder-macSubtext focus:outline-none focus:border-macAccent/60 transition-all resize-none font-mono leading-relaxed"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading || saved}
              className="flex-1 bg-success/10 text-success border border-success/30 font-semibold rounded-xl p-4 transition-all duration-300 hover:bg-success/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon name="download" size={16} />
              {saved ? 'Saved' : 'Save Changes'}
            </button>

            <button
              onClick={handleImprove}
              disabled={claudeActions.loading || !pitch}
              className="flex-1 gradient-accent text-white font-semibold rounded-xl p-4 transition-all duration-300 hover-lift shadow-lg hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {claudeActions.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Improving...
                </>
              ) : (
                <>
                  <Icon name="lightning" size={16} />
                  Improve with Claude
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="liquid-glass rounded-xl p-8 border border-macBorder/30"
        >
          {pitch ? (
            <div className="prose prose-sm prose-invert max-w-none">
              <div className="text-macText leading-relaxed whitespace-pre-wrap">
                {pitch}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="document" size={48} className="text-macSubtext opacity-30 mx-auto mb-4" />
              <p className="text-sm text-macSubtext">No pitch available yet</p>
              <p className="text-xs text-macSubtext mt-1">Click Edit to create one</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Version Selector (if multiple versions exist) */}
      {pitch && !isEditing && (
        <div className="flex items-center gap-3 text-xs text-macSubtext">
          <span className="font-semibold">Versions:</span>
          <button className="px-3 py-1.5 rounded-lg bg-macAccent/10 text-macAccent border border-macAccent/30">
            90s (Current)
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-macPanel/60 text-macSubtext border border-macBorder/30 hover:border-macAccent/30 transition-colors">
            60s
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-macPanel/60 text-macSubtext border border-macBorder/30 hover:border-macAccent/30 transition-colors">
            30s
          </button>
        </div>
      )}
    </div>
  );
};

export default PitchReader;
