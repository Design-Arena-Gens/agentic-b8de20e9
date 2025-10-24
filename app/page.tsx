import PromptBuilder from '../components/PromptBuilder';

export default function Page() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <div className="title">Generatore Prompt Analisi di Mercato</div>
            <div className="subtitle">Crea istruzioni perfette per analisi in italiano</div>
          </div>
        </div>
        <span className="badge">Made for Vercel</span>
      </header>

      <PromptBuilder />

      <footer>
        Costruito con Next.js. Suggerimenti? Apri un issue sul repo.
      </footer>
    </div>
  );
}
