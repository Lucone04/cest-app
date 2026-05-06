import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getLang } from '../../lib/i18n'
import { calcolaScoringTRE, PROFILI_TRE } from '../../lib/scoring-tre'
import { supabase } from '../../lib/supabase'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function TreRisultati() {
  const router = useRouter()
  const [lang, setL] = useState('it')
  const [risultato, setRisultato] = useState(null)
  const [salvato, setSalvato] = useState(false)

  useEffect(() => {
    setL(getLang())
    const handler = () => setL(getLang())
    window.addEventListener('cest_lang_change', handler)
    return () => window.removeEventListener('cest_lang_change', handler)
  }, [])

  useEffect(() => {
    const demo = JSON.parse(sessionStorage.getItem('tre_demo') || 'null')
    const risposte = JSON.parse(sessionStorage.getItem('tre_risposte') || 'null')

    if (!demo || !risposte) {
      router.push('/tre/demo')
      return
    }

    const scoring = calcolaScoringTRE(risposte)
    setRisultato({ demo, risposte, scoring })
    salvaRisultato(demo, risposte, scoring)
  }, [])

  const salvaRisultato = async (demo, risposte, scoring) => {
    try {
      const record = {
        nome: demo.nome || null,
        cognome: demo.cognome || null,
        eta: parseInt(demo.eta),
        genere: demo.genere,
        istruzione: demo.istruzione,
        occupazione: demo.occupazione,
        // risposte grezze
        r1: risposte[0], r2: risposte[1], r3: risposte[2], r4: risposte[3], r5: risposte[4],
        r6: risposte[5], r7: risposte[6], r8: risposte[7], r9: risposte[8], r10: risposte[9],
        r11: risposte[10], r12: risposte[11], r13: risposte[12], r14: risposte[13], r15: risposte[14],
        r16: risposte[15], r17: risposte[16], r18: risposte[17], r19: risposte[18], r20: risposte[19],
        r21: risposte[20], r22: risposte[21], r23: risposte[22], r24: risposte[23], r25: risposte[24],
        r26: risposte[25], r27: risposte[26], r28: risposte[27], r29: risposte[28], r30: risposte[29],
        // scoring
        punteggio_totale: scoring.totale,
        percentuale_emotivita: scoring.percentualeEmotivita,
        percentuale_razionalita: scoring.percentualeRazionalita,
        profilo: scoring.profilo,
      }
      const { error } = await supabase.from('risposte_tre').insert(record)
      if (!error) setSalvato(true)
    } catch (e) {
      console.error('Errore:', e)
    }
  }

  if (!risultato) {
    return (
      <>
        <LanguageSwitcher />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {lang === 'it' ? 'Elaborazione in corso...' : 'Processing...'}
          </p>
        </div>
      </>
    )
  }

  const { scoring } = risultato
  const profilo = PROFILI_TRE[scoring.profilo]

  // Barra continuum razionalità/emotività
  const ContinuumBar = () => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            {lang === 'it' ? 'Razionalità' : 'Rationality'}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>
            {scoring.percentualeRazionalita}%
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            {lang === 'it' ? 'Emotività' : 'Emotionality'}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#ef4444' }}>
            {scoring.percentualeEmotivita}%
          </p>
        </div>
      </div>
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6, #ec4899, #f97316, #ef4444)',
          opacity: 0.3,
        }} />
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: 0,
          width: `${scoring.percentualeRazionalita}%`,
          background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
          borderRadius: '6px 0 0 6px',
          transition: 'width 1.2s var(--ease-out)',
        }} />
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0,
          right: 0,
          width: `${scoring.percentualeEmotivita}%`,
          background: 'linear-gradient(90deg, #f97316, #ef4444)',
          borderRadius: '0 6px 6px 0',
          transition: 'width 1.2s var(--ease-out)',
        }} />
        {/* Marker posizione */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${scoring.percentualeRazionalita}%`,
          transform: 'translate(-50%, -50%)',
          width: 20, height: 20,
          borderRadius: '50%',
          background: profilo.colore,
          border: '3px solid var(--bg-base)',
          boxShadow: `0 0 12px ${profilo.colore}`,
          zIndex: 2,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>0</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
          {lang === 'it' ? `Punteggio totale: ${scoring.totale} / 90` : `Total score: ${scoring.totale} / 90`}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>90</span>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>{lang === 'it' ? 'Risultati' : 'Results'} — TRE LMTC</title></Head>
      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', padding: '80px 24px 80px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }} className="fade-in-up">
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400, height: 200,
              background: `radial-gradient(ellipse, ${profilo.colore}30 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <p className="eyebrow" style={{ marginBottom: 16, color: '#ec4899' }}>
              {lang === 'it' ? 'Profilo assegnato' : 'Assigned profile'}
            </p>
            <h1 className="heading-1" style={{ color: profilo.colore, marginBottom: 8, textShadow: `0 0 60px ${profilo.colore}40` }}>
              {scoring.profilo}
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {profilo.funzione} · {profilo.range} {lang === 'it' ? 'punti' : 'points'}
            </p>
            <div style={{ width: 56, height: 2, background: profilo.colore, margin: '20px auto 0', boxShadow: `0 0 12px ${profilo.colore}` }} />
          </div>

          {/* Continuum */}
          <div className="card-elevated fade-in-up stagger-2" style={{ marginBottom: 28 }}>
            <p className="label-dim" style={{ marginBottom: 20 }}>
              {lang === 'it' ? 'Posizione nel continuum Razionalità / Emotività' : 'Position on the Rationality / Emotionality continuum'}
            </p>
            <ContinuumBar />
          </div>

          {/* Descrizione profilo */}
          <div
            className="card-elevated fade-in-up stagger-3"
            style={{ marginBottom: 28, borderColor: profilo.colore + '40', boxShadow: `0 0 60px ${profilo.colore}15, var(--shadow-lg)` }}
          >
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-soft)', marginBottom: 24 }}>
              {profilo.descrizione}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--success)', marginBottom: 10,
                }}>
                  {lang === 'it' ? 'Punti di forza' : 'Strengths'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.65 }}>{profilo.puntiForza}</p>
              </div>
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--warning)', marginBottom: 10,
                }}>
                  {lang === 'it' ? 'Aree di attenzione' : 'Areas of attention'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.65 }}>{profilo.areeAttenzione}</p>
              </div>
            </div>
          </div>

          {/* Nota metodologica */}
          <div className="fade-in-up stagger-4" style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.04), rgba(249, 115, 22, 0.02))',
            border: '1px solid rgba(236, 72, 153, 0.15)',
            borderRadius: 'var(--radius)',
            padding: '18px 22px',
            marginBottom: 40,
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>
              {lang === 'it'
                ? 'Questo strumento fornisce un\'indicazione orientativa sulla preferenza cognitiva dominante nel momento della compilazione. Non sostituisce strumenti standardizzati e validati. Non valuta capacità intellettive né tratti patologici.'
                : 'This tool provides an indicative reading of the dominant cognitive preference at the time of completion. It does not replace standardized and validated instruments. It does not assess intellectual abilities or pathological traits.'}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button className="btn-secondary" onClick={() => { sessionStorage.removeItem('tre_demo'); sessionStorage.removeItem('tre_risposte'); router.push('/') }}>
              {lang === 'it' ? '← Torna alla selezione' : '← Back to selection'}
            </button>
          </div>

          {salvato && (
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 24, letterSpacing: '0.05em' }}>
              {lang === 'it' ? 'Dati registrati in modo anonimo. Grazie per la partecipazione.' : 'Data anonymously recorded. Thank you for participating.'}
            </p>
          )}

        </div>
      </div>
    </>
  )
}
