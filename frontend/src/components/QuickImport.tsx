import React, { useState } from 'react';

interface ParsedData {
  projects?: any[];
  experience?: any[];
  skills?: any;
  achievements?: string[];
}

interface QuickImportProps {
  apiBaseUrl: string;
  onDataMerged?: () => void;
}

const QuickImport: React.FC<QuickImportProps> = ({ apiBaseUrl, onDataMerged }) => {
  const [inputText, setInputText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [merging, setMerging] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleParse = async () => {
    if (!inputText.trim()) {
      showNotification('Please paste some text to parse', 'error');
      return;
    }

    try {
      setParsing(true);
      const response = await fetch(`${apiBaseUrl}/api/ingest/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to parse text');
      }

      const result = await response.json();
      setParsedData(result.parsed_data);
      showNotification('Text parsed successfully! Review and accept to merge.', 'success');
    } catch (error) {
      console.error('Parse error:', error);
      showNotification(error instanceof Error ? error.message : 'Failed to parse text', 'error');
    } finally {
      setParsing(false);
    }
  };

  const handleMerge = async () => {
    if (!parsedData) return;

    try {
      setMerging(true);
      const response = await fetch(`${apiBaseUrl}/api/ingest/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parsed_data: parsedData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to merge data');
      }

      showNotification('Data merged successfully into curriculum!', 'success');
      setParsedData(null);
      setInputText('');

      if (onDataMerged) {
        onDataMerged();
      }
    } catch (error) {
      console.error('Merge error:', error);
      showNotification(error instanceof Error ? error.message : 'Failed to merge data', 'error');
    } finally {
      setMerging(false);
    }
  };

  const handleReject = () => {
    setParsedData(null);
    showNotification('Parsed data discarded', 'success');
  };

  return (
    <div className="bg-surface-elevated border border-border rounded shadow-sm p-8">
      <div className="mb-1.5">
        <h2 className="text-sm font-bold text-slate-50 mb-2">Quick Import</h2>
        <p className="text-text-tertiary">
          Paste unstructured text and let Claude extract CV information automatically.
        </p>
      </div>

      {!parsedData ? (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Paste text here
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste memory packs, project descriptions, GitHub links, or any career-related text..."
              className="w-full h-64 px-2 py-1.5 bg-surface-elevated border border-border rounded text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={handleParse}
              disabled={parsing || !inputText.trim()}
              className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-1.5 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {parsing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Parsing with Claude...
                </span>
              ) : (
                'Parse & Extract'
              )}
            </button>

            <button
              onClick={() => setInputText('')}
              disabled={parsing}
              className="px-3 py-1.5 bg-surface-hover hover:bg-slate-600 text-text-secondary font-medium rounded transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="bg-surface-elevated border border-border rounded p-2">
            <p className="text-sm text-text-tertiary">
              <strong className="text-text-secondary">Examples of what you can paste:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-text-tertiary ml-4 list-disc">
              <li>Memory packs from other AI conversations</li>
              <li>Project descriptions from GitHub or documentation</li>
              <li>Job descriptions to extract requirements</li>
              <li>LinkedIn profile text</li>
              <li>Email threads about projects</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="bg-green-900/20 border border-green-700 rounded p-2">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-success mb-1">Data Parsed Successfully</h3>
                <p className="text-sm text-green-300">Review the extracted information below and accept to merge into your CV.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {parsedData.projects && parsedData.projects.length > 0 && (
              <div className="bg-surface-elevated border border-border rounded p-2">
                <h3 className="font-semibold text-slate-50 mb-1.5 flex items-center">
                  <span className="text-sm mr-2">🚀</span>
                  Projects ({parsedData.projects.length})
                </h3>
                <div className="space-y-1.5">
                  {parsedData.projects.map((project, idx) => (
                    <div key={idx} className="bg-surface-elevated border border-border rounded p-3">
                      <h4 className="font-medium text-text-primary">{project.name}</h4>
                      {project.tagline && (
                        <p className="text-sm text-text-tertiary mt-1">{project.tagline}</p>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tech_stack.map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedData.experience && parsedData.experience.length > 0 && (
              <div className="bg-surface-elevated border border-border rounded p-2">
                <h3 className="font-semibold text-slate-50 mb-1.5 flex items-center">
                  <span className="text-sm mr-2">💼</span>
                  Experience ({parsedData.experience.length})
                </h3>
                <div className="space-y-1.5">
                  {parsedData.experience.map((exp, idx) => (
                    <div key={idx} className="bg-surface-elevated border border-border rounded p-3">
                      <h4 className="font-medium text-text-primary">{exp.role}</h4>
                      <p className="text-sm text-text-tertiary">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedData.skills && (
              <div className="bg-surface-elevated border border-border rounded p-2">
                <h3 className="font-semibold text-slate-50 mb-1.5 flex items-center">
                  <span className="text-sm mr-2">⚡</span>
                  Skills Extracted
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {parsedData.skills.languages && parsedData.skills.languages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.languages.map((lang: any, i: number) => (
                          <span key={i} className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">
                            {lang.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {parsedData.skills.tools && parsedData.skills.tools.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.tools.map((tool: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={handleMerge}
              disabled={merging}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-1.5 px-3 rounded transition-colors disabled:opacity-50"
            >
              {merging ? 'Merging...' : 'Accept & Merge into CV'}
            </button>
            <button
              onClick={handleReject}
              disabled={merging}
              className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-error font-medium rounded transition-colors disabled:opacity-50 border border-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className={`mt-2 rounded p-2 ${
          notification.type === 'success'
            ? 'bg-green-900/20 border border-green-700'
            : 'bg-red-900/20 border border-red-700'
        }`}>
          <p className={`text-sm ${
            notification.type === 'success' ? 'text-success' : 'text-error'
          }`}>
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickImport;
