// ============================================================
// TRE Scoring Engine — Test Razionalità/Emotività
// 30 item, scala 4 punti, range 0-90
// ============================================================

// Orientamento item: R = Razionalità, E = Emotività
// Per R: Sempre vero=0, Abbastanza vero=1, Abbastanza falso=2, Sempre falso=3
// Per E: Sempre vero=3, Abbastanza vero=2, Abbastanza falso=1, Sempre falso=0

export const ORIENTAMENTI = [
  'R','E','R','E','R','E','R','E','R','E',
  'R','E','R','E','R','E','R','E','R','E',
  'R','E','R','E','R','E','R','E','R','E'
]

export function calcolaScoringTRE(risposte) {
  // risposte: array di 30 valori, ciascuno 0-3 (indice della scelta: 0=Sempre vero, 1=Abbastanza vero, 2=Abbastanza falso, 3=Sempre falso)
  let totale = 0

  risposte.forEach((risposta, index) => {
    const orientamento = ORIENTAMENTI[index]
    if (orientamento === 'R') {
      // R: Sempre vero=0, Abbastanza vero=1, Abbastanza falso=2, Sempre falso=3
      totale += risposta
    } else {
      // E: Sempre vero=3, Abbastanza vero=2, Abbastanza falso=1, Sempre falso=0
      totale += (3 - risposta)
    }
  })

  const profilo = assegnaProfilo(totale)
  const percentualeEmotivita = Math.round((totale / 90) * 100)
  const percentualeRazionalita = 100 - percentualeEmotivita

  return {
    totale,
    percentualeEmotivita,
    percentualeRazionalita,
    profilo,
  }
}

function assegnaProfilo(totale) {
  if (totale <= 15) return 'Razionale Puro'
  if (totale <= 30) return 'Razionale Prevalente'
  if (totale <= 45) return 'Equilibrato Analitico'
  if (totale <= 60) return 'Equilibrato Empatico'
  if (totale <= 75) return 'Emotivo Prevalente'
  return 'Emotivo Puro'
}

export const PROFILI_TRE = {
  'Razionale Puro': {
    range: '0 – 15',
    colore: '#3b82f6',
    funzione: 'Thinking dominante',
    descrizione: 'Il soggetto applica criteri logici, oggettivi e impersonali in maniera sistematica. Il processo decisionale è guidato da analisi causale, gerarchie di efficienza e principi normativi. Tende a separare nettamente il piano dei fatti da quello dei valori personali, percependo quest\'ultimo come fonte potenziale di distorsione cognitiva.',
    puntiForza: 'Capacità superiore di analisi sotto pressione; immunità ai bias emotivi; eccellenza in contesti tecnici, strategici e di problem solving complesso; coerenza interna del giudizio; affidabilità nella valutazione critica delle informazioni.',
    areeAttenzione: 'Possibile sottostima dell\'impatto interpersonale delle proprie decisioni; rischio di apparire freddo o distante; tendenza a interpretare le richieste emotive altrui come irrazionalità; difficoltà nella negoziazione di compromessi che richiedono flessibilità relazionale.',
  },
  'Razionale Prevalente': {
    range: '16 – 30',
    colore: '#6366f1',
    funzione: 'Thinking primario, Feeling ausiliario',
    descrizione: 'Il soggetto mantiene un approccio strutturato e analitico ma integra in modo selettivo la dimensione umana nelle decisioni. Riconosce l\'importanza del contesto emotivo come variabile da considerare, pur subordinandola a criteri oggettivi quando i due piani entrano in conflitto. Profilo tipico di leadership tecnica.',
    puntiForza: 'Decisioni strutturate ma sensibili al contesto; ottime capacità di pianificazione e di leadership operativa; abilità nel comunicare scelte difficili in modo chiaro; equilibrio tra rigore analitico e consapevolezza relazionale.',
    areeAttenzione: 'In situazioni di stress può ripiegare su un approccio rigido, sacrificando l\'armonia per l\'efficienza; può sottovalutare il tempo necessario all\'elaborazione emotiva altrui; tendenza a razionalizzare scelte che hanno una componente affettiva non riconosciuta.',
  },
  'Equilibrato Analitico': {
    range: '31 – 45',
    colore: '#8b5cf6',
    funzione: 'Thinking leggermente prevalente',
    descrizione: 'Profilo caratterizzato da un\'autentica integrazione tra logica ed empatia, con una marginale preferenza per la struttura. Il soggetto valuta le situazioni considerando simultaneamente dati oggettivi e dinamiche relazionali. Mostra notevole flessibilità di adattamento al contesto.',
    puntiForza: 'Versatilità decisionale; capacità di mediare tra istanze tecniche e umane; affidabilità sia nei contesti analitici sia in quelli relazionali; pensiero critico bilanciato; buona capacità di leggere situazioni complesse senza polarizzazioni.',
    areeAttenzione: 'Possibile difficoltà nel prendere posizioni nette; rischio di oscillazione decisionale quando le due funzioni cognitive forniscono indicazioni contrastanti; tendenza a procrastinare scelte ad alto contenuto emotivo.',
  },
  'Equilibrato Empatico': {
    range: '46 – 60',
    colore: '#ec4899',
    funzione: 'Feeling leggermente prevalente',
    descrizione: 'Profilo bilanciato con lieve preferenza per il "sentire". Il soggetto integra logica ed empatia ma, in caso di parità, privilegia la dimensione umana e valoriale. Mostra una notevole capacità di lettura emotiva sostenuta da un solido apparato analitico. È spesso il "connettore" naturale all\'interno di un gruppo.',
    puntiForza: 'Eccellente intelligenza emotiva supportata da capacità analitiche; abilità nel costruire e mantenere relazioni di qualità; capacità di motivare e coinvolgere; sensibilità etica nelle decisioni; comunicazione efficace e calibrata.',
    areeAttenzione: 'Può attribuire eccessivo peso al disagio emotivo altrui in fase decisionale; rischio di affaticamento empatico in contesti ad alta densità relazionale; possibile difficoltà nel dare feedback negativi diretti.',
  },
  'Emotivo Prevalente': {
    range: '61 – 75',
    colore: '#f97316',
    funzione: 'Feeling primario, Thinking ausiliario',
    descrizione: 'Il soggetto prende decisioni a partire da un sistema di valori personali ben definito e dall\'impatto che le proprie azioni avranno sugli altri. La dimensione razionale è presente come strumento di verifica, ma la bussola principale è il giudizio etico ed emotivo. Profilo caratterizzato da forte coerenza valoriale e integrità relazionale.',
    puntiForza: 'Profonda comprensione delle dinamiche umane; capacità di costruire fiducia e legami autentici; coerenza tra valori dichiarati e comportamento; ottima capacità di mentoring e supporto; pensiero etico sviluppato.',
    areeAttenzione: 'Difficoltà nel prendere decisioni necessarie ma dolorose; possibile tendenza a evitare il conflitto a costi alti; rischio di sopravvalutare l\'importanza dell\'armonia rispetto all\'efficacia; vulnerabilità al sovraccarico emotivo.',
  },
  'Emotivo Puro': {
    range: '76 – 90',
    colore: '#ef4444',
    funzione: 'Feeling dominante',
    descrizione: 'Il soggetto opera principalmente attraverso intuizione, sensibilità relazionale e una forte risonanza con i propri valori interiori. Le decisioni nascono da una sintesi olistica che privilegia armonia, autenticità e benessere collettivo o personale. La logica formale è percepita come uno strumento secondario.',
    puntiForza: 'Empatia eccezionale; intuizione affinata sulle persone e sui contesti; creatività relazionale; capacità di percepire bisogni inespressi; forte ancoraggio ai propri valori; abilità nel creare ambienti emotivamente sicuri.',
    areeAttenzione: 'Le decisioni possono risultare poco coerenti con i dati oggettivi disponibili; possibile difficoltà nei contesti che richiedono distacco analitico; rischio di sovraesposizione emotiva; vulnerabilità alle critiche percepite come attacchi personali.',
  },
}
