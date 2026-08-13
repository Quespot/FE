import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from "react";
import { Landmark, MapPin, Search } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "disabled";
  icon?: ReactNode;
};

const buttonVariantClasses = {
  primary: "bg-[var(--primary)] text-white",
  secondary: "border-[1px_solid_#dbe8f8] bg-[#f5faff] text-[var(--primary)]",
  disabled: "bg-[#d2d3d4] text-white cursor-default",
  ghost: "",
} as const;

export function Button({
  children,
  className="",
  icon,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center w-full min-h-[34px] rounded-[10px] p-[0_14px] text-[13px] font-black whitespace-nowrap w-[auto] min-h-8 rounded-[14px] text-xs gap-2 min-h-13 rounded-2xl text-sm ${buttonVariantClasses[variant]} ${className}`}
      type="button"
      {...props}
    >
      {icon ? <span className="inline-flex items-center justify-center">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <label className="grid gap-[3px] w-full text-[var(--muted)] text-[8px] font-bold gap-[7px] text-[13px]">
      <span>{label}</span>
      <input className="w-full min-h-8 border-[1px_solid_#dbe8f8] rounded-[10px] p-[0_13px] bg-[#f6faff] text-[var(--navy)] outline-none placeholder:text-[#c6d1e0] min-h-12 rounded-2xl text-sm" {...props} />
    </label>
  );
}

export function Panel({
  children,
  className="",
}: PropsWithChildren<{ className?: string }>) {
  return <section className={`w-full border-[1px_solid_var(--sky-100)] rounded-2xl p-4 bg-white [box-shadow:0_1px_3px_rgba(0,_0,_0,_0.1)] ${className}`}>{children}</section>;
}

export function WireImage({
  label = "코스 이미지",
  tall = false,
}: {
  label?: string;
  tall?: boolean;
}) {
  return (
    <div className={`relative h-16 overflow-hidden rounded-[10px] bg-[#c5cedc] after:[content:''] after:absolute after:[inset:auto_0_0] after:h-[40%] after:bg-[#b8d8b8] h-[82px] rounded-2xl grid place-items-center text-[rgba(8,_37,_95,_0.5)] ${tall ? "" : ""}`}>
      <Landmark className="relative z-10" size={20} strokeWidth={2.4} />
      <span className="absolute z-10 top-[8px] left-[8px] text-[rgba(8,_37,_95,_0.6)] text-[8px] font-bold top-[auto] bottom-[8px] text-[rgba(8,_37,_95,_0.68)]">{label}</span>
      <i className="absolute left-[10px] right-[10px] top-[50%] h-[5px] rounded-full bg-[rgba(255,_255,_255,_0.45)]" />
    </div>
  );
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <label className="flex items-center gap-2 h-8 p-[0_12px] border-[1px_solid_#dbe8f8] rounded-2xl bg-[var(--sky-50)] h-[46px] rounded-[18px] p-[0_14px] bg-white text-[var(--muted-2)] [box-shadow:0_1px_5px_rgba(8,_37,_95,_0.08)] min-h-11 mt-[-4px] border-[1px_solid_#dce8f5] rounded-[17px] p-[0_18px] text-[#9aa8bb] [box-shadow:0_3px_9px_rgba(8,_37,_95,_0.08)]">
      <Search size={16} strokeWidth={2.4} />
      <input className="w-full border-0 bg-transparent text-[var(--navy)] text-[9px] outline-none text-[13px] text-[var(--ink)]" placeholder={placeholder} />
    </label>
  );
}

export function LocationBadge({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center gap-1 w-fit rounded-full p-[5px_9px] bg-[rgba(255,_255,_255,_0.82)] text-[var(--primary)] text-[11px] font-black p-[3px_7px] text-[10px]">
      <MapPin size={13} strokeWidth={2.4} />
      {children}
    </span>
  );
}

