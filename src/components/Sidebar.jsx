import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, MessageSquare, Flame, Zap, User, Mic, BarChart2, Shield, Brain } from 'lucide-react'

const PERSONAS = ['Ruthless VC', 'Broke Uncle', 'SEBI Officer', 'Gordon Ramsay', 'Wall Street Bro']
const VIBES = ['Savage', 'Brutally Honest', 'Sarcastic', 'Tough Love', 'Dark Humor']
const LANGUAGES = ['English', 'Hindi', 'Hinglish', 'Spanish', 'French', 'German', 'Japanese', 'Arabic']
const RESPONSE_LENGTHS = ['Short Burn', 'Full Roast', 'Essay Mode']
const PORTFOLIO_TYPES = ['Stocks', 'Crypto', 'Mutual Funds', 'Mixed', 'F&O']
const RISK_APPETITES = ['Conservative', 'Moderate', 'Yolo']
const EXPERIENCE_LEVELS = ['Noob', 'Intermediate', 'Pro']

function Dropdown({ options, value, onChange, theme }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border ${theme.divider} transition`}
        style={{ background: 'rgba(255,255,255,0.03)', fontFamily: 'Inter, sans-serif' }}
      >
        <span className={`${theme.title} flex items-center gap-2`}>{value}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={11} className={theme.muted} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-full mt-1 rounded-xl border ${theme.divider} overflow-hidden shadow-2xl`}
            style={{ background: 'rgba(10,10,14,0.98)', backdropFilter: 'blur(20px)' }}
          >
            {options.map(o => (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                  value === o ? theme.accent : theme.unselected
                } hover:bg-white/5`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {o}
                {value === o && <span className="opacity-50 text-xs">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToggleSwitch({ value, onChange, theme }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-9 h-5 rounded-full transition-all duration-300 ${value ? theme.accentBg : 'bg-zinc-800'}`}
    >
      <motion.div
        animate={{ x: value ? 16 : 2 }}
        transition={{ duration: 0.2 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  )
}

function Row({ icon: Icon, label, children, theme }) {
  return (
    <div className="space-y-1">
      <label className={`text-xs px-0.5 flex items-center gap-1.5 ${theme.muted}`}
        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.01em' }}>
        {Icon && <Icon size={9} />} {label}
      </label>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs uppercase text-zinc-600 mt-1"
      style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', fontWeight: 500 }}>
      {children}
    </p>
  )
}

export default function Sidebar({ settings, onChange, theme, sessions, activeSession, onSelectSession, onNewSession }) {
  const set = (key, val) => {
    onChange({ ...settings, [key]: val })

    if (typeof pendo !== 'undefined') {
      pendo.track('roast_settings_configured', {
        settingKey: key,
        settingValue: String(val),
        persona: key === 'persona' ? val : settings.persona,
        vibe: key === 'vibe' ? val : settings.vibe,
        language: key === 'language' ? val : settings.language,
        intensity: key === 'intensity' ? val : settings.intensity,
        responseLength: key === 'responseLength' ? val : settings.responseLength,
        portfolioType: key === 'portfolioType' ? val : settings.portfolioType,
        riskAppetite: key === 'riskAppetite' ? val : settings.riskAppetite,
        experienceLevel: key === 'experienceLevel' ? val : settings.experienceLevel,
        showRealTalk: key === 'showRealTalk' ? val : settings.showRealTalk,
      })
    }
  }

  return (
    <div className="flex flex-col gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>

      <SectionLabel>Character</SectionLabel>
      <Row icon={User} label="Persona" theme={theme}>
        <Dropdown options={PERSONAS} value={settings.persona} onChange={v => set('persona', v)} theme={theme} />
      </Row>
      <Row icon={Zap} label="Vibe" theme={theme}>
        <Dropdown options={VIBES} value={settings.vibe} onChange={v => set('vibe', v)} theme={theme} />
      </Row>
      <Row icon={Mic} label="Language" theme={theme}>
        <Dropdown options={LANGUAGES} value={settings.language} onChange={v => set('language', v)} theme={theme} />
      </Row>

      <div className={`border-t ${theme.divider} my-1`} />

      <SectionLabel>Roast Config</SectionLabel>
      <Row icon={BarChart2} label="Response Length" theme={theme}>
        <Dropdown options={RESPONSE_LENGTHS} value={settings.responseLength} onChange={v => set('responseLength', v)} theme={theme} />
      </Row>
      <Row icon={Brain} label="Portfolio Type" theme={theme}>
        <Dropdown options={PORTFOLIO_TYPES} value={settings.portfolioType} onChange={v => set('portfolioType', v)} theme={theme} />
      </Row>
      <Row icon={Shield} label="Risk Appetite" theme={theme}>
        <Dropdown options={RISK_APPETITES} value={settings.riskAppetite} onChange={v => set('riskAppetite', v)} theme={theme} />
      </Row>
      <Row icon={Brain} label="Experience Level" theme={theme}>
        <Dropdown options={EXPERIENCE_LEVELS} value={settings.experienceLevel} onChange={v => set('experienceLevel', v)} theme={theme} />
      </Row>
      <div className="flex items-center justify-between px-0.5 py-1">
        <label className={`text-xs flex items-center gap-1.5 ${theme.muted}`}
          style={{ fontFamily: 'Inter, sans-serif' }}>
          <Flame size={9} /> Show Real Talk
        </label>
        <ToggleSwitch value={settings.showRealTalk} onChange={v => set('showRealTalk', v)} theme={theme} />
      </div>

      <div className={`border-t ${theme.divider} my-1`} />

      <SectionLabel>Intensity</SectionLabel>
      <div className="space-y-1.5 px-0.5">
        <div className="flex justify-between">
          <span className={`text-xs ${theme.muted}`} style={{ fontFamily: 'Inter, sans-serif' }}>Roast Level</span>
          <span className={`text-xs font-bold ${theme.accent}`}>{settings.intensity}/10</span>
        </div>
        <input
          type="range" min={1} max={10}
          value={settings.intensity}
          onChange={e => set('intensity', Number(e.target.value))}
          className="w-full accent-orange-500"
        />
        <div className={`flex justify-between text-xs ${theme.muted}`} style={{ fontFamily: 'Inter, sans-serif' }}>
          <span>Gentle</span><span>Nuclear</span>
        </div>
      </div>

      <div className={`border-t ${theme.divider} my-1`} />

      <div className="flex items-center justify-between">
        <SectionLabel>History</SectionLabel>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onNewSession}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${theme.divider} ${theme.muted} hover:bg-white/5 transition`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Plus size={10} /> New
        </motion.button>
      </div>

      <div
        className="flex flex-col gap-1"
        style={{ maxHeight: '200px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sessions.length === 0 && (
          <p className={`text-xs ${theme.muted} px-1`} style={{ fontFamily: 'Inter, sans-serif' }}>No sessions yet.</p>
        )}
        {sessions.map(s => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectSession(s.id)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left truncate transition ${
              s.id === activeSession.id ? theme.selected : theme.unselected
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <MessageSquare size={10} className="shrink-0 opacity-60" />
            <span className="truncate">{s.title}</span>
          </motion.button>
        ))}
      </div>

    </div>
  )
}