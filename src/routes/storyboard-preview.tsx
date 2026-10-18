import { createFileRoute } from "@tanstack/react-router";
import receivingShop from "@/assets/storyboard/frame-01.webp";
import sendingCity from "@/assets/storyboard/frame-02.webp";
import receivingCafe from "@/assets/storyboard/frame-03.webp";
import "@/components/ararat/storyboard-preview.css";

export const Route = createFileRoute("/storyboard-preview")({
  head: () => ({
    meta: [
      { title: "Storyboard review — Araratpay" },
      { name: "description", content: "Three cinematic receiving and sending key frames for Araratpay creative review." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: "Storyboard review — Araratpay" },
      { property: "og:description", content: "Candid lifestyle storyboard frames for Araratpay creative review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryboardPreview,
});

const frames = [
  { image: receivingShop, label: "01 · RECEIVING", caption: "Between customers, a shop owner glances at his phone and smiles. “+100 USDT received”.", alt: "A shop owner smiles at a small phone reading +100 USDT received, between customers at a warmly lit counter." },
  { image: sendingCity, label: "02 · SENDING", caption: "A quick payment mid-conversation on a golden-hour city walk, just before the phone returns to a pocket. “100 USDT sent”.", alt: "Two people converse on a sunset city walk; a small phone reads 100 USDT sent." },
  { image: receivingCafe, label: "03 · RECEIVING", caption: "A café owner checks an incoming payment while serving a customer. “+100 USDT received”.", alt: "A café owner checks a small phone reading +100 USDT received while serving coffee, with a blurred customer in front." },
];

function StoryboardPreview() {
  return <main className="storyboard-review">
    <div className="storyboard-review__inner">
      <h1>Araratpay — storyboard review</h1>
      <p className="storyboard-review__intro">Three AI-generated key frames · Illustrative payments</p>
      {frames.map((frame, index) => <figure key={frame.label}>
        <img src={frame.image} alt={frame.alt} width={1920} height={1080} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
        <figcaption><strong>{frame.label}</strong><p>{frame.caption}</p></figcaption>
      </figure>)}
    </div>
  </main>;
}