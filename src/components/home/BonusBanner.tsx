type BonusBannerProps = {
  mascotSrc: string;
};

export default function BonusBanner({ mascotSrc }: BonusBannerProps) {
  return (
    <section className="grid min-h-24 grid-cols-[82px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_right_40%,rgba(255,255,255,0.13)_0_62px,transparent_63px),linear-gradient(135deg,#55b8fb_0%,#63bded_100%)] px-5 py-[18px] text-white">
      <img
        className="h-[72px] w-[72px] object-contain"
        src={mascotSrc}
        alt="Quespot 캐릭터"
      />

      <div>
        <strong className="block text-[16px] font-black leading-snug">
          소도시 미션에서
          <br />
          추가 보너스 포인트!
        </strong>

        <p className="mb-0 mt-1.5 text-[11px] text-white/80">
          인구감소지역 미션 완료 시 +20% 보너스
        </p>
      </div>
    </section>
  );
}