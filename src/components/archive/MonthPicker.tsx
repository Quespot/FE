import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

type MonthPickerProps = {
  value: string;
  max: string;
  onChange: (value: string) => void;
};

const months = Array.from({ length: 12 }, (_, index) => index + 1);

export default function MonthPicker({ value, max, onChange }: MonthPickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const maxYear = Number(max.slice(0, 4));
  const maxMonth = Number(max.slice(5, 7));
  const selectedYear = value ? Number(value.slice(0, 4)) : maxYear;
  const selectedMonth = value ? Number(value.slice(5, 7)) : null;
  const [visibleYear, setVisibleYear] = useState(selectedYear);

  useEffect(() => {
    if (open) setVisibleYear(selectedYear);
  }, [open, selectedYear]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const selectMonth = (month: number) => {
    onChange(`${visibleYear}-${String(month).padStart(2, "0")}`);
    setOpen(false);
  };

  return (
    <div className="relative flex min-w-0 flex-1 gap-2" ref={rootRef}>
      <button
        aria-expanded={open}
        className={`flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[14px] border px-3 text-left transition ${open ? "border-[#69bbed] bg-white ring-2 ring-[#dff2fd]" : "border-[#dce8f1] bg-[#f7fbfe]"}`}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <CalendarDays className="shrink-0 text-[#50ace7]" size={16} strokeWidth={2.3} />
        <span className={`min-w-0 flex-1 truncate text-[11px] font-extrabold ${value ? "text-[#465e70]" : "text-[#8fa1ae]"}`}>
          {value ? `${selectedYear}년 ${selectedMonth}월` : "전체 기간"}
        </span>
      </button>
      {value ? <button aria-label="날짜 필터 초기화" className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#edf5f9] text-[#718697] transition active:scale-95" onClick={() => onChange("")} type="button"><X size={14} strokeWidth={2.4} /></button> : null}

      {open ? (
        <div className="absolute left-0 top-[48px] z-50 w-[272px] rounded-[22px] border border-[#dcebf4] bg-white p-4 shadow-[0_16px_42px_rgba(38,76,104,0.22)]">
          <div className="flex items-center justify-between">
            <button aria-label="이전 연도" className="grid h-8 w-8 place-items-center rounded-full bg-[#eef7fc] text-[#5aaee3] transition active:scale-95" onClick={() => setVisibleYear((year) => year - 1)} type="button"><ChevronLeft size={16} /></button>
            <strong className="text-[14px] font-black text-[#30485c]">{visibleYear}년</strong>
            <button aria-label="다음 연도" className="grid h-8 w-8 place-items-center rounded-full bg-[#eef7fc] text-[#5aaee3] transition enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-30" disabled={visibleYear >= maxYear} onClick={() => setVisibleYear((year) => Math.min(year + 1, maxYear))} type="button"><ChevronRight size={16} /></button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {months.map((month) => {
              const selected = selectedYear === visibleYear && selectedMonth === month;
              const disabled = visibleYear > maxYear || (visibleYear === maxYear && month > maxMonth);
              return <button className={`h-10 rounded-[12px] text-[11px] font-extrabold transition ${selected ? "bg-[#55b3eb] text-white shadow-[0_5px_12px_rgba(55,161,226,.28)]" : "bg-[#f2f8fc] text-[#647b8d] hover:bg-[#e3f3fc]"} disabled:cursor-not-allowed disabled:bg-[#f6f8f9] disabled:text-[#c6d0d7]`} disabled={disabled} key={month} onClick={() => selectMonth(month)} type="button">{month}월</button>;
            })}
          </div>
          <button className="mt-3 h-9 w-full rounded-[12px] bg-[#edf5f9] text-[10px] font-extrabold text-[#718697]" onClick={() => { onChange(""); setOpen(false); }} type="button">전체 기간 보기</button>
        </div>
      ) : null}
    </div>
  );
}
