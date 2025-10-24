"use client";
import { useMemo, useState } from 'react';

type Strategy = 'go-to-market' | 'competitive' | 'sizing' | 'pricing' | 'persona' | 'swot' | 'trend' | 'porters' | 'channels' | 'positioning' | 'all';

type InputState = {
  settore: string;
  mercatoTarget: string;
  areaGeografica: string;
  obiettivo: string;
  stadio: 'idea' | 'pre-seed' | 'seed' | 'growth' | 'scale' | '';
  budget: string;
  timeframe: string;
  prodottiServizi: string;
  vantaggioCompetitivo: string;
  datiDisponibili: string;
  restrizioni: string;
  tono: 'formale' | 'consulenziale' | 'accademico' | 'pratico' | 'persuasivo' | 'neutro';
  livelloDettaglio: 'sintetico' | 'standard' | 'approfondito';
  formato: 'report' | 'bullet' | 'tabella';
  lingue: string;
  metodologie: string;
  strategie: Strategy[];
};

const defaultState: InputState = {
  settore: '',
  mercatoTarget: '',
  areaGeografica: 'Italia',
  obiettivo: 'Valutare l\'opportunità e definire le priorità operative',
  stadio: '',
  budget: '',
  timeframe: 'Q4 2025',
  prodottiServizi: '',
  vantaggioCompetitivo: '',
  datiDisponibili: '',
  restrizioni: '',
  tono: 'consulenziale',
  livelloDettaglio: 'approfondito',
  formato: 'report',
  lingue: 'Italiano',
  metodologie: 'TAM SAM SOM, 5 Forze di Porter, SWOT, JTBD, PESTLE, Analisi Canali',
  strategie: ['all']
};

function buildPrompt(s: InputState): string {
  const selStrategie = (s.strategie.includes('all')
    ? ['go-to-market','competitive','sizing','pricing','persona','swot','trend','porters','channels','positioning'] as const
    : s.strategie) as Exclude<Strategy, 'all'>[];

  const sezioni = {
    contesto: `Contesto aziendale: settore "${s.settore}"; mercato target "${s.mercatoTarget}"; area geografica "${s.areaGeografica}"; stadio "${s.stadio || 'n/d'}"; prodotti/servizi: ${s.prodottiServizi || 'n/d'}; vantaggio competitivo: ${s.vantaggioCompetitivo || 'n/d'}.`,
    obiettivo: `Obiettivo dell'analisi: ${s.obiettivo}. Budget indicativo: ${s.budget || 'n/d'}. Orizzonte temporale: ${s.timeframe || 'n/d'}.`,
    dati: `Dati disponibili: ${s.datiDisponibili || 'n/d'}. Vincoli o restrizioni: ${s.restrizioni || 'n/d'}. Fonti preferite/metodologie: ${s.metodologie || 'n/d'}.`,
    output: `Tono: ${s.tono}. Livello di dettaglio: ${s.livelloDettaglio}. Formato: ${s.formato}. Lingua/e: ${s.lingue}.`
  };

  const focus: Record<Exclude<Strategy, 'all'>, string> = {
    'go-to-market': 'Definisci segmento prioritario, proposta di valore, pricing iniziale, canali e roadmap GTM.',
    competitive: 'Mappa top 10 competitor (diretti/indiretti), share of voice, feature matrix e barriere all\'ingresso.',
    sizing: 'Stima TAM, SAM, SOM con ipotesi esplicite, fonti e sensibilità scenari (best/base/worst).',
    pricing: 'Analizza modelli di monetizzazione, willingness-to-pay, elasticità, benchmark e suggerisci struttura prezzi.',
    persona: 'Definisci 2-4 buyer persona con pain, gain, jobs-to-be-done, criteri di acquisto e obiezioni.',
    swot: 'SWOT completa con implicazioni strategiche e 3-5 mosse prioritarie.',
    trend: 'Analizza trend macro PESTLE, tecnologie emergenti e rischi normativi con impatti a 12-24 mesi.',
    porters: 'Applica 5 Forze di Porter con esempi specifici di fornitori, clienti, entranti, sostituti e rivalità.',
    channels: 'Valuta canali (SEO, SEM, social, partnership, field, marketplace) con CPA stimato, ramp time e rischi.',
    positioning: 'Posiziona il brand su mappa percettiva, differenziatori chiave e messaggi per segmento.'
  } as const;

  const richieste = selStrategie.map(key => `- ${focus[key]}`).join('\n');

  const formatoOut = s.formato === 'tabella'
    ? 'Usa tabelle per confronti/metriche; altrimenti bullet puntati.'
    : s.formato === 'bullet'
      ? 'Usa bullet puntati compatti, con sezioni chiare.'
      : 'Scrivi come un report strutturato con sezioni e sottosezioni.';

  return [
    'Agisci come un consulente di strategia senior specializzato in analisi di mercato in Italia.',
    sezioni.contesto,
    sezioni.obiettivo,
    sezioni.dati,
    '',
    'Consegna un output completo che includa:',
    richieste,
    '',
    'Requisiti di metodo e qualità:',
    `- Cita fonti e ipotesi; evidenzia limiti dei dati.`,
    `- Includi metriche (CAC, LTV, conversioni, churn) quando rilevanti.`,
    `- Fornisci un piano in 30-60-90 giorni con milestone e KPI.`,
    `- Evidenzia quick wins e rischi con mitigazioni.`,
    `- ${formatoOut}`,
    '',
    'Formato finale richiesto:',
    `- Tono: ${s.tono}. Dettaglio: ${s.livelloDettaglio}. Lingua/e: ${s.lingue}.`,
    'Inizia con una sintesi esecutiva (max 10 punti) e termina con un action plan.'
  ].join('\n');
}

export default function PromptBuilder() {
  const [state, setState] = useState<InputState>(defaultState);
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => buildPrompt(state), [state]);

  function update<K extends keyof InputState>(key: K, value: InputState[K]) {
    setState(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="section">
          <h2>Impostazioni</h2>
          <p className="help">Compila i campi chiave per generare un prompt completo.</p>
        </div>
        <div className="section">
          <div className="row">
            <div>
              <label>Settore</label>
              <input className="input" placeholder="Es. SaaS HR, FoodTech, Energy" value={state.settore} onChange={e=>update('settore', e.target.value)} />
            </div>
            <div>
              <label>Mercato target</label>
              <input className="input" placeholder="Es. PMI, Enterprise, Consumer" value={state.mercatoTarget} onChange={e=>update('mercatoTarget', e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Area geografica</label>
              <input className="input" value={state.areaGeografica} onChange={e=>update('areaGeografica', e.target.value)} />
            </div>
            <div>
              <label>Stadio azienda</label>
              <select className="input" value={state.stadio} onChange={e=>update('stadio', e.target.value as InputState['stadio'])}>
                <option value="">Seleziona</option>
                <option value="idea">Idea</option>
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="growth">Growth</option>
                <option value="scale">Scale</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div>
              <label>Obiettivo</label>
              <input className="input" value={state.obiettivo} onChange={e=>update('obiettivo', e.target.value)} />
            </div>
            <div>
              <label>Budget</label>
              <input className="input" placeholder="Es. 50k-100k EUR" value={state.budget} onChange={e=>update('budget', e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Timeframe</label>
              <input className="input" value={state.timeframe} onChange={e=>update('timeframe', e.target.value)} />
            </div>
            <div>
              <label>Lingua/e</label>
              <input className="input" value={state.lingue} onChange={e=>update('lingue', e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Prodotti / Servizi</label>
              <textarea placeholder="Descrivi l'offerta" value={state.prodottiServizi} onChange={e=>update('prodottiServizi', e.target.value)} />
            </div>
            <div>
              <label>Vantaggio competitivo</label>
              <textarea placeholder="Moat, IP, rete, costi, UX" value={state.vantaggioCompetitivo} onChange={e=>update('vantaggioCompetitivo', e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Dati disponibili</label>
              <textarea placeholder="Dati interni, ricerche, metriche attuali" value={state.datiDisponibili} onChange={e=>update('datiDisponibili', e.target.value)} />
            </div>
            <div>
              <label>Restrizioni</label>
              <textarea placeholder="Vincoli legali, budget, tempistiche" value={state.restrizioni} onChange={e=>update('restrizioni', e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Tono</label>
              <select className="input" value={state.tono} onChange={e=>update('tono', e.target.value as InputState['tono'])}>
                <option value="formale">Formale</option>
                <option value="consulenziale">Consulenziale</option>
                <option value="accademico">Accademico</option>
                <option value="pratico">Pratico</option>
                <option value="persuasivo">Persuasivo</option>
                <option value="neutro">Neutro</option>
              </select>
            </div>
            <div>
              <label>Livello di dettaglio</label>
              <select className="input" value={state.livelloDettaglio} onChange={e=>update('livelloDettaglio', e.target.value as InputState['livelloDettaglio'])}>
                <option value="sintetico">Sintetico</option>
                <option value="standard">Standard</option>
                <option value="approfondito">Approfondito</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div>
              <label>Formato</label>
              <select className="input" value={state.formato} onChange={e=>update('formato', e.target.value as InputState['formato'])}>
                <option value="report">Report</option>
                <option value="bullet">Bullet</option>
                <option value="tabella">Tabella</option>
              </select>
            </div>
            <div>
              <label>Metodologie preferite</label>
              <input className="input" value={state.metodologie} onChange={e=>update('metodologie', e.target.value)} />
            </div>
          </div>
          <div className="section">
            <label>Focus dell'analisi</label>
            <div className="actions" style={{marginTop:8}}>
              {[
                {k:'all', l:'Completa'},
                {k:'go-to-market', l:'GTM'},
                {k:'competitive', l:'Competitor'},
                {k:'sizing', l:'Sizing'},
                {k:'pricing', l:'Pricing'},
                {k:'persona', l:'Persona'},
                {k:'swot', l:'SWOT'},
                {k:'trend', l:'Trend'},
                {k:'porters', l:'Porter'},
                {k:'channels', l:'Canali'},
                {k:'positioning', l:'Posizionamento'}
              ].map(({k,l})=>{
                const active = state.strategie.includes(k as Strategy);
                return (
                  <button
                    key={k}
                    className={`btn ${active ? 'primary' : ''}`}
                    type="button"
                    onClick={()=>{
                      if(k==='all') return update('strategie', ['all']);
                      const next = active
                        ? state.strategie.filter(s=>s!==k)
                        : [...state.strategie.filter(s=>s!=='all'), k as Strategy];
                      update('strategie', next.length? next : ['all']);
                    }}
                  >{l}</button>
                );
              })}
            </div>
            <p className="help">Seleziona "Completa" per includere tutte le sezioni principali.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section" style={{borderBottom:'1px dashed var(--border)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <h2>Prompt generato</h2>
            <div className="actions">
              <button
                className="btn primary"
                type="button"
                onClick={async ()=>{
                  await navigator.clipboard.writeText(prompt);
                  setCopied(true);
                  setTimeout(()=>setCopied(false), 2000);
                }}
              >Copia prompt</button>
              <span className="badge">{copied ? 'Copiato!' : 'Pronto per ChatGPT/Claude/Gemini'}</span>
            </div>
          </div>
        </div>
        <div className="output">{prompt}</div>
      </div>
    </div>
  );
}
