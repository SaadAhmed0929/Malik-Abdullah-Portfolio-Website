import { useState, useEffect, useRef } from 'react'

export default function EEPreloader({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const boltRef = useRef(null)

  useEffect(() => {
    let frame
    let start = null
    const duration = 2200 // ms

    const tick = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      const p = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setPercent(p)

      if (p < 100) {
        frame = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => onComplete(), 500)
        }, 300)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onComplete])

  // Archimedean spiral path for the dashed ring (decorative)
  const ringR = 70
  const ringCX = 80
  const ringCY = 80

  // Lightning bolt path
  const boltPath = 'M 55,20 L 48,50 L 62,48 L 40,90 L 55,55 L 42,58 L 55,20'

  // Calculate bolt stroke dashoffset for draw-on animation
  const boltLen = 280 // approximate path length
  const boltOffset = boltLen - (boltLen * (percent / 100))

  return (
    <div
      className={`ee-scene ee-preloader ${fadeOut ? 'ee-scene-exit' : 'ee-scene-enter'}`}
    >
      <div className="ee-preloader__ring">
        <svg viewBox="0 0 160 160">
          {/* Dashed circle ring */}
          <circle
            className="ee-preloader__ring-circle"
            cx={ringCX}
            cy={ringCY}
            r={ringR}
          />
          {/* Lightning bolt drawn on with progress */}
          <path
            ref={boltRef}
            className="ee-preloader__bolt"
            d={boltPath}
            strokeDasharray={boltLen}
            strokeDashoffset={boltOffset}
          />
        </svg>
        <span className="ee-preloader__percent">{percent}%</span>
      </div>
      <div className="ee-preloader__subtitle">Loading the corridor...</div>
    </div>
  )
}
