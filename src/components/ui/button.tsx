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
          "rounded-[var(--radius-button,8px)] bg-[var(--color-clay,#d97757)] text-white hover:bg-[var(--color-clay-deep,#c6613f)] active:bg-[var(--color-clay-deep,#c6613f)] shadow-none",
        destructive:
          "rounded-[var(--radius-button,8px)] bg-destructive text-destructive-foreground shadow-none hover:bg-destructive/90",
        outline:
          "glass-button rounded-[var(--radius-button-outline,12px)] border border-[var(--color-cloud-dark,#87867f)] bg-transparent text-foreground hover:bg-[var(--surface-secondary)] shadow-none",
        filledIvory:
          "button-filled-ivory rounded-t-0 rounded-b-[var(--radius-button,8px)] bg-[var(--color-ivory-light,#faf9f5)] text-[var(--color-slate-dark,#141413)] hover:opacity-90 shadow-none",
        secondary:
          "rounded-[var(--radius-button,8px)] border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-none",
        ghost: "rounded-[var(--radius-button,8px)] text-foreground hover:bg-secondary hover:text-foreground",
        link: "rounded-[var(--radius-link,0px)] text-foreground underline underline-offset-4 hover:underline",
        brand: "brand-button text-white",
        glass: "glass-button text-foreground",
        nav: "nav-button rounded-[var(--radius-nav,0px)] text-foreground hover:underline",
        iconGlass: "glass-button text-foreground",
        menuItem: "menu-item text-foreground",
        mobileNav: "mobile-nav-button text-foreground",
        mobileSubnav: "mobile-subnav-button text-muted-foreground",
        textLink: "text-link-button text-foreground",
      },
      size: {
        default: "h-10 px-4 py-2 text-[14px]",
        sm: "h-8 rounded-[var(--radius-button,8px)] px-3 text-xs",
        lg: "h-11 rounded-[var(--radius-button,8px)] px-6 text-[15px]",
        icon: "h-9 w-9 rounded-[var(--radius-button,8px)]",
        nav: "h-9 px-4 text-[14px] rounded-[var(--radius-nav,0px)]",
        hero: "h-11 px-6 text-[14px] font-semibold rounded-[var(--radius-button,8px)]",
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
