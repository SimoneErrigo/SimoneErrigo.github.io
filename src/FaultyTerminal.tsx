import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useCallback, useEffect, useMemo, useRef } from "react";

type Vec2 = [number, number];

type Props = {
  scale?: number;
  gridMul?: Vec2;
  digitSize?: number;
  timeScale?: number;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  curvature?: number;
  tint?: string;
  mouseStrength?: number;
  brightness?: number;
};

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uCurvature;
uniform vec3 uTint;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uPageLoadProgress;
uniform float uBrightness;
float time;

float noise(vec2 p) {
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);
  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  q = vec2(fbm(p + vec2(1.0)), fbm(rot01 * p + vec2(1.0)));
  r = vec2(fbm(rot1 * q), fbm(q));
  return fbm(p + r);
}

float digit(vec2 p) {
  vec2 grid = uGridMul * 15.0;
  vec2 s = floor(p * grid) / grid;
  p *= grid;
  vec2 q, r;
  float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
  vec2 mouseWorld = uMouse * uScale;
  float distToMouse = distance(s, mouseWorld);
  float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
  intensity += mouseInfluence;
  intensity += sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
  float randomDelay = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453) * 0.8;
  intensity *= smoothstep(0.0, 1.0, clamp((uPageLoadProgress - randomDelay) / 0.2, 0.0, 1.0));
  p = fract(p) * uDigitSize;
  float px5 = p.x * 5.0;
  float py5 = (1.0 - p.y) * 5.0;
  float x = fract(px5);
  float y = fract(py5);
  float i = floor(py5) - 2.0;
  float j = floor(px5) - 2.0;
  float isOn = step(0.1, intensity - (i * i + j * j) * 0.0625);
  float lit = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
  return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * lit;
}

float onOff(float a, float b, float c) {
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 p) {
  float y = p.y - mod(iTime * 0.25, 1.0);
  float window = 1.0 / (1.0 + 50.0 * y * y);
  return sin(p.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) *
    (1.0 + cos(iTime * 60.0)) * window;
}

vec3 getColor(vec2 p) {
  float bar = (step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0) * uScanlineIntensity;
  float displacement = displace(p);
  p.x += displacement * uGlitchAmount;
  float middle = digit(p);
  const float off = 0.002;
  float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) +
    digit(p + vec2(off, -off)) + digit(p + vec2(-off, 0.0)) +
    digit(p) + digit(p + vec2(off, 0.0)) + digit(p + vec2(-off, off)) +
    digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
  return vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
}

void main() {
  time = iTime * 0.333333;
  vec2 c = vUv * 2.0 - 1.0;
  c *= 1.0 + uCurvature * dot(c, c);
  vec2 p = (c * 0.5 + 0.5) * uScale;
  gl_FragColor = vec4(getColor(p) * uTint * uBrightness, 1.0);
}`;

function rgb(hex: string) {
  const value = parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export default function FaultyTerminal({
  scale = 1.55,
  gridMul = [2, 1],
  digitSize = 1.4,
  timeScale = 0.22,
  scanlineIntensity = 0.35,
  glitchAmount = 0.8,
  flickerAmount = 0.45,
  noiseAmp = 1,
  curvature = 0.08,
  tint = "#8dff77",
  mouseStrength = 0.18,
  brightness = 0.8,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const tintValue = useMemo(() => rgb(tint), [tint]);
  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!container.current) return;
    const rect = container.current.getBoundingClientRect();
    mouse.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: 1 - (event.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(1, 1, 1) },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array(gridMul) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uCurvature: { value: curvature },
        uTint: { value: new Color(tintValue[0], tintValue[1], tintValue[2]) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: mouseStrength },
        uPageLoadProgress: { value: 0 },
        uBrightness: { value: brightness },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const started = performance.now();
    let frame = 0;

    const resize = () => {
      renderer.setSize(element.offsetWidth, element.offsetHeight);
      program.uniforms.iResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    const update = (now: number) => {
      frame = requestAnimationFrame(update);
      program.uniforms.iTime.value = now * 0.001 * timeScale;
      program.uniforms.uPageLoadProgress.value = Math.min((now - started) / 2000, 1);
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.08;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.08;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = smoothMouse.current.x;
      mouseUniform[1] = smoothMouse.current.y;
      renderer.render({ scene: mesh });
    };

    element.appendChild(gl.canvas);
    element.addEventListener("mousemove", onMouseMove);
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("mousemove", onMouseMove);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    brightness, curvature, digitSize, flickerAmount, glitchAmount, gridMul,
    mouseStrength, noiseAmp, onMouseMove, scale, scanlineIntensity, timeScale, tintValue,
  ]);

  return <div ref={container} className="faulty-terminal-container" />;
}
