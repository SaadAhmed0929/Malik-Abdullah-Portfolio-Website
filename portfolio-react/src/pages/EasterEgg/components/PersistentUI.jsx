import { useNavigate } from 'react-router-dom'

export default function PersistentUI({ onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      sessionStorage.removeItem('corridor-unlocked')
      navigate('/')
    }
  }

  return (
    <div className="ee-chrome">
      <div className="ee-chrome-left">
        <button className="ee-chrome-btn" onClick={handleBack} title="Go back">
          <svg viewBox="0 0 24 24">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="ee-chrome-right">
        {/* Audio toggle — placeholder (no audio file yet) */}
        <button className="ee-chrome-btn" title="Toggle audio" onClick={() => {}}>
          <svg viewBox="0 0 24 24">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </button>
      </div>
    </div>
  )
}
