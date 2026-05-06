import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { t, getLang } from '../lib/i18n'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Demo() {
  const router = useRouter()
  const [lang, setL] = useState('it')
  const [form, setForm] = useState({
    nome: '', cognome: '', eta: '', genere: '', istruzione: '', occupazione: '',
  })
  const [errore, setErrore] = useState('')

  useEffect(() => {
    setL(getLang())
    const handler = () => setL(getLang())
    window.addEventListener('cest_lang_change', handler)
    return () => window.removeEventListener('cest_lang_change', handler)
  }, [])

  const handleSubmit = () => {
    if (!form.eta || !form.genere || !form.istruzione || !form.occupazione) {
      setErrore(t('demo_error_required', lang))
      return
    }
    if (isNaN(form.eta) || form.eta < 14 || form.eta > 100) {
      setErrore(t('demo_error_age', lang))
      return
    }
    sessionStorage.setItem('cest_demo', JSON.stringify(form))
    router.push('/sezione-a')
  }

  return (
    <>
      <Head><title>{t('demo_title', lang)} — CEST</title></Head>
      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: 600, width: '100%' }} className="fade-in-up">

          <div style={{ marginBottom: 40 }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>{t('demo_eyebrow', lang)}</p>
            <h2 className="heading-1" style={{ marginBottom: 14 }}>{t('demo_title', lang)}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>
              {t('demo_subtitle', lang)}
            </p>
          </div>

          <div className="card-elevated">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label className="input-label">
                  {t('demo_name', lang)} <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t('demo_optional', lang)}</span>
                </label>
                <input
                  className="input"
                  type="text"
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  placeholder={lang === 'it' ? 'es. Mario' : 'e.g. John'}
                />
              </div>
              <div>
                <label className="input-label">
                  {t('demo_surname', lang)} <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t('demo_optional', lang)}</span>
                </label>
                <input
                  className="input"
                  type="text"
                  value={form.cognome}
                  onChange={e => setForm({ ...form, cognome: e.target.value })}
                  placeholder={lang === 'it' ? 'es. Rossi' : 'e.g. Smith'}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{t('demo_age', lang)}</label>
              <input
                className="input"
                type="number"
                value={form.eta}
                onChange={e => setForm({ ...form, eta: e.target.value })}
                placeholder={lang === 'it' ? 'es. 28' : 'e.g. 28'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{t('demo_gender', lang)}</label>
              <select
                className="select"
                value={form.genere}
                onChange={e => setForm({ ...form, genere: e.target.value })}
                style={{ color: form.genere ? 'var(--text)' : 'var(--text-dim)' }}
              >
                <option value="">{t('demo_select', lang)}</option>
                <option value="M">{t('demo_male', lang)}</option>
                <option value="F">{t('demo_female', lang)}</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{t('demo_education', lang)}</label>
              <select
                className="select"
                value={form.istruzione}
                onChange={e => setForm({ ...form, istruzione: e.target.value })}
                style={{ color: form.istruzione ? 'var(--text)' : 'var(--text-dim)' }}
              >
                <option value="">{t('demo_select', lang)}</option>
                <option value="licenza_media">{t('demo_edu_middle', lang)}</option>
                <option value="diploma">{t('demo_edu_high', lang)}</option>
                <option value="universita_in_corso">{t('demo_edu_uni_progress', lang)}</option>
                <option value="laurea_triennale">{t('demo_edu_bachelor', lang)}</option>
                <option value="laurea_magistrale">{t('demo_edu_master', lang)}</option>
                <option value="dottorato">{t('demo_edu_phd', lang)}</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{t('demo_occupation', lang)}</label>
              <select
                className="select"
                value={form.occupazione}
                onChange={e => setForm({ ...form, occupazione: e.target.value })}
                style={{ color: form.occupazione ? 'var(--text)' : 'var(--text-dim)' }}
              >
                <option value="">{t('demo_select', lang)}</option>
                <option value="studente">{t('demo_occ_student', lang)}</option>
                <option value="dipendente_privato">{t('demo_occ_private', lang)}</option>
                <option value="dipendente_pubblico">{t('demo_occ_public', lang)}</option>
                <option value="libero_professionista">{t('demo_occ_freelance', lang)}</option>
                <option value="imprenditore">{t('demo_occ_entrepreneur', lang)}</option>
                <option value="disoccupato">{t('demo_occ_unemployed', lang)}</option>
                <option value="altro">{t('demo_occ_other', lang)}</option>
              </select>
            </div>

            {errore && <p className="error-msg">{errore}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn-primary" onClick={handleSubmit}>
                <span>{t('demo_continue', lang)} →</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
