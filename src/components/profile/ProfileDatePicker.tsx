import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";

interface ProfileDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  max: string;
  minYear?: number;
}

type PickerView = "calendar" | "year" | "month";
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const toDateValue = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export default function ProfileDatePicker({ value, onChange, isOpen, onOpenChange, max, minYear = 1900 }: ProfileDatePickerProps) {
  const maxDate = useMemo(() => new Date(`${max}T00:00:00`), [max]);
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date(2000, 0, 1);
  const [visibleYear, setVisibleYear] = useState(initialDate.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(initialDate.getMonth());
  const [view, setView] = useState<PickerView>("calendar");
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onOpenChange(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen || !value) return;
    const selected = new Date(`${value}T00:00:00`);
    setVisibleYear(selected.getFullYear());
    setVisibleMonth(selected.getMonth());
    setView("calendar");
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen || view !== "year") return;
    const frame = window.requestAnimationFrame(() => selectedYearRef.current?.scrollIntoView({ block: "center" }));
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, view]);

  const changeMonth = (amount: number) => {
    const next = new Date(visibleYear, visibleMonth + amount, 1);
    if (next.getFullYear() < minYear || next > maxDate) return;
    setVisibleYear(next.getFullYear());
    setVisibleMonth(next.getMonth());
  };

  const firstDay = new Date(visibleYear, visibleMonth, 1).getDay();
  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const years = Array.from({ length: maxDate.getFullYear() - minYear + 1 }, (_, index) => maxDate.getFullYear() - index);
  const formattedValue = value
    ? (() => { const [year, month, day] = value.split("-"); return `${year}년 ${Number(month)}월 ${Number(day)}일`; })()
    : "생년월일 선택";

  const sheet = isOpen ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center" role="presentation">
      <button className="absolute inset-0 cursor-default bg-[#17203b]/35 backdrop-blur-[2px]" aria-label="달력 닫기" onClick={() => onOpenChange(false)} type="button" />
      <section className="relative z-10 flex max-h-[82dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[30px] bg-[#f8fbff] shadow-[0_-18px_55px_rgba(26,62,93,0.2)]" aria-labelledby="birth-date-title" aria-modal="true" role="dialog">
        <div className="flex justify-center pt-3" aria-hidden="true"><span className="h-1 w-10 rounded-full bg-[#d9e4ee]" /></div>
        <header className="flex items-center justify-between px-6 pb-4 pt-4">
          <div><p className="text-[10px] font-bold text-[#55aceb]">Quespot 프로필</p><h2 className="mt-1 text-[19px] font-extrabold tracking-[-0.45px] text-[#202943]" id="birth-date-title">생년월일을 선택해주세요</h2></div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#8794a2] shadow-sm ring-1 ring-[#e8eff5]" aria-label="닫기" onClick={() => onOpenChange(false)} type="button"><X aria-hidden="true" size={18} /></button>
        </header>

        <div className="overflow-y-auto overscroll-contain px-5 pb-[max(26px,env(safe-area-inset-bottom))]">
          <div className="rounded-[22px] border border-[#e3ebf2] bg-white p-4 shadow-[0_6px_22px_rgba(62,102,142,0.07)]">
            <div className="mb-4 flex items-center justify-between">
              <button className="grid h-9 w-9 place-items-center rounded-full bg-[#f1f7fc] text-[#6c8294] disabled:opacity-30" aria-label="이전 달" disabled={visibleYear === minYear && visibleMonth === 0} onClick={() => changeMonth(-1)} type="button"><ChevronLeft aria-hidden="true" size={18} /></button>
              <div className="flex gap-1.5">
                <button className={`rounded-xl px-3 py-2 text-[13px] font-extrabold ${view === "year" ? "bg-[#5bb5f8] text-white" : "bg-[#edf7ff] text-[#329fe8]"}`} onClick={() => setView(view === "year" ? "calendar" : "year")} type="button">{visibleYear}년</button>
                <button className={`rounded-xl px-3 py-2 text-[13px] font-extrabold ${view === "month" ? "bg-[#5bb5f8] text-white" : "bg-[#edf7ff] text-[#329fe8]"}`} onClick={() => setView(view === "month" ? "calendar" : "month")} type="button">{visibleMonth + 1}월</button>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-[#f1f7fc] text-[#6c8294] disabled:opacity-30" aria-label="다음 달" disabled={visibleYear === maxDate.getFullYear() && visibleMonth >= maxDate.getMonth()} onClick={() => changeMonth(1)} type="button"><ChevronRight aria-hidden="true" size={18} /></button>
            </div>

            {view === "year" ? (
              <div className="grid max-h-[280px] grid-cols-4 gap-2 overflow-y-auto pr-1">
                {years.map((year) => <button className={`h-10 rounded-xl text-[12px] font-bold ${year === visibleYear ? "bg-[#5bb5f8] text-white" : "bg-[#f5f8fb] text-[#657382]"}`} key={year} onClick={() => { setVisibleYear(year); if (year === maxDate.getFullYear() && visibleMonth > maxDate.getMonth()) setVisibleMonth(maxDate.getMonth()); setView("month"); }} ref={year === visibleYear ? selectedYearRef : undefined} type="button">{year}</button>)}
              </div>
            ) : view === "month" ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, month) => {
                  const disabled = visibleYear === maxDate.getFullYear() && month > maxDate.getMonth();
                  return <button className={`h-12 rounded-[14px] text-[12px] font-bold disabled:opacity-30 ${month === visibleMonth ? "bg-[#5bb5f8] text-white" : "bg-[#f5f8fb] text-[#657382]"}`} disabled={disabled} key={month} onClick={() => { setVisibleMonth(month); setView("calendar"); }} type="button">{month + 1}월</button>;
                })}
              </div>
            ) : (
              <>
                <div className="mb-1 grid grid-cols-7 text-center">{weekDays.map((day, index) => <span className={`py-2 text-[10px] font-bold ${index === 0 ? "text-[#ef7b7b]" : index === 6 ? "text-[#5aaee8]" : "text-[#9aa5af]"}`} key={day}>{day}</span>)}</div>
                <div className="grid grid-cols-7 gap-y-1">
                  {Array.from({ length: firstDay }, (_, index) => <span aria-hidden="true" className="h-10" key={`empty-${index}`} />)}
                  {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
                    const dateValue = toDateValue(visibleYear, visibleMonth, day);
                    const disabled = new Date(visibleYear, visibleMonth, day) > maxDate;
                    const selected = value === dateValue;
                    return <button className={`relative mx-auto grid h-10 w-10 place-items-center rounded-full text-[12px] font-bold transition disabled:opacity-25 ${selected ? "bg-[#5bb5f8] text-white shadow-[0_4px_10px_rgba(66,164,230,0.28)]" : "text-[#536171] hover:bg-[#edf7ff]"}`} disabled={disabled} key={day} onClick={() => { onChange(dateValue); onOpenChange(false); }} type="button">{day}{selected ? <Check className="absolute -right-0.5 -top-0.5 rounded-full bg-white p-0.5 text-[#46a8eb]" aria-hidden="true" size={13} strokeWidth={3} /> : null}</button>;
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  ) : null;

  return (
    <div className="grid gap-2">
      <span className="type-caption3 text-[#556171]">생년월일 <b className="text-[#51aceb]">*</b></span>
      <button className={`flex h-[50px] w-full items-center gap-2 rounded-[15px] border bg-[#f7faff] px-[15px] text-left outline-none transition focus-visible:border-[#63b8f2] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#5bb5f8]/10 ${value ? "border-[#d7e8f4] text-[#222b45]" : "border-[#e4edf5] text-[#aab7c5]"}`} aria-expanded={isOpen} aria-haspopup="dialog" aria-required="true" onClick={() => onOpenChange(true)} type="button">
        <CalendarDays className="shrink-0 text-[#68b5e8]" aria-hidden="true" size={17} />
        <span className="type-body2 min-w-0 flex-1 truncate">{formattedValue}</span>
        <ChevronDown className={`shrink-0 text-[#8b99a8] transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" size={16} />
      </button>
      {sheet}
    </div>
  );
}
