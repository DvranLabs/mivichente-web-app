// Dibujos del mockup v2 (mvp-design/opiniones/opiniones-vichente.html). Son
// genéricos a propósito: no llevan el beneficio, que es texto libre por negocio
// y no cabe en un dibujo chico, ni el diseño del acrílico de un negocio en
// particular. Todos son decorativos: el texto de al lado dice lo mismo.

const ESTRELLA = "M12 2.8l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L3 9.4l6.2-.9z";

// Los módulos del QR de juguete, en una cuadrícula de 5 en 5.
const QR: [number, number][] = [
  [0, 0], [5, 0], [10, 0], [0, 5], [10, 5], [0, 10], [5, 10], [10, 10],
  [20, 0], [25, 0], [30, 0], [20, 5], [30, 5], [20, 10], [25, 10], [30, 10],
  [0, 20], [5, 20], [10, 20], [0, 25], [10, 25], [0, 30], [5, 30], [10, 30],
  [20, 20], [30, 20], [25, 25], [20, 30], [30, 30], [15, 15], [15, 5], [5, 15], [25, 15],
];

function Qr({ x, y, escala = 1 }: { x: number; y: number; escala?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} fill="#1F1A14">
      {QR.map(([qx, qy]) => (
        <rect key={`${qx}-${qy}`} x={qx} y={qy} width="5" height="5" />
      ))}
    </g>
  );
}

export function Estrella({ llena }: { llena: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={ESTRELLA}
        fill={llena ? "#FFC629" : "#fff"}
        stroke={llena ? "#E0A800" : "#D6CFC1"}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type IconoDePaso = "opinas" | "vuelves" | "usas" | "listo";

export function IconoPaso({ icono }: { icono: IconoDePaso }) {
  if (icono === "opinas") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={ESTRELLA} />
      </svg>
    );
  }
  if (icono === "vuelves") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 3h7v7H3zm2 2v3h3V5zM14 3h7v7h-7zm2 2v3h3V5zM3 14h7v7H3zm2 2v3h3v-3zM14 14h3v3h-3zm4 0h3v3h-3zm-4 4h3v3h-3zm4 0h3v3h-3z" />
      </svg>
    );
  }
  if (icono === "usas") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
        <path d="M18 6L6 18" />
        <circle cx="7" cy="7" r="2.4" />
        <circle cx="17" cy="17" r="2.4" />
      </svg>
    );
  }
  return <Palomita tamano={18} color="currentColor" />;
}

export function Palomita({ tamano, color }: { tamano: number; color: string }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Un celular escaneando el letrero del local: lo que se hace al regresar. */
export function LetreroConQr() {
  return (
    <svg width="200" height="106" viewBox="0 0 250 132" aria-hidden="true">
      <rect x="28" y="6" width="84" height="120" rx="6" fill="#FFF9EE" stroke="#D6CFC1" strokeWidth="1.5" />
      <circle cx="70" cy="22" r="9" fill="#E8C9A0" stroke="#6B4423" strokeWidth="1.2" />
      <rect x="44" y="40" width="52" height="8" rx="4" fill="#4A2A14" />
      <rect x="52" y="54" width="36" height="5" rx="2.5" fill="#9A8E76" />
      <rect x="50" y="72" width="40" height="40" rx="3" fill="#fff" />
      <Qr x={52.5} y={74.5} />
      <path d="M120 66 h26" stroke="#FF6A1F" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M120 66 l8 -6 M120 66 l8 6" stroke="#FF6A1F" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="154" y="14" width="64" height="108" rx="12" fill="#1F1A14" />
      <rect x="159" y="22" width="54" height="92" rx="6" fill="#FDFCFA" />
      <path d="M170 48 v-8 h8 M202 48 v-8 h-8 M170 80 v8 h8 M202 80 v8 h-8" stroke="#FF6A1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Qr x={176} y={54} escala={0.6} />
    </svg>
  );
}

/** El celular volteado hacia la caja: el descuento se le enseña a quien cobra. */
export function CelularACaja() {
  return (
    <svg width="250" height="110" viewBox="0 0 250 110" aria-hidden="true">
      <rect x="24" y="10" width="54" height="92" rx="10" fill="#1F1A14" />
      <rect x="28" y="17" width="46" height="78" rx="5" fill="#D9F0DF" />
      <path d="M34 38 h34 v8 a4 4 0 0 0 0 8 v8 h-34 v-8 a4 4 0 0 0 0 -8 z" fill="#fff" stroke="#1F6B36" strokeWidth="1.6" strokeDasharray="3 2" />
      <path d="M43 50 l5 5 l9 -10" stroke="#1F6B36" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="36" y="72" width="30" height="9" rx="4" fill="#1F1A14" />
      <path d="M92 56 q30 -26 62 0" stroke="#1F6B36" strokeWidth="2.5" fill="none" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M154 56 l-9 -1 M154 56 l-2 -9" stroke="#1F6B36" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="186" y="30" width="34" height="14" rx="3" fill="#3A3024" />
      <rect x="190" y="33" width="26" height="8" rx="1.5" fill="#D9F0DF" />
      <rect x="200" y="44" width="6" height="10" fill="#3A3024" />
      <path d="M170 54 h66 l-6 30 h-54 z" fill="#6B4423" />
      <rect x="166" y="84" width="74" height="16" rx="3" fill="#3A2614" />
      <rect x="196" y="89" width="14" height="4" rx="2" fill="#C9A77F" />
      <g fill="#E8C9A0">
        {[188, 198, 208, 218].map((cx) => <circle key={`a${cx}`} cx={cx} cy="64" r="2.5" />)}
        {[190, 200, 210, 220].map((cx) => <circle key={`b${cx}`} cx={cx} cy="73" r="2.5" />)}
      </g>
    </svg>
  );
}
