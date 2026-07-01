import { useState, useEffect } from "react";
import { GuildMarkPage } from "./components/GuildMarkPage";
import { SkillPage } from "./components/SkillPage";
import { Footer } from "./components/Footer";
import faviconImage from "figma:asset/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";
import mapleLeaf from "../assets/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";
import headerBg from "../assets/0bbd438f2659f0b454ed2b2e5656ebd71721c84f.png";

type Page = "guild-mark" | "skills";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("guild-mark");

  useEffect(() => {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    (link as HTMLLinkElement).type = "image/png";
    (link as HTMLLinkElement).rel = "icon";
    (link as HTMLLinkElement).href = faviconImage;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-50">
      <div className="p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className="rounded-2xl shadow-2xl p-4 md:p-8 mb-4 border-2 md:border-4 border-purple-400 relative overflow-hidden"
            style={{
              backgroundImage: `url(${headerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* 로고 + 타이틀 */}
            <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
              <img
                src={mapleLeaf}
                alt="Maple Leaf"
                className="w-10 h-10 md:w-16 md:h-16 object-contain drop-shadow-lg"
              />
              <h1
                className="text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient relative"
                style={{
                  textShadow:
                    "0 0 30px rgba(168,85,247,0.4),0 0 60px rgba(168,85,247,0.2)",
                  filter: "drop-shadow(0 4px 20px rgba(168,85,247,0.5))",
                }}
              >
                Maple_Hub
                <span className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-30 -z-10">
                  Maple_Hub
                </span>
              </h1>
            </div>

            {/* 사이트 소개 */}
            <div className="relative z-10 text-center mt-3 md:mt-4">
              <p className="text-white/90 text-sm md:text-base font-medium tracking-wide drop-shadow">
                메이플스토리 팬사이트 — 직업 정보부터 길드마크까지 한 곳에서
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 md:mt-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs md:text-sm font-semibold backdrop-blur-sm border border-white/30 shadow-sm">
                  🗡️ 직업별 스킬 정보
                </span>
                <span className="text-white/40 text-sm hidden md:inline">·</span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs md:text-sm font-semibold backdrop-blur-sm border border-white/30 shadow-sm">
                  🔥 극딜 사이클
                </span>
                <span className="text-white/40 text-sm hidden md:inline">·</span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs md:text-sm font-semibold backdrop-blur-sm border border-white/30 shadow-sm">
                  🔗 링크 스킬
                </span>
                <span className="text-white/40 text-sm hidden md:inline">·</span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs md:text-sm font-semibold backdrop-blur-sm border border-white/30 shadow-sm">
                  🏅 길드마크 에디터
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setActivePage("guild-mark")}
              className={`px-8 py-3 rounded-2xl text-base font-bold tracking-wide transition-all ${
                activePage === "guild-mark"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                  : "bg-white/70 text-purple-600 hover:bg-white border border-purple-200"
              }`}
            >
              길드마크 만들기
            </button>
            <button
              onClick={() => setActivePage("skills")}
              className={`px-8 py-3 rounded-2xl text-base font-bold tracking-wide transition-all ${
                activePage === "skills"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                  : "bg-white/70 text-purple-600 hover:bg-white border border-purple-200"
              }`}
            >
              직업 스킬정보
            </button>
          </div>

          {/* Main Layout */}
          <div>
            {activePage === "guild-mark" ? <GuildMarkPage /> : <SkillPage />}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
