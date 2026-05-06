export const TRANSLATIONS = {
  it: {
    // Homepage
    home_eyebrow: 'CEST · LMTC 1.0',
    home_title_1: 'Stress-Test',
    home_title_2: 'della Personalità',
    home_subtitle: 'Strumento di screening rapido — 40 item. Tempo stimato: 8–10 minuti.',
    home_instructions_label: 'Istruzioni',
    home_instructions_1: 'Il test è diviso in due sezioni. Nella **Sezione A** ti verranno presentati 15 scenari: scegli l\'opzione che meglio descrive ciò che faresti *realmente*, non ciò che pensi sia giusto fare.',
    home_instructions_2: 'Nella **Sezione B** valuterai 25 affermazioni su scala da 1 a 6. Il test contiene item formulati in direzioni opposte: rispondere meccanicamente nello stesso verso invalida il protocollo.',
    home_instructions_3: 'Non esistono risposte corrette o sbagliate. Lo strumento misura il *pattern*, non la performance.',
    home_note_label: 'Nota',
    home_note: 'Alcuni scenari affrontano temi ad alta intensità emotiva (perdita, emergenza, crisi). Se ti trovi in un momento di vulnerabilità personale, valuta se questo è il momento appropriato per la compilazione.',
    home_cta: 'Inizia il test',

    // Demo
    demo_eyebrow: 'Prima di iniziare',
    demo_title: 'Dati demografici',
    demo_subtitle: 'Le informazioni sono anonime e vengono utilizzate esclusivamente per l\'analisi statistica aggregata. I campi con * sono obbligatori.',
    demo_name: 'Nome',
    demo_surname: 'Cognome',
    demo_optional: '(facoltativo)',
    demo_age: 'Età *',
    demo_gender: 'Genere *',
    demo_education: 'Livello di istruzione *',
    demo_occupation: 'Occupazione / settore *',
    demo_select: '— Seleziona —',
    demo_male: 'Maschile',
    demo_female: 'Femminile',
    demo_edu_middle: 'Licenza media',
    demo_edu_high: 'Diploma superiore',
    demo_edu_uni_progress: 'Università in corso',
    demo_edu_bachelor: 'Laurea triennale',
    demo_edu_master: 'Laurea magistrale / ciclo unico',
    demo_edu_phd: 'Dottorato / specializzazione post-laurea',
    demo_occ_student: 'Studente',
    demo_occ_private: 'Dipendente settore privato',
    demo_occ_public: 'Dipendente settore pubblico',
    demo_occ_freelance: 'Libero professionista',
    demo_occ_entrepreneur: 'Imprenditore / autonomo',
    demo_occ_unemployed: 'In cerca di occupazione',
    demo_occ_other: 'Altro',
    demo_continue: 'Continua',
    demo_error_required: 'Compila tutti i campi obbligatori per procedere.',
    demo_error_age: 'Inserisci un\'età valida.',

    // Sezione A
    sa_label: 'Sezione A — Scenari',
    sa_cluster_crisis: 'Cluster Crisi',
    sa_cluster_blackswan: 'Cluster Cigno Nero',
    sa_back: 'Indietro',
    sa_continue: 'Continua',
    sa_to_b: 'Vai alla Sezione B',
    sa_error_select: 'Seleziona un\'opzione per continuare.',

    // Sezione B
    sb_label: 'Sezione B — Identità Percepita',
    sb_back: 'Sezione A',
    sb_calculate: 'Calcola il profilo',
    sb_processing: 'Elaborazione...',
    sb_error_missing: (n) => `Mancano ${n} risposte. Compila tutti gli item per continuare.`,
    sb_scale_1: 'Assolutamente Falso',
    sb_scale_2: 'Falso',
    sb_scale_3: 'Piuttosto Falso',
    sb_scale_4: 'Piuttosto Vero',
    sb_scale_5: 'Vero',
    sb_scale_6: 'Assolutamente Vero',
    sb_dim_nfc: 'Need for Cognition',
    sb_dim_fi: 'Felt Intelligence',
    sb_dim_cs: 'Cold Structure',
    sb_dim_pr: 'Perceived Resilience',

    // Risultati
    res_eyebrow: 'Profilo assegnato',
    res_aq_warning_label: 'Avviso protocollo:',
    res_aq_warning: 'L\'AQ-Index rileva possibile acquiescenza su due o più dimensioni. Il profilo assegnato va interpretato con riserva.',
    res_delta_label: 'Delta Index — Congruenza identità / comportamento',
    res_delta_legend: '|Δ| ≤ 1.0 → congruenza · Δ > +1.0 → sovrastima identitaria · Δ < −1.0 → sottostima identitaria',
    res_undestimate: 'Sottostima',
    res_overestimate: 'Sovrastima',
    res_behavior_label: 'Comportamento (Sez. A)',
    res_identity_label: 'Identità percepita (Sez. B)',
    res_score_rationality: 'Razionalità',
    res_score_emotivity: 'Emotività',
    res_score_coldness: 'Freddezza',
    res_score_integration: 'Integrazione',
    res_anesthesia_label: 'Flag CS-Anestesia attivo',
    res_anesthesia: ' — Gli item 30 e 33 mostrano valori elevati. Questo pattern suggerisce un\'ipotesi di ridotta risonanza empatica da approfondire in contesto appropriato. Non è una diagnosi.',
    res_new_test: 'Nuovo test',
    res_saved: 'Dati registrati in modo anonimo. Grazie per la partecipazione.',
    res_loading: 'Elaborazione in corso...',
  },
  en: {
    // Homepage
    home_eyebrow: 'CEST · LMTC 1.0',
    home_title_1: 'Personality',
    home_title_2: 'Stress-Test',
    home_subtitle: 'Rapid screening tool — 40 items. Estimated time: 8–10 minutes.',
    home_instructions_label: 'Instructions',
    home_instructions_1: 'The test is divided into two sections. In **Section A** you will be presented with 15 scenarios: choose the option that best describes what you would *actually* do, not what you think is right.',
    home_instructions_2: 'In **Section B** you will rate 25 statements on a 1 to 6 scale. The test contains items worded in opposite directions: answering mechanically in the same direction invalidates the protocol.',
    home_instructions_3: 'There are no correct or incorrect answers. The instrument measures the *pattern*, not the performance.',
    home_note_label: 'Note',
    home_note: 'Some scenarios address themes of high emotional intensity (loss, emergency, crisis). If you are in a moment of personal vulnerability, consider whether this is the appropriate time for completion.',
    home_cta: 'Start the test',

    // Demo
    demo_eyebrow: 'Before starting',
    demo_title: 'Demographic data',
    demo_subtitle: 'Information is anonymous and used exclusively for aggregate statistical analysis. Fields marked with * are required.',
    demo_name: 'First name',
    demo_surname: 'Last name',
    demo_optional: '(optional)',
    demo_age: 'Age *',
    demo_gender: 'Gender *',
    demo_education: 'Education level *',
    demo_occupation: 'Occupation / sector *',
    demo_select: '— Select —',
    demo_male: 'Male',
    demo_female: 'Female',
    demo_edu_middle: 'Middle school',
    demo_edu_high: 'High school diploma',
    demo_edu_uni_progress: 'University in progress',
    demo_edu_bachelor: 'Bachelor\'s degree',
    demo_edu_master: 'Master\'s degree',
    demo_edu_phd: 'PhD / post-graduate specialization',
    demo_occ_student: 'Student',
    demo_occ_private: 'Private sector employee',
    demo_occ_public: 'Public sector employee',
    demo_occ_freelance: 'Freelancer',
    demo_occ_entrepreneur: 'Entrepreneur / self-employed',
    demo_occ_unemployed: 'Job seeking',
    demo_occ_other: 'Other',
    demo_continue: 'Continue',
    demo_error_required: 'Please fill all required fields to continue.',
    demo_error_age: 'Please enter a valid age.',

    // Sezione A
    sa_label: 'Section A — Scenarios',
    sa_cluster_crisis: 'Crisis Cluster',
    sa_cluster_blackswan: 'Black Swan Cluster',
    sa_back: 'Back',
    sa_continue: 'Continue',
    sa_to_b: 'Go to Section B',
    sa_error_select: 'Please select an option to continue.',

    // Sezione B
    sb_label: 'Section B — Perceived Identity',
    sb_back: 'Section A',
    sb_calculate: 'Calculate profile',
    sb_processing: 'Processing...',
    sb_error_missing: (n) => `${n} answers missing. Please complete all items to continue.`,
    sb_scale_1: 'Absolutely False',
    sb_scale_2: 'False',
    sb_scale_3: 'Rather False',
    sb_scale_4: 'Rather True',
    sb_scale_5: 'True',
    sb_scale_6: 'Absolutely True',
    sb_dim_nfc: 'Need for Cognition',
    sb_dim_fi: 'Felt Intelligence',
    sb_dim_cs: 'Cold Structure',
    sb_dim_pr: 'Perceived Resilience',

    // Risultati
    res_eyebrow: 'Assigned profile',
    res_aq_warning_label: 'Protocol warning:',
    res_aq_warning: 'The AQ-Index detects possible acquiescence on two or more dimensions. The assigned profile should be interpreted with caution.',
    res_delta_label: 'Delta Index — Identity / behavior congruence',
    res_delta_legend: '|Δ| ≤ 1.0 → congruence · Δ > +1.0 → identity overestimation · Δ < −1.0 → identity underestimation',
    res_undestimate: 'Underestimate',
    res_overestimate: 'Overestimate',
    res_behavior_label: 'Behavior (Sect. A)',
    res_identity_label: 'Perceived identity (Sect. B)',
    res_score_rationality: 'Rationality',
    res_score_emotivity: 'Emotivity',
    res_score_coldness: 'Coldness',
    res_score_integration: 'Integration',
    res_anesthesia_label: 'CS-Anesthesia flag active',
    res_anesthesia: ' — Items 30 and 33 show elevated values. This pattern suggests a hypothesis of reduced empathic resonance to be explored in appropriate context. This is not a diagnosis.',
    res_new_test: 'New test',
    res_saved: 'Data anonymously recorded. Thank you for participating.',
    res_loading: 'Processing...',
  }
}

export function getLang() {
  if (typeof window === 'undefined') return 'it'
  return localStorage.getItem('cest_lang') || 'it'
}

export function setLang(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cest_lang', lang)
    window.dispatchEvent(new Event('cest_lang_change'))
  }
}

export function t(key, lang) {
  const l = lang || getLang()
  return TRANSLATIONS[l]?.[key] ?? TRANSLATIONS.it[key] ?? key
}
