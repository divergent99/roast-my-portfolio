import { motion } from 'framer-motion'
import { THEMES } from '../utils/themes'

const ACTIVE_STYLES = {
  terminal: 'bg-green-500 text-black border-green-500',
  premium: 'bg-blue-600 text-white border-blue-600',
  brutalist: 'bg-orange-500 text-black border-orange-500',
}

export default function ThemeSwitcher({ current, onChange }) {
  return (
    <div className="flex gap-1">
      {Object.values(THEMES).map(t => (
        <motion.button
          key={t.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(t.id)}
          className={`px-3 py-1 rounded text-xs font-mono font-bold border transition-all ${
            current === t.id
              ? ACTIVE_STYLES[t.id]
              : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500'
          }`}
        >
          {t.name}
        </motion.button>
      ))}
    </div>
  )
}