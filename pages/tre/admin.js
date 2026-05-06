import { useState } from 'react'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import { PROFILI_TRE } from '../../lib/scoring-tre'

const ADMIN_PWD = 'cest2024admin'

export default function TreAdmin() {
  const [autenticato, setAutenticato] = useState(false)
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState('')
  const [dati, setDati] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState({ genere: '', istruzione: '', occupazione: '' })

  const login = () => {
    if (password === ADMIN_PWD) { setAutenticato(true); caricaDati() }
    else setErrore('Password errata.')
  }

  const caricaDati = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('risposte_tre').select('*').order('created_at', { ascending: false })
    if (!error) setDati(data || [])
    setLoading(false)
  }

  const eliminaRecord = async (id) => {
    if (!confirm('Eliminare questo record? L\'operazione è irreversibile.')) return
    const { error } = await supabase.from('risposte_tre').delete().eq('id', id)
    if (!error) setDati(prev => prev.filter(r => r.id !== id))
  }

  const datiFiltrati = dati.filter(r => {
    if (filtro.genere && r.genere !== filtro.genere) return false
    if (filtro.istruzione && r.istruzione !== filtro.istruzione) return false
    if (filtro.occupazione && r.occupazione !== filtro.occupazione) return false
    return true
  })

  const etaMedia = (arr) => arr.length ? (arr.reduce((s, r) => s + (r.eta || 0), 0) / arr.length).toFixed(1) : '—'
  const mediaKey = (arr, key) => arr.length ? (arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length).toFixed(1) : '0'

  const contaProfili = (arr) => {
    const c = {}
    arr.forEach(r => { c[r.profilo] = (c[r.profilo] || 0) + 1 })
    return c
  }

  const profiliCount = contaProfili(datiFiltrati)
  const profilColors = Object.fromEntries(Object.entries(PROFILI_TRE).map(([k, v]) => [k, v.colore]))

  if (!autenticato) {
    return (
      <>
        <Head><title>Admin TRE — CEST</title></Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 400, width: '100%' }}>
            <p className="label-dim" style={{ marginBottom: 12 }}>Pannello amministrativo</p>
            <h2 style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}>TRE — Dashboard</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>Autovalutazione Emotività / Razionalità</p>
            <div className="card">
              <label className="input-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="input" style={{ marginBottom: 16 }} />
              {errore && <p className="error-msg" style={{ marginBottom: 12 }}>{errore}</p>}
              <button className="btn-primary" onClick={login} style={{ width: '100%', background: '#ec4899', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}><span>Accedi</span></button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <a href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>→ Dashboard CEST</a>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head><title>Dashboard TRE — LMTC</title></Head>
      <div style={{ minHeight: '100vh', padding: '32px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p className="label-dim" style={{ marginBottom: 8, color: '#ec4899' }}>TRE · LMTC</p>
              <h1 style={{ fontSize: 28, fontWeight: 400 }}>Dashboard — Emotività / Razionalità</h1>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="/admin" className="btn-secondary" style={{ fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Dashboard CEST</a>
              <button className="btn-secondary" onClick={caricaDati}>↻ Aggiorna</button>
            </div>
          </div>

          {loading && <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: 14 }}>Caricamento...</p>}

          {/* Sommario */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Compilazioni totali', val: dati.length },
              { label: 'Compilazioni filtrate', val: datiFiltrati.length },
              { label: 'Età media', val: etaMedia(datiFiltrati) },
              { label: 'Punteggio medio', val: mediaKey(datiFiltrati, 'punteggio_totale') + '/90' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: 28, fontWeight: 300, color: '#ec4899', fontFamily: 'var(--font-body)', marginBottom: 8 }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtri */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 16 }}>Filtri</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { key: 'genere', label: 'Genere', opts: [['', 'Tutti'], ['M', 'Maschile'], ['F', 'Femminile']] },
                { key: 'istruzione', label: 'Istruzione', opts: [['', 'Tutti'], ['licenza_media', 'Lic. Media'], ['diploma', 'Diploma'], ['universita_in_corso', 'Univ. in corso'], ['laurea_triennale', 'Triennale'], ['laurea_magistrale', 'Magistrale'], ['dottorato', 'Dottorato']] },
                { key: 'occupazione', label: 'Occupazione', opts: [['', 'Tutti'], ['studente', 'Studente'], ['dipendente_privato', 'Dip. Privato'], ['dipendente_pubblico', 'Dip. Pubblico'], ['libero_professionista', 'Lib. Prof.'], ['imprenditore', 'Imprenditore'], ['disoccupato', 'In cerca'], ['altro', 'Altro']] },
              ].map(f => (
                <div key={f.key} style={{ flex: 1, minWidth: 160 }}>
                  <label className="input-label" style={{ marginBottom: 6 }}>{f.label}</label>
                  <select className="select" value={filtro[f.key]} onChange={e => setFiltro({ ...filtro, [f.key]: e.target.value })}>
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
              <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: 14 }}>Nessun dato disponibile.</p>
            ) : (
              Object.entries(profiliCount).sort((a, b) => b[1] - a[1]).map(([profilo, count]) => {
                const pct = Math.round((count / datiFiltrati.length) * 100)
                return (
                  <div key={profilo} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: profilColors[profilo] || 'var(--text)' }}>{profilo}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: profilColors[profilo] || '#ec4899', borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Legenda profili */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 20 }}>Legenda profili — cosa identifica ciascun profilo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {Object.entries(PROFILI_TRE).map(([nome, p]) => (
                <div key={nome} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 4, minHeight: 40, borderRadius: 2, background: p.colore, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: p.colore }}>{nome}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{p.range} pt · {p.funzione}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.65, marginBottom: 8 }}>{p.descrizione}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--success)', display: 'block', marginBottom: 4 }}>Punti di forza</span>
                        <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>{p.puntiForza}</p>
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--warning)', display: 'block', marginBottom: 4 }}>Aree di attenzione</span>
                        <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>{p.areeAttenzione}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medie */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="label-dim" style={{ marginBottom: 20 }}>Medie campione filtrato</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Punteggio totale medio', key: 'punteggio_totale', max: 90, color: '#ec4899' },
                { label: '% Emotività media', key: 'percentuale_emotivita', max: 100, color: '#ef4444' },
                { label: '% Razionalità media', key: 'percentuale_razionalita', max: 100, color: '#3b82f6' },
              ].map(s => (
                <div key={s.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: s.color }}>{mediaKey(datiFiltrati, s.key)}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(parseFloat(mediaKey(datiFiltrati, s.key)) / s.max) * 100}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabella */}
          <div className="card">
            <p className="label-dim" style={{ marginBottom: 20 }}>Ultime compilazioni</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Data', 'Nome', 'Cognome', 'Età', 'Genere', 'Istruzione', 'Profilo', 'Punteggio', 'Razionalità', 'Emotività', ''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.06em', fontSize: 11, textTransform: 'uppercase', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datiFiltrati.slice(0, 50).map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString('it-IT')}</td>
                      <td style={{ padding: '10px 12px' }}>{r.nome || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>{r.cognome || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>{r.eta}</td>
                      <td style={{ padding: '10px 12px' }}>{r.genere}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{r.istruzione}</td>
                      <td style={{ padding: '10px 12px', color: profilColors[r.profilo] || 'var(--text)', fontWeight: 600 }}>{r.profilo}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ec4899' }}>{r.punteggio_totale}/90</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#3b82f6' }}>{r.percentuale_razionalita}%</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#ef4444' }}>{r.percentuale_emotivita}%</td>
                      <td style={{ padding: '10px 12px' }}>
                        <button
                          onClick={() => eliminaRecord(r.id)}
                          style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = '#ef4444' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
                        >✕</button>
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
