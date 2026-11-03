// Globo 3D de puntos (noche): ciudades encendidas en oro y costas de Europa en plata.
// Todo se mueve con `vuelo` (0–1), que calcula la escena a partir del fotograma actual.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { TIERRA, TIERRA_EUROPA } from "./tierra";

const R = 1;
const rad = (g: number) => (g * Math.PI) / 180;
/** lon/lat → punto de la esfera (lon 0, lat 0 mira a la cámara, +z). */
const xyz = (lon: number, lat: number, r = R) => new THREE.Vector3(r * Math.cos(rad(lat)) * Math.sin(rad(lon)), r * Math.sin(rad(lat)), r * Math.cos(rad(lat)) * Math.cos(rad(lon)));

// Ciudades (lon, lat, peso). Más densidad en Europa, que es donde aterriza la cámara.
const CIUDADES: [number, number, number][] = [
  [-0.13, 51.51, 1.6], [-1.9, 52.48, 0.9], [-2.24, 53.48, 0.9], [-1.55, 53.8, 0.7], [-2.98, 53.41, 0.7], [-4.25, 55.86, 0.8], [-3.19, 55.95, 0.7], [-3.18, 51.48, 0.6], [-1.61, 54.98, 0.6], [-2.59, 51.45, 0.6],
  [-6.26, 53.35, 0.7], [2.35, 48.86, 1.3], [4.35, 50.85, 0.8], [4.9, 52.37, 0.8], [8.68, 50.11, 1.0], [13.4, 52.52, 1.0], [-3.7, 40.42, 1.0], [-9.14, 38.72, 0.7], [12.5, 41.9, 0.9], [9.19, 45.46, 0.8],
  [8.54, 47.37, 0.7], [12.57, 55.68, 0.7], [10.75, 59.91, 0.6], [18.07, 59.33, 0.6], [16.37, 48.21, 0.7], [21.01, 52.23, 0.7], [37.62, 55.75, 1.0], [2.17, 41.39, 0.8], [-74.0, 40.71, 1.4], [-87.63, 41.88, 0.9],
  [-79.38, 43.65, 0.7], [-118.24, 34.05, 1.0], [31.24, 30.04, 0.8], [28.98, 41.01, 0.9], [-7.6, 33.57, 0.6], [3.38, 6.52, 0.7], [55.27, 25.2, 0.7], [72.88, 19.08, 0.9], [-43.17, -22.9, 0.8], [-46.63, -23.55, 0.9],
];

/** Textura redonda y difusa para que los puntos no sean cuadrados. */
const usaPunto = () =>
  useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.35, "rgba(255,255,255,0.8)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

/** Arcos de dinero hacia Londres: salen de las plazas financieras de 1992. */
const ORIGENES: [number, number][] = [[-74.0, 40.71], [-87.63, 41.88], [8.68, 50.11], [8.54, 47.37], [-3.7, 40.42], [37.62, 55.75]];
const LONDRES: [number, number] = [-0.13, 51.51];
/** Gran círculo de A a B, levantado sobre la superficie en el centro. */
const arcoDe = (a: [number, number], b: [number, number], n = 64) => {
  const va = xyz(...a).normalize(),
    vb = xyz(...b).normalize();
  const ang = va.angleTo(vb);
  return Array.from({ length: n + 1 }).map((_, i) => {
    const t = i / n;
    const v = va.clone().multiplyScalar(Math.sin((1 - t) * ang)).add(vb.clone().multiplyScalar(Math.sin(t * ang))).divideScalar(Math.sin(ang));
    return v.multiplyScalar(1.01 + Math.sin(Math.PI * t) * ang * 0.28);
  });
};

/** Borde iluminado del planeta de la serie: ámbar, más intenso arriba a la izquierda. */
const bordeAmbar = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    uniforms: {},
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vV;
      void main(){
        float fr = pow(1.0 - abs(dot(vN, vV)), 2.2);
        float lado = clamp(0.35 + 0.65 * dot(normalize(vN.xy + 1e-4), normalize(vec2(-0.7, 0.7))), 0.15, 1.0);
        vec3 c = mix(vec3(0.71,0.47,0.25), vec3(0.91,0.71,0.48), lado);
        gl_FragColor = vec4(c, fr * lado * 1.3);
      }`,
  });

const nube = (pts: [number, number][], r: number) => {
  const g = new THREE.BufferGeometry();
  g.setFromPoints(pts.map(([lo, la]) => xyz(lo, la, r)));
  return g;
};

const Globo: React.FC<{ vuelo: number; giro: number; costas: [number, number][][]; brillo: number; arcos: number }> = ({ vuelo, giro, costas, brillo, arcos }) => {
  const punto = usaPunto();
  const borde = useMemo(bordeAmbar, []);
  const tierra = useMemo(() => nube(TIERRA, 1.004), []);
  const europa = useMemo(() => nube(TIERRA_EUROPA, 1.005), []);
  const ciudades = useMemo(() => nube(CIUDADES.map(([lo, la]) => [lo, la]), 1.008), []);
  const lineas = useMemo(
    () =>
      costas.map((pts) => {
        const g = new THREE.BufferGeometry().setFromPoints(pts.map(([lo, la]) => xyz(lo, la, 1.006)));
        return new THREE.Line(g, new THREE.LineBasicMaterial({ color: "#E7B57A", transparent: true, opacity: 0.8 }));
      }),
    [costas],
  );
  const rutas = useMemo(
    () =>
      ORIGENES.map((o) => {
        const pts = arcoDe(o, LONDRES);
        // tubo (las líneas de WebGL siempre miden 1 px)
        const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.0045, 6, false);
        const l = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: "#E9C25A", transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
        return { l, g, pts };
      }),
    [],
  );
  // cada arco arranca un poco después del anterior y se dibuja hasta Londres
  const cabezas = rutas.map(({ g, pts }, k) => {
    const p = Math.max(0, Math.min(1, arcos * 1.6 - k * 0.12));
    const n = Math.round(p * (pts.length - 1));
    g.setDrawRange(0, n * 6 * 6);
    return p > 0 && p < 1 ? pts[n] : null;
  });
  // al caer sobre Gran Bretaña los arcos ya llegaron: se apagan para no tapar el mapa
  const apaga = 1 - Math.max(0, Math.min(1, (vuelo - 0.55) / 0.2));
  rutas.forEach(({ l }) => ((l.material as THREE.MeshBasicMaterial).opacity = 0.95 * apaga));
  const cab = useMemo(() => new THREE.BufferGeometry(), []);
  cab.setFromPoints(cabezas.filter((v): v is THREE.Vector3 => !!v));
  // Reino Unido de frente: girar -lon y luego inclinar +lat
  const lon0 = -2.5,
    lat0 = 54;
  const z = -3.0 + vuelo * 5.75; // de lejos (globo entero) a rozar Gran Bretaña
  return (
    <group position={[0, 0, z]} rotation={[rad(lat0 * (0.35 + 0.65 * vuelo)), 0, 0]}>
      <group rotation={[0, -rad(lon0) - giro, 0]}>
        <mesh>
          <sphereGeometry args={[R, 96, 96]} />
          <meshStandardMaterial color="#15110C" roughness={0.95} metalness={0} emissive="#070605" emissiveIntensity={1} />
        </mesh>
        {/* borde ámbar del planeta de la serie */}
        <mesh scale={1.035} material={borde}>
          <sphereGeometry args={[R, 96, 96]} />
        </mesh>
        <points geometry={tierra}>
          <pointsMaterial size={0.024 * (1 - 0.5 * vuelo)} color="#8C7458" transparent opacity={0.8} map={punto ?? undefined} alphaTest={0.05} depthWrite={false} />
        </points>
        <points geometry={europa}>
          <pointsMaterial size={0.009} color="#B89A72" transparent opacity={0.35 + 0.5 * vuelo} map={punto ?? undefined} alphaTest={0.05} depthWrite={false} />
        </points>
        {lineas.map((l, i) => (
          <primitive key={i} object={l} />
        ))}
        {rutas.map(({ l }, i) => (
          <primitive key={`r${i}`} object={l} />
        ))}
        <points geometry={cab}>
          <pointsMaterial size={0.06} color="#FFE7A3" transparent opacity={apaga} map={punto ?? undefined} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
        <points geometry={ciudades}>
          <pointsMaterial size={0.09 * brillo * (1 - 0.82 * vuelo)} color="#F0A955" transparent opacity={0.45} map={punto ?? undefined} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
        <points geometry={ciudades}>
          <pointsMaterial size={0.03 * (1 - 0.6 * vuelo)} color="#FFE2B0" transparent opacity={0.95} map={punto ?? undefined} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>
    </group>
  );
};

export const Globo3D: React.FC<{ vuelo: number; giro: number; costas: [number, number][][]; brillo?: number; arcos?: number }> = ({ vuelo, giro, costas, brillo = 1, arcos = 0 }) => (
  <ThreeCanvas width={1080} height={1920} camera={{ fov: 35, position: [0, 0, 4], near: 0.01, far: 50 }} style={{ position: "absolute", left: 0, top: 0 }}>
    <ambientLight intensity={0.5} />
    <directionalLight position={[-4, 4, 3]} intensity={0.9} color="#E7B57A" />
    <Globo vuelo={vuelo} giro={giro} costas={costas} brillo={brillo} arcos={arcos} />
  </ThreeCanvas>
);
