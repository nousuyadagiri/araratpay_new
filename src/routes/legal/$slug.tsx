import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell, PageIntro, pageHead } from "@/components/ararat/pages/PageShell";
import { legalPages } from "@/components/ararat/pages/legalData";
export const Route = createFileRoute("/legal/$slug")({
 loader: ({ params }) => { const page = legalPages[params.slug as keyof typeof legalPages]; if (!page) throw notFound(); return { page }; },
 head: ({ loaderData, params }) => loaderData ? pageHead(loaderData.page.title, loaderData.page.description, `/legal/${params.slug}`) : { meta: [{ title: "Not found | AraratPay" }, { name: "robots", content: "noindex" }] },
 component: LegalPage,
 errorComponent: () => <div className="shell inner-hero-copy"><h1>This page didn't load.</h1></div>,
 notFoundComponent: () => <div className="shell inner-hero-copy"><h1>Page not found.</h1></div>,
});
function LegalPage() { const { page } = Route.useLoaderData(); return <PageShell cta={false}><PageIntro eyebrow="LEGAL / ARARATPAY" title={page.title} description="Content pending legal review."/><section className="page-section"><div className="shell legal-layout"><nav className="legal-toc" aria-label="On this page"><span className="mono-label">ON THIS PAGE</span>{page.sections.map((s,i) => <a href={`#section-${i}`} key={s}>{String(i+1).padStart(2,"0")} / {s}</a>)}</nav><div className="legal-body"><div className="legal-notice"><strong>Content pending legal review.</strong><p>This page is a structural preview, not a binding policy or agreement.</p></div>{page.sections.map((s,i) => <section id={`section-${i}`} key={s}><span className="mono-label">{String(i+1).padStart(2,"0")} / {page.title.toUpperCase()}</span><h2>{s}</h2><p>Content pending legal review.</p></section>)}</div></div></section></PageShell>; }
