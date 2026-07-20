import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { LoginPage, SignupPage, TermsPage } from "./pages/AuthPages";
import { MissionRecordPage, PhotoCertificationPage } from "./pages/MissionPages";
import type { BottomNavKey } from "./components/UI";
import { MapPage } from "./pages/MapPage";

type AppScreen = "login" | "signup" | "terms" | "home" | "map" | "photo" | "record";

function App() {
  const [screenStack, setScreenStack] = useState<AppScreen[]>(["login"]);
  const activeScreen = screenStack[screenStack.length - 1];

  const navigate = (screen: AppScreen) => {
    setScreenStack((stack) => (stack[stack.length - 1] === screen ? stack : [...stack, screen]));
  };

  const resetTo = (screen: AppScreen) => {
    setScreenStack([screen]);
  };

  const goBack = () => {
    setScreenStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  };

  const handleBottomNav = (key: BottomNavKey) => {
    if (key === "mission") {
      navigate("photo");
      return;
    }

    if (key === "map") {
      navigate("map");
      return;
    }

    if (key === "reward" || key === "my") {
      navigate("record");
      return;
    }

    navigate("home");
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "login":
        return <LoginPage onLogin={() => resetTo("home")} onSignup={() => navigate("signup")} />;
      case "signup":
        return <SignupPage />;
      case "terms":
        return <TermsPage />;
      case "home":
        return (
          <HomePage
            onNavigate={handleBottomNav}
            onOpenRecord={() => navigate("record")}
            onStartMission={() => navigate("photo")}
          />
        );
      case "map":
        return <MapPage onBack={goBack} onNavigate={handleBottomNav} onStartMission={() => navigate("photo")} />;
      case "photo":
        return <PhotoCertificationPage onBack={goBack} />;
      case "record":
        return <MissionRecordPage onBack={goBack} />;
      default:
        return <LoginPage onLogin={() => resetTo("home")} />;
    }
  };

  return (
    <div className="app-shell mobile-app-shell">
      <section className="mobile-stage">{renderScreen()}</section>
    </div>
  );
}

export default App;
