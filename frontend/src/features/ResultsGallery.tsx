import { useEffect, useState } from 'react';
import { collection as firestoreCollection, query as firestoreQuery, orderBy as firestoreOrderBy, onSnapshot as firestoreOnSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface AnalysisResult {
  id: string;
  filePath: string;
  status: 'processing' | 'completed' | 'error';
  result?: string;
  error?: string;
  createdAt: any;
}

export const ResultsGallery = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const q = firestoreQuery(
      firestoreCollection(db, 'analysisResults'),
      firestoreOrderBy('createdAt', 'desc')
    );

    const unsubscribe = firestoreOnSnapshot(q, (snapshot) => {
      const data: AnalysisResult[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as AnalysisResult);
      });
      setResults(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="results-container">
      <h2 className="section-title">Recent Analyses</h2>
      
      {results.length === 0 ? (
        <div className="glass-panel empty-state">
          <FileText size={48} color="var(--surface-border)" />
          <p>No results yet. Upload an image to start.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {results.map((item) => (
            <div key={item.id} className="glass-panel result-card animate-fade-in">
              <div className="card-header">
                <span className="file-name" title={item.filePath}>
                  {item.filePath.split('_').pop() || 'Unknown File'}
                </span>
                {item.status === 'processing' && <Clock size={20} className="status-icon text-accent animate-pulse" />}
                {item.status === 'completed' && <CheckCircle2 size={20} className="status-icon text-success" />}
                {item.status === 'error' && <AlertCircle size={20} className="status-icon text-error" />}
              </div>
              
              <div className="card-body">
                {item.status === 'processing' && (
                  <p className="loading-text">Analyzing image using Gemini Flash 2.5...</p>
                )}
                {item.status === 'error' && (
                  <p className="error-text">{item.error}</p>
                )}
                {item.status === 'completed' && (
                  <div className="result-content">
                    {item.result}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          padding-left: 0.5rem;
        }

        .empty-state {
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
        }

        .cards-grid {
          display: grid;
          gap: 1.5rem;
        }

        .result-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .result-card:hover {
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--surface-border);
          padding-bottom: 0.75rem;
        }

        .file-name {
          font-weight: 500;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 85%;
        }

        .card-body {
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .result-content {
          color: var(--text-main);
          white-space: pre-wrap;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        /* Custom scrollbar for results */
        .result-content::-webkit-scrollbar {
          width: 6px;
        }
        .result-content::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        .result-content::-webkit-scrollbar-thumb {
          background: var(--surface-border);
          border-radius: 4px;
        }

        .loading-text {
          color: var(--text-muted);
          font-style: italic;
        }

        .error-text {
          color: var(--error-color);
          background: rgba(239, 68, 68, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
        }

        .text-accent { color: #60a5fa; }
        .text-success { color: var(--accent-color); }
        .text-error { color: var(--error-color); }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};
