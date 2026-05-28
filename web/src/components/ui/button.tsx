import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display italic font-black uppercase tracking-[0.1em] transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-white hover:translate-x-[-2px] hover:translate-y-[-2px] [box-shadow:4px_4px_0_#A4CD3A] hover:[box-shadow:6px_6px_0_#A4CD3A]",
        secondary:
          "bg-lime text-navy hover:translate-x-[-2px] hover:translate-y-[-2px] [box-shadow:4px_4px_0_#0A1A3D] hover:[box-shadow:6px_6px_0_#0A1A3D]",
        ghost:
          "bg-transparent text-navy border-2 border-navy hover:bg-navy hover:text-white",
        blue:
          "bg-blue text-white hover:bg-blue-deep [box-shadow:3px_3px_0_#0A1A3D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:[box-shadow:4px_4px_0_#0A1A3D]",
        link: "text-blue underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-3 py-2 text-[11px]",
        md: "px-5 py-3 text-[12px]",
        lg: "px-6 py-3.5 text-[12.5px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
