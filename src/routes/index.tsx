import { createFileRoute } from "@tanstack/react-router";
import { lazy, useEffect, useRef, type ReactNode } from "react";
import SiteHeader from "@/components/ararat/SiteHeader";
import HeroSection from "@/components/ararat/HeroSection";
import Capabilities from "@/components/ararat/Capabilities";
import { MoneyFlow } from "@/components/ararat/StatsAndFlow";
import { UseCases } from "@/components/ararat/UseCasesAndSecurity";
import { useSiteAction } from "@/components/ararat/pages/PageShell";
import { NearMount } from "@/components/ararat/NearMount";
import heroPoster from "@/assets/videos/client-clear-poster.webp.asset.json";

// Below-the-fold sections download and mount ~1 viewport before they scroll into view.
const DashboardPreview = lazy(() => import("@/components/ararat/DashboardPreview"));
const SiteFooter = lazy(() => import("@/components/ararat/SiteFooter"));
const FeeCalculator = lazy(() =>
  import("@/components/ararat/FeesAndReasons").then((m) => ({ default: m.FeeCalculator })),
);
const WhyArarat = lazy(() => import("@/components/ararat/RadarComparison"));
const GlobalCoverage = lazy(() => import("@/components/ararat/GlobalCoverage"));
const SecurityAndDev = lazy(() => import("@/components/ararat/SecurityAndDev"));
const TrustAndFAQ = lazy(() => import("@/components/ararat/TrustAndFAQ"));
const FinalCTA = lazy(() =>
  import("@/components/ararat/ClosingSections").then((m) => ({ default: m.FinalCTA })),
);

function Sheet({ children, fullScreen = false }: { children: ReactNode; fullScreen?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.dataset["entered"] = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`home-sheet${fullScreen ? " home-screen-sheet" : ""}`}>
      {children}
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AraratPay — Business Payments, Powered by Crypto" },
      {
        name: "description",
        content:
          "One AraratPay platform, four flows: accept crypto, pay out, settle to your bank and spend with cards from one account.",
      },
      { property: "og:site_name", content: "AraratPay" },
      { property: "og:title", content: "AraratPay — Business Payments, Powered by Crypto" },
      {
        property: "og:description",
        content:
          "One AraratPay platform, four flows: accept crypto, pay out, settle to your bank and spend with cards from one account.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://araratpay.vercel.app/" },
      { property: "og:image", content: "https://araratpay.vercel.app/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AraratPay — Business Payments, Powered by Crypto" },
      {
        name: "twitter:description",
        content:
          "One AraratPay platform, four flows: accept crypto, pay out, settle to your bank and spend with cards from one account.",
      },
      { name: "twitter:image", content: "https://araratpay.vercel.app/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://araratpay.vercel.app/" },
      { rel: "preload", as: "image", href: heroPoster.url, fetchPriority: "high" },
    ],
  }),
  component: Index,
});

function Index() {
  const action = useSiteAction();
  return (
    <>
      <SiteHeader onAction={action} overHero />
      <main className="home-sheets">
        <HeroSection onAction={action} />
        <Sheet fullScreen>
          <MoneyFlow />
        </Sheet>
        <Sheet fullScreen>
          <Capabilities />
        </Sheet>
        <Sheet fullScreen>
          <NearMount minHeight={620}>
            <DashboardPreview />
          </NearMount>
        </Sheet>
        <Sheet fullScreen>
          <UseCases />
        </Sheet>
        <Sheet>
          <NearMount minHeight={700} id="pricing">
            <FeeCalculator />
          </NearMount>
        </Sheet>
        <Sheet>
          <NearMount minHeight={550}>
            <WhyArarat />
          </NearMount>
        </Sheet>
        <Sheet>
          <NearMount minHeight={650} id="coverage">
            <GlobalCoverage />
          </NearMount>
        </Sheet>
        <Sheet>
          <NearMount minHeight={650} id="developers">
            <SecurityAndDev onAction={action} />
          </NearMount>
        </Sheet>
        <Sheet>
          <NearMount minHeight={480} id="faq">
            <TrustAndFAQ />
          </NearMount>
        </Sheet>
        <Sheet>
          <NearMount minHeight={330}>
            <FinalCTA onAction={action} />
          </NearMount>
        </Sheet>
        <Sheet>
          <NearMount minHeight={490}>
            <SiteFooter onAction={action} />
          </NearMount>
        </Sheet>
      </main>
    </>
  );
}
