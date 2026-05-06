// ============================================================
// CEST Scoring Engine — implementazione fedele al protocollo
// ============================================================

export function calcolaScoring(risposteA, risposteB) {
  // --- SEZIONE A ---
  // Conta frequenze per lettera
  let contA = 0, contB = 0, contC = 0, contD = 0

  risposteA.forEach((risposta, index) => {
    const scenario = index + 1 // 1-15
    const isCignoNero = scenario >= 12 && scenario <= 15
    const isCrisi = scenario >= 8 && scenario <= 11

    if (risposta === 'A') contA++
    else if (risposta === 'B') {
      // Nel cluster Crisi (8-11), B è elaborazione adattiva — conta come integrazione
      if (isCrisi) contD++
      else contB++
    }
    else if (risposta === 'C') {
      // Nel cluster Cigno Nero (12-15), C è freddezza operativa funzionale
      if (isCignoNero) contC++ // resta C ma non è disfunzionale
      else contC++
    }
    else if (risposta === 'D') contD++
  })

  const score_a_razionalita = (contA / 15) * 6
  const score_a_emotivita = (contB / 15) * 6
  const score_a_freddezza = (contC / 15) * 6
  const score_a_integrazione = (contD / 15) * 6

  // --- SEZIONE B ---
  // Inversione reverse-item: valore corretto = 7 - valore grezzo
  const b = risposteB // array indice 0 = item 16, indice 24 = item 40

  const inv = (val) => 7 - val

  // NFC: item 16,17,18[R],19[R],20,21
  const nfc_vals = [
    b[0],      // 16
    b[1],      // 17
    inv(b[2]), // 18 [R]
    inv(b[3]), // 19 [R]
    b[4],      // 20
    b[5],      // 21
  ]
  const score_b_nfc = media(nfc_vals)

  // FI: item 22,23,24,25[R],26[R],27
  const fi_vals = [
    b[6],      // 22
    b[7],      // 23
    b[8],      // 24
    inv(b[9]), // 25 [R]
    inv(b[10]),// 26 [R]
    b[11],     // 27
  ]
  const score_b_fi = media(fi_vals)

  // CS-Disciplina: item 28,29,31,34 + 32[R]
  const cs_disciplina_vals = [
    b[12],     // 28
    b[13],     // 29
    b[15],     // 31
    b[18],     // 34
    inv(b[16]),// 32 [R]
  ]
  const score_b_cs_disciplina = media(cs_disciplina_vals)

  // CS-Anestesia: item 30 e 33 (flag, non punteggio aggregato)
  const score_b_cs_anestesia = media([b[14], b[17]]) // 30, 33
  const flag_anestesia = b[14] >= 5 && b[17] >= 5

  // PR: item 35,36,37[R],38,39[R],40[R]
  const pr_vals = [
    b[19],     // 35
    b[20],     // 36
    inv(b[21]),// 37 [R]
    b[22],     // 38
    inv(b[23]),// 39 [R]
    inv(b[24]),// 40 [R]
  ]
  const score_b_pr = media(pr_vals)

  // --- DELTA INDEX ---
  const delta_nfc = score_b_nfc - score_a_razionalita
  const delta_fi = score_b_fi - score_a_emotivita
  const delta_cs = score_b_cs_disciplina - score_a_freddezza
  // PR delta: usa solo item 12-15 della Sezione A (indici 11-14)
  const integrazione_cigno = risposteA.slice(11, 15).filter(r => r === 'D').length
  const score_a_integrazione_pr = (integrazione_cigno / 4) * 6
  const delta_pr = score_b_pr - score_a_integrazione_pr

  // --- PROFILO ---
  const profilo = assegnaProfilo({
    score_b_nfc,
    score_b_fi,
    score_b_cs_disciplina,
    score_b_pr,
    score_a_razionalita,
    score_a_emotivita,
    score_a_freddezza,
    delta_nfc,
    delta_fi,
    delta_cs,
    delta_pr,
    flag_anestesia,
  })

  // --- AQ INDEX (controllo acquiescenza) ---
  const aq_valido = controlloAcquiescenza(risposteB)

  return {
    score_a_razionalita: arrotonda(score_a_razionalita),
    score_a_emotivita: arrotonda(score_a_emotivita),
    score_a_freddezza: arrotonda(score_a_freddezza),
    score_a_integrazione: arrotonda(score_a_integrazione),
    score_b_nfc: arrotonda(score_b_nfc),
    score_b_fi: arrotonda(score_b_fi),
    score_b_cs_disciplina: arrotonda(score_b_cs_disciplina),
    score_b_cs_anestesia: arrotonda(score_b_cs_anestesia),
    score_b_pr: arrotonda(score_b_pr),
    delta_nfc: arrotonda(delta_nfc),
    delta_fi: arrotonda(delta_fi),
    delta_cs: arrotonda(delta_cs),
    delta_pr: arrotonda(delta_pr),
    profilo,
    aq_valido,
    flag_anestesia,
  }
}

function assegnaProfilo(s) {
  const {
    score_b_nfc, score_b_fi, score_b_cs_disciplina, score_b_pr,
    score_a_razionalita, score_a_emotivita, score_a_freddezza,
    delta_nfc, delta_fi, delta_cs, delta_pr,
    flag_anestesia,
  } = s

  // Profilo Epsilon — priorità alta: narrativa di invulnerabilità
  if (score_b_pr >= 5.0 && delta_pr >= 1.5) return 'Epsilon'

  // Profilo Delta — freddezza dissociativa non consapevole
  if (score_a_freddezza >= 3.5 && delta_cs < 0 && flag_anestesia) return 'Delta'

  // Profilo Gamma — razionalizzatore
  if (delta_nfc >= 1.5) return 'Gamma'

  // Profilo Alpha — analitico coerente
  if (
    score_b_nfc >= 4.5 &&
    score_a_razionalita >= 3.5 &&
    Math.abs(delta_nfc) <= 1.0 &&
    score_b_cs_disciplina >= 4.0 &&
    !flag_anestesia
  ) return 'Alpha'

  // Profilo Beta — intuitivo coerente
  if (
    score_b_fi >= 4.5 &&
    score_a_emotivita >= 3.0 &&
    Math.abs(delta_fi) <= 1.0
  ) return 'Beta'

  // Nessun profilo dominante netto
  return 'Misto'
}

function controlloAcquiescenza(risposteB) {
  // Per ogni dimensione confronta media diretti vs media [R] pre-inversione
  // Se differenza < 0.5 su 2+ dimensioni → invalido

  const b = risposteB
  let dimensioniSospette = 0

  // NFC: diretti [0,1,4,5], reverse [2,3]
  const nfc_diretti = media([b[0], b[1], b[4], b[5]])
  const nfc_reverse = media([b[2], b[3]])
  if (Math.abs(nfc_diretti - nfc_reverse) < 0.5) dimensioniSospette++

  // FI: diretti [6,7,8,11], reverse [9,10]
  const fi_diretti = media([b[6], b[7], b[8], b[11]])
  const fi_reverse = media([b[9], b[10]])
  if (Math.abs(fi_diretti - fi_reverse) < 0.5) dimensioniSospette++

  // CS: diretti [12,13,15,18], reverse [16]
  const cs_diretti = media([b[12], b[13], b[15], b[18]])
  const cs_reverse = media([b[16]])
  if (Math.abs(cs_diretti - cs_reverse) < 0.5) dimensioniSospette++

  // PR: diretti [19,20,22], reverse [21,23,24]
  const pr_diretti = media([b[19], b[20], b[22]])
  const pr_reverse = media([b[21], b[23], b[24]])
  if (Math.abs(pr_diretti - pr_reverse) < 0.5) dimensioniSospette++

  return dimensioniSospette < 2
}

function media(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function arrotonda(val) {
  return Math.round(val * 100) / 100
}

// ============================================================
// Descrizioni profili per la pagina risultati
// ============================================================
export const PROFILI = {
  Alpha: {
    nome: 'Alpha — Analitico Coerente',
    colore: '#2563eb',
    descrizione: 'Il tuo pattern mostra una dominanza razionale coerente tra identità percepita e comportamento dichiarato. Elabori sistematicamente le situazioni, mantieni il controllo emotivo come scelta deliberata e la tua auto-percezione riflette accuratamente il tuo funzionamento reale.',
    nota: 'Nota: questo profilo è il più suscettibile a costruzione strategica in contesti valutativi. La coerenza osservata va letta insieme all\'AQ-Index.',
  },
  Beta: {
    nome: 'Beta — Intuitivo Coerente',
    colore: '#059669',
    descrizione: 'Il tuo pattern mostra una dominanza esperienziale e intuitiva, con piena consapevolezza di questo orientamento. Fidi delle tue sensazioni come fonti di informazione affidabili, e il tuo comportamento conferma questa identità.',
    nota: null,
  },
  Gamma: {
    nome: 'Gamma — Razionalizzatore',
    colore: '#d97706',
    descrizione: 'Il tuo pattern mostra uno scarto significativo tra l\'identità razionale che ti attribuisci e il comportamento dichiarato nelle situazioni concrete. Tendi a costruire una narrativa di sé più analitica di quanto il pattern comportamentale confermi.',
    nota: 'Questo profilo presenta bassa apprendibilità: la narrativa identitaria è investita e tende a resistere al feedback esterno.',
  },
  Delta: {
    nome: 'Delta — Freddo Non Consapevole',
    colore: '#7c3aed',
    descrizione: 'Il tuo pattern comportamentale mostra una freddezza operativa significativa nelle situazioni di crisi, che non viene riconosciuta nella auto-descrizione. Il distacco emotivo sembra funzionare come modalità di default più che come scelta deliberata.',
    nota: 'Nota metodologica: questo pattern suggerisce un\'ipotesi alessitimica da approfondire. Non è una diagnosi.',
  },
  Epsilon: {
    nome: 'Epsilon — Resilienza Performativa',
    colore: '#dc2626',
    descrizione: 'Il tuo pattern mostra una narrativa di invulnerabilità e resilienza costruita su basi non verificate empiricamente. La distanza tra la resilienza percepita e il comportamento dichiarato in situazioni reali è significativa.',
    nota: 'Clinicamente il profilo più fragile di fronte a eventi realmente catastrofici: l\'effetto di aspettativa tradita tende a produrre un crollo accelerato.',
  },
  Misto: {
    nome: 'Profilo Misto',
    colore: '#6b7280',
    descrizione: 'Il tuo pattern non mostra una dominanza dimensionale netta. Le quattro dimensioni presentano un equilibrio relativo senza configurazione prevalente identificabile con la Short Form.',
    nota: 'Per una profilazione più precisa è raccomandata la somministrazione della full-form.',
  },
}
