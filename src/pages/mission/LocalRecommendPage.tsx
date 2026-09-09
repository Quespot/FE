import { useMemo, useState } from "react";
import { ArrowLeft, Filter, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";

type LocalCategory = "restaurant" | "cafe" | "culture";

type LocalPlace = {
  id: number;
  name: string;
  type: string;
  distance: string;
  rating: number;
  emoji: string;
  category: LocalCategory;
  liked: boolean;
};

const FILTERS: {
  id: LocalCategory;
  label: string;
  emoji: string;
}[] = [
  {
    id: "restaurant",
    label: "음식점",
    emoji: "🍴",
  },
  {
    id: "cafe",
    label: "카페",
    emoji: "☕",
  },
  {
    id: "culture",
    label: "문화시설",
    emoji: "🏛️",
  },
];

const LOCAL_PLACES: LocalPlace[] = [
  {
    id: 1,
    name: "전통 청국장집",
    type: "한식",
    distance: "300m",
    rating: 4.3,
    emoji: "🍲",
    category: "restaurant",
    liked: false,
  },
  {
    id: 2,
    name: "전통 청국장집",
    type: "한식",
    distance: "300m",
    rating: 4.3,
    emoji: "🍲",
    category: "restaurant",
    liked: true,
  },
  {
    id: 3,
    name: "전통 청국장집",
    type: "한식",
    distance: "300m",
    rating: 4.3,
    emoji: "🍲",
    category: "restaurant",
    liked: false,
  },
  {
    id: 4,
    name: "전통 청국장집",
    type: "한식",
    distance: "300m",
    rating: 4.3,
    emoji: "🍲",
    category: "restaurant",
    liked: false,
  },
  {
    id: 5,
    name: "북촌 감성 카페",
    type: "카페",
    distance: "450m",
    rating: 4.6,
    emoji: "☕",
    category: "cafe",
    liked: false,
  },
  {
    id: 6,
    name: "작은 전시관",
    type: "전시",
    distance: "520m",
    rating: 4.4,
    emoji: "🏛️",
    category: "culture",
    liked: true,
  },
];

export default function LocalRecommendPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] =
    useState<LocalCategory>("restaurant");
  const [places, setPlaces] = useState<LocalPlace[]>(LOCAL_PLACES);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => place.category === selectedCategory);
  }, [places, selectedCategory]);

  const handleToggleLike = (id: number) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((place) =>
        place.id === id ? { ...place, liked: !place.liked } : place,
      ),
    );
  };

  return (
    <QuespotPageLayout>
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

          <h1 className="m-0 text-[22px] font-black leading-[30px] text-[#1C1C3A]">
            주변 로컬 추천
          </h1>
        </div>

        <QuespotDivider />

        <div className="flex h-[62px] items-center justify-between gap-[12px] border-b border-[#EAF5FF] bg-white px-[16px]">
          <div className="no-scrollbar flex min-w-0 flex-1 gap-[8px] overflow-x-auto">
            {FILTERS.map((filter) => {
              const isActive = selectedCategory === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedCategory(filter.id)}
                  className={[
                    "flex h-[40px] shrink-0 items-center justify-center gap-[5px] rounded-full px-[16px] text-[14px] font-black leading-[18px]",
                    isActive
                      ? "bg-[#5BB5F8] text-white"
                      : "bg-[#EAF5FF] text-[#A2A9B2]",
                  ].join(" ")}
                >
                  <span className="text-[12px] leading-none">
                    {filter.emoji}
                  </span>
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="flex h-[40px] shrink-0 items-center gap-[5px] bg-transparent text-[14px] font-black text-[#5BB5F8]"
          >
            <Filter size={16} strokeWidth={2.4} />
            거리순
          </button>
        </div>
      </header>

      <QuespotPageContent className="gap-[8px] px-[16px] py-[16px]">
        {filteredPlaces.map((place) => (
          <LocalPlaceCard
            key={place.id}
            place={place}
            onToggleLike={() => handleToggleLike(place.id)}
          />
        ))}
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

type LocalPlaceCardProps = {
  place: LocalPlace;
  onToggleLike: () => void;
};

function LocalPlaceCard({ place, onToggleLike }: LocalPlaceCardProps) {
  return (
    <article className="relative flex h-[88px] shrink-0 items-center rounded-[16px] border border-[#EAF5FF] bg-white px-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-[16px] bg-[#EAF5FF] text-[24px] leading-none">
        {place.emoji}
      </div>

      <div className="ml-[16px] min-w-0 flex-1">
        <h2 className="m-0 text-[18px] font-black leading-[24px] text-[#1C1C3A]">
          {place.name}
        </h2>

        <div className="mt-[8px] flex items-center gap-[9px]">
          <span className="rounded-full bg-[#EEF5FA] px-[10px] py-[4px] text-[12px] font-bold leading-none text-[#7B8794]">
            {place.type}
          </span>

          <span className="text-[14px] font-medium leading-none text-[#A2A9B2]">
            {place.distance}
          </span>

          <span className="flex items-center gap-[3px] text-[14px] font-black leading-none text-[#6B7280]">
            <Star size={14} fill="#FACC15" strokeWidth={0} />
            {place.rating}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleLike}
        className="grid h-[40px] w-[40px] shrink-0 place-items-center text-[#C8E8FF]"
        aria-label="좋아요"
      >
        <Heart
          size={26}
          strokeWidth={0}
          fill={place.liked ? "#5BB5F8" : "#C8E8FF"}
        />
      </button>
    </article>
  );
}