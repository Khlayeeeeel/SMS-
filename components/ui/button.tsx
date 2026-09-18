import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variants = {
      primary: "bg-secondary-container text-deep-charcoal hover:bg-secondary-fixed-dim font-bold shadow-sm",
      secondary: "bg-primary text-on-primary hover:bg-primary-container font-bold shadow-sm",
      outline: "border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold bg-transparent",
      ghost: "text-primary hover:bg-primary-container/5 font-bold border border-transparent",
    };
    const sizes = {
      default: "px-6 py-3 text-label-sm",
      sm: "px-4 py-2 text-label-sm",
      lg: "px-8 py-4 text-label-sm",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded transition-colors duration-200 scale-95 active:scale-90 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
