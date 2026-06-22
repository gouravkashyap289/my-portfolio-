import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  OrbitControls, 
  Float, 
  Stars,
  ContactShadows
} from '@react-three/drei';
import { motion } from 'motion/react';
import { GokuModel } from './GokuModel';

function Scene() {
  return (
    <Suspense fallback={null}>
      <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={45} />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <GokuModel />
      </Float>

      <Stars radius={100} depth={50} count={3000} factor={6} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.5} />
      
      {/* Cinematic Rim Lights */}
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={5} 
        color="#22d3ee" 
        castShadow 
      />
      <spotLight 
        position={[-10, 5, -5]} 
        angle={0.2} 
        penumbra={1} 
        intensity={3} 
        color="#d946ef" 
      />
      <spotLight 
        position={[0, 10, -10]} 
        angle={0.2} 
        penumbra={1} 
        intensity={4} 
        color="#ffffff" 
      />
      
      <pointLight position={[0, 2, 4]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -2, 2]} intensity={1} color="#22d3ee" />

      <Environment preset="city" />
      
      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.6} 
        scale={10} 
        blur={2.5} 
        far={5} 
      />

      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 2.5}
      />
    </Suspense>
  );
}

export function Hero3D() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Canvas
        className="absolute inset-0 z-0"
        shadows
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>

      <div className="relative z-10 flex h-full flex-col justify-center px-12 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-block px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-black uppercase tracking-widest mb-6">
            Available for Commissions
          </div>
          <h1 className="max-w-4xl text-7xl font-black leading-[0.9] tracking-tight md:text-8xl mb-8">
            I TURN FRAMES<br />
            INTO <span className="text-stroke text-transparent">FEELINGS</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-gray-400 mb-8">
            Gourav — Video Editor & Motion Designer specialized in high-energy anime edits and cinematic storytelling.
          </p>

          <div className="flex flex-wrap gap-6">
            <motion.a
              href="#work"
              whileHover={{ backgroundColor: '#22d3ee', color: '#000' }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-sm font-bold text-sm flex items-center gap-3 transition-colors uppercase tracking-widest"
            >
              PLAY SHOWREEL
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L3 10V2L10 6Z" fill="currentColor"/>
              </svg>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white/20 rounded-sm font-bold text-sm transition-colors uppercase tracking-widest text-white mt-0"
            >
              Get In Touch →
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-[1px] bg-gradient-to-b from-neon-cyan to-transparent" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
            Scroll
          </span>
        </div>
      </motion.div>
    </div>
  );
}
