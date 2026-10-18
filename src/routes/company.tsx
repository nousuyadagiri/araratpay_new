import { lazy } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageShell, pageHead } from '@/components/ararat/pages/PageShell';
import { NearMount } from '@/components/ararat/NearMount';
import manifestoPoster from '@/assets/company/manifesto-poster.jpg.asset.json';
import '@/components/ararat/pages/company.css';

const CompanyManifesto = lazy(() => import('@/components/ararat/pages/CompanyManifesto'));
const CompanyStory = lazy(() => import('@/components/ararat/pages/CompanyStory'));

export const Route = createFileRoute('/company')({
  head: () => {
    const head = pageHead('Company — AraratPay manifesto', 'Money should move like a message. Discover the ideas, connections and people behind one AraratPay platform and four payment flows.', '/company');
    return { ...head, meta: [...head.meta, { property: 'og:image', content: manifestoPoster.url }, { name: 'twitter:image', content: manifestoPoster.url }], links: [...head.links, { rel: 'preload', as: 'image', href: manifestoPoster.url, fetchPriority: 'high' as const }] };
  },
  component: CompanyPage,
});

function CompanyPage() {
  return <PageShell cta={false} overHero><CompanyManifesto/><NearMount minHeight={3600}><CompanyStory/></NearMount></PageShell>;
}
