import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getLang } from '../../lib/i18n'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function TreDemo() {
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
      setErrore(lang === 'it' ? 'Compila tutti i campi obbligatori per procedere.' : 'Please fill all required fields to continue.')
      return
    }
    if (isNaN(form.eta) || form.eta < 14 || form.eta > 100) {
      setErrore(lang === 'it' ? 'Inserisci un\'età valida.' : 'Please enter a valid age.')
      return
    }
    sessionStorage.setItem('tre_demo', JSON.stringify(form))
    router.push('/tre/test')
  }

  return (
    <>
      <Head><title>{lang === 'it' ? 'Dati demografici' : 'Demographic data'} — TRE LMTC</title></Head>
      <LanguageSwitcher />

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: 600, width: '100%' }} className="fade-in-up">

          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => router.push('/')}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', cursor: 'pointer', letterSpacing: '0.05em', marginBottom: 24, display: 'block' }}
            >
              ← {lang === 'it' ? 'Torna alla selezione' : 'Back to selection'}
            </button>
            <p className="eyebrow" style={{ marginBottom: 16, color: '#ec4899' }}>TRE · LMTC</p>
            <h2 className="heading-1" style={{ marginBottom: 14 }}>
              {lang === 'it' ? 'Dati demografici' : 'Demographic data'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>
              {lang === 'it'
                ? 'Le informazioni sono anonime e utilizzate esclusivamente per l\'analisi statistica aggregata. I campi con * sono obbligatori.'
                : 'Information is anonymous and used exclusively for aggregate statistical analysis. Fields marked * are required.'}
            </p>
          </div>

          <div className="card-elevated" style={{ marginTop: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label className="input-label">
                  {lang === 'it' ? 'Nome' : 'First name'} <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({lang === 'it' ? 'facoltativo' : 'optional'})</span>
                </label>
                <input className="input" type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder={lang === 'it' ? 'es. Mario' : 'e.g. John'} />
              </div>
              <div>
                <label className="input-label">
                  {lang === 'it' ? 'Cognome' : 'Last name'} <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({lang === 'it' ? 'facoltativo' : 'optional'})</span>
                </label>
                <input className="input" type="text" value={form.cognome} onChange={e => setForm({ ...form, cognome: e.target.value })} placeholder={lang === 'it' ? 'es. Rossi' : 'e.g. Smith'} />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{lang === 'it' ? 'Età *' : 'Age *'}</label>
              <input className="input" type="number" value={form.eta} onChange={e => setForm({ ...form, eta: e.target.value })} placeholder={lang === 'it' ? 'es. 28' : 'e.g. 28'} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{lang === 'it' ? 'Genere *' : 'Gender *'}</label>
              <select className="select" value={form.genere} onChange={e => setForm({ ...form, genere: e.target.value })} style={{ color: form.genere ? 'var(--text)' : 'var(--text-dim)' }}>
                <option value="">{lang === 'it' ? '— Seleziona —' : '— Select —'}</option>
                <option value="M">{lang === 'it' ? 'Maschile' : 'Male'}</option>
                <option value="F">{lang === 'it' ? 'Femminile' : 'Female'}</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{lang === 'it' ? 'Livello di istruzione *' : 'Education level *'}</label>
              <select className="select" value={form.istruzione} onChange={e => setForm({ ...form, istruzione: e.target.value })} style={{ color: form.istruzione ? 'var(--text)' : 'var(--text-dim)' }}>
                <option value="">{lang === 'it' ? '— Seleziona —' : '— Select —'}</option>
                <option value="licenza_media">{lang === 'it' ? 'Licenza media' : 'Middle school'}</option>
                <option value="diploma">{lang === 'it' ? 'Diploma superiore' : 'High school diploma'}</option>
                <option value="universita_in_corso">{lang === 'it' ? 'Università in corso' : 'University in progress'}</option>
                <option value="laurea_triennale">{lang === 'it' ? 'Laurea triennale' : 'Bachelor\'s degree'}</option>
                <option value="laurea_magistrale">{lang === 'it' ? 'Laurea magistrale / ciclo unico' : 'Master\'s degree'}</option>
                <option value="dottorato">{lang === 'it' ? 'Dottorato / specializzazione' : 'PhD / post-graduate'}</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">{lang === 'it' ? 'Occupazione / settore *' : 'Occupation / sector *'}</label>
              <select className="select" value={form.occupazione} onChange={e => setForm({ ...form, occupazione: e.target.value })} style={{ color: form.occupazione ? 'var(--text)' : 'var(--text-dim)' }}>
                <option value="">{lang === 'it' ? '— Seleziona —' : '— Select —'}</option>
                <option value="studente">{lang === 'it' ? 'Studente' : 'Student'}</option>
                <option value="dipendente_privato">{lang === 'it' ? 'Dipendente settore privato' : 'Private sector employee'}</option>
                <option value="dipendente_pubblico">{lang === 'it' ? 'Dipendente settore pubblico' : 'Public sector employee'}</option>
                <option value="libero_professionista">{lang === 'it' ? 'Libero professionista' : 'Freelancer'}</option>
                <option value="imprenditore">{lang === 'it' ? 'Imprenditore / autonomo' : 'Entrepreneur'}</option>
                <option value="disoccupato">{lang === 'it' ? 'In cerca di occupazione' : 'Job seeking'}</option>
                <option value="altro">{lang === 'it' ? 'Altro' : 'Other'}</option>
              </select>
            </div>

            {errore && <p className="error-msg">{errore}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn-primary" onClick={handleSubmit} style={{ borderColor: '#ec4899', background: '#ec4899' }}>
                <span>{lang === 'it' ? 'Continua' : 'Continue'} →</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
