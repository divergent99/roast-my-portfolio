import { useRef } from 'react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import { X, Download, Flame, TrendingDown, AlertTriangle, Skull } from 'lucide-react'

const CARD_STYLES = {
  terminal: {
    bg: '#000000', border: '#22c55e', titleColor: '#4ade80',
    textColor: '#86efac', mutedColor: '#166534', statBg: '#052e16',
    statText: '#4ade80', accentColor: '#22c55e',
  },
  premium: {
    bg: '#0d1117', border: '#7c3aed', titleColor: '#a78bfa',
    textColor: '#cbd5e1', mutedColor: '#475569', statBg: '#161b22',
    statText: '#a78bfa', accentColor: '#7c3aed',
  },
  brutalist: {
    bg: '#09090b', border: '#f97316', titleColor: '#f97316',
    textColor: '#f4f4f5', mutedColor: '#52525b', statBg: '#18181b',
    statText: '#fb923c', accentColor: '#f97316',
  },
}

function extractStats(content) {
  const stats = []
  const lossMatch = content.match(/down\s+([\d.]+)%/i)
  if (lossMatch) stats.push({ icon: TrendingDown, label: 'Biggest Loss', value: `-${lossMatch[1]}%` })
  const scoreMatch = content.match(/portfolio score[:\s]+(\d+)\/10/i)
  if (scoreMatch) stats.push({ icon: Skull, label: 'Portfolio Score', value: `${scoreMatch[1]}/10` })
  const holdingsMatch = content.match(/(\d+)\s+(?:different\s+)?(?:stocks?|holdings?)/i)
  if (holdingsMatch) stats.push({ icon: AlertTriangle, label: 'Holdings', value: holdingsMatch[1] })
  if (stats.length === 0) {
    stats.push(
      { icon: Skull, label: 'Survival Chance', value: '12%' },
      { icon: TrendingDown, label: 'Skill Issue', value: '100%' },
      { icon: AlertTriangle, label: 'Risk Level', value: 'MAX' },
    )
  }
  return stats.slice(0, 3)
}

function extractBullets(content) {
  const clean = content.replace(/[#*`]/g, '').trim()

  // Try Real Talk section first -- cleanest points
  const realTalkMatch = clean.match(/Real Talk[:\s]+([\s\S]+?)(?:Portfolio Score|$)/i)
  if (realTalkMatch) {
    const bullets = realTalkMatch[1]
      .split(/\n/)
      .map(s => s.replace(/^\d+\.\s*/, '').trim())
      .filter(s => s.length > 15)
      .slice(0, 3)
    if (bullets.length >= 2) return bullets
  }

  // Fallback -- complete sentences over 40 chars
  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 140 && !s.startsWith('Portfolio Score'))

  return sentences.slice(0, 3)
}

export default function RoastCard({ content, onClose, theme }) {
  const cardRef = useRef(null)
  const cs = CARD_STYLES[theme.id] || CARD_STYLES.brutalist
  const stats = extractStats(content)
  const bullets = extractBullets(content)

  const download = async () => {
    const canvas = await html2canvas(cardRef.current, { backgroundColor: cs.bg, scale: 2 })
    const link = document.createElement('a')
    link.download = 'roast-card.png'
    link.href = canvas.toDataURL()
    link.click()

    if (typeof pendo !== 'undefined') {
      pendo.track('roast_card_downloaded', {
        themeId: theme.id,
        statsCount: stats.length,
        bulletsCount: bullets.length,
        contentLength: content?.length || 0,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full space-y-4 border border-zinc-800"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold">Your Roast Card</h3>
          <button onClick={onClose}><X size={18} className="text-zinc-400 hover:text-white" /></button>
        </div>

        <div
          ref={cardRef}
          style={{
            backgroundColor: cs.bg,
            border: `2px solid ${cs.border}`,
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: cs.titleColor, fontSize: '18px' }}>🔥</span>
            <span style={{ color: cs.titleColor, fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.1em' }}>
              ROAST MY PORTFOLIO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: cs.accentColor, fontSize: '12px', marginTop: '2px' }}>›</span>
                <span style={{ color: cs.textColor, fontSize: '12px', lineHeight: '1.5' }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: '8px' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ backgroundColor: cs.statBg, borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ color: cs.statText, fontWeight: 'bold', fontSize: '14px' }}>{stat.value}</div>
                <div style={{ color: cs.mutedColor, fontSize: '10px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${cs.border}33`, paddingTop: '10px' }}>
            <span style={{ color: cs.mutedColor, fontSize: '11px' }}>roastmyportfolio.app</span>
            <span style={{ color: cs.accentColor, fontSize: '11px' }}>You got cooked</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={download}
          className={`w-full flex items-center justify-center gap-2 ${theme.button} font-bold rounded-xl py-2.5 text-sm transition`}
        >
          <Download size={14} /> Download Card
        </motion.button>
      </motion.div>
    </motion.div>
  )
}