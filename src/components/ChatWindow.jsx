import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Flame, Zap, Plus, Image, FileText, X, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import RoastCard from './RoastCard'
import Aurora from './Aurora'

const CHAT_LINES = [
  "Oh you want to talk? Sure, I have nothing better to do.",
  "A conversation? How quaint. Go on then.",
  "You rang? I was busy judging other portfolios.",
  "Sure, let's chat. Your portfolio already ruined my day anyway.",
  "I'm listening. This better be good.",
]

const ROAST_LINES = [
  "Analyzing your financial disasters...",
  "Counting your losses... one by one.",
  "Preparing the eulogy for your gains...",
  "Running the numbers. They're bad. Very bad.",
  "Consulting the spirits of Warren Buffett...",
]

const IDEA_CARDS = [
  { title: 'Screenshot Roast', desc: 'I have my Groww holdings open. Roast what you see.' },
  { title: 'Blind Roast', desc: 'I hold Nifty 50, some midcaps, and a few random picks. Go.' },
  { title: 'Global Portfolio', desc: 'My portfolio is S&P 500 ETFs and some individual US stocks.' },
  { title: 'Strategy Check', desc: 'I buy dips and hold long term. Is my strategy actually solid?' },
  { title: 'Loss Debrief', desc: 'I lost 30% on a stock last year. Tell me what went wrong.' },
  { title: 'Goal Alignment', desc: 'I want 1 crore in 10 years. Does my current portfolio get me there?' },
]

function CopyButton({ text, theme }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={copy}
      className={`p-1 rounded-md transition opacity-0 group-hover:opacity-100 ${theme.muted}`}
    >
      {copied
        ? <Check size={11} className="text-green-400" />
        : <Copy size={11} />
      }
    </motion.button>
  )
}

function SessionMenu({ session, theme, onRename, onDelete }) {
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
          className={`bg-transparent border-b ${theme.accentBorder} outline-none text-sm ${theme.title} w-64`}
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
            className={`absolute top-8 left-0 rounded-xl border ${theme.divider} overflow-hidden shadow-2xl z-50`}
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

export default function ChatWindow({ session, onSend, loading, theme, themeId }) {
  const [input, setInput] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [loadingLine, setLoadingLine] = useState('')
  const bottomRef = useRef(null)
  const imageInputRef = useRef(null)
  const docInputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session.messages, loading])

  const handleSend = () => {
    if (!input.trim() && !attachment) return
    const line = attachment
      ? ROAST_LINES[Math.floor(Math.random() * ROAST_LINES.length)]
      : CHAT_LINES[Math.floor(Math.random() * CHAT_LINES.length)]
    setLoadingLine(line)
    onSend({ text: input, image: attachment?.type === 'image' ? attachment.file : null })
    setInput('')
    setAttachment(null)
  }

  const handleFile = (file, type) => {
    setAttachment({ file, type, name: file.name, preview: type === 'image' ? URL.createObjectURL(file) : null })
    setShowAttachMenu(false)
  }

  const lastRoast = [...session.messages].reverse().find(m => m.role === 'assistant')

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <Aurora themeId={themeId} />

      {/* Messages */}
      <div
        className="relative flex-1 overflow-y-auto py-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="max-w-2xl mx-auto px-4 space-y-5 h-full">

          {session.messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center gap-6 py-8"
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                >
                  <Flame size={40} className={theme.accent} />
                </motion.div>
                <h2 className={`text-xl font-bold ${theme.title}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  Roast My Portfolio
                </h2>
                <p className={`text-xs max-w-xs ${theme.muted}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  Upload a screenshot or just start chatting.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 max-w-xl w-full">
                {IDEA_CARDS.map((card, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setInput(card.desc)}
                    className={`text-left p-3 rounded-xl border ${theme.divider} hover:bg-white/5 transition`}
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className={`text-xs font-semibold ${theme.title} mb-1`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {card.title}
                    </div>
                    <div className={`text-xs ${theme.muted} leading-relaxed`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {card.desc}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {session.messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`flex items-end gap-2 group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-1 ${theme.accentBg}`}>
                    <Flame size={12} className="text-white" />
                  </div>
                )}

                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? `${theme.userBubble} rounded-br-none`
                    : `${theme.aiBubble} rounded-bl-none`
                }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {msg.image && (
                    <img src={msg.image} className="rounded-xl mb-2 max-h-40 object-contain" />
                  )}
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown components={{
                      p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className={`font-semibold ${theme.accent}`}>{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-1.5 pl-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-1.5 pl-1">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      h1: ({ children }) => <h1 className={`text-base font-bold mb-1.5 ${theme.accent}`}>{children}</h1>,
                      h2: ({ children }) => <h2 className={`text-sm font-bold mb-1 ${theme.accent}`}>{children}</h2>,
                      h3: ({ children }) => <h3 className={`font-semibold mb-1 ${theme.accent}`}>{children}</h3>,
                      hr: () => <hr className="my-2 border-t opacity-20" />,
                      code: ({ children }) => <code className="bg-black/20 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                    }}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>

                <div className={`shrink-0 mb-1 ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <CopyButton text={msg.content} theme={theme} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2 justify-start"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${theme.accentBg}`}>
                <Flame size={12} className="text-white" />
              </div>
              <div className={`${theme.aiBubble} rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2`}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                >
                  <Zap size={13} className={theme.accent} />
                </motion.div>
                <span className={`${theme.muted} text-xs`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {loadingLine}
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="relative px-4 pb-2 pt-1">
        <div className="max-w-2xl mx-auto">

          {lastRoast && (
            <div className="mb-1.5">
              <button
                onClick={() => setShowCard(true)}
                className={`text-xs ${theme.accent} hover:opacity-70 transition underline`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                ✦ Generate Roast Card
              </button>
            </div>
          )}

          <div
            className={`relative flex items-end gap-2 rounded-2xl border ${theme.input} px-3 py-2.5`}
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}
          >
            {attachment && (
              <div className={`absolute -top-10 left-3 flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${theme.aiBubble}`}>
                {attachment.preview
                  ? <img src={attachment.preview} className="h-6 w-6 rounded object-cover" />
                  : <FileText size={13} className={theme.accent} />
                }
                <span className={theme.muted}>{attachment.name}</span>
                <button onClick={() => setAttachment(null)} className="hover:text-red-400 transition ml-1">
                  <X size={11} />
                </button>
              </div>
            )}

            <div className="relative shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAttachMenu(v => !v)}
                className={`w-7 h-7 rounded-full flex items-center justify-center border ${theme.divider} ${theme.muted} transition`}
              >
                <Plus size={14} />
              </motion.button>

              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className={`absolute bottom-10 left-0 rounded-xl border ${theme.divider} overflow-hidden shadow-xl`}
                    style={{ background: 'rgba(10,10,12,0.95)', backdropFilter: 'blur(16px)', minWidth: '160px' }}
                  >
                    <button
                      onClick={() => imageInputRef.current.click()}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 text-xs ${theme.unselected} hover:bg-white/5 transition`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Image size={13} className={theme.accent} /> Upload Image
                    </button>
                    <button
                      onClick={() => docInputRef.current.click()}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 text-xs ${theme.unselected} hover:bg-white/5 transition border-t ${theme.divider}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <FileText size={13} className={theme.accent} /> Upload PDF/Doc
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files[0] && handleFile(e.target.files[0], 'image')} />
              <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                onChange={e => e.target.files[0] && handleFile(e.target.files[0], 'doc')} />
            </div>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask anything or attach a screenshot..."
              rows={1}
              className={`flex-1 bg-transparent outline-none text-sm resize-none ${theme.title} max-h-32 overflow-y-auto`}
              style={{ lineHeight: '1.5', scrollbarWidth: 'none', fontFamily: 'Inter, sans-serif' }}
            />

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleSend}
              disabled={loading || (!input.trim() && !attachment)}
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition ${
                (input.trim() || attachment) && !loading
                  ? `${theme.accentBg} text-white`
                  : 'bg-zinc-800 text-zinc-600'
              }`}
            >
              <Send size={13} />
            </motion.button>
          </div>

          {/* Disclaimer */}
          <p className="text-center mt-2 pb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="text-xs text-zinc-600">
              Roast My Portfolio uses AI and can make mistakes. Not financial advice.{' '}
              <a
                href="https://youtu.be/QDia3e12czc?si=v1trdggNAU6zFQIA"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-zinc-400 transition"
              >
                Learn more
              </a>
            </span>
          </p>
        </div>
      </div>

      {showCard && lastRoast && (
        <RoastCard content={lastRoast.content} onClose={() => setShowCard(false)} theme={theme} />
      )}
    </div>
  )
}
