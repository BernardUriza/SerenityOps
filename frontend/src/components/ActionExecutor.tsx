import React, { useState, useEffect } from 'react';

interface ActionExecutorProps {
  action: {
    type: string;
    payload?: Record<string, any>;
  };
  apiBaseUrl: string;
}

interface ExecutionResult {
  status: 'pending' | 'success' | 'error';
  message: string;
  result?: any;
  traceback?: string;
}

const ActionExecutor: React.FC<ActionExecutorProps> = ({ action, apiBaseUrl }) => {
  const [result, setResult] = useState<ExecutionResult>({
    status: 'pending',
    message: 'Executing action...'
  });

  useEffect(() => {
    executeAction();
  }, []);

  const executeAction = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/actions/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult({
          status: 'success',
          message: data.message,
          result: data.result
        });
      } else {
        setResult({
          status: 'error',
          message: data.message || 'Action execution failed',
          traceback: data.traceback
        });
      }
    } catch (error) {
      setResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error during action execution'
      });
    }
  };

  if (result.status === 'pending') {
    return (
      <div className="my-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <div>
            <p className="text-blue-300 font-semibold">Executing Action: {action.type}</p>
            <p className="text-blue-400 text-sm">{result.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (result.status === 'success') {
    return (
      <div className="my-4 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="flex-1">
            <p className="text-emerald-300 font-semibold">✅ Action Completed: {action.type}</p>
            <p className="text-emerald-400 text-sm mt-1">{result.message}</p>

            {result.result && (
              <div className="mt-3 p-3 bg-slate-950 rounded border border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Result:</p>

                {/* PDF Download */}
                {result.result.pdf_download_url && (
                  <a
                    href={`${apiBaseUrl}${result.result.pdf_download_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Download PDF ({(result.result.pdf_size / 1024).toFixed(1)} KB)
                  </a>
                )}

                {/* File Info */}
                {result.result.pdf_filename && (
                  <div className="mt-3 text-xs text-slate-400">
                    <span className="font-mono">{result.result.pdf_filename}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="my-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
      <div className="flex items-start space-x-3">
        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <p className="text-red-300 font-semibold">⚠️ Action Failed: {action.type}</p>
          <p className="text-red-400 text-sm mt-1">{result.message}</p>

          {result.traceback && (
            <details className="mt-3">
              <summary className="text-xs text-red-500 cursor-pointer hover:text-red-400">
                Show error details
              </summary>
              <pre className="mt-2 p-3 bg-slate-950 rounded border border-slate-700 text-xs text-red-400 overflow-x-auto">
                {result.traceback}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionExecutor;
