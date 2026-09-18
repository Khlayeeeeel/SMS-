import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-label-sm font-label-sm font-medium",
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
export { Badge };
