import React, { useState } from 'react';
import { Icon } from '../icons';

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
    <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="gradient-orb fixed top-[8%] right-[15%] w-[500px] h-[500px] bg-cyan-500/12 -z-10"></div>

      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl gradient-accent-subtle flex items-center justify-center shadow-lg animate-glow-pulse">
            <svg className="w-6 h-6 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient mb-1">Quick Import</h2>
            <p className="text-macSubtext text-sm leading-relaxed">
              Paste unstructured text and let Claude AI extract CV information automatically
            </p>
          </div>
        </div>
      </div>

      {!parsedData ? (
        <div className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-macText mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Paste your content
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste memory packs, project descriptions, GitHub READMEs, LinkedIn profiles, or any career-related text..."
              className="w-full h-72 px-5 py-4 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-xl text-macText placeholder-macSubtext/60 focus:outline-none focus:ring-2 focus:ring-macAccent/50 focus:border-macAccent resize-none font-mono text-sm transition-all duration-300 ease-mac leading-relaxed shadow-inner"
            />
            {inputText && (
              <p className="text-xs text-macSubtext mt-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {inputText.length} characters ready to parse
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleParse}
              disabled={parsing || !inputText.trim()}
              className="flex-1 gradient-accent text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 ease-mac disabled:opacity-50 disabled:cursor-not-allowed text-sm hover-lift shadow-lg hover:shadow-accent group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
              {parsing ? (
                <span className="flex items-center justify-center relative z-10">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Parsing with Claude AI...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Parse & Extract with AI
                </span>
              )}
            </button>

            <button
              onClick={() => setInputText('')}
              disabled={parsing}
              className="px-6 py-3.5 bg-macPanel/60 hover:bg-macPanel/80 border border-macBorder/40 text-macSubtext hover:text-macText font-semibold rounded-xl transition-all duration-300 ease-mac disabled:opacity-50 text-sm hover-lift"
            >
              Clear
            </button>
          </div>

          <div className="liquid-glass rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-macText">
                Examples of what you can paste:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: 'brain', text: 'Memory packs from AI conversations' },
                { icon: 'folder', text: 'Project READMEs or documentation' },
                { icon: 'briefcase', text: 'Job descriptions to extract requirements' },
                { icon: 'tie', text: 'LinkedIn profile text' },
                { icon: 'mail', text: 'Email threads about projects' },
                { icon: 'document', text: 'Resume or CV text' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-macSubtext bg-macPanel/30 rounded-lg p-3 border border-macBorder/30">
                  <Icon name={item.icon} size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          <div className="liquid-glass rounded-xl border border-success/30 p-6 shadow-lg animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-success mb-2 text-base">Data Parsed Successfully</h3>
                <p className="text-sm text-macSubtext leading-relaxed">
                  Claude AI has extracted structured information from your text. Review the data below and click <strong className="text-macText">"Accept & Merge"</strong> to add it to your curriculum.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {parsedData.projects && parsedData.projects.length > 0 && (
              <div className="liquid-glass rounded-xl p-6 border border-cyan-500/20 shadow-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-macText text-base">Projects</h3>
                    <p className="text-xs text-macSubtext">{parsedData.projects.length} projects extracted</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {parsedData.projects.map((project, idx) => (
                    <div key={idx} className="liquid-glass rounded-lg p-4 border border-macBorder/30 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">#{idx + 1}</span>
                        <h4 className="font-semibold text-macText text-sm flex-1">{project.name}</h4>
                      </div>
                      {project.tagline && (
                        <p className="text-sm text-macSubtext mt-2 leading-relaxed">{project.tagline}</p>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tech_stack.map((tech: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-lg border border-cyan-500/20">
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
              <div className="liquid-glass rounded-xl p-6 border border-purple-500/20 shadow-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-macText text-base">Experience</h3>
                    <p className="text-xs text-macSubtext">{parsedData.experience.length} positions extracted</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {parsedData.experience.map((exp, idx) => (
                    <div key={idx} className="liquid-glass rounded-lg p-4 border border-macBorder/30 hover:border-purple-500/30 transition-all duration-300">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">#{idx + 1}</span>
                        <h4 className="font-semibold text-macText text-sm flex-1">{exp.role}</h4>
                      </div>
                      <p className="text-sm text-macSubtext mt-2">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedData.skills && (
              <div className="liquid-glass rounded-xl p-6 border border-green-500/20 shadow-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-macText text-base">Skills</h3>
                    <p className="text-xs text-macSubtext">Extracted technical capabilities</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsedData.skills.languages && parsedData.skills.languages.length > 0 && (
                    <div className="liquid-glass rounded-lg p-4 border border-macBorder/30">
                      <h4 className="text-sm font-semibold text-macText mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Languages
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.languages.map((lang: any, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-lg border border-purple-500/20">
                            {lang.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {parsedData.skills.tools && parsedData.skills.tools.length > 0 && (
                    <div className="liquid-glass rounded-lg p-4 border border-macBorder/30">
                      <h4 className="text-sm font-semibold text-macText mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.tools.map((tool: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-lg border border-green-500/20">
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
              className="flex-1 bg-success hover:bg-success/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 ease-mac disabled:opacity-50 disabled:cursor-not-allowed text-sm hover-lift shadow-lg hover:shadow-success/50 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
              <span className="flex items-center justify-center gap-2 relative z-10">
                {merging ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Merging into CV...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Accept & Merge into CV
                  </>
                )}
              </span>
            </button>
            <button
              onClick={handleReject}
              disabled={merging}
              className="px-6 py-4 bg-error/10 hover:bg-error/20 border border-error/30 text-error font-semibold rounded-xl transition-all duration-300 ease-mac disabled:opacity-50 text-sm hover-lift"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </span>
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className={`mt-6 rounded-xl backdrop-blur-md p-5 shadow-lg animate-slide-up border ${
          notification.type === 'success'
            ? 'bg-success/10 border-success/30'
            : 'bg-error/10 border-error/30'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              notification.type === 'success' ? 'bg-success/10' : 'bg-error/10'
            }`}>
              <svg className={`w-5 h-5 ${notification.type === 'success' ? 'text-success' : 'text-error'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {notification.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <p className={`text-sm font-medium leading-relaxed flex-1 ${
              notification.type === 'success' ? 'text-success' : 'text-error'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickImport;
