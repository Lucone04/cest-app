import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getLang } from '../../lib/i18n'
import { ITEMS_TRE, SCALA_TRE } from '../../lib/domande-tre'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function TreTest() {
  const router = useRouter()
  const [lang, setL] = useState('it')
  const [risposte, setRisposte] = useState(Array(30).fill(null))
  const [errore, setErrore] = useState('')
  const [invio, setInvio] = useState(false)

  useEffect(() => {
    setL(getLang())
    const handler = () => setL(getLang())
    window.addEventListener('cest_lang_change', handler)
    return () => window.removeEventListener('cest_lang_change', handler)
  }, [])

  const items = ITEMS_TRE[lang]
  const scala = SCALA_TRE[lang]
  const progresso = Math.round((risposte.filter(r => r !== null).length / 30) * 100)

  const handleSelect = (index, valore) => {
    const nuove = [...risposte]
    nuove[index] = valore
    setRisposte(nuove)
  }

  const handleSubmit = () => {
    const nonRisposti = risposte.filter(r => r === null).length
    if (nonRisposti > 0) {
      setErrore(lang === 'it' ? `Mancano ${nonRisposti} risposte. Compila tutti gli item per continuare.` : `${nonRisposti} answers missing. Please complete all items.`)
      const idx = risposte.findIndex(r => r === null)
      const el = document.getElementById(`tre-item-${idx}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setInvio(true)
    sessionStorage.setItem('tre_risposte', JSON.stringify(risposte))
    router.push('/tre/risultati')
  }

  // Colori per i 4 valori della scala
  const scalaColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444']

  return (
    <>
      <Head><title>{lang === 'it' ? 'Test' : 'Test'} — TRE LMTC</title></Head>
      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', padding: '80px 24px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }} className="fade-in-up">

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p className="eyebrow" style={{ color: '#ec4899' }}>TRE · LMTC</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                {lang === 'it' ? 'Autovalutazione Emotività / Razionalità' : 'Emotionality / Rationality Self-Assessment'}
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              {risposte.filter(r => r !== null).length} / 30
            </p>
          </div>

          <div className="progress-bar" style={{ marginBottom: 16 }}>
            <div className="progress-fill" style={{ width: `${progresso}%`, background: 'linear-gradient(90deg, #ec4899, #f97316)' }} />
          </div>

          {/* Legenda scala */}
          <div className="card-glass" style={{ marginBottom: 36, padding: '16px 24px' }}>
            <p className="label-dim" style={{ marginBottom: 12 }}>{lang === 'it' ? 'Legenda scala' : 'Scale legend'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {scala.map((s, i) => (
                <div key={s.val} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: scalaColors[i],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: 12,
                    color: 'white',
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.3 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Istruzioni */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.04), rgba(249, 115, 22, 0.02))',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            borderRadius: 'var(--radius)',
            padding: '14px 20px',
            marginBottom: 32,
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.65 }}>
              {lang === 'it'
                ? 'Rispondere con la massima sincerità, riferendosi al comportamento reale e non a quello idealizzato. Non esistono risposte giuste o sbagliate.'
                : 'Answer with maximum sincerity, referring to real behavior, not idealized behavior. There are no right or wrong answers.'}
            </p>
          </div>

          {/* Items */}
          {items.map((item, index) => {
            const risposta = risposte[index]
            return (
              <div key={item.id} id={`tre-item-${index}`} style={{ marginBottom: 16 }}>
                <div
                  className="card"
                  style={{
                    padding: '22px 24px',
                    borderColor: risposta !== null ? 'var(--border-strong)' : 'var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-dim)',
                      minWidth: 28,
                      paddingTop: 2,
                      fontWeight: 500,
                    }}>
                      {String(item.id).padStart(2, '0')}
                    </span>
                    <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-soft)' }}>{item.testo}</p>
                  </div>

                  {/* 4-point scale buttons */}
                  <div style={{ display: 'flex', gap: 10, paddingLeft: 42, flexWrap: 'wrap' }}>
                    {scala.map((s, i) => {
                      const isSelected = risposta === s.val
                      return (
                        <button
                          key={s.val}
                          onClick={() => handleSelect(index, s.val)}
                          title={s.label}
                          style={{
                            height: 36,
                            padding: '0 14px',
                            borderRadius: 6,
                            border: `1.5px solid ${isSelected ? scalaColors[i] : 'var(--border)'}`,
                            background: isSelected ? scalaColors[i] + '20' : 'transparent',
                            color: isSelected ? scalaColors[i] : 'var(--text-muted)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            fontWeight: isSelected ? 600 : 400,
                            transition: 'all 0.2s var(--ease-out)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = scalaColors[i] + '80' }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)' }}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}

          {errore && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius)',
              padding: '14px 22px',
              marginTop: 24,
            }}>
              <p className="error-msg" style={{ marginTop: 0 }}>{errore}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 }}>
            <button className="btn-secondary" onClick={() => router.push('/tre/demo')}>
              ← {lang === 'it' ? 'Indietro' : 'Back'}
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={invio}
              style={{ fontSize: 16, padding: '16px 40px', background: '#ec4899', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
            >
              <span>{invio ? (lang === 'it' ? 'Elaborazione...' : 'Processing...') : (lang === 'it' ? 'Calcola il profilo' : 'Calculate profile')} →</span>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
