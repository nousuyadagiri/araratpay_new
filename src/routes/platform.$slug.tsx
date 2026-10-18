import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { products, type ProductSlug } from "@/components/ararat/products/productData";
import { cryptoInHero, cryptoOutHero, fiatOutHero, cardsHero } from "@/components/ararat/products/flowHeroFilms";

const CryptoInPage = lazy(() => import("@/components/ararat/products/CryptoInPage"));
const RemainingFlowPages = lazy(() => import("@/components/ararat/products/RemainingFlowPages"));

export const Route = createFileRoute("/platform/$slug")({
  loader: ({ params }) => {
    const product = products[params.slug as ProductSlug];
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Not found — AraratPay" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    const title = `${p.name} — AraratPay platform`;
    const poster = ({ "crypto-in": cryptoInHero, "crypto-out": cryptoOutHero, "fiat-out": fiatOutHero, cards: cardsHero })[p.slug].poster;
    const description = p.slug === "crypto-in"
      ? "Accept crypto through QR, payment links, checkout, invoices or API. One AraratPay balance, 7+ chains and a flat 1% fee."
      : p.slug === "crypto-out" ? "Pay suppliers, creators and teams from one crypto balance. See an illustrative batch payout flow with a flat 1% fee."
      : p.slug === "fiat-out" ? "Convert crypto to bank payouts in 180+ fiat currencies. See the rate before confirming and pay a flat 1% fee."
      : "Spend from one AraratPay balance with cards. Explore the illustrative card experience and flat 1% transaction fee; the experience shown is illustrative.";
    const canonicalUrl = `https://araratpay.vercel.app/platform/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: "AraratPay" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: poster },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:locale", content: "en_US" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: poster },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: ProductRoute,
  notFoundComponent: ProductNotFound,
});

function ProductRoute() {
  const { product } = Route.useLoaderData();
  if (product.slug === "crypto-in") return <Suspense fallback={<div style={{ minHeight: "100vh" }}/> }><CryptoInPage/></Suspense>;
  return <Suspense fallback={<div style={{ minHeight: "100vh" }}/> }><RemainingFlowPages slug={product.slug}/></Suspense>;
}

function ProductNotFound() {
  return <main className="shell" style={{ padding: "160px 0" }}><h1>Flow not found</h1></main>;
}
