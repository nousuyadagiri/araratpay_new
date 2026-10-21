import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-sans font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-md,0.375rem)] bg-[var(--color-primary-700,#575757)] text-white hover:bg-[var(--color-primary-800,#424242)] active:bg-[var(--color-primary-800,#424242)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] border-none",
        destructive:
          "rounded-[var(--radius-md,0.375rem)] bg-[var(--color-error,#ef4444)] text-white shadow-none hover:bg-[var(--color-error,#ef4444)]/90",
        outline:
          "glass-button rounded-[var(--radius-md,0.375rem)] border border-[var(--color-neutral-700,#575757)] bg-white text-[var(--color-neutral-900,#333333)] hover:bg-[var(--color-neutral-100,#f0f0f0)] shadow-none",
        filledIvory:
          "button-filled-ivory rounded-[var(--radius-md,0.375rem)] bg-white text-[var(--color-neutral-900,#333333)] border border-[var(--color-neutral-200,#dbdbdb)] hover:bg-[var(--color-neutral-100,#f0f0f0)]",
        secondary:
          "rounded-[var(--radius-md,0.375rem)] border border-[var(--color-neutral-200,#dbdbdb)] bg-[var(--color-neutral-100,#f0f0f0)] text-[var(--color-neutral-900,#333333)] hover:bg-[var(--color-neutral-200,#dbdbdb)]",
        pastelMint:
          "rounded-[var(--radius-md,0.375rem)] bg-[var(--color-accent-100,#fcf3e3)] text-[var(--color-accent-700,#a76c07)] hover:opacity-90 border border-transparent",
        pastelTeal:
          "rounded-[var(--radius-md,0.375rem)] bg-[var(--color-secondary-100,#ebe3fc)] text-[var(--color-secondary-700,#3809a4)] hover:opacity-90 border border-transparent",
        pastelBlush:
          "rounded-[var(--radius-md,0.375rem)] bg-[var(--color-secondary-200,#d0bff8)] text-[var(--color-secondary-900,#230c5a)] hover:opacity-90 border border-transparent",
        ghost:
          "rounded-[var(--radius-md,0.375rem)] bg-transparent text-[var(--color-neutral-900,#333333)] hover:bg-[var(--color-neutral-100,#f0f0f0)]",
        link:
          "text-[var(--color-neutral-900,#333333)] underline underline-offset-4 hover:opacity-80 p-0 h-auto font-sans",
        brand:
          "brand-button rounded-[var(--radius-md,0.375rem)] bg-[var(--color-primary-700,#575757)] text-white hover:bg-[var(--color-primary-800,#424242)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        glass:
          "glass-button rounded-[var(--radius-md,0.375rem)] border border-[var(--color-neutral-700,#575757)] bg-white text-[var(--color-neutral-900,#333333)] hover:bg-[var(--color-neutral-100,#f0f0f0)] shadow-none",
        nav:
          "nav-button rounded-[var(--radius-md,0.375rem)] text-foreground hover:bg-[var(--color-neutral-100,#f0f0f0)]",
        iconGlass:
          "glass-button text-foreground rounded-[var(--radius-md,0.375rem)] border border-[var(--color-neutral-200,#dbdbdb)]",
        menuItem:
          "menu-item text-foreground rounded-[var(--radius-md,0.375rem)]",
        mobileNav:
          "mobile-nav-button text-foreground",
        mobileSubnav:
          "mobile-subnav-button text-muted-foreground",
        textLink:
          "text-link-button text-[var(--color-neutral-900,#333333)]",
      },
      size: {
        default: "h-10 px-4 py-2 text-[14px] rounded-[var(--radius-md,0.375rem)]",
        sm: "h-8 rounded-[var(--radius-md,0.375rem)] px-3 text-xs",
        lg: "h-12 rounded-[var(--radius-md,0.375rem)] px-6 text-[16px]",
        icon: "h-9 w-9 rounded-[var(--radius-md,0.375rem)]",
        nav: "h-9 px-4 text-[14px] rounded-[var(--radius-md,0.375rem)]",
        hero: "min-h-[50px] px-8 py-3 text-[16px] font-medium rounded-[var(--radius-md,0.375rem)]",
        cta: "min-h-[54px] px-10 py-4 text-[16px] font-medium rounded-[var(--radius-md,0.375rem)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
