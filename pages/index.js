import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getLang } from '../lib/i18n'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Home() {
  const router = useRouter()
  const [lang, setL] = useState('it')

  useEffect(() => {
    setL(getLang())
    const handler = () => setL(getLang())
    window.addEventListener('cest_lang_change', handler)
    return () => window.removeEventListener('cest_lang_change', handler)
  }, [])

  const tests = [
    {
      codice: 'CEST',
      titolo: lang === 'it' ? 'CEST — Stress-Test della Personalità' : 'CEST — Personality Stress-Test',
      sottotitolo: 'LMTC 1.0',
      descrizione: lang === 'it'
        ? 'Strumento di screening rapido che misura quattro dimensioni cognitive e comportamentali: Need for Cognition, Felt Intelligence, Cold Structure e Perceived Resilience. Restituisce un profilo composito con Delta Index.'
        : 'Rapid screening tool measuring four cognitive and behavioral dimensions: Need for Cognition, Felt Intelligence, Cold Structure and Perceived Resilience. Returns a composite profile with Delta Index.',
      durata: lang === 'it' ? '8 – 10 min · 40 item' : '8 – 10 min · 40 items',
      colore: '#6366f1',
      route: '/demo',
      tag: lang === 'it' ? 'Scenari + Likert' : 'Scenarios + Likert',
    },
    {
      codice: 'TRE',
      titolo: lang === 'it' ? 'Autovalutazione Emotività / Razionalità' : 'Emotionality / Rationality Self-Assessment',
      sottotitolo: 'LMTC',
      descrizione: lang === 'it'
        ? 'Test di profilazione delle funzioni cognitive Thinking/Feeling. Misura il bilanciamento individuale tra razionalità analitica ed emotività empatica lungo un continuum di sei posizioni.'
        : 'Profiling tool for Thinking/Feeling cognitive functions. Measures the individual balance between analytical rationality and empathic emotionality across a six-position continuum.',
      durata: lang === 'it' ? '12 – 18 min · 30 item' : '12 – 18 min · 30 items',
      colore: '#ec4899',
      route: '/tre/demo',
      tag: lang === 'it' ? 'Scala a 4 punti' : '4-point scale',
    },
  ]

  return (
    <>
      <Head>
        <title>Strumenti di Profilazione Psicologica — LMTC</title>
      </Head>

      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, width: '100%' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-in-up">
            <p className="eyebrow" style={{ marginBottom: 20 }}>LMTC</p>
            <h1 className="display-1" style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: 20 }}>
              {lang === 'it' ? 'Strumenti di' : 'Psychological'}<br />
              <em>{lang === 'it' ? 'Profilazione Psicologica' : 'Profiling Tools'}</em>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              {lang === 'it'
                ? 'Seleziona il test che vuoi compilare. Ogni strumento è indipendente e restituisce un profilo specifico.'
                : 'Select the test you wish to complete. Each tool is independent and returns a specific profile.'}
            </p>
          </div>

          {/* Test cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {tests.map((test, i) => (
              <div
                key={test.codice}
                className={`fade-in-up stagger-${i + 2}`}
                onClick={() => router.push(test.route)}
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid var(--border)`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s var(--ease-out)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = test.colore + '60'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 16px 48px ${test.colore}20`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Glow top bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${test.colore}, transparent)`,
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      color: test.colore,
                      marginBottom: 8,
                    }}>{test.codice} · {test.sottotitolo}</p>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 20,
                      fontWeight: 400,
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em',
                    }}>{test.titolo.replace(test.codice + ' — ', '').replace(test.codice + ' — ', '')}</h2>
                  </div>
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    background: test.colore + '20',
                    border: `1px solid ${test.colore}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    color: test.colore,
                    fontSize: 18,
                  }}>→</div>
                </div>

                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
                  {test.descrizione}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-dim)',
                    letterSpacing: '0.05em',
                  }}>{test.durata}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: test.colore,
                    background: test.colore + '15',
                    padding: '4px 10px',
                    borderRadius: 4,
                    border: `1px solid ${test.colore}30`,
                  }}>{test.tag}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
