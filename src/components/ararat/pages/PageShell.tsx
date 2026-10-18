import { type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import { FinalCTA } from "../ClosingSections";

export function useSiteAction() {
  const navigate = useNavigate();
  return (name: string) => {
    const contact =
      /get started|start accepting|log in|talk to sales|book a walkthrough|contact sales|newsletter|email|contact|careers/i.test(
        name,
      );
    const path = contact
      ? "/contact"
      : /pricing|fee/i.test(name)
        ? "/pricing"
        : /security|audit|bug bounty/i.test(name)
          ? "/security"
          : /solution/i.test(name)
            ? "/solutions"
            : /company|about|blog|licensing/i.test(name)
              ? "/company"
              : /faq/i.test(name)
                ? "/faq"
                : /linkedin|github/i.test(name)
                  ? "/company"
                  : "/developers";
    if (path === "/contact") navigate({ to: "/contact", search: { interest: name } });
    else navigate({ to: path });
  };
}

export function PageShell({
  children,
  cta = true,
  overHero = false,
}: {
  children: ReactNode;
  cta?: boolean;
  overHero?: boolean;
}) {
  const action = useSiteAction();
  return (
    <>
      <SiteHeader onAction={action} overHero={overHero} />
      <main>
        {children}
        {cta && <FinalCTA onAction={action} />}
      </main>
      <SiteFooter onAction={action} />
    </>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="inner-hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="shell inner-hero-copy">
        <span className="mono-label">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function DetailRows({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="detail-rows">
      {items.map((item, i) => (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="detail-row"
          key={item.title}
        >
          <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </motion.article>
      ))}
    </div>
  );
}
export const SITE_URL = "https://araratpay.vercel.app";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const pageHead = (title: string, description: string, path: string, image?: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath}`;
  const fullTitle =
    title.includes("AraratPay") || title.includes("Araratpay") ? title : `${title} | AraratPay`;
  const imageUrl = image || DEFAULT_OG_IMAGE;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:site_name", content: "AraratPay" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
};
