import { useState, useEffect } from 'react'

/* ========================================================
   SVG Assets for Hand-Drawn Building Exterior
   ======================================================== */

// Brick Wall Background Pattern
const BrickPattern = () => (
  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <defs>
      <pattern id="handDrawnBricks" width="120" height="60" patternUnits="userSpaceOnUse">
        {/* Brick Row 1 */}
        <rect x="2" y="2" width="56" height="26" rx="1" fill="none" stroke="#222222" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="62" y="2" width="56" height="26" rx="1" fill="none" stroke="#222222" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Brick Row 2 */}
        <rect x="2" y="32" width="26" height="26" rx="1" fill="none" stroke="#222222" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="32" y="32" width="56" height="26" rx="1" fill="none" stroke="#222222" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="92" y="32" width="26" height="26" rx="1" fill="none" stroke="#222222" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Hand-drawn texture details */}
        <path d="M 10 15 Q 25 12 45 16" fill="none" stroke="#888888" strokeWidth="0.5" />
        <path d="M 70 45 Q 85 40 105 44" fill="none" stroke="#888888" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#handDrawnBricks)" opacity="0.35" />
  </svg>
)

// Cobblestone Path leading to door
const CobblestonePath = () => (
  <svg viewBox="0 0 240 180" preserveAspectRatio="none" className="ee-building__cobblestones">
    {/* Outline path bounds */}
    <path d="M 20 180 L 70 0 L 170 0 L 220 180 Z" fill="#f2efe9" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    {/* Irregular stone shapes */}
    <path d="M 25 170 Q 50 165 70 172 Q 80 178 50 180 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 75 168 Q 110 160 145 168 Q 160 175 110 180 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 150 165 Q 185 162 215 170 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    
    <path d="M 35 145 Q 65 140 90 146 Q 100 152 65 158 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 95 142 Q 135 138 175 144 Q 180 152 135 156 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 180 140 Q 200 138 210 145 Z" fill="none" stroke="#333" strokeWidth="1.5" />

    <path d="M 45 120 Q 75 115 105 122 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 110 118 Q 145 114 185 120 Z" fill="none" stroke="#333" strokeWidth="1.5" />

    <path d="M 55 95 Q 85 90 115 96 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 120 92 Q 155 88 185 94 Z" fill="none" stroke="#333" strokeWidth="1.5" />

    <path d="M 62 70 Q 90 65 120 71 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 125 68 Q 150 64 178 70 Z" fill="none" stroke="#333" strokeWidth="1.5" />

    <path d="M 68 45 Q 95 40 125 46 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 130 44 Q 152 40 172 45 Z" fill="none" stroke="#333" strokeWidth="1.5" />

    <path d="M 72 20 Q 98 16 128 21 Z" fill="none" stroke="#333" strokeWidth="1.5" />
    <path d="M 132 19 Q 152 15 168 20 Z" fill="none" stroke="#333" strokeWidth="1.5" />
  </svg>
)

// Tree with Hanging Mouse & Sitting White Cat
const TreeAndCat = () => (
  <div className="ee-building__left-decor">
    <svg viewBox="0 0 320 480" className="ee-building__tree-svg" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Foliage Clouds */}
      <path d="M 80 180 C 40 160 20 110 50 70 C 40 30 90 10 130 30 C 170 0 230 20 240 70 C 280 60 300 110 270 160 C 300 200 260 250 210 240 C 180 270 120 260 90 230 C 50 240 30 200 80 180 Z" fill="#f7f6f1" stroke="#222" strokeWidth="2.5" />
      <path d="M 90 120 C 110 100 140 110 150 130" stroke="#888" strokeWidth="1.5" />
      <path d="M 170 90 C 200 80 220 100 210 120" stroke="#888" strokeWidth="1.5" />
      <path d="M 110 180 C 130 160 160 170 170 190" stroke="#888" strokeWidth="1.5" />

      {/* Main Trunk */}
      <path d="M 130 480 C 135 380 120 300 140 220 C 150 180 160 150 165 120" fill="none" />
      <path d="M 170 480 C 165 380 175 300 170 230 C 180 180 190 150 185 120" fill="none" />

      {/* Trunk detail lines */}
      <path d="M 140 480 C 145 400 135 340 148 260" stroke="#555" strokeWidth="1.5" />
      <path d="M 160 480 C 158 390 162 330 158 270" stroke="#555" strokeWidth="1.5" />

      {/* Major Branch extending to the right for the hanging mouse cord */}
      <path d="M 165 240 C 200 230 250 250 280 270" fill="none" stroke="#222" strokeWidth="3" />
      <path d="M 170 248 C 200 238 240 256 265 272" fill="none" stroke="#222" strokeWidth="1.5" />

      {/* Cord hanging down from branch */}
      <path d="M 260 265 L 260 350" stroke="#222" strokeWidth="1.8" />
      
      {/* Computer Mouse dangling like a swing */}
      <g transform="translate(245, 350)">
        {/* Mouse body */}
        <rect x="0" y="0" width="30" height="46" rx="15" fill="#ffffff" stroke="#222" strokeWidth="2" />
        {/* Scroll wheel & split line */}
        <line x1="15" y1="0" x2="15" y2="18" stroke="#222" strokeWidth="1.5" />
        <rect x="13" y="6" width="4" height="8" rx="2" fill="#222" />
        <line x1="3" y1="18" x2="27" y2="18" stroke="#222" strokeWidth="1.2" />
      </g>
    </svg>

    {/* White Cat Sitting on the ground */}
    <svg viewBox="0 0 100 120" className="ee-building__cat-svg">
      {/* Tail */}
      <path d="M 25 100 Q 10 90 15 70 Q 20 60 10 55" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="50" cy="85" rx="25" ry="30" fill="#ffffff" stroke="#222" strokeWidth="2.5" />
      {/* Chest/front paws */}
      <path d="M 40 110 L 40 85 M 60 110 L 60 85" stroke="#222" strokeWidth="2" strokeLinecap="round" />
      {/* Head */}
      <circle cx="50" cy="42" r="20" fill="#ffffff" stroke="#222" strokeWidth="2.5" />
      {/* Ears */}
      <polygon points="35,28 30,8 45,23" fill="#ffffff" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="65,28 70,8 55,23" fill="#ffffff" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
      {/* Eyes & Nose */}
      <circle cx="43" cy="40" r="2.5" fill="#222" />
      <circle cx="57" cy="40" r="2.5" fill="#222" />
      <polygon points="48,46 52,46 50,49" fill="#222" />
      {/* Whiskers */}
      <line x1="30" y1="45" x2="15" y2="42" stroke="#222" strokeWidth="1.2" />
      <line x1="30" y1="48" x2="15" y2="48" stroke="#222" strokeWidth="1.2" />
      <line x1="70" y1="45" x2="85" y2="42" stroke="#222" strokeWidth="1.2" />
      <line x1="70" y1="48" x2="85" y2="48" stroke="#222" strokeWidth="1.2" />
    </svg>
  </div>
)

// Window with Planter Box of Cacti/Succulents
const WindowWithPlanter = () => (
  <div className="ee-building__window-wrap">
    <svg viewBox="0 0 160 220" className="ee-building__window-svg">
      {/* Outer frame */}
      <rect x="10" y="10" width="140" height="140" rx="3" fill="#f7f6f1" stroke="#222" strokeWidth="3" />
      <rect x="18" y="18" width="124" height="124" fill="none" stroke="#222" strokeWidth="1.5" />
      
      {/* Window Panes Grid (4 panes) */}
      <line x1="80" y1="18" x2="80" y2="142" stroke="#222" strokeWidth="2.5" />
      <line x1="18" y1="80" x2="142" y2="80" stroke="#222" strokeWidth="2.5" />
      
      {/* Glass reflections */}
      <line x1="30" y1="30" x2="60" y2="60" stroke="#888" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="90" y1="30" x2="120" y2="60" stroke="#888" strokeWidth="1" strokeDasharray="4 4" />

      {/* Planter Wooden Box Ledge */}
      <rect x="2" y="148" width="156" height="32" rx="2" fill="#d8be9c" stroke="#222" strokeWidth="2.5" />
      {/* Wood grain on planter box */}
      <line x1="10" y1="158" x2="150" y2="158" stroke="#8b7355" strokeWidth="1" />
      <line x1="15" y1="168" x2="145" y2="168" stroke="#8b7355" strokeWidth="1" />

      {/* Cacti & Succulents inside Planter Box */}
      <g stroke="#222" strokeWidth="1.8" strokeLinecap="round">
        {/* Cactus 1 (Left) */}
        <path d="M 25 148 L 25 125 C 25 118 35 118 35 125 L 35 148" fill="#a8d5ba" />
        <path d="M 20 135 C 12 135 12 125 22 128" fill="none" />
        
        {/* Cactus 2 (Tall Middle) */}
        <path d="M 60 148 L 60 108 C 60 100 75 100 75 108 L 75 148" fill="#88c999" />
        <path d="M 55 125 C 45 125 45 115 58 118" fill="none" />
        <path d="M 80 130 C 90 130 90 120 77 123" fill="none" />

        {/* Succulent 3 (Round leaves) */}
        <circle cx="105" cy="138" r="8" fill="#b5e7a0" />
        <circle cx="118" cy="135" r="9" fill="#99d885" />
        <circle cx="112" cy="144" r="7" fill="#b5e7a0" />

        {/* Ducky figurine sitting in planter box! */}
        <path d="M 136 148 C 130 148 128 140 134 136 C 132 132 138 126 144 130 C 148 130 152 136 148 142 C 146 146 142 148 136 148 Z" fill="#ffec99" />
        <polygon points="144,133 150,135 144,137" fill="#ffa94d" />
        <circle cx="141" cy="132" r="1" fill="#222" />
      </g>
    </svg>
  </div>
)

// Hanging Wooden Sign "ETRIGAN"
const HangingSign = () => (
  <div className="ee-building__sign-wrap">
    {/* Top mounting beam */}
    <div className="ee-building__sign-beam" />
    
    {/* Chains */}
    <div className="ee-building__chain ee-chain-left" />
    <div className="ee-building__chain ee-chain-right" />

    {/* Main Wooden Plaque */}
    <div className="ee-building__sign-board">
      <span className="ee-building__sign-text">ETRIGAN</span>
    </div>
  </div>
)

// Skill Stickers attached to doors
const DOOR_STICKERS_LEFT = [
  { label: 'JS', color: '#f7df1e', text: '#222', type: 'hex', top: '18%', left: '20%' },
  { label: 'React', color: '#00d8ff', text: '#222', type: 'atom', top: '42%', left: '30%' },
  { label: 'TypeScript', color: '#3178c6', text: '#fff', type: 'box', top: '68%', left: '15%' },
]

const DOOR_STICKERS_RIGHT = [
  { label: 'Node', color: '#68a063', text: '#fff', type: 'hex', top: '22%', left: '25%' },
  { label: 'CSS3', color: '#1572b6', text: '#fff', type: 'shield', top: '50%', left: '35%' },
  { label: '🔥', color: '#ffca28', text: '#222', type: 'circle', top: '72%', left: '28%' },
]

export default function BuildingExterior({ onEnter }) {
  const [doorOpen, setDoorOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleDoorClick = () => {
    if (!ready || doorOpen) return
    setDoorOpen(true)
    setTimeout(() => onEnter(), 1100)
  }

  return (
    <div className="ee-scene ee-building ee-scene-enter">
      {/* Full-bleed brick wall background */}
      <BrickPattern />

      {/* Main Facade Layout */}
      <div className="ee-building__facade">
        {/* Left Side: Tree, Hanging Mouse & Cat */}
        <TreeAndCat />

        {/* Center: Hanging Sign, Entrance Doors & Cobblestone Path */}
        <div className="ee-building__center">
          {/* Hanging Sign above door */}
          <HangingSign />

          {/* Double Entrance Doors */}
          <div
            className={`ee-building__door-wrap${doorOpen ? ' ee-door-open' : ''}`}
            onClick={handleDoorClick}
            style={{ cursor: ready && !doorOpen ? 'pointer' : 'default' }}
          >
            {/* Outer door casing frame */}
            <div className="ee-building__door-frame" />

            {/* Left Door Panel with Stickers */}
            <div className="ee-building__door-panel ee-building__door-panel--left">
              {DOOR_STICKERS_LEFT.map((s, i) => (
                <div
                  key={i}
                  className={`ee-sticker ee-sticker--${s.type}`}
                  style={{
                    top: s.top,
                    left: s.left,
                    backgroundColor: s.color,
                    color: s.text,
                  }}
                >
                  {s.type === 'atom' && <span className="ee-sticker__atom-ring" />}
                  {s.label}
                </div>
              ))}
              <div className="ee-building__door-handle ee-handle-left" />
            </div>

            {/* Right Door Panel with Stickers */}
            <div className="ee-building__door-panel ee-building__door-panel--right">
              {DOOR_STICKERS_RIGHT.map((s, i) => (
                <div
                  key={i}
                  className={`ee-sticker ee-sticker--${s.type}`}
                  style={{
                    top: s.top,
                    left: s.left,
                    backgroundColor: s.color,
                    color: s.text,
                  }}
                >
                  {s.label}
                </div>
              ))}
              <div className="ee-building__door-handle ee-handle-right" />
            </div>

            {/* Light glowing behind open door */}
            <div className="ee-building__door-light" />
          </div>

          {/* Cobblestone path extending down from door */}
          <CobblestonePath />
        </div>

        {/* Right Side: Window with Planter Box */}
        <WindowWithPlanter />
      </div>

      {/* Torn-paper Instruction Banner at Bottom */}
      <div className="ee-building__footer-card">
        <div className="ee-building__card-tag">EXPLORER</div>
        <div className="ee-building__card-text">Click a door to enter. Audio is currently OFF</div>
      </div>
    </div>
  )
}
