import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import {
  Gift,
  Home,
  Landmark,
  Map,
  MapPin,
  Search,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "disabled";
  icon?: ReactNode;
};

export function Button({ children, className = "", icon, variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant} ${className}`} type="button" {...props}>
      {icon ? <span className="button-icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

export function Panel({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function WireImage({ label = "코스 이미지", tall = false }: { label?: string; tall?: boolean }) {
  return (
    <div className={`wire-image ${tall ? "wire-image-tall" : ""}`}>
      <Landmark className="wire-image-icon" size={20} strokeWidth={2.4} />
      <span>{label}</span>
      <i />
    </div>
  );
}

export type BottomNavKey = "home" | "mission" | "map" | "reward" | "my";

const navItems: Array<{ key: BottomNavKey; label: string; Icon: LucideIcon }> = [
  { key: "home", label: "홈", Icon: Home },
  { key: "mission", label: "미션", Icon: Target },
  { key: "map", label: "지도", Icon: Map },
  { key: "reward", label: "보상", Icon: Gift },
  { key: "my", label: "MY", Icon: UserRound },
];

export function BottomNav({
  active = "home",
  onSelect,
}: {
  active?: BottomNavKey;
  onSelect?: (key: BottomNavKey) => void;
}) {

  return (
    <nav className="bottom-nav" aria-label="앱 하단 메뉴">
      {navItems.map(({ Icon, key, label }) => (
        <button className={key === active ? "is-active" : ""} key={key} onClick={() => onSelect?.(key)} type="button">
          <Icon size={20} strokeWidth={2.4} />
          <strong>{label}</strong>
        </button>
      ))}
    </nav>
  );
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <label className="search-box">
      <Search size={16} strokeWidth={2.4} />
      <input placeholder={placeholder} />
    </label>
  );
}

export function LocationBadge({ children }: PropsWithChildren) {
  return (
    <span className="location-badge">
      <MapPin size={13} strokeWidth={2.4} />
      {children}
    </span>
  );
}
