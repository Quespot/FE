import { X } from "lucide-react";

import type { CouponItem } from "@/data/reward";

type CouponUseModalProps = {
  coupon: CouponItem;
  onClose: () => void;
};

const QR_BLOCKS = [
  1, 1, 1, 1, 1, 0, 1, 0, 1, 1,
  1, 0, 0, 0, 1, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 1, 0, 1,
  1, 0, 0, 0, 1, 1, 1, 0, 1, 0,
  1, 1, 1, 1, 1, 0, 0, 1, 1, 1,
  0, 1, 0, 1, 0, 1, 1, 0, 1, 0,
  1, 0, 1, 1, 1, 0, 1, 0, 0, 1,
  0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
  1, 0, 0, 1, 1, 0, 1, 1, 0, 1,
  1, 1, 1, 0, 1, 1, 0, 0, 1, 1,
];

export default function CouponUseModal({
  coupon,
  onClose,
}: CouponUseModalProps) {
  const couponCode = `QSPOT-${String(coupon.id).padStart(4, "0")}`;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#1C1C3A]/35 px-[24px]">
      <section className="w-full max-w-[330px] rounded-[24px] bg-white px-[20px] pb-[22px] pt-[18px] text-center shadow-[0_18px_40px_rgba(8,37,95,0.28)]">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#EAF5FF] px-[12px] py-[6px] text-[12px] font-black text-[#5BB5F8]">
            제휴 쿠폰
          </span>

          <button
            type="button"
            onClick={onClose}
            className="grid h-[32px] w-[32px] place-items-center rounded-full bg-[#F4F8FF] text-[#A2A9B2]"
            aria-label="쿠폰 모달 닫기"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mx-auto mt-[18px] grid h-[64px] w-[64px] place-items-center rounded-[20px] bg-[#DFF3FF] text-[34px]">
          {coupon.emoji}
        </div>

        <h2 className="m-0 mt-[14px] text-[19px] font-black leading-[26px] text-[#1C1C3A]">
          {coupon.title}
        </h2>

        <p className="m-0 mt-[6px] text-[18px] font-black leading-[24px] text-[#5BB5F8]">
          {coupon.benefit}
        </p>

        <p className="m-0 mt-[6px] text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
          매장 직원에게 아래 QR을 보여주세요
        </p>

        <div className="mx-auto mt-[18px] grid h-[164px] w-[164px] place-items-center rounded-[20px] border border-[#EAF5FF] bg-white shadow-[0_2px_8px_rgba(8,37,95,0.08)]">
          <div className="grid grid-cols-10 gap-[3px] rounded-[12px] bg-white p-[10px]">
            {QR_BLOCKS.map((block, index) => (
              <span
                key={`${coupon.id}-${index}`}
                className={[
                  "h-[9px] w-[9px] rounded-[2px]",
                  block ? "bg-[#1C1C3A]" : "bg-[#EAF5FF]",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-[14px] w-fit rounded-full bg-[#F4F8FF] px-[14px] py-[7px]">
          <span className="text-[12px] font-black tracking-[0.08em] text-[#7B8794]">
            {couponCode}
          </span>
        </div>

        <p className="m-0 mt-[10px] text-[11px] font-medium leading-[17px] text-[#A2A9B2]">
          대회 제출용 임시 QR입니다.
          <br />
          실제 서비스에서는 업체별 쿠폰 코드로 대체됩니다.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-[18px] h-[48px] w-full rounded-[16px] bg-[#5BB5F8] text-[15px] font-black leading-none text-white shadow-[0_8px_18px_rgba(91,181,248,0.24)] active:scale-[0.99]"
        >
          확인
        </button>
      </section>
    </div>
  );
}