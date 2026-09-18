import { useState } from 'react'
import InstructionCard from '../components/InstructionCard'
import ProjectModal from '../components/ProjectModal'

const PROJECTS = [
  {
    title: 'RAGDOLL ROYALE',
    desc: '3D physics-based RTS combat game in Unity with an Entity-Component-System (ECS) architecture, multi-threaded joint physics, and autonomous FSM combat AI at 60 FPS.',
    href: '#',
    img: '/images/RagdollRoyale.png',
    tech: ['Unity', 'C#', 'ECS', 'RigidBody Physics', 'FSM AI'],
  },
  {
    title: 'CODEQUEST',
    desc: 'Interactive gamified platform to teach Python programming with dynamic feature flows and hidden Easter eggs.',
    href: 'https://code-quest-taupe.vercel.app',
    img: '/images/CodeQuest.png',
    tech: ['React', 'JavaScript', 'CSS3', 'Firebase'],
  },
  {
    title: 'ONLINE365',
    desc: 'Full SaaS dashboard for e-commerce prep services — supply chain tracking, real-time inventory, and order fulfilment workflows.',
    href: 'https://portal.theonline365.com/',
    img: '/images/Online365.png',
    tech: ['React', 'Node.js', 'Docker', 'PostgreSQL'],
  },
  {
    title: 'TOUCHLESS MOUSE',
    desc: 'Real-time hand-gesture interface using MediaPipe 3D landmark detection and OpenCV for system-level cursor control.',
    href: '#',
    img: '/images/VirtualMouse.png',
    tech: ['Python', 'MediaPipe', 'OpenCV', 'Pygame'],
  },
  {
    title: 'ZAIN AHMED',
    desc: 'High-performance digital portfolio for a Mechanical Engineer specializing in advanced physics simulations.',
    href: 'https://www.zainahmed.cv/',
    img: '/images/ZainAhmed.png',
    tech: ['React', 'JavaScript', 'CSS3'],
  },
]

// Hand-drawn city skyline SVG
const Skyline = () => (
  <svg viewBox="0 0 1200 250" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    {/* Buildings */}
    <path d="M 0,250 L 0,180 L 40,178 L 40,150 L 80,152 L 80,180 L 120,178 L 120,130 L 160,128 L 160,180 L 200,182 L 200,100 L 220,98 L 220,60 L 240,62 L 240,100 L 280,102 L 280,160 L 320,158 L 320,120 L 360,122 L 360,180 L 400,178 L 400,90 L 440,88 L 440,180 L 480,182 L 480,140 L 520,138 L 520,180 L 560,178 L 560,110 L 580,108 L 580,70 L 600,72 L 600,110 L 640,112 L 640,180 L 680,178 L 680,150 L 720,148 L 720,180 L 760,182 L 760,95 L 800,93 L 800,180 L 840,178 L 840,130 L 880,132 L 880,180 L 920,178 L 920,160 L 960,158 L 960,110 L 980,108 L 980,75 L 1000,77 L 1000,110 L 1040,112 L 1040,180 L 1080,178 L 1080,145 L 1120,143 L 1120,180 L 1160,182 L 1160,170 L 1200,168 L 1200,250 Z" 
      stroke="#222" strokeWidth="2" fill="none" strokeLinejoin="round" />
    
    {/* Water tower */}
    <path d="M 470,140 L 470,105 L 455,105 L 455,90 L 505,90 L 505,105 L 490,105 L 490,140" 
      stroke="#222" strokeWidth="2" fill="none" />
    
    {/* Crane */}
    <path d="M 850,130 L 850,40 L 920,40 M 850,50 L 830,50 M 850,40 L 850,35 L 855,35" 
      stroke="#222" strokeWidth="1.5" fill="none" />
    
    {/* Clouds */}
    <path d="M 150,50 Q 170,30 200,40 Q 220,25 250,40 Q 270,30 280,50" 
      stroke="#bbb" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 700,35 Q 720,20 745,30 Q 760,18 780,30 Q 795,22 805,40" 
      stroke="#bbb" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

// Railing SVG
const Railing = () => (
  <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    {/* Top rail */}
    <line x1="0" y1="5" x2="1200" y2="5" stroke="#222" strokeWidth="3" />
    {/* Bottom rail */}
    <line x1="0" y1="55" x2="1200" y2="55" stroke="#222" strokeWidth="3" />
    {/* Balusters */}
    {Array.from({ length: 40 }, (_, i) => (
      <g key={i}>
        <line x1={30 * i + 15} y1="5" x2={30 * i + 15} y2="55" stroke="#222" strokeWidth="2" />
        {/* Decorative circle */}
        <circle cx={30 * i + 15} cy="30" r="4" stroke="#222" strokeWidth="1.5" fill="none" />
      </g>
    ))}
  </svg>
)

export default function Gallery({ onBack }) {
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const [modalProject, setModalProject] = useState(null)

  return (
    <div className="ee-scene ee-gallery ee-scene-enter">
      {/* Skyline background */}
      <div className="ee-gallery__skyline">
        <Skyline />
      </div>

      {/* Railing */}
      <div className="ee-gallery__railing">
        <Railing />
      </div>

      {/* Clothesline wire */}
      <div className="ee-gallery__wire" />

      {/* Project cards hanging from wire */}
      <div className="ee-gallery__cards-track">
        {PROJECTS.map((p, i) => (
          <div
            key={p.title}
            className={`ee-gallery-card${focusedIdx === i ? ' ee-card-focused' : ''}`}
            onMouseEnter={() => setFocusedIdx(i)}
            onMouseLeave={() => setFocusedIdx(-1)}
            onClick={() => setModalProject(p)}
          >
            <div className="ee-gallery-card__img-wrap">
              <img
                src={p.img}
                alt={p.title}
                onError={e => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement.style.background =
                    'linear-gradient(135deg, #ddd, #eee)'
                }}
              />
            </div>
            <div className="ee-gallery-card__title">{p.title}</div>
          </div>
        ))}
      </div>

      {/* Instruction card */}
      <InstructionCard
        header="ART CRITIC"
        icon="🎨"
        body="Hover to preview. Click a project to inspect."
        autoHideSec={5}
      />

      {/* Project details modal */}
      {modalProject && (
        <ProjectModal
          project={modalProject}
          onClose={() => setModalProject(null)}
        />
      )}
    </div>
  )
}
