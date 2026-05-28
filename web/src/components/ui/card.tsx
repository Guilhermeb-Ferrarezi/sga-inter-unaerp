import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative bg-white border-[1.5px] border-border-strong shadow-brutal",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
