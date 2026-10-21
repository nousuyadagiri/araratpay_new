import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-md,0.375rem)] border border-[var(--color-neutral-200,#dbdbdb)] bg-white px-3 py-2 text-base text-[var(--color-neutral-900,#333333)] font-sans shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-neutral-400,#9e9e9e)] focus-visible:outline-none focus-visible:border-[var(--color-primary-700,#575757)] focus-visible:ring-1 focus-visible:ring-[var(--color-primary-700,#575757)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
