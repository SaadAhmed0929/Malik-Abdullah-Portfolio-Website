import { useRef, useState, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Html, ScrollControls, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import InstructionCard from '../components/InstructionCard'
import ContactForm from '../components/ContactForm'

/* ========================================
   Procedural Textures (hand-drawn style)
   ======================================== */

const createFloorTexture = () => {
  const c = document.createElement('canvas')
  c.width = 1024; c.height = 1024
  const ctx = c.getContext('2d')

  ctx.fillStyle = '#f5f5f3'
  ctx.fillRect(0, 0, 1024, 1024)

  // Plank lines
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 4
  const pw = 1024 / 6
  for (let x = 0; x <= 1024; x += pw) {
    ctx.beginPath()
    ctx.moveTo(x + (Math.random() * 4 - 2), 0)
    ctx.lineTo(x + (Math.random() * 4 - 2), 1024)
    ctx.stroke()
  }

  // Cross joints
  for (let y = 128; y < 1024; y += 256) {
    for (let i = 0; i < 6; i++) {
      if (Math.random() > 0.3) {
        ctx.beginPath()
        ctx.moveTo(i * pw, y)
        ctx.lineTo((i + 1) * pw, y)
        ctx.stroke()
      }
    }
  }

  // Wood grain
  ctx.strokeStyle = '#666'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 30; i++) {
    const sx = Math.random() * 1024, sy = Math.random() * 1024
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.bezierCurveTo(sx + 20, sy + 100, sx - 20, sy + 200, sx + 10, sy + 300)
    ctx.stroke()
  }

  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.repeat.set(1, 6)
  return t
}

const createDoorTexture = (type) => {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 1024
  const ctx = c.getContext('2d')

  // Warm wood base
  ctx.fillStyle = '#c68a4c'
  ctx.fillRect(0, 0, 512, 1024)

  // Wood grain
  ctx.strokeStyle = '#7c481d'
  ctx.lineWidth = 3
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 512
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.bezierCurveTo(x + 25, 300, x - 25, 700, x + 10, 1024)
    ctx.stroke()
  }

  // Frame border
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 10
  ctx.strokeRect(8, 8, 496, 1008)

  // Two inset panels
  ctx.strokeStyle = '#2d1806'
  ctx.lineWidth = 6
  ctx.strokeRect(40, 50, 432, 400)
  ctx.strokeRect(40, 520, 432, 440)

  // Panel shading
  ctx.fillStyle = 'rgba(0,0,0,0.06)'
  ctx.fillRect(40, 50, 432, 400)
  ctx.fillRect(40, 520, 432, 440)

  if (type === 'contact') {
    // Mail slot
    ctx.fillStyle = '#7a5428'
    ctx.fillRect(140, 560, 232, 40)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 4
    ctx.strokeRect(140, 560, 232, 40)

    // Envelope poking out
    ctx.save()
    ctx.translate(256, 610)
    ctx.rotate(-0.15)
    ctx.fillStyle = '#fff'
    ctx.fillRect(-60, -35, 120, 70)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 3
    ctx.strokeRect(-60, -35, 120, 70)
    ctx.beginPath()
    ctx.moveTo(-60, -35); ctx.lineTo(0, -5); ctx.lineTo(60, -35)
    ctx.stroke()
    // Airmail stripes
    ctx.lineWidth = 5
    ctx.strokeStyle = '#e63946'
    ctx.beginPath(); ctx.moveTo(-55, -30); ctx.lineTo(-30, -30); ctx.stroke()
    ctx.strokeStyle = '#1d3557'
    ctx.beginPath(); ctx.moveTo(-25, -30); ctx.lineTo(0, -30); ctx.stroke()
    ctx.restore()
  }

  if (type === 'gallery') {
    // Pinned photos/notes
    const drawNote = (x, y, w, h, angle) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = '#fff'
      ctx.fillRect(-w / 2, -h / 2, w, h)
      ctx.strokeStyle = '#111'
      ctx.lineWidth = 3
      ctx.strokeRect(-w / 2, -h / 2, w, h)
      // Grid lines (blueprint style)
      ctx.strokeStyle = '#0077b6'
      ctx.lineWidth = 2
      ctx.strokeRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16)
      // Pin
      ctx.fillStyle = '#e63946'
      ctx.beginPath()
      ctx.arc(0, -h / 2 + 4, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    drawNote(220, 220, 160, 190, -0.06)
    drawNote(320, 700, 140, 170, 0.1)
  }

  if (type === 'studio') {
    // Social badges
    const drawBadge = (y, color, label) => {
      ctx.save()
      ctx.translate(256, y)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(0, 0, 40, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#111'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(0, 0, 40, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, 0, 0)
      ctx.restore()
    }
    drawBadge(220, '#333', 'GH')
    drawBadge(360, '#0077b5', 'in')
    drawBadge(740, '#e1306c', 'IG')
  }

  return new THREE.CanvasTexture(c)
}

const createSignTexture = (text) => {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 160
  const ctx = c.getContext('2d')

  ctx.fillStyle = '#e2c398'
  ctx.fillRect(0, 0, 512, 160)

  // Wood grain
  ctx.strokeStyle = '#b89058'
  ctx.lineWidth = 2
  for (let y = 15; y < 160; y += 18) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(150, y + 5, 350, y - 5, 512, y)
    ctx.stroke()
  }

  // Frame
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 6
  ctx.strokeRect(5, 5, 502, 150)

  // Text
  ctx.fillStyle = '#111'
  ctx.font = 'bold 48px "Courier New", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.toUpperCase(), 256, 80)

  return new THREE.CanvasTexture(c)
}

/* ========================================
   Wall Texture (hand-drawn paper)
   ======================================== */
const createWallTexture = () => {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 512
  const ctx = c.getContext('2d')

  ctx.fillStyle = '#f7f6f1'
  ctx.fillRect(0, 0, 512, 512)

  // Subtle paper grain
  ctx.fillStyle = 'rgba(0,0,0,0.015)'
  for (let i = 0; i < 200; i++) {
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2)
  }

  return new THREE.CanvasTexture(c)
}

/* ========================================
   Door Component
   ======================================== */
const Door = ({ position, rotation, label, type, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const doorTex = useMemo(() => createDoorTexture(type), [type])
  const signTex = useMemo(() => createSignTexture(label), [label])
  const doorCenterY = 0.2

  return (
    <group position={[position[0], doorCenterY, position[2]]} rotation={rotation}>
      {/* Door frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 3.6, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.42, 3.62, 0.12)]} />
        <lineBasicMaterial color="#111111" linewidth={3} />
      </lineSegments>

      {/* Door surface */}
      <mesh
        position={[0, -0.05, 0.06]}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        onClick={(e) => { e.stopPropagation(); onClick?.() }}
      >
        <planeGeometry args={[2.1, 3.3]} />
        <meshBasicMaterial map={doorTex} color={hovered ? '#fff3e6' : '#ffffff'} />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.85, -0.1, 0.14]}>
        <boxGeometry args={[0.08, 0.3, 0.1]} />
        <meshBasicMaterial color="#d4af37" />
      </mesh>

      {/* Sign above door */}
      <mesh position={[0, 2.3, 0.06]}>
        <planeGeometry args={[2.4, 0.7]} />
        <meshBasicMaterial map={signTex} />
      </mesh>
      <lineSegments position={[0, 2.3, 0.06]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.42, 0.72)]} />
        <lineBasicMaterial color="#111111" linewidth={2} />
      </lineSegments>

      {/* Arrow doodle pointing at door */}
      <group position={[-1.7, 0, 0.02]} rotation={[0, 0, 0.1]}>
        <Text fontSize={0.45} color="#111" anchorX="center" font={undefined}>➔</Text>
      </group>
    </group>
  )
}

/* ========================================
   Portal (back wall)
   ======================================== */
const Portal = () => {
  return (
    <group position={[0, 0.5, -5]}>
      {/* Portal frame */}
      <mesh>
        <planeGeometry args={[3.2, 3.8]} />
        <meshBasicMaterial color="#f0efea" />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 3.8)]} />
        <lineBasicMaterial color="#111" linewidth={3} />
      </lineSegments>

      {/* Inner glow */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.8, 3.4]} />
        <meshBasicMaterial color="#f7f6f1" />
      </mesh>
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.8, 3.4)]} />
        <lineBasicMaterial color="#222" linewidth={2} />
      </lineSegments>

      {/* Logo text */}
      <Text
        position={[0, 0.4, 0.02]}
        fontSize={0.7}
        color="#111"
        anchorX="center"
        anchorY="middle"
        font={undefined}
        fontWeight="bold"
      >
        ETRIGAN
      </Text>

      {/* Tagline */}
      <Text
        position={[0, -0.2, 0.02]}
        fontSize={0.18}
        color="#666"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {'‹ creative developer /›'}
      </Text>

      {/* Decorative sparkles */}
      <Text position={[-1.2, 1.5, 0.02]} fontSize={0.15} color="#bbb" anchorX="center">✦</Text>
      <Text position={[1.3, 1.3, 0.02]} fontSize={0.12} color="#bbb" anchorX="center">✦</Text>
      <Text position={[0.8, -1.4, 0.02]} fontSize={0.1} color="#bbb" anchorX="center">·</Text>
    </group>
  )
}

/* ========================================
   Wall Doodles
   ======================================== */
const WallDoodles = () => {
  return (
    <group>
      {/* Code line above portal */}
      <Text position={[0, 2.3, -4.9]} fontSize={0.2} color="#333" anchorX="center" font={undefined}>
        {'while(true) { explore(); }'}
      </Text>

      {/* IDEA → DEV → BUG flowchart (left wall) */}
      <group position={[-2.4, 0.8, -3.5]} rotation={[0, Math.PI / 2, 0]}>
        <Text position={[0, 0.8, 0]} fontSize={0.18} color="#333" anchorX="center" font={undefined}>
          💡 IDEA
        </Text>
        <Text position={[0, 0.4, 0]} fontSize={0.25} color="#666" anchorX="center" font={undefined}>
          ↓
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#333" anchorX="center" font={undefined}>
          🖥 DEV
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.25} color="#666" anchorX="center" font={undefined}>
          ↓
        </Text>
        <Text position={[0, -0.8, 0]} fontSize={0.2} color="#d90429" anchorX="center" font={undefined}>
          🐛 BUG!
        </Text>
      </group>

      {/* Right wall doodles */}
      <group position={[2.4, 0.6, -3]} rotation={[0, -Math.PI / 2, 0]}>
        <Text position={[0, 0.5, 0]} fontSize={0.3} color="#333" anchorX="center" font={undefined}>
          ☕
        </Text>
        <Text position={[0, -0.2, 0]} fontSize={0.14} color="#999" anchorX="center" font={undefined}>
          {'< / >'}
        </Text>
        <Text position={[0, -0.7, 0]} fontSize={0.12} color="#bbb" anchorX="center" font={undefined}>
          ✦ · ✦
        </Text>
      </group>
    </group>
  )
}

/* ========================================
   Corridor Scene (Camera + Geometry)
   ======================================== */
function CorridorContent({ onDoorClick }) {
  const scroll = useScroll()
  const floorTex = useMemo(() => createFloorTexture(), [])
  const wallTex = useMemo(() => createWallTexture(), [])

  useFrame((state, delta) => {
    const offset = scroll.offset
    // Camera moves from Z=3 (entrance) toward Z=-15
    const rawZ = 3 - offset * 18

    let targetX = 0
    let targetRotY = 0
    let stickyZ = rawZ

    const doors = [
      { z: -2, xDir: 1, rotDir: -1 },   // Contact (right)
      { z: -7, xDir: -1, rotDir: 1 },    // Gallery (left)
      { z: -12, xDir: 1, rotDir: -1 },   // Studio (right)
    ]

    for (const door of doors) {
      const focusZ = door.z + 3
      const dist = rawZ - focusZ
      if (Math.abs(dist) < 3) {
        const t = 1 - Math.abs(dist) / 3
        const smooth = t * t * (3 - 2 * t)
        targetX = smooth * door.xDir * 0.6
        targetRotY = smooth * door.rotDir * (Math.PI / 7)
        stickyZ = THREE.MathUtils.lerp(rawZ, focusZ, smooth * 0.6)
      }
    }

    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, stickyZ, 4, delta)
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 4, delta)
    state.camera.position.y = 0 + Math.sin(offset * Math.PI * 8) * 0.03
    state.camera.rotation.order = 'YXZ'
    state.camera.rotation.y = THREE.MathUtils.damp(state.camera.rotation.y, targetRotY, 4, delta)
  })

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -7]}>
        <planeGeometry args={[5, 25]} />
        <meshBasicMaterial map={floorTex} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, -7]}>
        <planeGeometry args={[5, 25]} />
        <meshBasicMaterial color="#f7f7f5" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-2.5, 0.5, -7]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[25, 4]} />
        <meshBasicMaterial map={wallTex} />
      </mesh>

      {/* Right wall */}
      <mesh position={[2.5, 0.5, -7]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[25, 4]} />
        <meshBasicMaterial map={wallTex} />
      </mesh>

      {/* Back wall (behind portal) */}
      <mesh position={[0, 0.5, -5.1]}>
        <planeGeometry args={[5, 4]} />
        <meshBasicMaterial color="#f4f3ee" />
      </mesh>

      {/* Baseboard lines */}
      {[-2.49, 2.49].map((x, i) => (
        <lineSegments key={`base-${i}`} position={[x, -1.49, -7]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 0, -12.5, 0, 0, 12.5]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#111" linewidth={2} />
        </lineSegments>
      ))}

      {/* Ceiling lines */}
      {[-2.49, 2.49].map((x, i) => (
        <lineSegments key={`ceil-${i}`} position={[x, 2.49, -7]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 0, -12.5, 0, 0, 12.5]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#111" linewidth={2} />
        </lineSegments>
      ))}

      {/* Ceiling lights */}
      {[0, -5, -10, -15].map((zp, i) => (
        <group key={`light-${i}`} position={[0, 2.47, zp]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2, 0.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <lineSegments rotation={[Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(2, 0.5)]} />
            <lineBasicMaterial color="#222" linewidth={2} />
          </lineSegments>
        </group>
      ))}

      {/* Portal on back wall */}
      <Portal />

      {/* Wall doodles */}
      <WallDoodles />

      {/* === DOORS === */}
      <Door
        position={[2.45, 0, -2]}
        rotation={[0, -Math.PI / 2, 0]}
        label="CONTACT"
        type="contact"
        onClick={() => onDoorClick('contact')}
      />
      <Door
        position={[-2.45, 0, -7]}
        rotation={[0, Math.PI / 2, 0]}
        label="THE GALLERY"
        type="gallery"
        onClick={() => onDoorClick('gallery')}
      />
      <Door
        position={[2.45, 0, -12]}
        rotation={[0, -Math.PI / 2, 0]}
        label="THE STUDIO"
        type="studio"
        onClick={() => onDoorClick('studio')}
      />
    </group>
  )
}

/* ========================================
   Hub Scene Wrapper
   ======================================== */
export default function Hub({ onNavigate }) {
  const [contactOpen, setContactOpen] = useState(false)

  const handleDoorClick = useCallback((door) => {
    if (door === 'contact') {
      setContactOpen(true)
    } else {
      onNavigate(door)
    }
  }, [onNavigate])

  return (
    <div className="ee-scene ee-scene-enter" style={{ background: '#f4f3ee' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 55 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#f4f3ee']} />
        <ambientLight intensity={0.95} />
        <fog attach="fog" args={['#f4f3ee', 15, 25]} />

        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.25}>
            <CorridorContent onDoorClick={handleDoorClick} />
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Instruction card */}
      <InstructionCard
        header="EXPLORER"
        icon="🧭"
        body="Scroll to move. Click a door to enter."
        autoHideSec={4}
      />

      {/* Contact form overlay */}
      {contactOpen && <ContactForm onClose={() => setContactOpen(false)} />}
    </div>
  )
}
