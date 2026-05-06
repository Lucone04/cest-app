import { useState, useEffect } from 'react'
import { getLang, setLang } from '../lib/i18n'

export default function LanguageSwitcher() {
  const [lang, setL] = useState('it')

  useEffect(() => {
    setL(getLang())
    const handler = () => setL(getLang())
    window.addEventListener('cest_lang_change', handler)
    return () => window.removeEventListener('cest_lang_change', handler)
  }, [])

  const change = (l) => {
    setLang(l)
    setL(l)
  }

  return (
    <div className="lang-switcher">
      <button className={`lang-btn ${lang === 'it' ? 'active' : ''}`} onClick={() => change('it')}>IT</button>
      <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => change('en')}>EN</button>
    </div>
  )
}
