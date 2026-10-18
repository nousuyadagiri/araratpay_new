import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { requestLayoutRefresh, useNearView } from "./perf";

/** Mounts (and thereby downloads) its lazy children once the placeholder is ~1 viewport away. */
export function NearMount({
  children,
  minHeight = 800,
  id,
}: {
  children: ReactNode;
  minHeight?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearView(ref, "100% 0px", true);
  useEffect(() => {
    if (!near) return undefined;
    const t = window.setTimeout(requestLayoutRefresh, 400);
    return () => window.clearTimeout(t);
  }, [near]);
  if (!near) return <div ref={ref} id={id} style={{ minHeight }} aria-hidden="true" />;
  return <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>;
}
