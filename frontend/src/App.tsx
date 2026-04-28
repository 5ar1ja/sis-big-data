import { BrainCircuit } from 'lucide-react';
import { UploadPanel } from './features/UploadPanel';
import { ResultsGallery } from './features/ResultsGallery';

function App() {
  return (
    <div className="app-container">
      <header className="glass-panel header">
        <div className="logo-container">
          <BrainCircuit size={32} color="var(--primary-color)" />
          <h1 className="text-gradient">VisionAI B2B</h1>
        </div>
        <p className="subtitle">Enterprise Document & Image Intelligence</p>
      </header>

      <main className="main-content">
        <section className="upload-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <UploadPanel />
        </section>

        <section className="results-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ResultsGallery />
        </section>
      </main>

      <style>{`
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          margin-bottom: 3rem;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-container h1 {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
