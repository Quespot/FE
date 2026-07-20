import { Bell, ChevronLeft, Gem, Glasses, Lock, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { DeviceFrame, SubHeader } from "../components/DeviceFrame";
import { BottomNav, type BottomNavKey } from "../components/UI";
import { figmaAssets } from "../data/quespot";

type QuestyCustomizePageProps = {
  onBack?: () => void;
  onNavigate?: (screen: BottomNavKey) => void;
};

const equippedItems = ["🎩 탐험가 모자", "🕶️ 선글라스", "🧣 파란 스카프", "🧳 여행 가방"];
const closetItems = [
  { icon: "🎩", name: "탐험가 모자", type: "일반", equipped: true },
  { icon: "🕶️", name: "선글라스", type: "일반", equipped: true },
  { icon: "🧣", name: "파란 스카프", type: "일반", equipped: true },
  { icon: "🧳", name: "여행 가방", type: "일반", equipped: true },
];

export function QuestyCustomizePage({ onBack, onNavigate }: QuestyCustomizePageProps) {
  return (
    <DeviceFrame className="app-device questy-device">
      <section className="questy-screen">
        <header className="mobile-topbar questy-logo-header">
          <div>
            <img src={figmaAssets.mascot} alt="" />
            <strong>Quespot</strong>
          </div>
          <button className="notification-button" type="button" aria-label="알림">
            <Bell size={19} strokeWidth={2.4} />
            <span>3</span>
          </button>
        </header>

        <SubHeader
          title="마스코트 꾸미기"
          onBack={onBack}
          action={
            <span className="point-pill">
              <Zap size={14} fill="currentColor" strokeWidth={0} />
              1,240P
            </span>
          }
        />

        <section className="questy-preview">
          <span className="sparkle sparkle-a">✦</span>
          <span className="sparkle sparkle-b">✦</span>
          <div className="questy-avatar">
            <img className="questy-avatar-img" src={figmaAssets.mascot} alt="움직이는 퀘스티" />
            <span className="questy-hat">🎩</span>
            <span className="questy-glasses">
              <Glasses size={34} strokeWidth={3} />
            </span>
            <span className="questy-scarf">🧣</span>
            <span className="questy-bag">🧳</span>
            <b>꿀</b>
          </div>
          <div className="equipped-row">
            {equippedItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p>아이템을 탭해서 장착/해제</p>
        </section>

        <section className="closet-panel">
          <div className="closet-tabs">
            <button className="is-selected" type="button">👕 내 옷장</button>
            <button type="button">🛍️ 아이템 샵</button>
          </div>
          <div className="closet-filters">
            {["모두", "모자", "액세서리", "의상", "아이템"].map((filter, index) => (
              <button className={index === 0 ? "is-selected" : ""} key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>
          <p className="closet-count">보유 중인 아이템 <b>4개</b></p>
          <div className="closet-grid">
            {closetItems.map((item) => (
              <article key={item.name}>
                <span>{item.icon}</span>
                <strong>{item.name}</strong>
                <small>{item.type}</small>
                <button type="button">{item.equipped ? "장착 중" : "장착"}</button>
              </article>
            ))}
          </div>
          <div className="locked-item-row">
            <span>
              <Lock size={16} strokeWidth={2.5} />
              레어 아이템은 미션 배지로 해금돼요
            </span>
            <Gem size={18} strokeWidth={2.5} />
          </div>
        </section>
      </section>
      <BottomNav active="my" onSelect={onNavigate} />
    </DeviceFrame>
  );
}
