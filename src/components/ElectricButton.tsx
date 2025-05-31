
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ElectricButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ElectricButton = ({ children, onClick }: ElectricButtonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId?: number;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !buttonRef.current) return;

    const canvas = canvasRef.current;
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(rect.width, rect.height, false);

    // Electric/Ripple shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uHover;
      uniform float uClick;
      uniform vec2 uResolution;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        
        // Electric effect
        float electric = 0.0;
        for(int i = 0; i < 3; i++) {
          float fi = float(i);
          electric += sin(dist * 20.0 + uTime * 3.0 + fi) * 0.1;
          electric += sin(uv.x * 15.0 + uTime * 2.0 + fi) * 0.05;
          electric += sin(uv.y * 12.0 + uTime * 2.5 + fi) * 0.05;
        }
        
        // Ripple effect on click
        float ripple = 0.0;
        if(uClick > 0.0) {
          float rippleDist = dist;
          ripple = sin(rippleDist * 30.0 - uTime * 10.0) * exp(-rippleDist * 5.0) * uClick;
        }
        
        // Border glow
        float border = smoothstep(0.45, 0.5, dist) - smoothstep(0.5, 0.55, dist);
        
        // Combine effects
        float intensity = (electric * 0.3 + ripple * 0.7 + border * 0.5) * uHover;
        intensity = clamp(intensity, 0.0, 1.0);
        
        gl_FragColor = vec4(1.0, 1.0, 1.0, intensity * 0.3);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uClick: { value: 0 },
        uResolution: { value: new THREE.Vector2(rect.width, rect.height) }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = Date.now();
    sceneRef.current = { scene, camera, renderer, material, startTime };

    const animate = () => {
      if (!sceneRef.current) return;
      
      const elapsed = (Date.now() - sceneRef.current.startTime) / 1000;
      sceneRef.current.material.uniforms.uTime.value = elapsed;
      
      // Smooth hover transition
      const targetHover = isHovered ? 1.0 : 0.0;
      const currentHover = sceneRef.current.material.uniforms.uHover.value;
      sceneRef.current.material.uniforms.uHover.value = THREE.MathUtils.lerp(currentHover, targetHover, 0.1);
      
      // Click effect decay
      const currentClick = sceneRef.current.material.uniforms.uClick.value;
      sceneRef.current.material.uniforms.uClick.value = Math.max(0, currentClick - 0.05);
      
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [isHovered, isClicked]);

  const handleClick = () => {
    setIsClicked(true);
    if (sceneRef.current) {
      sceneRef.current.material.uniforms.uClick.value = 1.0;
    }
    setTimeout(() => setIsClicked(false), 300);
    onClick?.();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="relative font-exo font-bold text-sm uppercase tracking-widest px-8 py-3 border-2 border-white bg-transparent text-white transition-all duration-300 hover:bg-white hover:text-black rounded overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />
        <span className="relative z-10">{children}</span>
      </button>
    </div>
  );
};

export default ElectricButton;
