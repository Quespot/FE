import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonSize = "sm" | "md" | "lg";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[12px] rounded-full",
  md: "w-full p-3 text-[12px] rounded-xl",
  lg: "w-full p-4 text-[14px] rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "red" | "redSecondary" | "greenSecondary";
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  primary: "bg-primary text-white",
  secondary: "bg-[#EAF5FF] text-primary",
  red: "bg-[#E7000B] text-white",
  redSecondary: "bg-[#FEE2E2] text-[#EF4444]",
  greenSecondary: "bg-[#E8FBF3] text-[#059669]",
};

export default function Button({
  children,
  variant = "primary",
  size = "lg",
  isLoading = false,
  disabled,
  type = "button",
  className = "",
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        flex justify-center items-center gap-1 font-bold whitespace-nowrap text-center
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
        disabled:bg-[#D2D3D4]
      `}
      {...props}
    >
      {icon ? <span>{icon}</span> : null}
      {isLoading ? "처리 중..." : children}
    </button>
  );
}
