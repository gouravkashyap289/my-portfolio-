import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GokuModel() {
  const group = useRef<THREE.Group>(null);
  // Using the moved model from public folder
  const { scene, animations } = useGLTF('/goku.glb');
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (names.length > 0) {
      // Play the first animation if available
      const action = actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);

  useFrame((state) => {
    if (group.current) {
      // Gentle floating/breathing animation
      group.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Auto-rotate slowly
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive 
      ref={group}
      object={scene} 
      scale={.8} 
      position={[0, -0.8, 0]} 
      castShadow 
      receiveShadow
    />
  );
}

useGLTF.preload('/goku.glb');
