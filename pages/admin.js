import { useState, useEffect } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

const ADMIN_PWD = 'cest2024admin'

export default function Admin() {
  const [autenticato, setAutenticato] = useState(false)
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState('')
  const [dati, setDati] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState({ genere: '', istruzione: '', occupazione: '' })

  const login = () => {
    if (password === ADMIN_PWD) {
      setAutenticato(true)
      caricaDati()
    } else {
      setErrore('Password errata.')
    }
  }

  const caricaDati = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('risposte')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setDati(data || [])
    setLoading(false)
  }

  const datiFiltrati = dati.filter(r => {
    if (filtro.genere && r.genere !== filtro.genere) return false
    if (filtro.istruzione && r.istruzione !== filtro.istruzione) return false
    if (filtro.occupazione && r.occupazione !== filtro.occupazione) return false
    return true
  })

  const stat = (arr, key) => {
    if (!arr.length) return 0
    return (arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length).toFixed(2)
  }

  const contaProfili = (arr) => {
    const c = {}
    arr.forEach(r => { c[r.profilo] = (c[r.profilo] || 0) + 1 })
    return c
  }

  const etaMedia = (arr) => {
    if (!arr.length) return '—'
    return (arr.reduce((s, r) => s + (r.eta || 0), 0) / arr.length).toFixed(1)
  }

  const eliminaRecord = async (id) => {
    if (!confirm('Eliminare questo record? L\'operazione è irreversibile.')) return
    const { error } = await supabase.from('risposte').delete().eq('id', id)
    if (!error) setDati(dati.filter(r => r.id !== id))
  }

  const profiliCount = contaProfili(datiFiltrati)
  const profilColors = { Alpha: '#2563eb', Beta: '#059669', Gamma: '#d97706', Delta: '#7c3aed', Epsilon: '#dc2626', Misto: '#6b7280' }

  if (!autenticato) {
    return (
      <>
        <Head><title>Admin — CEST</title></Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 400, width: '100%' }}>
            <p className="label-dim" style={{ marginBottom: 12 }}>Pannello amministrativo</p>
            <h2 style={{ fontSize: 24, fontWeight: 400, marginBottom: 32 }}>CEST — Dashboard</h2>
            <div className="card">
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', color: 'var(--text)', fontSize: 15, fontFamily: 'var(--font-ui)', marginBottom: 16 }}
              />
              {errore && <p className="error-msg" style={{ marginBottom: 12 }}>{errore}</p>}
              <button className="btn-primary" onClick={login} style={{ width: '100%' }}>Accedi</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head><title>Dashboard Admin — CEST</title></Head>
      <div style={{ minHeight: '100vh', padding: '32px 24px 80px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p className="label-dim" style={{ marginBottom: 8 }}>CEST LMTC 1.0</p>
              <h1 style={{ fontSize: 28, fontWeight: 400 }}>Dashboard statistiche</h1>
            </div>
            <button className="btn-secondary" onClick={caricaDati}>↻ Aggiorna</button>
          </div>

          {loading && <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Caricamento...</p>}

          {/* Sommario */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Compilazioni totali', val: dati.length },
              { label: 'Compilazioni filtrate', val: datiFiltrati.length },
              { label: 'Età media', val: etaMedia(datiFiltrati) },
              { label: 'AQ validi', val: datiFiltrati.filter(r => r.aq_valido).length },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--accent-light)', fontFamily: 'var(--font-ui)', marginBottom: 8 }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtri */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 16 }}>Filtri</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { key: 'genere', label: 'Genere', opts: [['', 'Tutti'], ['M', 'Maschile'], ['F', 'Femminile'], ['NB', 'Non binario'], ['ND', 'N/D']] },
                { key: 'istruzione', label: 'Istruzione', opts: [['', 'Tutti'], ['licenza_media', 'Lic. Media'], ['diploma', 'Diploma'], ['laurea_triennale', 'Triennale'], ['laurea_magistrale', 'Magistrale'], ['dottorato', 'Dottorato']] },
                { key: 'occupazione', label: 'Occupazione', opts: [['', 'Tutti'], ['studente', 'Studente'], ['dipendente_privato', 'Dip. Privato'], ['dipendente_pubblico', 'Dip. Pubblico'], ['libero_professionista', 'Lib. Prof.'], ['imprenditore', 'Imprenditore'], ['disoccupato', 'In cerca'], ['altro', 'Altro']] },
              ].map(f => (
                <div key={f.key} style={{ flex: 1, minWidth: 160 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6 }}>{f.label}</label>
                  <select
                    value={filtro[f.key]}
                    onChange={e => setFiltro({ ...filtro, [f.key]: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-ui)' }}
                  >
                    {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuzione profili */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 20 }}>Distribuzione profili</p>
            {Object.entries(profiliCount).length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', fontSize: 14 }}>Nessun dato disponibile.</p>
            ) : (
              Object.entries(profiliCount).sort((a, b) => b[1] - a[1]).map(([profilo, count]) => {
                const pct = Math.round((count / datiFiltrati.length) * 100)
                return (
                  <div key={profilo} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: profilColors[profilo] || 'var(--text)' }}>{profilo}</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: profilColors[profilo] || 'var(--accent)', borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Legenda dimensioni */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 20 }}>Legenda dimensioni — cosa misurano</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {[
                { sigla: 'NFC', colore: '#6366f1', nome: 'Need for Cognition — Bisogno di analisi', desc: 'Misura quanto il soggetto tende a cercare e godere del pensiero analitico profondo. Un NFC alto indica piacere nel ragionare su problemi complessi e ricerca del meccanismo causale, non solo della soluzione. Un NFC basso indica preferenza per risposte rapide e semplificate.' },
                { sigla: 'FI', colore: '#059669', nome: 'Felt Intelligence — Intelligenza intuitiva', desc: 'Misura quanto il soggetto si fida delle proprie intuizioni e sensazioni corporee come fonti di informazione affidabili. Un FI alto indica dominanza esperienziale: l\'istinto viene valorizzato anche quando contraddice l\'analisi razionale. Un FI basso indica dipendenza esclusiva da criteri espliciti e verificabili.' },
                { sigla: 'CS', colore: '#d97706', nome: 'Cold Structure — Struttura emotiva fredda', desc: 'Misura la capacità di gestire le emozioni in modo deliberato sotto pressione. La sotto-scala Disciplina (CS-D) indica controllo emotivo consapevole — il soggetto sente ma sceglie quando e quanto spazio dare alle emozioni. La sotto-scala Anestesia (CS-A, flag) segnala invece una possibile riduzione della risonanza emotiva non consapevole.' },
                { sigla: 'PR', colore: '#dc2626', nome: 'Perceived Resilience — Resilienza percepita', desc: 'Misura quanto il soggetto si ritiene capace di fronteggiare eventi catastrofici o imprevisti. Un PR alto indica fiducia nelle proprie risorse adattive. Attenzione: un PR molto alto non testato empiricamente è il marcatore del Profilo Epsilon — la resilienza percepita può essere una narrazione costruita, non una capacità verificata.' },
              ].map(d => (
                <div key={d.sigla} style={{ borderLeft: `3px solid ${d.colore}`, paddingLeft: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, color: d.colore }}>{d.sigla}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-muted)' }}>{d.nome}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{d.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16 }}>
              <p className="label-dim" style={{ marginBottom: 12 }}>Differenza Sezione A vs Sezione B</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>Sezione A (comportamento)</span> — rileva il pattern comportamentale dichiarato: cosa il soggetto farebbe concretamente nelle situazioni descritte. È una misura indiretta del funzionamento reale.
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>Sezione B (identità percepita)</span> — rileva come il soggetto si descrive e si percepisce. È una misura dell'auto-immagine, non necessariamente coincidente con il comportamento reale.
                </div>
              </div>
            </div>
          </div>

          {/* Medie punteggi */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 20 }}>Medie punteggi dimensionali (campione filtrato) — scala 0–6</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'NFC (Sez. B)', key: 'score_b_nfc', color: '#6366f1' },
                { label: 'FI (Sez. B)', key: 'score_b_fi', color: '#059669' },
                { label: 'CS-Disciplina (Sez. B)', key: 'score_b_cs_disciplina', color: '#d97706' },
                { label: 'PR (Sez. B)', key: 'score_b_pr', color: '#dc2626' },
                { label: 'Razionalità (Sez. A)', key: 'score_a_razionalita', color: '#6366f1' },
                { label: 'Emotività (Sez. A)', key: 'score_a_emotivita', color: '#059669' },
                { label: 'Freddezza (Sez. A)', key: 'score_a_freddezza', color: '#d97706' },
                { label: 'Integrazione (Sez. A)', key: 'score_a_integrazione', color: '#dc2626' },
              ].map(s => (
                <div key={s.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: s.color }}>{stat(datiFiltrati, s.key)}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(parseFloat(stat(datiFiltrati, s.key)) / 6) * 100}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legenda Delta */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 20 }}>Legenda Delta Index — cosa significa la distanza tra identità e comportamento</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
              Il Delta Index (Δ) misura la distanza tra come il soggetto si percepisce (Sezione B) e come dichiara di comportarsi realmente (Sezione A). Range teorico: da −6 a +6. Un delta vicino a zero indica coerenza; un delta ampio indica una discrepanza tra auto-immagine e comportamento.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[
                {
                  sigla: 'Δ NFC',
                  colore: '#6366f1',
                  sovrastima: 'Il soggetto si percepisce più analitico e riflessivo di quanto il suo comportamento dichiarato confermi. Tende a costruire una narrativa di sé come "pensatore profondo" che non si traduce in comportamenti coerenti sotto pressione. Marker del Profilo Gamma.',
                  sottostima: 'Il soggetto non riconosce la propria tendenza analitica. Si descrive come intuitivo o pragmatico, ma in realtà nelle situazioni concrete adotta sistematicamente approcci razionali e approfonditi.',
                },
                {
                  sigla: 'Δ FI',
                  colore: '#059669',
                  sovrastima: 'Il soggetto si ritiene molto intuitivo e capace di leggere persone e situazioni "a pelle", ma nelle situazioni concrete tende a comportarsi in modo più razionale e verificabile di quanto creda. L\'intuizione è più un\'auto-attribuzione che una modalità operativa reale.',
                  sottostima: 'Il soggetto non riconosce la propria intelligenza intuitiva. Le sue risposte comportamentali tradiscono una forte sensibilità contestuale e percettiva che lui stesso non valorizza nella propria auto-descrizione.',
                },
                {
                  sigla: 'Δ CS',
                  colore: '#d97706',
                  sovrastima: 'Il soggetto si descrive come freddo e controllato emotivamente, ma nelle situazioni concrete mostra maggiore reattività emotiva di quanto creda. Il distacco è più un ideale identitario che una capacità operativa stabile.',
                  sottostima: 'Il soggetto non riconosce il proprio controllo emotivo. Si percepisce come emotivamente reattivo, ma il pattern comportamentale mostra una gestione delle emozioni più disciplinata e deliberata di quanto ammetta. Possibile marker di Profilo Delta se associato a flag anestesia.',
                },
                {
                  sigla: 'Δ PR',
                  colore: '#dc2626',
                  sovrastima: 'Il soggetto si ritiene eccezionalmente resiliente e capace di fronteggiare crisi, ma il suo comportamento dichiarato in situazioni concrete non supporta questa convinzione. La resilienza è una narrazione identitaria non verificata empiricamente. Marker principale del Profilo Epsilon — il più fragile di fronte a eventi reali.',
                  sottostima: 'Il soggetto sottovaluta la propria capacità di adattamento. Nelle situazioni di crisi il suo comportamento è più efficace e strutturato di quanto la sua auto-percezione suggerisca. Risorsa non riconosciuta.',
                },
              ].map(d => (
                <div key={d.sigla} style={{ borderLeft: `3px solid ${d.colore}`, paddingLeft: 16 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, color: d.colore, display: 'block', marginBottom: 12 }}>{d.sigla}</span>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--warning)', display: 'block', marginBottom: 4 }}>Δ &gt; +1.0 — Sovrastima identitaria</span>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{d.sovrastima}</p>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#60a5fa', display: 'block', marginBottom: 4 }}>Δ &lt; −1.0 — Sottostima identitaria</span>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{d.sottostima}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabella ultime compilazioni */}
          <div className="card">
            <p className="label-dim" style={{ marginBottom: 20 }}>Ultime compilazioni</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Data', 'Nome', 'Cognome', 'Età', 'Genere', 'Istruzione', 'Profilo', 'AQ', 'NFC', 'FI', 'CS', 'PR', 'ΔNFC', 'ΔFI', 'ΔCS', 'ΔPR', ''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.06em', fontSize: 11, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datiFiltrati.slice(0, 50).map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString('it-IT')}</td>
                      <td style={{ padding: '10px 12px' }}>{r.nome || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>{r.cognome || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>{r.eta}</td>
                      <td style={{ padding: '10px 12px' }}>{r.genere}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{r.istruzione}</td>
                      <td style={{ padding: '10px 12px', color: profilColors[r.profilo] || 'var(--text)', fontWeight: 600 }}>{r.profilo}</td>
                      <td style={{ padding: '10px 12px', color: r.aq_valido ? 'var(--success)' : 'var(--danger)' }}>{r.aq_valido ? '✓' : '✗'}</td>
                      <td style={{ padding: '10px 12px' }}>{r.score_b_nfc?.toFixed(1)}</td>
                      <td style={{ padding: '10px 12px' }}>{r.score_b_fi?.toFixed(1)}</td>
                      <td style={{ padding: '10px 12px' }}>{r.score_b_cs_disciplina?.toFixed(1)}</td>
                      <td style={{ padding: '10px 12px' }}>{r.score_b_pr?.toFixed(1)}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: r.delta_nfc == null ? 'var(--text-dim)' : Math.abs(r.delta_nfc) <= 1.0 ? 'var(--success)' : Math.abs(r.delta_nfc) <= 2.0 ? 'var(--warning)' : 'var(--danger)' }}>{r.delta_nfc != null ? (r.delta_nfc > 0 ? '+' : '') + r.delta_nfc.toFixed(2) : '—'}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: r.delta_fi == null ? 'var(--text-dim)' : Math.abs(r.delta_fi) <= 1.0 ? 'var(--success)' : Math.abs(r.delta_fi) <= 2.0 ? 'var(--warning)' : 'var(--danger)' }}>{r.delta_fi != null ? (r.delta_fi > 0 ? '+' : '') + r.delta_fi.toFixed(2) : '—'}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: r.delta_cs == null ? 'var(--text-dim)' : Math.abs(r.delta_cs) <= 1.0 ? 'var(--success)' : Math.abs(r.delta_cs) <= 2.0 ? 'var(--warning)' : 'var(--danger)' }}>{r.delta_cs != null ? (r.delta_cs > 0 ? '+' : '') + r.delta_cs.toFixed(2) : '—'}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: r.delta_pr == null ? 'var(--text-dim)' : Math.abs(r.delta_pr) <= 1.0 ? 'var(--success)' : Math.abs(r.delta_pr) <= 2.0 ? 'var(--warning)' : 'var(--danger)' }}>{r.delta_pr != null ? (r.delta_pr > 0 ? '+' : '') + r.delta_pr.toFixed(2) : '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <button
                          onClick={() => eliminaRecord(r.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#ef4444',
                            borderRadius: 6,
                            padding: '4px 10px',
                            fontSize: 12,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-ui)',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = '#ef4444' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {datiFiltrati.length > 50 && (
                <p style={{ textAlign: 'center', padding: '16px', color: 'var(--text-dim)', fontSize: 12 }}>
                  Mostrate 50 di {datiFiltrati.length} compilazioni
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
