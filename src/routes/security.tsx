import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NearMount } from "@/components/ararat/NearMount";
import { PageShell, pageHead } from "@/components/ararat/pages/PageShell";

const SecurityDive = lazy(() => import("@/components/ararat/pages/SecurityDive"));
const SecurityAfterDive = lazy(() => import("@/components/ararat/pages/SecurityAfterDive"));

export const Route = createFileRoute("/security")({
  head: () => pageHead("Security dive", "Go inside the five layers of AraratPay security, with clear progress and candid compliance status.", "/security"),
  component: SecurityPage,
});

function SecurityPage() {
  return <PageShell cta={false} overHero><SecurityDive/><NearMount minHeight={1350}><SecurityAfterDive/></NearMount></PageShell>;
}
