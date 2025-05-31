
import { useEffect, useRef } from 'react';

interface ContourEffectProps {
  className?: string;
}

const ContourEffect = ({ className = '' }: ContourEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    glRef.current = gl;

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform sampler2D u_textTexture;
      
      varying vec2 v_texCoord;
      varying float v_displacement;
      
      void main() {
        v_texCoord = a_texCoord;
        
        // Sample text displacement
        vec4 textSample = texture2D(u_textTexture, a_texCoord);
        float textMask = textSample.a;
        
        // Create displacement based on text
        float displacement = textMask * 0.15;
        
        // Add mouse interaction
        vec2 mousePos = u_mouse;
        float mouseDist = distance(a_texCoord, mousePos);
        float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.1;
        
        displacement += mouseEffect;
        
        // Add subtle wave animation
        displacement += sin(a_texCoord.y * 20.0 + u_time * 2.0) * 0.02;
        
        v_displacement = displacement;
        
        vec2 position = a_position;
        position.x += displacement;
        
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      varying float v_displacement;
      
      void main() {
        // Create horizontal lines
        float lineSpacing = 0.03;
        float lineWidth = 0.002;
        
        float line = mod(v_texCoord.y, lineSpacing);
        float lineIntensity = smoothstep(lineWidth, 0.0, abs(line - lineSpacing * 0.5));
        
        // Add displacement-based intensity variation
        lineIntensity *= (1.0 + v_displacement * 2.0);
        lineIntensity = clamp(lineIntensity, 0.0, 1.0);
        
        // Fade edges
        float edgeFade = smoothstep(0.0, 0.1, v_texCoord.x) * 
                        smoothstep(1.0, 0.9, v_texCoord.x) *
                        smoothstep(0.0, 0.1, v_texCoord.y) * 
                        smoothstep(1.0, 0.9, v_texCoord.y);
        
        lineIntensity *= edgeFade;
        
        gl_FragColor = vec4(lineIntensity, lineIntensity, lineIntensity, 1.0);
      }
    `;

    // Compile shader
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    // Create geometry for grid
    const createGrid = (cols: number, rows: number) => {
      const positions = [];
      const texCoords = [];
      const indices = [];

      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const x = (col / cols) * 2 - 1;
          const y = (row / rows) * 2 - 1;
          const u = col / cols;
          const v = 1 - row / rows;

          positions.push(x, y);
          texCoords.push(u, v);

          if (row < rows && col < cols) {
            const topLeft = row * (cols + 1) + col;
            const topRight = topLeft + 1;
            const bottomLeft = (row + 1) * (cols + 1) + col;
            const bottomRight = bottomLeft + 1;

            indices.push(topLeft, bottomLeft, topRight);
            indices.push(topRight, bottomLeft, bottomRight);
          }
        }
      }

      return { positions, texCoords, indices };
    };

    const { positions, texCoords, indices } = createGrid(200, 150);

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Create text texture
    const createTextTexture = () => {
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 1024;
      textCanvas.height = 512;
      const ctx = textCanvas.getContext('2d')!;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 120px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('STORY MEEMAW', textCanvas.width / 2, textCanvas.height / 2);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      return texture;
    };

    const textTexture = createTextTexture();

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const textTextureLocation = gl.getUniformLocation(program, 'u_textTexture');

    // Resize function
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth * dpr;
      const displayHeight = canvas.clientHeight * dpr;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1 - (e.clientY - rect.top) / rect.height;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = (time: number) => {
      resize();

      gl.useProgram(program);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Bind position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Bind texture coordinate buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.enableVertexAttribArray(texCoordLocation);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

      // Bind index buffer
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      // Set uniforms
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);

      // Bind text texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textTexture);
      gl.uniform1i(textTextureLocation, 0);

      // Draw
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      animationRef.current = requestAnimationFrame(render);
    };

    resize();
    render(0);

    // Handle resize
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Cleanup WebGL resources
      if (gl && program) {
        gl.deleteProgram(program);
      }
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      if (textTexture) gl.deleteTexture(textTexture);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (texCoordBuffer) gl.deleteBuffer(texCoordBuffer);
      if (indexBuffer) gl.deleteBuffer(indexBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'black' }}
    />
  );
};

export default ContourEffect;
