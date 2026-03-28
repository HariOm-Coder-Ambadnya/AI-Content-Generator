import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float, 
  MeshDistortMaterial, 
  PerspectiveCamera, 
  PresentationControls,
  RoundedBox,
  Environment,
  ContactShadows,
  GradientTexture
} from '@react-three/drei'
import * as THREE from 'three'

function RobotHead() {
  const headRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1
        headRef.current.position.y = Math.sin(t * 1.5) * 0.05
    }
  })

  return (
    <group ref={headRef}>
      <RoundedBox args={[1.2, 1, 0.8]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.2} />
      </RoundedBox>

      <RoundedBox args={[1.02, 0.82, 0.12]} radius={0.06} position={[0, 0, 0.38]}>
        <meshStandardMaterial color="#020617" />
        <mesh position={[0, 0, 0.065]}>
            <planeGeometry args={[0.9, 0.7]} />
            <MeshDistortMaterial 
                speed={3} 
                distort={0.4} 
                radius={1}
                emissive="#3b82f6"
                emissiveIntensity={8}
            >
              <GradientTexture
                stops={[0, 0.25, 0.5, 0.75, 1]}
                colors={['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
                size={512}
              />
            </MeshDistortMaterial>
        </mesh>
      </RoundedBox>

      <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function RobotBody() {
  const group = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
        group.current.rotation.y = Math.sin(t / 4) / 4
    }
  })

  return (
    <group ref={group} position={[0, -1.2, 0]}>
      <RoundedBox args={[0.9, 1.2, 0.6]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.2} />
      </RoundedBox>
      
      <mesh position={[0, 0.2, 0.31]}>
        <boxGeometry args={[0.4, 0.1, 0.02]} />
        <meshStandardMaterial emissive="#3b82f6" emissiveIntensity={4} color="#3b82f6" />
      </mesh>

      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      <Arm position={[0.6, 0.3, 0]} side="right" />
      <Arm position={[-0.6, 0.3, 0]} side="left" />

      <Leg position={[0.25, -0.85, 0]} />
      <Leg position={[-0.25, -0.85, 0]} />
    </group>
  )
}

function Arm({ position, side }) {
    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        ref.current.rotation.z = side === 'right' ? Math.sin(t * 1.5) * 0.1 - 0.2 : -Math.sin(t * 1.5) * 0.1 + 0.2
    })
    return (
        <group position={position} ref={ref}>
            <mesh>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.6, 32]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.2} />
            </mesh>
            <mesh position={[0, -0.75, 0]}>
                <boxGeometry args={[0.2, 0.2, 0.1]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    )
}

function Leg({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.8, 32]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.2} />
            </mesh>
            <RoundedBox args={[0.3, 0.2, 0.4]} radius={0.05} position={[0, -0.85, 0.1]}>
                 <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </RoundedBox>
        </group>
    )
}

export default function ForgeRobot() {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={40} />
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={3} castShadow />
        <pointLight position={[-10, -5, -10]} intensity={1.5} color="#3b82f6" />
        
        <PresentationControls
          global
          snap
          config={{ mass: 2, tension: 400 }}
          rotation={[0.1, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
            <group scale={1.4} position={[0, 0.2, 0]}>
              <RobotHead />
              <RobotBody />
            </group>
          </Float>
        </PresentationControls>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.3} 
          scale={15} 
          blur={2.5} 
          far={5} 
        />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  )
}
