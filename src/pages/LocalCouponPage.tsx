import { useMemo, useState } from "react";
import { ArrowLeft, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CouponCard from "@/components/reward/CouponCard";
import CouponTabs from "@/components/reward/CouponTabs";
import CouponUseModal from "@/components/reward/CouponUseModal";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { rewardCoupons, type CouponItem, type CouponTab } from "@/data/reward";

export default function LocalCouponPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<CouponTab>("available");
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);

  const filteredCoupons = useMemo(() => {
    return rewardCoupons.filter((coupon) => coupon.status === selectedTab);
  }, [selectedTab]);

  return (
    <QuespotPageLayout className="relative bg-[#F4F8FF]">
      <header className="shrink-0 bg-white">
        <div className="flex h-[80px] items-center gap-[16px] px-[16px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} strokeWidth={2.6} />
          </button>

          <h1 className="m-0 text-[17px] font-black leading-[24px] text-[#1C1C3A]">
            로컬 제휴 쿠폰
          </h1>
        </div>

        <QuespotDivider />

        <CouponTabs selectedTab={selectedTab} onChangeTab={setSelectedTab} />
      </header>

      <QuespotPageContent className="gap-[12px] px-[16px] py-[16px]">
        <section className="flex h-[44px] shrink-0 items-center gap-[8px] rounded-[16px] border border-[#EAF5FF] bg-white px-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <Ticket size={15} strokeWidth={2.4} className="text-[#5BB5F8]" />

          <p className="m-0 text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
            미션 완료 후 사용 가능한 제휴 쿠폰이에요
          </p>
        </section>

        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onUse={() => setSelectedCoupon(coupon)}
            />
          ))
        ) : (
          <EmptyCouponMessage selectedTab={selectedTab} />
        )}
      </QuespotPageContent>

      {selectedCoupon ? (
        <CouponUseModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      ) : null}
    </QuespotPageLayout>
  );
}

type EmptyCouponMessageProps = {
  selectedTab: CouponTab;
};

function EmptyCouponMessage({ selectedTab }: EmptyCouponMessageProps) {
  return (
    <section className="mt-[80px] flex flex-col items-center text-center">
      <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#EAF5FF] text-[30px]">
        🎟️
      </div>

      <h2 className="m-0 mt-[18px] text-[17px] font-black leading-[24px] text-[#1C1C3A]">
        {selectedTab === "available"
          ? "사용 가능한 쿠폰이 없어요"
          : "사용 완료한 쿠폰이 없어요"}
      </h2>

      <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
        미션을 완료하면 로컬 제휴 쿠폰을
        <br />
        받을 수 있어요.
      </p>
    </section>
  );
}