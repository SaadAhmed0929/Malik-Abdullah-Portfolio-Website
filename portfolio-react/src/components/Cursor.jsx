import { useEffect, useRef, useState } from 'react'

/**
 * Custom cursor — optimized with event delegation and fast responsive lerp (0.42).
 * Eliminates MutationObserver slowdowns and lag.
 */
export default function Cursor({ visible = true }) {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [variant, setVariant] = useState('default') // 'default' | 'link' | 'project'

  useEffect(() => {
    if (window.innerWidth < 1024 || !visible) return

    const cursor = cursorRef.current
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let posX = mouseX
    let posY = mouseY
    let rafId = null

    const SPEED = 0.42 // ← Ultra-fast & snappy lerp

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    document.addEventListener('mousemove', onMouseMove, { passive: true })

    const animate = () => {
      posX += (mouseX - posX) * SPEED
      posY += (mouseY - posY) * SPEED

      if (cursor) {
        cursor.style.transform = `translate(${posX}px, ${posY}px)`
      }
      rafId = requestAnimationFrame(animate)
    }
    animate()

    // Event delegation: zero overhead, handles dynamic DOM effortlessly without MutationObserver!
    const onMouseOver = (e) => {
      if (e.target.closest('.works-carousel__card, .project-card')) {
        setVariant('project')
      } else if (e.target.closest('a, button, [role="button"], input, textarea')) {
        setVariant('link')
      } else {
        setVariant('default')
      }
    }

    document.addEventListener('mouseover', onMouseOver, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [visible])

  if (!visible) return null

  const ringClass = [
    'cursor__ring',
    variant === 'link' && 'cursor__ring--hover-link',
    variant === 'project' && 'cursor__ring--hover-project',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={cursorRef}
      className="cursor cursor--appeared"
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}
    >
      <div ref={ringRef} className={ringClass}>
        <span className="cursor__label">View</span>
      </div>
    </div>
  )
}
