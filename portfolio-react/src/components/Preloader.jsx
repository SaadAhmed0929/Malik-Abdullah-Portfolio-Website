import { useEffect, useState, useRef } from 'react'

export default function Preloader({ onStartReveal, onComplete }) {
  const [stage, setStage] = useState('entering') // 'entering' | 'expanding' | 'ready' | 'fading'
  const callbacksRef = useRef({ onStartReveal, onComplete })

  useEffect(() => {
    callbacksRef.current = { onStartReveal, onComplete }
  }, [onStartReveal, onComplete])

  useEffect(() => {
    // Intercept scroll events so user cannot scroll during preloader,
    // while keeping overflow-y: scroll permanently intact on html (`0px layout shift`)
    const preventScroll = (e) => e.preventDefault()
    const preventKeyScroll = (e) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.code)) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventKeyScroll, { passive: false })

    // Stage timeline for a single slow cinematic fade reveal:
    // 50ms: begin expanding the center-out line
    const t1 = setTimeout(() => setStage('expanding'), 50)

    // 1300ms: line expansion completes, transition text to ready state ('WELCOME')
    const t2 = setTimeout(() => setStage('ready'), 1300)

    // 1700ms: trigger the single slow cinematic fade-out & reveal hero content simultaneously
    const t3 = setTimeout(() => {
      setStage('fading')
      window.scrollTo(0, 0)
      if (callbacksRef.current.onStartReveal) callbacksRef.current.onStartReveal()
      window.dispatchEvent(new CustomEvent('preloader:reveal'))

      // 3900ms: slow fade completely finished (2200ms duration), unmount & unlock inputs
      setTimeout(() => {
        window.removeEventListener('wheel', preventScroll)
        window.removeEventListener('touchmove', preventScroll)
        window.removeEventListener('keydown', preventKeyScroll)
        window.scrollTo(0, 0)
        if (callbacksRef.current.onComplete) callbacksRef.current.onComplete()
        window.dispatchEvent(new CustomEvent('preloader:done'))
      }, 2200)
    }, 1700)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventKeyScroll)
    }
  }, []) // Empty dependency array ensures timeline runs exactly ONCE cleanly!

  const isFading = stage === 'fading'

  return (
    <div className={['preloader', isFading ? 'preloader--fading' : ''].filter(Boolean).join(' ')}>
      <div className="preloader__minimal-wrap">
        <div className="preloader__title-box">
          <h1 className="preloader__minimal-title">MUHAMMAD ABDULLAH</h1>
          <p className="preloader__minimal-subtitle">PORTFOLIO</p>
        </div>

        <div className="preloader__minimal-line-wrap">
          <div className={`preloader__minimal-line ${stage !== 'entering' ? 'preloader__minimal-line--active' : ''}`} />
        </div>

        <div className="preloader__minimal-meta">
          <span className="preloader__minimal-tag">
            {stage === 'ready' || isFading ? 'WELCOME' : 'DESIGN & ENGINEERING'}
          </span>
        </div>
      </div>
    </div>
  )
}
