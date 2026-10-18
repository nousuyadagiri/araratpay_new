import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { AraratMark } from "@/components/ararat/AraratLogo";
import { SiteEnhancements } from "@/components/ararat/pages/SiteEnhancements";
import appCss from "../styles.css?url";
import familjenBold from "@fontsource/familjen-grotesk/files/familjen-grotesk-latin-700-normal.woff2?url";
import familjenSemiBold from "@fontsource/familjen-grotesk/files/familjen-grotesk-latin-600-normal.woff2?url";
import interRegular from "@fontsource/inter/files/inter-latin-400-normal.woff2?url";
import jetBrainsMonoRegular from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return <main className="not-found"><div className="shell"><AraratMark className="brand-mark not-found-mark" title="AraratPay"/><h1>404</h1><h2>Off the map. Not out of reach.</h2><p>This page may have moved, but the network is still here.</p><Button variant="brand" asChild><Link to="/">Back to AraratPay</Link></Button></div></main>;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="brand"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button variant="glass" asChild><Link to="/">Go home</Link></Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#FFFFFF" },
    ],
    links: [
      { rel: "preload", as: "font", type: "font/woff2", href: familjenBold, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: familjenSemiBold, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: interRegular, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: jetBrainsMonoRegular, crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <SiteEnhancements />
    </QueryClientProvider>
  );
}
