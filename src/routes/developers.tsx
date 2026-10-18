import { createFileRoute } from "@tanstack/react-router";
import { PageShell, pageHead } from "@/components/ararat/pages/PageShell";
import ApiDocs from "@/components/ararat/pages/ApiDocs";

export const Route = createFileRoute("/developers")({
  head: () => pageHead("Developers — API docs", "Explore illustrative AraratPay API docs for payments, payouts, conversions, settlements, cards and webhooks. Preview only; endpoints are not live.", "/developers"),
  component: () => <PageShell cta={false}><ApiDocs/></PageShell>,
});
