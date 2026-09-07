import { useEffect, type ComponentType, type SVGProps } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";

type ChoiceIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>;

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  icon?: ChoiceIcon;
}

export interface ChoiceGroup {
  label: string;
  options: ChoiceOption[];
}

interface ProfileChoiceSelectProps {
  label: string;
  placeholder: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  groups: ChoiceGroup[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  required?: boolean;
  layout?: "grid" | "list";
}

export default function ProfileChoiceSelect({
  label,
  placeholder,
  title,
  value,
  onChange,
  groups,
  isOpen,
  onOpenChange,
  required = false,
  layout = "list",
}: ProfileChoiceSelectProps) {
  const selectedOption = groups.flatMap((group) => group.options).find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  const sheet = isOpen ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center" role="presentation">
      <button className="absolute inset-0 cursor-default bg-[#17203b]/35 backdrop-blur-[2px]" aria-label="선택 창 닫기" onClick={() => onOpenChange(false)} type="button" />
      <section className="relative z-10 flex max-h-[82dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[30px] bg-[#f8fbff] shadow-[0_-18px_55px_rgba(26,62,93,0.2)]" aria-labelledby="choice-sheet-title" aria-modal="true" role="dialog">
        <div className="flex justify-center pt-3" aria-hidden="true"><span className="h-1 w-10 rounded-full bg-[#d9e4ee]" /></div>
        <header className="flex items-center justify-between px-6 pb-4 pt-4">
          <div><p className="text-[10px] font-bold text-[#55aceb]">Quespot 프로필</p><h2 className="mt-1 text-[19px] font-extrabold tracking-[-0.45px] text-[#202943]" id="choice-sheet-title">{title}</h2></div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#8794a2] shadow-sm ring-1 ring-[#e8eff5]" aria-label="닫기" onClick={() => onOpenChange(false)} type="button"><X aria-hidden="true" size={18} /></button>
        </header>

        <div className="overflow-y-auto overscroll-contain px-5 pb-[max(26px,env(safe-area-inset-bottom))]">
          <div className="grid gap-4">
            {groups.map((group) => (
              <section key={group.label}>
                {group.label ? <h3 className="mb-2 px-1 text-[10px] font-extrabold tracking-[0.02em] text-[#8b98a6]">{group.label}</h3> : null}
                <div className={layout === "grid" ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
                  {group.options.map((option) => {
                    const Icon = option.icon;
                    const selected = value === option.value;
                    return (
                      <button
                        className={`relative flex min-h-[52px] items-center gap-3 rounded-[16px] border px-3.5 py-3 text-left transition active:scale-[0.98] ${selected ? "border-[#67baf2] bg-[#eaf7ff] text-[#258fd6] shadow-[0_4px_12px_rgba(73,162,222,0.11)]" : "border-[#e3ebf2] bg-white text-[#4f5b69] hover:border-[#b9ddf5]"}`}
                        key={option.value}
                        onClick={() => { onChange(option.value); onOpenChange(false); }}
                        type="button"
                      >
                        {Icon ? <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[12px] ${selected ? "bg-[#5bb5f8] text-white" : "bg-[#eef6fc] text-[#64aee0]"}`}><Icon aria-hidden="true" size={18} strokeWidth={2.2} /></span> : null}
                        <span className="min-w-0 flex-1"><strong className="block text-[12px] font-extrabold">{option.label}</strong>{option.description ? <small className="mt-0.5 block text-[9.5px] text-[#98a3ae]">{option.description}</small> : null}</span>
                        {selected ? <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#5bb5f8] text-white"><Check aria-hidden="true" size={12} strokeWidth={3} /></span> : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  ) : null;

  return (
    <div className="grid gap-2">
      <span className="text-[12px] font-bold text-[#556171]">{label} {required ? <b className="text-[#51aceb]">*</b> : <em className="font-medium not-italic text-[#9ba4af]">(선택)</em>}</span>
      <button
        className={`flex h-[50px] w-full items-center justify-between rounded-[15px] border bg-[#f7faff] px-[15px] text-left outline-none transition focus-visible:border-[#63b8f2] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#5bb5f8]/10 ${selectedOption ? "border-[#d7e8f4] text-[#222b45]" : "border-[#e4edf5] text-[#aab7c5]"}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-required={required}
        onClick={() => onOpenChange(true)}
        type="button"
      >
        <span className="type-body2 truncate">{selectedOption?.label ?? placeholder}</span>
        <ChevronDown className={`ml-2 shrink-0 text-[#8b99a8] transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" size={16} />
      </button>
      {sheet}
    </div>
  );
}
