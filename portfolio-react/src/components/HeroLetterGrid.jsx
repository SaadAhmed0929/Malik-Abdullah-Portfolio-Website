import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

const COLS = 8
const ROWS = 4

const ORIGINAL_GRID = [
  ['X', 'Q', 'V', 'K', 'R', 'W', 'T', 'Z'],
  ['M', 'U', 'H', 'A', 'M', 'M', 'A', 'D'],
  ['A', 'B', 'D', 'U', 'L', 'L', 'A', 'H'],
  ['J', 'Y', 'O', 'P', 'F', 'S', 'N', 'E']
]

const HOVER_GRID = [
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'K'],
  ['P', 'L', 'E', 'T', "'", 'S', 'Q', 'R'],
  ['J', 'T', 'A', 'L', 'K', '!', 'W', 'Z'],
  ['N', 'M', 'Q', 'W', 'E', 'R', 'T', 'Y']
]

const HIGHLIGHT_ORIGINAL = [
  [false, false, false, false, false, false, false, false],
  [true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true],
  [false, false, false, false, false, false, false, false]
]

const HIGHLIGHT_HOVER = [
  [false, false, false, false, false, false, false, false],
  [false, true, true, true, true, true, false, false],
  [false, true, true, true, true, true, false, false],
  [false, false, false, false, false, false, false, false]
]

export default function HeroLetterGrid() {
  const navigate = useNavigate()
  const spanRefs = useRef([])
  const cellRefs = useRef([])
  const rowStatesRef = useRef(['original', 'original', 'original', 'original'])

  // Initialize ref arrays
  if (spanRefs.current.length === 0) {
    for (let i = 0; i < ROWS; i++) {
      spanRefs.current[i] = []
      cellRefs.current[i] = []
    }
  }

  useEffect(() => {
    const CLEAN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    const runShuffleAnimation = () => {
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const span = spanRefs.current[row]?.[col]
          if (!span) continue

          const finalLetter = ORIGINAL_GRID[row][col]
          const delay = 0.12 + row * 0.12 + col * 0.04
          const duration = 1.2 + row * 0.12

          // Initial entrance: gentle fade and rise
          gsap.fromTo(span,
            { opacity: 0, y: col % 2 === 0 ? -10 : 10 },
            { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power2.out' }
          )

          // Smooth letter shuffle
          const dummy = { p: 0 }
          let lastStep = -1
          const totalSteps = 8

          gsap.to(dummy, {
            p: 1,
            duration,
            delay,
            ease: 'power2.out',
            onUpdate: () => {
              const currentStep = Math.floor(dummy.p * totalSteps)
              if (currentStep !== lastStep && currentStep < totalSteps) {
                lastStep = currentStep
                let nextChar = CLEAN_CHARS[Math.floor(Math.random() * CLEAN_CHARS.length)]

                while (nextChar === finalLetter && CLEAN_CHARS.length > 1) {
                  nextChar = CLEAN_CHARS[Math.floor(Math.random() * CLEAN_CHARS.length)]
                }

                span.textContent = nextChar
              }
            },
            onComplete: () => {
              gsap.delayedCall(0.35, () => {
                span.textContent = finalLetter
                gsap.fromTo(span,
                  { opacity: 0.6, scale: 1.08 },
                  { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
                )
              })
            }
          })
        }
      }
    }

    // Check if preloader is currently active on the page
    const preloaderEl = document.querySelector('.preloader:not(.preloader--fading)')
    if (preloaderEl) {
      // Hide letters initially so they wait under the active loading screen
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (spanRefs.current[r]?.[c]) {
            gsap.set(spanRefs.current[r][c], { opacity: 0 })
          }
        }
      }

      // Run shuffle when the preloader begins fading and revealing the hero section
      const handleReveal = () => {
        setTimeout(runShuffleAnimation, 350)
        window.removeEventListener('preloader:reveal', handleReveal)
      }
      window.addEventListener('preloader:reveal', handleReveal)

      return () => window.removeEventListener('preloader:reveal', handleReveal)
    } else {
      runShuffleAnimation()
    }
  }, [])

  const animateRowToHover = (rowIndex) => {
    if (rowStatesRef.current[rowIndex] === 'hover') return
    rowStatesRef.current[rowIndex] = 'hover'

    for (let col = 0; col < COLS; col++) {
      const span = spanRefs.current[rowIndex]?.[col]
      const cell = cellRefs.current[rowIndex]?.[col]
      if (!span || !cell) continue

      const direction = col % 2 === 0 ? -35 : 35
      const targetText = HOVER_GRID[rowIndex][col]
      const targetHighlight = HIGHLIGHT_HOVER[rowIndex][col]

      gsap.killTweensOf(span)
      gsap.to(span, {
        y: direction,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          span.textContent = targetText
          if (targetHighlight) {
            cell.classList.add('is-highlighted')
          } else {
            cell.classList.remove('is-highlighted')
          }
          gsap.set(span, { y: -direction, opacity: 0 })
          gsap.to(span, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' })
        }
      })
    }
  }

  const animateRowToOriginal = (rowIndex) => {
    if (rowStatesRef.current[rowIndex] === 'original') return
    rowStatesRef.current[rowIndex] = 'original'

    for (let col = 0; col < COLS; col++) {
      const span = spanRefs.current[rowIndex]?.[col]
      const cell = cellRefs.current[rowIndex]?.[col]
      if (!span || !cell) continue

      const direction = col % 2 === 0 ? -35 : 35
      const targetText = ORIGINAL_GRID[rowIndex][col]
      const targetHighlight = HIGHLIGHT_ORIGINAL[rowIndex][col]

      gsap.killTweensOf(span)
      gsap.to(span, {
        y: direction,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          span.textContent = targetText
          if (targetHighlight) {
            cell.classList.add('is-highlighted')
          } else {
            cell.classList.remove('is-highlighted')
          }
          gsap.set(span, { y: -direction, opacity: 0 })
          gsap.to(span, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' })
        }
      })
    }
  }

  const renderRow = (rowIndex) => {
    const rowArr = ORIGINAL_GRID[rowIndex]
    return (
      <div
        key={rowIndex}
        className="custom-grid-row"
        onMouseEnter={(rowIndex === 0 || rowIndex === 3) ? () => animateRowToHover(rowIndex) : undefined}
        onMouseLeave={(rowIndex === 0 || rowIndex === 3) ? () => animateRowToOriginal(rowIndex) : undefined}
      >
        {rowArr.map((letter, colIndex) => {
          const isHighlight = HIGHLIGHT_ORIGINAL[rowIndex][colIndex]
          return (
            <div
              key={colIndex}
              ref={(el) => {
                if (!cellRefs.current[rowIndex]) cellRefs.current[rowIndex] = []
                cellRefs.current[rowIndex][colIndex] = el
              }}
              className={`custom-grid-cell${isHighlight ? ' is-highlighted' : ''}`}
            >
              <span
                ref={(el) => {
                  if (!spanRefs.current[rowIndex]) spanRefs.current[rowIndex] = []
                  spanRefs.current[rowIndex][colIndex] = el
                }}
              >
                {letter}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="hero-letter-grid-wrapper">
      <div className="custom-letter-grid">
        {renderRow(0)}
        <div
          className="name-letter-group"
          onClick={() => navigate('/contact')}
          onMouseEnter={() => {
            animateRowToHover(1)
            animateRowToHover(2)
          }}
          onMouseLeave={() => {
            animateRowToOriginal(1)
            animateRowToOriginal(2)
          }}
        >
          {renderRow(1)}
          {renderRow(2)}
        </div>
        {renderRow(3)}
      </div>
    </div>
  )
}
