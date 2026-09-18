import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text, Html } from '@react-three/drei'
import * as THREE from 'three'

// Generate procedural Hand-Drawn Wood Plank Texture for Floor
const createFloorTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  // Light sketched background
  ctx.fillStyle = '#f5f5f3'
  ctx.fillRect(0, 0, 1024, 1024)

  // Longitudinal floor plank lines (Black sketch lines)
  ctx.strokeStyle = '#222222'
  ctx.lineWidth = 5
  const plankWidth = 1024 / 6
  for (let x = 0; x <= 1024; x += plankWidth) {
    ctx.beginPath()
    ctx.moveTo(x + (Math.random() * 4 - 2), 0)
    ctx.lineTo(x + (Math.random() * 4 - 2), 1024)
    ctx.stroke()
  }

  // Plank cross-joints
  for (let y = 128; y < 1024; y += 256) {
    for (let i = 0; i < 6; i++) {
      if (Math.random() > 0.3) {
        ctx.beginPath()
        ctx.moveTo(i * plankWidth, y)
        ctx.lineTo((i + 1) * plankWidth, y)
        ctx.stroke()
      }
    }
  }

  // Sketchy wood grain details
  ctx.strokeStyle = '#666666'
  ctx.lineWidth = 2
  for (let i = 0; i < 35; i++) {
    const startX = Math.random() * 1024
    const startY = Math.random() * 1024
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.bezierCurveTo(
      startX + (Math.random() * 40 - 20), startY + 100,
      startX + (Math.random() * 40 - 20), startY + 200,
      startX + (Math.random() * 20 - 10), startY + 300
    )
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 8)
  return texture
}

// Generate Wood Texture for Doors
const createDoorTexture = (doorType) => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  // Rich Warm Wooden Base
  ctx.fillStyle = '#c68a4c'
  ctx.fillRect(0, 0, 512, 1024)

  // Sketchy Wood Grain Lines
  ctx.strokeStyle = '#7c481d'
  ctx.lineWidth = 4
  for (let i = 0; i < 25; i++) {
    ctx.beginPath()
    const x = Math.random() * 512
    ctx.moveTo(x, 0)
    ctx.bezierCurveTo(x + 30, 300, x - 30, 700, x + 10, 1024)
    ctx.stroke()
  }

  // Outer Sketch Frame Border
  ctx.strokeStyle = '#111111'
  ctx.lineWidth = 12
  ctx.strokeRect(10, 10, 492, 1004)

  // Inset Door Panels (Top and Bottom)
  ctx.strokeStyle = '#2d1806'
  ctx.lineWidth = 8
  ctx.strokeRect(45, 50, 422, 420)
  ctx.strokeRect(45, 530, 422, 440)

  // Shading inside panels
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fillRect(45, 50, 422, 420)
  ctx.fillRect(45, 530, 422, 440)

  // Specific Door Additions directly on Texture
  if (doorType === 'contact') {
    // Mail Slot
    ctx.fillStyle = '#7a5428'
    ctx.fillRect(140, 560, 232, 45)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 5
    ctx.strokeRect(140, 560, 232, 45)

    // Envelope poking out
    ctx.save()
    ctx.translate(256, 615)
    ctx.rotate(-0.18)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-70, -40, 140, 80)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 4
    ctx.strokeRect(-70, -40, 140, 80)
    ctx.beginPath()
    ctx.moveTo(-70, -40)
    ctx.lineTo(0, 0)
    ctx.lineTo(70, -40)
    ctx.stroke()
    // Airmail stripes
    ctx.strokeStyle = '#e63946'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(-65, -35)
    ctx.lineTo(-40, -35)
    ctx.stroke()
    ctx.strokeStyle = '#1d3557'
    ctx.beginPath()
    ctx.moveTo(-35, -35)
    ctx.lineTo(-10, -35)
    ctx.stroke()
    ctx.restore()
  }

  if (doorType === 'gallery') {
    // Blueprints Taped to Door
    const drawBlueprint = (x, y, w, h, angle) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-w/2, -h/2, w, h)
      ctx.strokeStyle = '#111'
      ctx.lineWidth = 4
      ctx.strokeRect(-w/2, -h/2, w, h)
      
      // Blueprint grid lines
      ctx.strokeStyle = '#0077b6'
      ctx.lineWidth = 3
      ctx.strokeRect(-w/2 + 10, -h/2 + 10, w - 20, h - 20)
      ctx.beginPath()
      ctx.moveTo(-w/2 + 10, 0)
      ctx.lineTo(w/2 - 10, 0)
      ctx.moveTo(0, -h/2 + 10)
      ctx.lineTo(0, h/2 - 10)
      ctx.stroke()
      
      // Blue Tape at corners
      ctx.fillStyle = 'rgba(72, 149, 239, 0.9)'
      ctx.fillRect(-w/2 - 5, -h/2 - 5, 35, 16)
      ctx.fillRect(w/2 - 30, h/2 - 5, 35, 16)
      ctx.restore()
    }

    drawBlueprint(220, 210, 200, 240, -0.08)
    drawBlueprint(310, 390, 180, 210, 0.12)
    drawBlueprint(200, 740, 210, 250, -0.05)
  }

  if (doorType === 'studio') {
    // Social Badges on Door
    // Instagram Icon
    ctx.save()
    ctx.translate(256, 210)
    ctx.fillStyle = '#e1306c'
    ctx.beginPath()
    ctx.arc(0, 0, 50, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 6
    ctx.strokeRect(-22, -22, 44, 44)
    ctx.beginPath()
    ctx.arc(0, 0, 11, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // TikTok Icon
    ctx.save()
    ctx.translate(256, 360)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(0, 0, 50, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#00f2fe'
    ctx.font = 'bold 45px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🎵', 0, 0)
    ctx.restore()

    // YouTube Icon
    ctx.save()
    ctx.translate(256, 750)
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(-60, -36, 120, 72)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(-15, -22)
    ctx.lineTo(20, 0)
    ctx.lineTo(-15, 22)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  return new THREE.CanvasTexture(canvas)
}

// Generate Wooden Sign Texture
const createSignTexture = (text) => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')

  // Wood Background
  ctx.fillStyle = '#e2c398'
  ctx.fillRect(0, 0, 512, 160)

  // Wood Grain
  ctx.strokeStyle = '#b89058'
  ctx.lineWidth = 3
  for (let y = 15; y < 160; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(150, y + 6, 350, y - 6, 512, y)
    ctx.stroke()
  }

  // Outer Frame
  ctx.strokeStyle = '#111111'
  ctx.lineWidth = 8
  ctx.strokeRect(6, 6, 500, 148)

  // Corner Bolts
  ctx.fillStyle = '#333333'
  ctx.beginPath()
  ctx.arc(22, 22, 8, 0, Math.PI * 2)
  ctx.arc(490, 22, 8, 0, Math.PI * 2)
  ctx.arc(22, 138, 8, 0, Math.PI * 2)
  ctx.arc(490, 138, 8, 0, Math.PI * 2)
  ctx.fill()

  // Text
  ctx.fillStyle = '#111111'
  ctx.font = 'bold 54px "Courier New", monospace, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.toUpperCase(), 256, 80)

  return new THREE.CanvasTexture(canvas)
}

const Door = ({ position, rotation, label, title, content, type }) => {
  const [hovered, setHovered] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const doorTex = useMemo(() => createDoorTexture(type), [type])
  const signTex = useMemo(() => createSignTexture(label), [label])

  // Door height is 3.4, sitting on floor Y = -1.5, so center Y is -1.5 + (3.4 / 2) = 0.2
  const doorCenterY = 0.2

  return (
    <group position={[position[0], doorCenterY, position[2]]} rotation={rotation}>
      {/* 3D Door Outer Frame (White Trim with Bold Black Edges) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 3.6, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.42, 3.62, 0.12)]} />
        <lineBasicMaterial color="#111111" linewidth={3} />
      </lineSegments>

      {/* 3D Wooden Door Mesh */}
      <mesh
        position={[0, -0.05, 0.06]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          setOpenModal(true)
        }}
      >
        <planeGeometry args={[2.1, 3.3]} />
        <meshBasicMaterial map={doorTex} color={hovered ? '#fff3e6' : '#ffffff'} />
      </mesh>

      {/* Door Handle (Brass) */}
      <mesh position={[0.85, -0.1, 0.14]}>
        <boxGeometry args={[0.08, 0.35, 0.12]} />
        <meshBasicMaterial color="#d4af37" />
      </mesh>

      {/* Wooden Sign Above Door */}
      <mesh position={[0, 2.3, 0.06]}>
        <planeGeometry args={[2.4, 0.75]} />
        <meshBasicMaterial map={signTex} />
      </mesh>
      <lineSegments position={[0, 2.3, 0.06]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.42, 0.77)]} />
        <lineBasicMaterial color="#111111" linewidth={2} />
      </lineSegments>

      {/* Hand-drawn Arrow on Wall pointing to door */}
      <group position={[-1.7, 0, 0.02]} rotation={[0, 0, 0.1]}>
        <Text fontSize={0.5} color="#111" anchorX="center">➔</Text>
      </group>

      {/* Modal Popup on Click */}
      {openModal && (
        <Html center position={[0, 0, 0.8]}>
          <div className="door-modal" onClick={() => setOpenModal(false)}>
            <div className="door-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{title}</h3>
              <p>{content}</p>
              <button onClick={() => setOpenModal(false)}>Close</button>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function CorridorScene() {
  const scroll = useScroll()
  const floorTex = useMemo(() => createFloorTexture(), [])

  useFrame((state, delta) => {
    const scrollOffset = scroll.offset // 0 to 1
    // Corridor ranges from Z = 2 down to Z = -30
    const rawZ = 2 - (scrollOffset * 30)
    
    let targetX = 0
    let targetRotationY = 0
    let stickyZ = rawZ

    const doors = [
      { z: -1, xDir: -1, rotDir: 1 },
      { z: -8, xDir: 1, rotDir: -1 },
      { z: -15, xDir: -1, rotDir: 1 },
      { z: -22, xDir: 1, rotDir: -1 }
    ]

    for (let door of doors) {
      const focusZ = door.z + 3.5 
      const distance = rawZ - focusZ
      
      if (Math.abs(distance) < 3) {
        const t = 1 - (Math.abs(distance) / 3)
        const smoothT = t * t * (3 - 2 * t)
        
        targetX = smoothT * door.xDir * 0.8 
        targetRotationY = smoothT * door.rotDir * (Math.PI / 6) 
        stickyZ = THREE.MathUtils.lerp(rawZ, focusZ, smoothT * 0.8)
      }
    }
    
    // Smooth camera updates (Eye height Y = 0)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, stickyZ, 4, delta)
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 4, delta)
    state.camera.position.y = 0 + Math.sin(scrollOffset * Math.PI * 12) * 0.04
    
    state.camera.rotation.order = 'YXZ'
    state.camera.rotation.y = THREE.MathUtils.damp(state.camera.rotation.y, targetRotationY, 4, delta)
  })

  return (
    <group>
      {/* Floor Mesh (Y = -1.5) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -15]}>
        <planeGeometry args={[5, 40]} />
        <meshBasicMaterial map={floorTex} />
      </mesh>
      
      {/* Ceiling Mesh (Y = 2.5) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, -15]}>
        <planeGeometry args={[5, 40]} />
        <meshBasicMaterial color="#f7f7f5" />
      </mesh>

      {/* Left Wall (X = -2.5) */}
      <mesh position={[-2.5, 0.5, -15]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 4]} />
        <meshBasicMaterial color="#fcfcfc" />
      </mesh>

      {/* Right Wall (X = 2.5) */}
      <mesh position={[2.5, 0.5, -15]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[40, 4]} />
        <meshBasicMaterial color="#fcfcfc" />
      </mesh>

      {/* SKETCHED OUTLINES FOR 3D PERSPECTIVE (Baseboards & Crown Moldings) */}
      {/* Floor-Wall Baseboard Lines */}
      <lineSegments position={[-2.49, -1.49, -15]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, -20, 0, 0, 20]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#111111" linewidth={3} />
      </lineSegments>

      <lineSegments position={[2.49, -1.49, -15]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, -20, 0, 0, 20]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#111111" linewidth={3} />
      </lineSegments>

      {/* Ceiling-Wall Lines */}
      <lineSegments position={[-2.49, 2.49, -15]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, -20, 0, 0, 20]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#111111" linewidth={3} />
      </lineSegments>

      <lineSegments position={[2.49, 2.49, -15]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, -20, 0, 0, 20]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#111111" linewidth={3} />
      </lineSegments>

      {/* Ceiling Fluorescent Lights */}
      {[0, -7, -14, -21, -28].map((zPos, idx) => (
        <group key={idx} position={[0, 2.47, zPos]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.2, 0.6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <lineSegments rotation={[Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(2.2, 0.6)]} />
            <lineBasicMaterial color="#222222" linewidth={2} />
          </lineSegments>
        </group>
      ))}

      {/* Doors positioned along the Corridor Walls */}
      <Door 
        position={[-2.45, 0, -1]} 
        rotation={[0, Math.PI / 2, 0]} 
        label="THE STUDIO"
        title="Creative Studio"
        content="My YouTube, Instagram, and TikTok content creation space."
        type="studio"
      />
      
      <Door 
        position={[2.45, 0, -8]} 
        rotation={[0, -Math.PI / 2, 0]} 
        label="THE GALLERY"
        title="Featured Projects"
        content="Check out my blueprints & portfolio showcase."
        type="gallery"
      />

      <Door 
        position={[-2.45, 0, -15]} 
        rotation={[0, Math.PI / 2, 0]} 
        label="CONTACT"
        title="Say Hello"
        content="Let me know about your ideas & projects!"
        type="contact"
      />
      
      <Door 
        position={[2.45, 0, -22]} 
        rotation={[0, -Math.PI / 2, 0]} 
        label="UNI LIFE"
        title="Brainstormers"
        content="The university group that made me. Endless nights of ideation."
        type="contact"
      />

      {/* End of Corridor Wall & Sketches */}
      <mesh position={[0, 0.5, -31]}>
        <planeGeometry args={[5, 4]} />
        <meshBasicMaterial color="#f4f4f4" />
      </mesh>
      {/* End Wall Doorway */}
      <mesh position={[0, 0.1, -30.95]}>
        <planeGeometry args={[2.0, 3.2]} />
        <meshBasicMaterial color="#eef0f2" />
      </mesh>
      <lineSegments position={[0, 0.1, -30.93]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.0, 3.2)]} />
        <lineBasicMaterial color="#111111" linewidth={3} />
      </lineSegments>

      {/* End Wall Sketch Text & Elements */}
      <Text position={[0, 2.0, -30.9]} fontSize={0.25} color="#111" anchorX="center">
        while(true) {'{'} explore(); {'}'}
      </Text>
      
      <Text position={[0, 0.1, -30.9]} fontSize={1.0} color="#0077b6" anchorX="center">
        ∞
      </Text>

      {/* Code / Bug / Lightbulb Wall Scribbles */}
      <Text position={[-1.5, 1.2, -30.9]} fontSize={0.18} color="#333" anchorX="center">
        💡 IDEA
      </Text>
      <Text position={[-1.5, 0.6, -30.9]} fontSize={0.18} color="#333" anchorX="center">
        ⚙️ DEV
      </Text>
      <Text position={[-1.5, 0.0, -30.9]} fontSize={0.18} color="#d90429" anchorX="center">
        🐛 BUG!
      </Text>
      <Text position={[1.5, 0.8, -30.9]} fontSize={0.18} color="#333" anchorX="center">
        &lt;/&gt; CODE
      </Text>
    </group>
  )
}

