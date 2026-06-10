import { useEffect, useRef } from 'react'

export default function Aurora({ themeId }) {
  const canvasRef = useRef(null)

  const COLORS = {
    terminal: ['#00ff4122', '#00cc3311', '#00ff8822'],
    premium:  ['#3b82f622', '#818cf811', '#c084fc22'],
    brutalist: ['#f9731622', '#ef444411', '#f59e0b22'],
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = COLORS[themeId] || COLORS.brutalist

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width
      const H = canvas.height

      colors.forEach((color, i) => {
        const x = W * (0.3 + 0.4 * Math.sin(t * 0.0007 + i * 2.1))
        const y = H * (0.3 + 0.3 * Math.cos(t * 0.0005 + i * 1.7))
        const r = Math.min(W, H) * (0.4 + 0.1 * Math.sin(t * 0.0009 + i))

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, color)
        grad.addColorStop(1, 'transparent')

        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [themeId])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}