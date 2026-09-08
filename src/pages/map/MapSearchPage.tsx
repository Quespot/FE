import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, MapPin, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { MAP_SPOTS, type MapSpot, type RoutePlace } from "@/data/mapSpots";
import { PATH } from "@/routes/paths";

type SearchResult =
  | {
      id: string;
      type: "spot";
      spot: MapSpot;
      place?: never;
    }
  | {
      id: string;
      type: "place";
      spot: MapSpot;
      place: RoutePlace;
    };

export default function MapSearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const searchResults = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    if (!trimmedKeyword) {
      return getDefaultResults();
    }

    return MAP_SPOTS.flatMap<SearchResult>((spot) => {
      const results: SearchResult[] = [];

      const isSpotMatched =
        spot.name.toLowerCase().includes(trimmedKeyword) ||
        spot.shortName.toLowerCase().includes(trimmedKeyword);

      if (isSpotMatched) {
        results.push({
          id: `spot-${spot.id}`,
          type: "spot",
          spot,
        });
      }

      spot.places.forEach((place) => {
        const isPlaceMatched =
          place.name.toLowerCase().includes(trimmedKeyword) ||
          place.area.toLowerCase().includes(trimmedKeyword);

        if (isPlaceMatched) {
          results.push({
            id: `place-${place.id}`,
            type: "place",
            spot,
            place,
          });
        }
      });

      return results;
    });
  }, [keyword]);

  const handleSelectResult = (result: SearchResult) => {
    navigate(PATH.MAP, {
      state: {
        selectedSpotId: result.spot.id,
        openPlaceList: true,
      },
    });
  };

  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <header className="shrink-0 bg-white">
        <div className="flex h-[80px] items-center gap-[12px] px-[16px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} strokeWidth={2.6} />
          </button>

          <div className="flex h-[46px] min-w-0 flex-1 items-center gap-[8px] rounded-[16px] bg-[#EAF5FF] px-[14px] text-[#A2A9B2]">
            <Search size={18} strokeWidth={2.2} />

            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="지역 · 장소 검색"
              autoFocus
              className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[20px] text-[#1C1C3A] outline-none placeholder:text-[#A2A9B2]"
            />

            {keyword ? (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-white text-[#A2A9B2]"
                aria-label="검색어 지우기"
              >
                <X size={15} strokeWidth={2.4} />
              </button>
            ) : null}
          </div>
        </div>

        <QuespotDivider />
      </header>

      <QuespotPageContent className="bg-[#F4F8FF] px-[16px] py-[18px]">
        <section className="shrink-0">
          <h1 className="m-0 text-[20px] font-black leading-[28px] text-[#1C1C3A]">
            지역과 장소를 검색해보세요
          </h1>

          <p className="m-0 mt-[6px] text-[13px] font-medium leading-[19px] text-[#A2A9B2]">
            검색 결과를 누르면 해당 위치가 지도에 표시돼요.
          </p>
        </section>

        <section className="mt-[20px] flex flex-col gap-[10px]">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                onClick={() => handleSelectResult(result)}
              />
            ))
          ) : (
            <EmptySearchResult keyword={keyword} />
          )}
        </section>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

function getDefaultResults(): SearchResult[] {
  return MAP_SPOTS.map((spot) => ({
    id: `spot-${spot.id}`,
    type: "spot",
    spot,
  }));
}

type SearchResultCardProps = {
  result: SearchResult;
  onClick: () => void;
};

function SearchResultCard({ result, onClick }: SearchResultCardProps) {
  const title = result.type === "spot" ? result.spot.name : result.place.name;

  const description =
    result.type === "spot"
      ? `${result.spot.places.length}개 추천 장소`
      : result.place.area;

  const badgeLabel = result.type === "spot" ? "지역" : "장소";
  const emoji = result.type === "spot" ? result.spot.emoji : result.place.emoji;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[78px] w-full items-center rounded-[16px] border border-[#EAF5FF] bg-white p-[14px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition active:scale-[0.99]"
    >
      <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[16px] bg-[#EAF5FF] text-[25px] leading-none">
        {emoji}
      </div>

      <div className="ml-[14px] min-w-0 flex-1">
        <div className="flex items-center gap-[7px]">
          <strong className="truncate text-[15px] font-black leading-[21px] text-[#1C1C3A]">
            {title}
          </strong>

          <span className="shrink-0 rounded-full bg-[#E8FBF3] px-[8px] py-[4px] text-[10px] font-black leading-none text-[#00A85A]">
            {badgeLabel}
          </span>
        </div>

        <p className="m-0 mt-[5px] truncate text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
          {description}
        </p>

        {result.type === "place" ? (
          <p className="m-0 mt-[5px] text-[11px] font-bold leading-[15px] text-[#5BB5F8]">
            {result.spot.shortName} 미션 스팟
          </p>
        ) : (
          <p className="m-0 mt-[5px] text-[11px] font-bold leading-[15px] text-[#5BB5F8]">
            {result.spot.status === "completed"
              ? "완료한 미션"
              : `미션 ${result.spot.missionCount ?? 0}개`}
          </p>
        )}
      </div>

      <ChevronRight
        size={20}
        strokeWidth={2.5}
        className="shrink-0 text-[#C8E8FF]"
      />
    </button>
  );
}

type EmptySearchResultProps = {
  keyword: string;
};

function EmptySearchResult({ keyword }: EmptySearchResultProps) {
  return (
    <section className="mt-[70px] flex flex-col items-center text-center">
      <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]">
        <MapPin size={32} strokeWidth={2.3} />
      </div>

      <h2 className="m-0 mt-[18px] text-[17px] font-black leading-[24px] text-[#1C1C3A]">
        검색 결과가 없어요
      </h2>

      <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
        “{keyword}”에 해당하는 지역이나 장소를
        <br />
        찾을 수 없어요.
      </p>
    </section>
  );
}