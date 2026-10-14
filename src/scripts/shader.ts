const vertex = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Gradiente orgânico (fbm com domain warping) nas cores da marca, reagindo ao mouse.
const fragment = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
  float t = u_time * 0.05;

  float glow = exp(-3.0 * length(p - m));
  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 4.0));
  float n = fbm(p * 2.0 + q * 1.9 + glow * 0.7);

  vec3 cream = vec3(1.0, 0.969, 0.91);
  vec3 sun   = vec3(1.0, 0.773, 0.192);
  vec3 deep  = vec3(0.949, 0.663, 0.0);

  vec3 col = mix(cream, sun, smoothstep(0.38, 0.82, n));
  col = mix(col, deep, smoothstep(0.72, 1.0, n) * 0.4);
  col = mix(col, cream, smoothstep(0.55, 0.0, uv.x) * 0.45);
  col += glow * 0.06;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile error');
  }
  return shader;
}

export function mountShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return; // fallback: gradiente CSS do próprio canvas

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_res');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = { x: 0.7, y: 0.5, tx: 0.7, ty: 0.5 };
  let visible = true;
  let frame = 0;
  let last = 0;
  let rect = { top: 0, width: 1, height: 1 };
  const start = performance.now();

  // O gradiente é suave: renderizar abaixo da resolução da tela e deixar o navegador ampliar
  // custa uma fração dos pixels sem diferença visível. No celular, menos ainda.
  const scale = matchMedia('(max-width: 767px), (pointer: coarse)').matches ? 0.3 : 0.5;
  const FRAME_MS = 1000 / 30;

  const resize = () => {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const r = canvas.getBoundingClientRect();
    rect = { top: r.top + scrollY, width: r.width, height: r.height };
  };

  const draw = (now: number) => {
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, reduce ? 20 : (now - start) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now: number) => {
    if (now - last >= FRAME_MS) {
      last = now;
      draw(now);
    }
    frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
  };
  const resume = () => {
    if (visible && !document.hidden && !frame) frame = requestAnimationFrame(loop);
  };

  resize();
  new ResizeObserver(() => {
    resize();
    if (reduce || !visible) draw(performance.now());
  }).observe(canvas);

  if (reduce) {
    draw(performance.now());
    return;
  }

  addEventListener(
    'pointermove',
    (e) => {
      mouse.tx = e.clientX / rect.width;
      mouse.ty = 1 - (e.clientY + scrollY - rect.top) / rect.height;
    },
    { passive: true },
  );

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resume();
  }).observe(canvas);
  document.addEventListener('visibilitychange', resume);
}
