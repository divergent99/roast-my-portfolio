import { motion } from 'framer-motion'
import { MessageSquare, Plus } from 'lucide-react'

export default function SessionList({ sessions, activeSession, onSelect, onNew, theme }) {
  return (
    <div className="flex flex-col h-full">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNew}
        className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border text-sm transition ${theme.sessionBtn}`}
      >
        <Plus size={13} /> New Session
      </motion.button>
      <div className="flex flex-col gap-1 overflow-y-auto">
        {sessions.map(s => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(s.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left truncate transition ${
              s.id === activeSession.id ? theme.selected : theme.unselected
            }`}
          >
            <MessageSquare size={11} />
            <span className="truncate">{s.title}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}