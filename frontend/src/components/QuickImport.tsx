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
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-50 mb-2">Quick Import</h2>
        <p className="text-slate-400">
          Paste unstructured text and let Claude extract CV information automatically.
        </p>
      </div>

      {!parsedData ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Paste text here
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste memory packs, project descriptions, GitHub links, or any career-related text..."
              className="w-full h-64 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleParse}
              disabled={parsing || !inputText.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400">
              <strong className="text-slate-300">Examples of what you can paste:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400 ml-4 list-disc">
              <li>Memory packs from other AI conversations</li>
              <li>Project descriptions from GitHub or documentation</li>
              <li>Job descriptions to extract requirements</li>
              <li>LinkedIn profile text</li>
              <li>Email threads about projects</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-green-400 mb-1">Data Parsed Successfully</h3>
                <p className="text-sm text-green-300">Review the extracted information below and accept to merge into your CV.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {parsedData.projects && parsedData.projects.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-50 mb-3 flex items-center">
                  <span className="text-xl mr-2">🚀</span>
                  Projects ({parsedData.projects.length})
                </h3>
                <div className="space-y-3">
                  {parsedData.projects.map((project, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 rounded p-3">
                      <h4 className="font-medium text-slate-200">{project.name}</h4>
                      {project.tagline && (
                        <p className="text-sm text-slate-400 mt-1">{project.tagline}</p>
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
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-50 mb-3 flex items-center">
                  <span className="text-xl mr-2">💼</span>
                  Experience ({parsedData.experience.length})
                </h3>
                <div className="space-y-3">
                  {parsedData.experience.map((exp, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 rounded p-3">
                      <h4 className="font-medium text-slate-200">{exp.role}</h4>
                      <p className="text-sm text-slate-400">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedData.skills && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-50 mb-3 flex items-center">
                  <span className="text-xl mr-2">⚡</span>
                  Skills Extracted
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {parsedData.skills.languages && parsedData.skills.languages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Languages</h4>
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
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Tools</h4>
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

          <div className="flex gap-3">
            <button
              onClick={handleMerge}
              disabled={merging}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {merging ? 'Merging...' : 'Accept & Merge into CV'}
            </button>
            <button
              onClick={handleReject}
              disabled={merging}
              className="px-6 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50 border border-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className={`mt-4 rounded-lg p-4 ${
          notification.type === 'success'
            ? 'bg-green-900/20 border border-green-700'
            : 'bg-red-900/20 border border-red-700'
        }`}>
          <p className={`text-sm ${
            notification.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickImport;
