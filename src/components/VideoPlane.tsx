import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVideoTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface VideoPlaneProps {
  videoSrc: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  onClick?: () => void;
}

export function VideoPlane({ 
  videoSrc, 
  position = [0, 0, 0], 
  scale = 1,
  rotation = [0, 0, 0],
  onClick 
}: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  
  // Custom video options
  const videoOptions = useMemo(() => ({
    unsuspend: 'canplay',
    muted: true,
    loop: true,
    crossOrigin: "Anonymous"
  }), []);

  // Load video explicitly to handle errors
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'Anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    video.play().then(() => {
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBAFormat;
      setTexture(videoTexture);
      setVideoReady(true);
    }).catch(err => {
      console.error("Video play error:", err);
      // Fallback: show the plane even without video if it hangs
      setVideoReady(true);
    });

    // Safety timeout to hide spinner after 5 seconds
    const safetyTimeout = setTimeout(() => {
      setVideoReady(true);
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
      video.pause();
      video.src = "";
      video.load();
    };
  }, [videoSrc]);
  
  // Hover and floating animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth scaling
    const targetScale = hovered ? scale * 1.1 : scale;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale), 
      0.1
    );
    
    // Subtle floating
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    
    // Parallax rotation
    if (hovered) {
      meshRef.current.rotation.y = rotation[1] + (state.mouse.x * 0.1);
      meshRef.current.rotation.x = rotation[0] + (-state.mouse.y * 0.1);
    } else {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation[1], 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation[0], 0.05);
    }
  });
  
  // Cursor change
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);
  
  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <planeGeometry args={[3.2, 1.8]} />
        
        {texture ? (
          <meshPhysicalMaterial
            map={texture}
            transparent
            opacity={videoReady ? 1 : 0}
            side={THREE.DoubleSide}
            roughness={0.1}
            metalness={0.9}
            transmission={hovered ? 0 : 0.4} 
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive={hovered ? "#00D9FF" : "#000000"}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        ) : (
          <meshPhysicalMaterial 
            color="#111111" 
            transparent 
            opacity={0.5} 
            transmission={0.8}
            roughness={0}
          />
        )}
      </mesh>
      
      {/* Glowing border on hover */}
      {hovered && (
        <mesh position={[0, 0, -0.01]} scale={1.05}>
          <planeGeometry args={[3.3, 1.9]} />
          <meshBasicMaterial 
            color="#00D9FF" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Loading placeholder */}
      {!videoReady && (
        <Html center>
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-neon-cyan" />
            <p className="text-[8px] font-bold uppercase tracking-widest text-neon-cyan">Loading</p>
          </div>
        </Html>
      )}
    </group>
  );
}
