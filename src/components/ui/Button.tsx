import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: "bg-vain-primary text-vain-100 hover:bg-vain-primary/90",
      secondary: "bg-vain-500 hover:bg-vain-400 text-white",
      ghost: "bg-transparent hover:bg-white/5 text-white",
      outline:
        "bg-transparent border border-white/20 hover:border-white/40 text-white",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };

    return (
      <button
        className={`rounded-md font-medium transition-all duration-200 flex items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
