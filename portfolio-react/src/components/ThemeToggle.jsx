import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { toggleTheme } = useContext(ThemeContext)

  return (
    <>
      {/* Desktop */}
      <div className="theme-toggle">
        <button className="toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          <div className="toggle-knob" />
        </button>
      </div>

      {/* Mobile */}
      <div className="theme-toggle--mobile">
        <button className="toggle-btn--mobile" onClick={toggleTheme} aria-label="Toggle theme">
          <div className="toggle-knob--mobile" />
        </button>
      </div>
    </>
  )
}
