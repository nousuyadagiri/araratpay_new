import { createFileRoute } from "@tanstack/react-router";
import SolutionsPrismPage from "@/components/ararat/solutions/SolutionsPrismPage";
import { pageHead } from "@/components/ararat/pages/PageShell";

export const Route = createFileRoute("/solutions")({
  head: () => pageHead("Industry solutions", "See how one AraratPay account connects four payment flows for e-commerce, SaaS, marketplaces, remittance, gaming and freelance platforms.", "/solutions"),
  component: SolutionsPrismPage,
});
