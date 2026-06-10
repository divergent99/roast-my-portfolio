import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Pencil, Trash2 } from 'lucide-react'

export default function SessionMenu({ session, theme, onRename, onDelete }) {
  const [open, setOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(session.title)
  const ref = useRef(null)

  useEffect(() => {
    setNewName(session.title)
  }, [session.title])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleRename = () => {
    if (newName.trim()) onRename(session.id, newName.trim())
    setRenaming(false)
    setOpen(false)
  }

  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      {renaming ? (
        <input
          autoFocus
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') setRenaming(false)
          }}
          onBlur={handleRename}
          className={`bg-transparent border-b ${theme.accentBorder} outline-none text-sm ${theme.title} w-48`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      ) : (
        <button
          onClick={() => setOpen(v => !v)}
          className={`flex items-center gap-1.5 text-sm font-medium ${theme.title} hover:opacity-70 transition`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="max-w-xs truncate">{session.title}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronDown size={13} className={theme.muted} />
          </motion.div>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-8 left-0 rounded-xl border ${theme.divider} overflow-hidden shadow-2xl z-[100]`}
            style={{ background: 'rgba(10,10,14,0.98)', backdropFilter: 'blur(20px)', minWidth: '180px' }}
          >
            <button
              onClick={() => { setRenaming(true); setNewName(session.title); setOpen(false) }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-xs ${theme.unselected} hover:bg-white/5 transition`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Pencil size={12} className={theme.muted} /> Rename
            </button>
            <button
              onClick={() => { onDelete(session.id); setOpen(false) }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-xs hover:bg-white/5 transition border-t ${theme.divider}`}
              style={{ fontFamily: 'Inter, sans-serif', color: '#ef4444' }}
            >
              <Trash2 size={12} style={{ color: '#ef4444' }} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}