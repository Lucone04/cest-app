import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { t, getLang } from '../lib/i18n'
import { SCENARI_TR } from '../lib/translations'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function SezioneA() {
  const router = useRouter()
  const [lang, setL] = useState('it')
  const [corrente, setCorrente] = useState(0)
  const [risposte, setRisposte] = useState(Array(15).fill(null))
  const [selezionata, setSelezionata] = useState(null)
  const [errore, setErrore] = useState('')

  useEffect(() => {
    setL(getLang())
    const handler = () => setL(getLang())
    window.addEventListener('cest_lang_change', handler)
    return () => window.removeEventListener('cest_lang_change', handler)
  }, [])

  const SCENARI = SCENARI_TR[lang]
  const scenario = SCENARI[corrente]
  const progresso = Math.round(((corrente) / 15) * 100)

  useEffect(() => {
    setSelezionata(risposte[corrente])
    setErrore('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [corrente])

  const handleNext = () => {
    if (!selezionata) {
      setErrore(t('sa_error_select', lang))
      return
    }
    const nuove = [...risposte]
    nuove[corrente] = selezionata
    setRisposte(nuove)

    if (corrente < 14) {
      setCorrente(corrente + 1)
    } else {
      sessionStorage.setItem('cest_sezione_a', JSON.stringify(nuove))
      router.push('/sezione-b')
    }
  }

  const handleBack = () => {
    if (corrente > 0) {
      const nuove = [...risposte]
      nuove[corrente] = selezionata
      setRisposte(nuove)
      setCorrente(corrente - 1)
    } else {
      router.push('/demo')
    }
  }

  const clusterLabel = {
    standard: null,
    crisi: t('sa_cluster_crisis', lang),
    cigno_nero: t('sa_cluster_blackswan', lang),
  }

  return (
    <>
      <Head><title>{t('sa_label', lang)} — CEST</title></Head>
      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', padding: '80px 24px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <p className="eyebrow">{t('sa_label', lang)}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              {String(corrente + 1).padStart(2, '0')} / 15
            </p>
          </div>

          <div className="progress-bar" style={{ marginBottom: 48 }}>
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
          </div>

          <div key={corrente} className="card-elevated fade-in-up" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
              <h2 className="heading-2">{scenario.titolo}</h2>
              {clusterLabel[scenario.cluster] && (
                <span className="tag" style={{ flexShrink: 0 }}>
                  {clusterLabel[scenario.cluster]}
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-soft)', fontSize: 15, whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {scenario.testo}
            </p>
          </div>

          <div key={`opts-${corrente}`} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {Object.entries(scenario.opzioni).map(([lettera, testo], idx) => {
              const isSelected = selezionata === lettera
              return (
                <button
                  key={lettera}
                  className={`option-btn ${isSelected ? 'selected' : ''} fade-in-up stagger-${idx + 1}`}
                  onClick={() => { setSelezionata(lettera); setErrore('') }}
                >
                  <span className="option-letter">{lettera}</span>
                  <span className="option-text">{testo}</span>
                </button>
              )
            })}
          </div>

          {errore && <p className="error-msg" style={{ marginBottom: 20 }}>{errore}</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn-secondary" onClick={handleBack}>
              ← {t('sa_back', lang)}
            </button>
            <button className="btn-primary" onClick={handleNext}>
              <span>{corrente < 14 ? t('sa_continue', lang) : t('sa_to_b', lang)} →</span>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
