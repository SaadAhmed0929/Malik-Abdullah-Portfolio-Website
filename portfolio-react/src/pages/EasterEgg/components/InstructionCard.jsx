import { useState, useEffect } from 'react'

export default function InstructionCard({ header, icon, body, autoHideSec = 0 }) {
  const [hiding, setHiding] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoHideSec > 0) {
      const timer = setTimeout(() => setHiding(true), autoHideSec * 1000)
      const remove = setTimeout(() => setVisible(false), autoHideSec * 1000 + 400)
      return () => { clearTimeout(timer); clearTimeout(remove) }
    }
  }, [autoHideSec])

  if (!visible) return null

  return (
    <div className={`ee-instruction-card${hiding ? ' ee-card-hiding' : ''}`}>
      <span className="ee-instruction-card__arrow">↙</span>
      <div className="ee-instruction-card__header">
        {icon && <span>{icon}</span>}
        <span>{header}</span>
      </div>
      <div className="ee-instruction-card__body">{body}</div>
    </div>
  )
}
