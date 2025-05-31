
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface DistortedTextProps {
  text: string;
  className?: string;
}

const DistortedText = ({ text, className = '' }: DistortedTextProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId?: number;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true 
    });

    // Create a temporary canvas to render text
    const textCanvas = document.createElement('canvas');
    const textContext = textCanvas.getContext('2d')!;
    
    // Set high resolution for crisp text
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const baseWidth = 1024;
    const baseHeight = 256;
    textCanvas.width = baseWidth * pixelRatio;
    textCanvas.height = baseHeight * pixelRatio;
    textContext.scale(pixelRatio, pixelRatio);
    
    // Style the text
    textContext.fillStyle = '#FFFFFF';
    textContext.font = 'bold 80px Poppins, sans-serif';
    textContext.textAlign = 'center';
    textContext.textBaseline = 'middle';
    textContext.letterSpacing = '-0.02em';
    
    // Draw text
    textContext.fillText(text, baseWidth / 2, baseHeight / 2);
    
    // Create texture from text canvas
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.needsUpdate = true;

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader with wave distortion
    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        // Create wave distortion
        float wave1 = sin(uv.x * 10.0 + uTime * 2.0) * 0.01;
        float wave2 = sin(uv.y * 8.0 + uTime * 1.5) * 0.008;
        float wave3 = sin((uv.x + uv.y) * 6.0 + uTime * 2.5) * 0.006;
        
        vec2 distortion = vec2(wave1 + wave3, wave2 + wave3) * uIntensity;
        vec2 distortedUv = uv + distortion;
        
        vec4 color = texture2D(uTexture, distortedUv);
        
        // Add subtle glow effect
        float glow = smoothstep(0.1, 0.9, color.a);
        color.rgb += glow * 0.1;
        
        gl_FragColor = color;
      }
    `;

    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: textTexture },
        uTime: { value: 0 },
        uIntensity: { value: 1.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    });

    // Create geometry and mesh
    const geometry = new THREE.PlaneGeometry(2, 0.5);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = Date.now();
    sceneRef.current = { scene, camera, renderer, material, startTime };

    // Resize handler
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      const elapsed = (Date.now() - sceneRef.current.startTime) / 1000;
      sceneRef.current.material.uniforms.uTime.value = elapsed;
      
      // Adjust intensity based on hover state
      const targetIntensity = isHovered ? 2.0 : 1.0;
      const currentIntensity = sceneRef.current.material.uniforms.uIntensity.value;
      sceneRef.current.material.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        currentIntensity, 
        targetIntensity, 
        0.1
      );
      
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      textTexture.dispose();
    };
  }, [text, isHovered]);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default DistortedText;
