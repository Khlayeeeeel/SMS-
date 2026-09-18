import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-technical-blue focus:ring-2 focus:ring-technical-blue/20 transition-shadow",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
