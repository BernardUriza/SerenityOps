// AnalyzerPanel - Job Description Analysis with Claude
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { UseClaudeActionsReturn } from '../hooks/useClaudeActions';
import type { FitAnalysis } from '../types';

interface AnalyzerPanelProps {
  claudeActions: UseClaudeActionsReturn;
}

const AnalyzerPanel: React.FC<AnalyzerPanelProps> = ({ claudeActions }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [yourSkills, setYourSkills] = useState('');
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !yourSkills.trim()) {
      alert('Please provide both job description and your skills');
      return;
    }

    const result = await claudeActions.analyzeJobDescription({
      job_description: jobDescription,
      your_skills: yourSkills.split(',').map((s) => s.trim()),
    });

    if (result?.fit_analysis) {
      setAnalysis(result.fit_analysis);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
          <Icon name="chart-bar" size={24} className="text-macAccent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient">Job Description Analyzer</h2>
          <p className="text-xs text-macSubtext">Claude evaluates fit, gaps, and keywords</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-macText mb-2">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-48 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-xl p-4 text-sm text-macText placeholder-macSubtext focus:outline-none focus:border-macAccent/60 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-macText mb-2">
            Your Skills (comma-separated)
          </label>
          <input
            type="text"
            value={yourSkills}
            onChange={(e) => setYourSkills(e.target.value)}
            placeholder="React, TypeScript, .NET, AWS, Docker..."
            className="w-full bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-xl p-3 text-sm text-macText placeholder-macSubtext focus:outline-none focus:border-macAccent/60 transition-all"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={claudeActions.loading || !jobDescription.trim() || !yourSkills.trim()}
          className="w-full gradient-accent text-white font-semibold rounded-xl p-4 transition-all duration-300 hover-lift shadow-lg hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {claudeActions.loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Icon name="chart-bar" size={16} />
              Analyze with Claude
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Skills Match */}
          <div className="liquid-glass rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-macText">Skills Match</h3>
              <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                analysis.skills_match_percentage >= 80 ? 'bg-success/10 text-success' :
                analysis.skills_match_percentage >= 60 ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-error/10 text-error'
              }`}>
                {analysis.skills_match_percentage}%
              </div>
            </div>
            <div className="w-full bg-macPanel/60 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.skills_match_percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${
                  analysis.skills_match_percentage >= 80 ? 'bg-success' :
                  analysis.skills_match_percentage >= 60 ? 'bg-yellow-400' :
                  'bg-error'
                }`}
              />
            </div>
          </div>

          {/* Stack Overlap */}
          {analysis.stack_overlap.length > 0 && (
            <div className="liquid-glass rounded-xl p-6 border border-green-500/20">
              <h3 className="text-sm font-bold text-macText mb-3">Stack Overlap</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.stack_overlap.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-green-500/10 text-success text-xs font-semibold rounded-lg border border-green-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          {analysis.gaps.length > 0 && (
            <div className="liquid-glass rounded-xl p-6 border border-amber-500/20">
              <h3 className="text-sm font-bold text-macText mb-3">Skills to Develop</h3>
              <ul className="space-y-2">
                {analysis.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-macSubtext">
                    <span className="text-amber-400 flex-shrink-0 mt-0.5">▪</span>
                    <span className="flex-1">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords for CV */}
          {analysis.keywords_for_cv.length > 0 && (
            <div className="liquid-glass rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-sm font-bold text-macText mb-3">Keywords for ATS</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords_for_cv.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs font-semibold rounded-lg border border-purple-500/20"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Claude Insight */}
          {analysis.claude_insight && (
            <div className="liquid-glass rounded-xl p-6 border border-macAccent/30 bg-macAccent/5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-macAccent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-macAccent mb-2">Claude's Insight</h3>
                  <p className="text-sm text-macText leading-relaxed">{analysis.claude_insight}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AnalyzerPanel;
