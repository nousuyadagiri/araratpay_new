import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[6px] border border-[var(--color-pencil-gray,#B6B6B6)] bg-[var(--color-cream-paper,#FCFAF5)] px-3 py-2 text-base text-[var(--color-forest-ink,#1A3300)] font-sans shadow-none placeholder:text-[var(--color-muted-neutral,#4D6038)] focus-visible:outline-none focus-visible:border-[var(--color-forest-ink,#1A3300)] focus-visible:ring-1 focus-visible:ring-[var(--color-forest-ink,#1A3300)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
