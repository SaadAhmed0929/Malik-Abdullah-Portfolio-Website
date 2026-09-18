import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import InstructionCard from '../components/InstructionCard'

/* ========================================
   Content cards data
   ======================================== */
const CARDS = [
  {
    title: 'Ragdoll Royale',
    date: 'Unity 3D',
    desc: '30 weeks developing a 3D physics-based combat game from scratch, tweaking finite state machines and spatial mechanics.',
    href: '#',
    color: '#0077b6',
  },
  {
    title: 'PITC Database Recovery',
    date: 'Systems',
    desc: 'Diagnosed and debugged critical database crash under intense pressure, restoring full system operations within two hours.',
    href: '#',
    color: '#7f52ff',
  },
  {
    title: 'KUN Foundation',
    date: 'Social Impact',
    desc: 'Founded the KUN Foundation, orchestrating large-scale volunteer operations and winter clothing drives across Lahore.',
    href: '#',
    color: '#e63946',
  },
  {
    title: 'Hardware & Architecture',
    date: 'Hardware',
    desc: 'Diagnosing hardware bottlenecks, analyzing custom PC configurations, and pushing Arduino circuit simulations to their limits.',
    href: '#',
    color: '#3ddc84',
  },
  {
    title: 'Neural Networks',
    date: 'Deep Learning',
    desc: 'Optimizing neural network backpropagation and systems with obsessive precision to master the finest details.',
    href: '#',
    color: '#f7df1e',
  },
  {
    title: 'Model UN & Head Boy',
    date: 'Leadership',
    desc: 'Stepped up as Head Boy and debated at Model UN, learning to navigate human variables with structural thinking.',
    href: '#',
    color: '#d90429',
  },
]

/* ========================================
   Floating Card (Three.js mesh)
   ======================================== */
function FloatingCard({ card, index, total, onSelect, selected }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Distribute cards in a rough sphere/cloud
  const pos = useMemo(() => {
    const angle = (index / total) * Math.PI * 2
    const radius = 3 + Math.sin(index * 1.7) * 1.5
    const y = (Math.cos(index * 2.3) * 1.5)
    return [
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius - 2
    ]
  }, [index, total])

  const initialRot = useMemo(() => [
    Math.random() * 0.3 - 0.15,
    (index / total) * Math.PI * 0.5 + Math.random() * 0.5,
    Math.random() * 0.1 - 0.05,
  ], [index, total])

  // Idle drift animation
  useFrame((state) => {
    if (!meshRef.current || selected !== null) return
    const t = state.clock.elapsedTime
    const offset = index * 1.3
    meshRef.current.rotation.y = initialRot[1] + Math.sin(t * 0.3 + offset) * 0.15
    meshRef.current.rotation.x = initialRot[0] + Math.cos(t * 0.25 + offset) * 0.08
    meshRef.current.position.y = pos[1] + Math.sin(t * 0.4 + offset) * 0.15
  })

  // Generate card face texture
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 400; c.height = 300
    const ctx = c.getContext('2d')

    // Paper background
    ctx.fillStyle = '#f4f3ee'
    ctx.fillRect(0, 0, 400, 300)

    // Border
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 4
    ctx.strokeRect(4, 4, 392, 292)

    // Color accent bar at top
    ctx.fillStyle = card.color
    ctx.fillRect(4, 4, 392, 8)

    // Title
    ctx.fillStyle = '#222'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(card.title, 20, 50)

    // Date
    ctx.fillStyle = '#888'
    ctx.font = '14px monospace'
    ctx.fillText(card.date, 20, 75)

    // Description (word-wrap)
    ctx.fillStyle = '#555'
    ctx.font = '14px sans-serif'
    const words = card.desc.split(' ')
    let line = ''
    let y = 110
    for (const word of words) {
      const test = line + word + ' '
      if (ctx.measureText(test).width > 360) {
        ctx.fillText(line, 20, y)
        line = word + ' '
        y += 20
      } else {
        line = test
      }
    }
    ctx.fillText(line, 20, y)

    return new THREE.CanvasTexture(c)
  }, [card])

  return (
    <mesh
      ref={meshRef}
      position={pos}
      rotation={initialRot}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      onClick={(e) => { e.stopPropagation(); onSelect(index) }}
      scale={hovered && selected === null ? 1.08 : 1}
    >
      <planeGeometry args={[2.4, 1.8]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        color={selected !== null && selected !== index ? '#888888' : '#ffffff'}
      />
    </mesh>
  )
}

/* ========================================
   Glitch text accents
   ======================================== */
function GlitchText({ position, text }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2
  })

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.2}
      color="#ccc"
      anchorX="center"
      font={undefined}
    >
      {text}
    </Text>
  )
}

/* ========================================
   Studio 3D Content
   ======================================== */
function StudioContent({ onSelect, selected }) {
  return (
    <group>
      {CARDS.map((card, i) => (
        <FloatingCard
          key={i}
          card={card}
          index={i}
          total={CARDS.length}
          onSelect={onSelect}
          selected={selected}
        />
      ))}

      {/* Ambient glitch text accents */}
      <GlitchText position={[-3, 2, -4]} text="1010" />
      <GlitchText position={[4, -1, -3]} text="{ − }" />
      <GlitchText position={[2, 2.5, -5]} text="< />" />
      <GlitchText position={[-4, -0.5, -2]} text="0x3F" />
    </group>
  )
}

/* ========================================
   Studio Scene Wrapper
   ======================================== */
export default function Studio({ onBack }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (idx) => {
    setSelected(idx)
  }

  const handleClose = () => {
    setSelected(null)
    document.body.style.cursor = 'default'
  }

  const selectedCard = selected !== null ? CARDS[selected] : null

  return (
    <div className="ee-scene ee-studio ee-scene-enter">
      <div className="ee-studio__canvas-wrap">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#f4f3ee']} />
          <ambientLight intensity={1} />

          <Suspense fallback={null}>
            <StudioContent onSelect={handleSelect} selected={selected} />
          </Suspense>
        </Canvas>
      </div>

      {/* Spotlight overlay when card selected */}
      {selected !== null && (
        <div
          className="ee-studio__spotlight"
          style={{ '--spot-x': '40%', '--spot-y': '50%' }}
          onClick={handleClose}
        />
      )}

      {/* Detail card */}
      {selectedCard && (
        <div className="ee-studio__detail-card" onClick={e => e.stopPropagation()}>
          <button className="ee-modal-close" onClick={handleClose}>×</button>
          <h3>{selectedCard.title}</h3>
          <div className="date">{selectedCard.date}</div>
          <p className="desc">{selectedCard.desc}</p>
          {selectedCard.href && selectedCard.href !== '#' && (
            <a
              href={selectedCard.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ee-modal-action"
            >
              Open Link
              <span style={{ fontSize: '0.9em' }}>↗</span>
            </a>
          )}
        </div>
      )}

      {/* Instruction card */}
      <InstructionCard
        header="CURATOR"
        icon="🖼️"
        body="Click a card to spotlight it."
        autoHideSec={5}
      />
    </div>
  )
}
