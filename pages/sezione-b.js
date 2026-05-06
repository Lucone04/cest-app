import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { t, getLang } from '../lib/i18n'
import { ITEM_LIKERT_TR } from '../lib/translations'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function SezioneB() {
  const router = useRouter()
  const [lang, setL] = useState('it')
  const [risposte, setRisposte] = useState(Array(25).fill(null))
  const [errore, setErrore] = useState('')
  const [invio, setInvio] = useState(false)

  useEffect(() => {
    setL(getLang())
    const handler = () => setL(getLang())
    window.addEventListener('cest_lang_change', handler)
    return () => window.removeEventListener('cest_lang_change', handler)
  }, [])

  const ITEMS = ITEM_LIKERT_TR[lang]
  const SCALA = [
    { val: 1, label: t('sb_scale_1', lang) },
    { val: 2, label: t('sb_scale_2', lang) },
    { val: 3, label: t('sb_scale_3', lang) },
    { val: 4, label: t('sb_scale_4', lang) },
    { val: 5, label: t('sb_scale_5', lang) },
    { val: 6, label: t('sb_scale_6', lang) },
  ]

  const progresso = Math.round((risposte.filter(r => r !== null).length / 25) * 100)

  const handleSelect = (index, valore) => {
    const nuove = [...risposte]
    nuove[index] = valore
    setRisposte(nuove)
  }

  const handleSubmit = async () => {
    const nonRisposti = risposte.filter(r => r === null).length
    if (nonRisposti > 0) {
      setErrore(t('sb_error_missing', lang)(nonRisposti))
      const idx = risposte.findIndex(r => r === null)
      const el = document.getElementById(`item-${idx}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setInvio(true)
    sessionStorage.setItem('cest_sezione_b', JSON.stringify(risposte))
    router.push('/risultati')
  }

  const dimColors = { NFC: '#6366f1', FI: '#10b981', CS: '#f59e0b', PR: '#ef4444' }
  const dimLabels = {
    NFC: t('sb_dim_nfc', lang),
    FI: t('sb_dim_fi', lang),
    CS: t('sb_dim_cs', lang),
    PR: t('sb_dim_pr', lang),
  }

  let ultimaDim = null

  return (
    <>
      <Head><title>{t('sb_label', lang)} — CEST</title></Head>
      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', padding: '80px 24px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }} className="fade-in-up">

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p className="eyebrow">{t('sb_label', lang)}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              {risposte.filter(r => r !== null).length} / 25
            </p>
          </div>

          <div className="progress-bar" style={{ marginBottom: 24 }}>
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
          </div>

          {/* Scale legend */}
          <div className="card-glass" style={{ marginBottom: 36, padding: '16px 24px' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {SCALA.map(s => (
                <div key={s.val} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: 12,
                    color: 'var(--accent-light)',
                    width: 20,
                    textAlign: 'center',
                  }}>{s.val}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          {ITEMS.map((item, index) => {
            const showDivider = item.dimensione !== ultimaDim
            ultimaDim = item.dimensione
            const risposta = risposte[index]

            return (
              <div key={item.id} id={`item-${index}`}>
                {showDivider && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '40px 0 24px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: dimColors[item.dimensione], boxShadow: `0 0 12px ${dimColors[item.dimensione]}` }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: dimColors[item.dimensione],
                      fontWeight: 600,
                    }}>
                      {dimLabels[item.dimensione]}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--border), transparent)' }} />
                  </div>
                )}

                <div
                  className="card"
                  style={{
                    marginBottom: 14,
                    borderColor: risposta ? 'var(--border-strong)' : 'var(--border)',
                    padding: '22px 24px',
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

                  <div style={{ display: 'flex', gap: 8, paddingLeft: 42, flexWrap: 'wrap' }}>
                    {SCALA.map(s => {
                      const isSelected = risposta === s.val
                      const color = dimColors[item.dimensione]
                      return (
                        <button
                          key={s.val}
                          onClick={() => handleSelect(index, s.val)}
                          title={s.label}
                          className={`likert-btn ${isSelected ? 'selected' : ''}`}
                          style={{
                            borderColor: isSelected ? color : 'var(--border)',
                            background: isSelected ? color : 'transparent',
                          }}
                        >
                          {s.val}
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
            <button className="btn-secondary" onClick={() => router.push('/sezione-a')}>
              ← {t('sb_back', lang)}
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={invio}
              style={{ fontSize: 16, padding: '16px 40px' }}
            >
              <span>{invio ? t('sb_processing', lang) : t('sb_calculate', lang)} →</span>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
