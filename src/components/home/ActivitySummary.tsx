type ActivitySummaryItem = {
  value: string;
  label: string;
};

type ActivitySummaryProps = {
  items: ActivitySummaryItem[];
};

export default function ActivitySummary({ items }: ActivitySummaryProps) {
  return (
    <section
      className="grid grid-cols-4 overflow-hidden rounded-[18px] bg-white px-1.5 shadow-[0_2px_8px_rgba(8,37,95,0.08)]"
      aria-label="활동 요약"
    >
      {items.map((item) => (
        <article
          className="grid min-h-[70px] justify-items-center gap-[5px] border-r border-[#e8eff8] py-4 text-center last:border-r-0"
          key={item.label}
        >
          <strong className="text-[18px] font-black leading-none text-[#5bb5f8]">
            {item.value}
          </strong>
          <span className="text-[10px] font-bold text-[#8b98aa]">
            {item.label}
          </span>
        </article>
      ))}
    </section>
  );
}