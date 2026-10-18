import { useEffect, useRef, type RefObject } from "react";
import { Check } from "lucide-react";
import { AraratMark } from "@/components/ararat/AraratLogo";
import usdt from "@/assets/hero-review/token-usdt.svg";
import usdc from "@/assets/hero-review/token-usdc.svg";

/** Screen corners (tl, tr, br, bl) measured on the 1280×720 shoulder stills. */
type Pt = [number, number];
type Quad = [Pt, Pt, Pt, Pt];
const QUADS: Record<"boutique" | "home" | "cafe" | "restaurant", Quad> = {
  boutique: [[766, 114.7], [964, 98.7], [956.9, 581.3], [760, 586.3]],
  home: [[791, 195.7], [953.1, 199.8], [945, 546.3], [784.9, 542.2]],
  cafe: [[712, 312.4], [1103.2, 331.8], [1068.9, 608.6], [669.7, 557.1]],
  restaurant: [[758.9, 136.9], [942.8, 139.1], [920, 587], [739, 579]],
};
const ORDER = ["boutique", "home", "cafe", "restaurant"] as const;
const FPS = 24, CHAPTER = 180, WIDE = 84, SHOULDER = 96, PUSH = 0.03, CX = 800, CY = 365;

const size = (q: Quad, w: number) => {
  const width = (Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) + Math.hypot(q[2][0] - q[3][0], q[2][1] - q[3][1])) / 2;
  const height = (Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]) + Math.hypot(q[2][0] - q[1][0], q[2][1] - q[1][1])) / 2;
  return { w, h: Math.round((w * height) / width) };
};
const DIMS = { boutique: size(QUADS.boutique, 360), home: size(QUADS.home, 360), restaurant: size(QUADS.restaurant, 360), cafe: size(QUADS.cafe, 1000) };

/** One homography mapping a W×H flat layer onto the quad. */
export function matrix3d(w: number, h: number, q: Quad) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map(v => +v.toFixed(8)).join(",")})`;
}

const Token = ({ coin }: { coin: "USDT" | "USDC" }) => <img className="fs-token" src={coin === "USDT" ? usdt : usdc} alt="" />;
const Brand = () => <div className="fs-brand"><AraratMark className="fs-mark" /><span>Araratpay</span></div>;

function Phone({ status, amount, coin }: { status: string; amount: string; coin: "USDT" | "USDC" }) {
  return <div className="fs-phone">
    <div className="fs-notch" />
    <Brand />
    <div className="fs-status"><span className="fs-check"><Check strokeWidth={3} /></span>{status}</div>
    <div className="fs-amount"><Token coin={coin} /><span>{amount}</span></div>
    <div className="fs-coin">{coin}</div>
    <div className="fs-card">
      <div className="fs-row fs-stack"><span>Invoice no.</span><b className="fs-mono">AR-250612-8X7Q2</b></div>
      <div className="fs-row"><span>Network</span><b className="fs-chip">{coin === "USDT" ? "TRC20" : "ERC20"}</b></div>
      <div className="fs-row"><span>Fee</span><b>Flat 1%</b></div>
      <div className="fs-row"><span>Status</span><b className="fs-ok">Settled</b></div>
    </div>
  </div>;
}

function Laptop() {
  return <div className="fs-laptop">
    <div className="fs-chrome"><i /><i /><i /></div>
    <div className="fs-lbody">
      <Brand />
      <div className="fs-status"><span className="fs-check"><Check strokeWidth={3} /></span>Payment received</div>
      <div className="fs-amount"><Token coin="USDC" /><span>+89.00 USDC</span></div>
      <div className="fs-cols">
        <div className="fs-card">
          <div className="fs-row fs-stack"><span>Invoice no.</span><b className="fs-mono">AR-250612-8X7Q2</b></div>
          <div className="fs-row"><span>Network</span><b className="fs-chip">ERC20</b></div>
          <div className="fs-row"><span>Status</span><b className="fs-ok">Settled</b></div>
        </div>
        <div className="fs-card">
          <div className="fs-row"><span>Amount</span><b className="fs-mono">89.00 USDC</b></div>
          <div className="fs-row"><span>Fee 1%</span><b className="fs-mono">0.89 USDC</b></div>
          <div className="fs-row"><span>Net</span><b className="fs-mono">88.11 USDC</b></div>
        </div>
      </div>
    </div>
  </div>;
}

const SCREENS = {
  boutique: <Phone status="Payment received" amount="+100.00" coin="USDT" />,
  home: <Phone status="Payment sent" amount="100.00" coin="USDC" />,
  cafe: <Laptop />,
  restaurant: <Phone status="Payment sent" amount="100.00" coin="USDT" />,
};

/** Live vector invoice screens, locked to the film's shoulder shots by currentTime. */
export function FilmScreens({ video }: { video: RefObject<HTMLVideoElement | null> }) {
  const stage = useRef<HTMLDivElement>(null);
  const layers = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = video.current, box = stage.current;
      if (!el || !box) return;
      box.style.transform = `scale(${box.parentElement!.clientWidth / 1280})`;
      const frame = Math.floor(el.currentTime * FPS + 0.001) % 720;
      const chapter = Math.floor(frame / CHAPTER), local = frame % CHAPTER;
      ORDER.forEach((name, index) => {
        const layer = layers.current[name];
        if (!layer) return;
        const on = index === chapter && local >= WIDE && el.currentTime > 0;
        layer.style.display = on ? "block" : "none";
        if (!on) return;
        const t = (local - WIDE) / (SHOULDER - 1), s = 1 + PUSH * t * t * (3 - 2 * t);
        const q = QUADS[name].map(([x, y]) => [CX + (x - CX) * s, CY + (y - CY) * s] as Pt) as Quad;
        const { w, h } = DIMS[name];
        const tf = matrix3d(w, h, q);
        for (const child of Array.from(layer.children) as HTMLElement[]) child.style.transform = tf;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [video]);
  return <div className="film-screens" aria-hidden="true"><div ref={stage} className="film-screens__stage">
    {ORDER.map(name => <div key={name} ref={node => { layers.current[name] = node; }} className={`film-screens__layer is-${name}`} style={{ display: "none" }}>
      <div className="fs-ui" style={{ width: DIMS[name].w, height: DIMS[name].h }}>{SCREENS[name]}</div>
      <div className="fs-glass" style={{ width: DIMS[name].w, height: DIMS[name].h }} />
    </div>)}
  </div></div>;
}
