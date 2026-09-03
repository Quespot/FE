import type { CouponItem } from "@/data/reward";

type CouponCardProps = {
  coupon: CouponItem;
};

export default function CouponCard({ coupon }: CouponCardProps) {
  const isUsed = coupon.status === "used";
  const canUse = coupon.status === "available" && coupon.usable;

  return (
    <article
      className={[
        "flex h-[76px] shrink-0 overflow-hidden rounded-[16px] border border-[#EAF5FF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        isUsed ? "opacity-45" : "",
      ].join(" ")}
    >
      <div className="grid h-full w-[68px] shrink-0 place-items-center bg-[#DFF3FF] text-[28px]">
        {coupon.emoji}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-[10px] px-[14px]">
        <div className="min-w-0">
          <h2 className="m-0 truncate text-[13px] font-black leading-[18px] text-[#1C1C3A]">
            {coupon.title}
          </h2>

          <p className="m-0 mt-[2px] truncate text-[14px] font-black leading-[19px] text-[#5BB5F8]">
            {coupon.benefit}
          </p>

          <p className="m-0 mt-[4px] text-[10px] font-medium leading-[14px] text-[#A2A9B2]">
            ~{coupon.expireDate}
          </p>
        </div>

        <button
          type="button"
          disabled={!canUse}
          className={[
            "h-[34px] shrink-0 rounded-full px-[14px] text-[12px] font-black leading-none transition",
            canUse
              ? "bg-[#5BB5F8] text-white active:scale-[0.98]"
              : "bg-[#F1F5F9] text-[#A2A9B2]",
          ].join(" ")}
        >
          {isUsed ? "사용완료" : canUse ? "사용" : "조건 미충족"}
        </button>
      </div>
    </article>
  );
}