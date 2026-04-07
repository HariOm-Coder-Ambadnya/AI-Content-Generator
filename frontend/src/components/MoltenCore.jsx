// src/components/MoltenCore.jsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

function Core() {
  const meshRef = useRef()
  const outerRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Smooth pulsing
    const scale = 1 + Math.sin(time * 0.5) * 0.04
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale)
    }

    // Slow rotation
    if (outerRef.current) {
      outerRef.current.rotation.y += 0.003
      outerRef.current.rotation.z += 0.002
    }
  })

  return (
    <group>
      {/* Inner Core Light */}
      <Sphere args={[1, 128, 128]} ref={meshRef}>
        <MeshDistortMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={1}
          distort={0.45}
          speed={1.5}
          roughness={0.1}
          metalness={1}
        />
      </Sphere>

      {/* Technical HUD Shell */}
      <Sphere args={[1.05, 64, 64]} ref={outerRef}>
        <meshStandardMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.08}
          roughness={0}
        />
      </Sphere>

      {/* Atmospheric Neutral Lighting */}
      <pointLight position={[0, 0, 0]} intensity={10} color="#FFFFFF" />
      <ambientLight intensity={0.1} />
    </group>
  )
}

export default function MoltenCore() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative pointer-events-none drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
          <Core />
        </Float>
      </Canvas>
    </div>
  )
}
