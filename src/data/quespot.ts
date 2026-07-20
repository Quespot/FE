export type ScreenKey =
  | "landing"
  | "login"
  | "signup"
  | "terms"
  | "home"
  | "photo"
  | "record";

export const figmaAssets = {
  mascot: "https://www.figma.com/api/mcp/asset/07ecc734-e0cf-4c20-bbcf-eece4e51e9a4",
  heroMascot: "https://www.figma.com/api/mcp/asset/21ad27f9-a249-4b25-ba66-e341aace6a45",
  goodPhoto: "https://www.figma.com/api/mcp/asset/d925bfb1-a3da-4cb2-a5fe-d20f74f4fa8d",
  badPhoto: "https://www.figma.com/api/mcp/asset/afc72025-62d3-4190-9aa5-5287b515074f",
  backIcon: "https://www.figma.com/api/mcp/asset/38be7f3e-715e-452c-a29a-268a35c4640e",
  photoBackIcon: "https://www.figma.com/api/mcp/asset/ab8fb7a9-7d80-42b7-9b18-2b6f11b00655",
  hintIcon: "https://www.figma.com/api/mcp/asset/c836e42e-ad0a-4c96-b72c-f802f0c18b8a",
  checkIcon: "https://www.figma.com/api/mcp/asset/1c30f067-249f-46a9-8e3f-d8e1163a2803",
  closeIcon: "https://www.figma.com/api/mcp/asset/fffdd0ae-2465-4ca3-9ba9-dc5867732f04",
  cameraIcon: "https://www.figma.com/api/mcp/asset/f6864cf3-399f-40d8-9242-7954026927a5",
};

export const courseCards = [
  "전주 한옥마을 미션 탐방",
  "강릉 바다와 커피 향기",
  "제주 오름 탐험 코스",
  "부산 바다 산책 코스",
];

export const previewScreens: Array<{ key: ScreenKey; label: string }> = [
  { key: "landing", label: "웹 랜딩" },
  { key: "login", label: "로그인" },
  { key: "signup", label: "회원가입" },
  { key: "terms", label: "약관동의" },
  { key: "home", label: "홈" },
  { key: "photo", label: "사진 인증" },
  { key: "record", label: "감상 기록" },
];
