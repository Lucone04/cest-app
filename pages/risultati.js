import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { calcolaScoring } from '../lib/scoring'
import { supabase } from '../lib/supabase'
import { t, getLang } from '../lib/i18n'
import { PROFILI_TR } from '../lib/translations'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Risultati() {
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
    const demo = JSON.parse(sessionStorage.getItem('cest_demo') || 'null')
    const sezioneA = JSON.parse(sessionStorage.getItem('cest_sezione_a') || 'null')
    const sezioneB = JSON.parse(sessionStorage.getItem('cest_sezione_b') || 'null')

    if (!demo || !sezioneA || !sezioneB) {
      router.push('/')
      return
    }

    const scoring = calcolaScoring(sezioneA, sezioneB)
    setRisultato({ demo, sezioneA, sezioneB, scoring })
    salvaRisultato(demo, sezioneA, sezioneB, scoring)
  }, [])

  const salvaRisultato = async (demo, sezioneA, sezioneB, scoring) => {
    try {
      const record = {
        nome: demo.nome || null,
        cognome: demo.cognome || null,
        eta: parseInt(demo.eta),
        genere: demo.genere,
        istruzione: demo.istruzione,
        occupazione: demo.occupazione,
        a1: sezioneA[0], a2: sezioneA[1], a3: sezioneA[2], a4: sezioneA[3], a5: sezioneA[4],
        a6: sezioneA[5], a7: sezioneA[6], a8: sezioneA[7], a9: sezioneA[8], a10: sezioneA[9],
        a11: sezioneA[10], a12: sezioneA[11], a13: sezioneA[12], a14: sezioneA[13], a15: sezioneA[14],
        b16: sezioneB[0], b17: sezioneB[1], b18: sezioneB[2], b19: sezioneB[3], b20: sezioneB[4],
        b21: sezioneB[5], b22: sezioneB[6], b23: sezioneB[7], b24: sezioneB[8], b25: sezioneB[9],
        b26: sezioneB[10], b27: sezioneB[11], b28: sezioneB[12], b29: sezioneB[13], b30: sezioneB[14],
        b31: sezioneB[15], b32: sezioneB[16], b33: sezioneB[17], b34: sezioneB[18], b35: sezioneB[19],
        b36: sezioneB[20], b37: sezioneB[21], b38: sezioneB[22], b39: sezioneB[23], b40: sezioneB[24],
        score_a_razionalita: scoring.score_a_razionalita,
        score_a_emotivita: scoring.score_a_emotivita,
        score_a_freddezza: scoring.score_a_freddezza,
        score_a_integrazione: scoring.score_a_integrazione,
        score_b_nfc: scoring.score_b_nfc,
        score_b_fi: scoring.score_b_fi,
        score_b_cs_disciplina: scoring.score_b_cs_disciplina,
        score_b_cs_anestesia: scoring.score_b_cs_anestesia,
        score_b_pr: scoring.score_b_pr,
        delta_nfc: scoring.delta_nfc,
        delta_fi: scoring.delta_fi,
        delta_cs: scoring.delta_cs,
        delta_pr: scoring.delta_pr,
        profilo: scoring.profilo,
        aq_valido: scoring.aq_valido,
      }
      const { error } = await supabase.from('risposte').insert(record)
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
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('res_loading', lang)}</p>
        </div>
      </>
    )
  }

  const { scoring } = risultato
  const profilo = PROFILI_TR[lang][scoring.profilo]
  const dimColors = { NFC: '#6366f1', FI: '#10b981', CS: '#f59e0b', PR: '#ef4444' }

  const DeltaBar = ({ label, delta, color }) => {
    const isPositive = delta > 0
    const width = Math.abs(delta / 6) * 50
    const deltaColor = Math.abs(delta) <= 1.0 ? 'var(--success)' : Math.abs(delta) <= 2.0 ? 'var(--warning)' : 'var(--danger)'
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-soft)', fontWeight: 500 }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: deltaColor }}>
            {delta > 0 ? '+' : ''}{delta.toFixed(2)}
          </span>
        </div>
        <div style={{ position: 'relative', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            left: isPositive ? '50%' : `${50 - width}%`,
            width: `${width}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            borderRadius: 4,
            transition: 'all 1s var(--ease-out)',
          }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: '100%', background: 'var(--text-dim)', transform: 'translateX(-50%)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{t('res_undestimate', lang)}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{t('res_overestimate', lang)}</span>
        </div>
      </div>
    )
  }

  const ScoreBar = ({ label, value, color }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-soft)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color }}>{value.toFixed(2)}</span>
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${(value / 6) * 100}%`, background: color }} />
      </div>
    </div>
  )

  return (
    <>
      <Head><title>{lang === 'it' ? 'Risultati' : 'Results'} — CEST</title></Head>
      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', padding: '80px 24px 80px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Hero */}
          <div className="profile-hero fade-in-up" style={{ marginBottom: 56 }}>
            <p className="eyebrow" style={{ marginBottom: 20 }}>{t('res_eyebrow', lang)}</p>
            <h1
              className="heading-1"
              style={{
                color: profilo.colore,
                marginBottom: 16,
                textShadow: `0 0 60px ${profilo.colore}40`,
              }}
            >
              {profilo.nome}
            </h1>
            <div style={{ width: 56, height: 2, background: profilo.colore, margin: '0 auto', boxShadow: `0 0 12px ${profilo.colore}` }} />
          </div>

          {!scoring.aq_valido && (
            <div className="fade-in-up stagger-1" style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius)',
              padding: '18px 22px',
              marginBottom: 32,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#fca5a5', lineHeight: 1.65 }}>
                <strong>{t('res_aq_warning_label', lang)}</strong> {t('res_aq_warning', lang)}
              </p>
            </div>
          )}

          <div
            className="card-elevated fade-in-up stagger-2"
            style={{
              marginBottom: 28,
              borderColor: profilo.colore + '40',
              boxShadow: `0 0 60px ${profilo.colore}15, var(--shadow-lg)`,
            }}
          >
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-soft)', marginBottom: profilo.nota ? 24 : 0 }}>
              {profilo.descrizione}
            </p>
            {profilo.nota && (
              <p style={{
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border)',
                paddingTop: 18,
                lineHeight: 1.65,
                fontStyle: 'italic',
              }}>
                {profilo.nota}
              </p>
            )}
          </div>

          <div className="card-elevated fade-in-up stagger-3" style={{ marginBottom: 28 }}>
            <p className="label-dim" style={{ marginBottom: 24 }}>{t('res_delta_label', lang)}</p>
            <DeltaBar label="NFC — Need for Cognition" delta={scoring.delta_nfc} color={dimColors.NFC} />
            <DeltaBar label="FI — Felt Intelligence" delta={scoring.delta_fi} color={dimColors.FI} />
            <DeltaBar label="CS — Cold Structure" delta={scoring.delta_cs} color={dimColors.CS} />
            <DeltaBar label="PR — Perceived Resilience" delta={scoring.delta_pr} color={dimColors.PR} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 20, lineHeight: 1.6 }}>
              {t('res_delta_legend', lang)}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
            <div className="card fade-in-up stagger-4">
              <p className="label-dim" style={{ marginBottom: 18 }}>{t('res_behavior_label', lang)}</p>
              <ScoreBar label={t('res_score_rationality', lang)} value={scoring.score_a_razionalita} color={dimColors.NFC} />
              <ScoreBar label={t('res_score_emotivity', lang)} value={scoring.score_a_emotivita} color={dimColors.FI} />
              <ScoreBar label={t('res_score_coldness', lang)} value={scoring.score_a_freddezza} color={dimColors.CS} />
              <ScoreBar label={t('res_score_integration', lang)} value={scoring.score_a_integrazione} color={dimColors.PR} />
            </div>
            <div className="card fade-in-up stagger-5">
              <p className="label-dim" style={{ marginBottom: 18 }}>{t('res_identity_label', lang)}</p>
              <ScoreBar label="NFC" value={scoring.score_b_nfc} color={dimColors.NFC} />
              <ScoreBar label="FI" value={scoring.score_b_fi} color={dimColors.FI} />
              <ScoreBar label="CS-Disciplina" value={scoring.score_b_cs_disciplina} color={dimColors.CS} />
              <ScoreBar label="PR" value={scoring.score_b_pr} color={dimColors.PR} />
            </div>
          </div>

          {scoring.flag_anestesia && (
            <div className="fade-in-up stagger-6" style={{
              background: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.25)',
              borderRadius: 'var(--radius)',
              padding: '18px 22px',
              marginBottom: 28,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#c4b5fd', lineHeight: 1.65 }}>
                <strong>{t('res_anesthesia_label', lang)}</strong>{t('res_anesthesia', lang)}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <button className="btn-secondary" onClick={() => { sessionStorage.clear(); router.push('/') }}>
              {t('res_new_test', lang)}
            </button>
          </div>

          {salvato && (
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 24, letterSpacing: '0.05em' }}>
              {t('res_saved', lang)}
            </p>
          )}

        </div>
      </div>
    </>
  )
}
