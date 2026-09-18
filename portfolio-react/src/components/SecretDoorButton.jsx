import { useState } from 'react'
import PasswordModal from './PasswordModal'

const DoorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12" />
    <path d="M22 18h-8" />
    <path d="M2 18h20" />
    <path d="M18 14v4" />
    <path d="M18 10v-4" />
    <circle cx="10" cy="12" r="1" />
  </svg>
)

export default function SecretDoorButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        className="secret-door-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Secret Door"
        title="Knock knock"
      >
        <DoorIcon />
      </button>

      {isOpen && <PasswordModal onClose={() => setIsOpen(false)} />}
    </>
  )
}
