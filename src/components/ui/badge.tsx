import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-sans font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-neutral-100,#f0f0f0)] text-[var(--color-neutral-900,#333333)]",
        tagline:
          "border-transparent bg-[var(--color-neutral-100,#f0f0f0)] text-[var(--color-neutral-900,#333333)]",
        primary:
          "border-transparent bg-[var(--color-neutral-200,#dbdbdb)] text-[var(--color-neutral-900,#333333)]",
        secondary:
          "border-transparent bg-[var(--color-secondary-100,#ebe3fc)] text-[var(--color-secondary-500,#520df2)]",
        accent:
          "border-transparent bg-[var(--color-accent-100,#fcf3e3)] text-[var(--color-accent-700,#a76c07)]",
        mono:
          "border-[var(--color-neutral-200,#dbdbdb)] bg-transparent text-[var(--color-neutral-700,#575757)] font-mono text-[12px] px-2 py-0.5 rounded-[4px]",
        mint:
          "border-transparent bg-[var(--color-accent-100,#fcf3e3)] text-[var(--color-accent-700,#a76c07)]",
        teal:
          "border-transparent bg-[var(--color-secondary-100,#ebe3fc)] text-[var(--color-secondary-700,#3809a4)]",
        blush:
          "border-transparent bg-[var(--color-secondary-200,#d0bff8)] text-[var(--color-secondary-900,#230c5a)]",
        destructive:
          "border-transparent bg-[var(--color-error,#ef4444)] text-white",
        outline:
          "border-[var(--color-neutral-200,#dbdbdb)] text-[var(--color-neutral-900,#333333)] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
