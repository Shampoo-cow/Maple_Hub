import { useState } from "react";
import { Download, X } from "lucide-react";
import { Footer } from "./Footer";
import mapleLeaf from "../../assets/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";
import headerBg from "../../assets/0bbd438f2659f0b454ed2b2e5656ebd71721c84f.png";
import guildMark1 from "../../assets/37054ac47711735d313eb47d69a54f4a420ef083.png";
import guildMark2 from "../../assets/6cce208904356b544799a82fa58aa2133da5b7ed.png";
import guildMark3 from "../../assets/e9d186ce7574ccb28e1f26c281904ce4f9f6058b.png";
import guildMark4 from "../../assets/a115ff6058d0682887cd9d64702262fef95e058b.png";
import guildMark5 from "../../assets/38c961d68d07bea362f1877e3a58995ced3ec032.png";
import guildMark6 from "../../assets/bbc1e7d574160ba0572f63120525eda416ddadec.png";
import guildMark7 from "../../assets/8a32077a4d44430b8b5be553403ae67e25884b87.png";
import guildMark8 from "../../assets/65c91c6b1aa16709678aa393ebc96339cc3f96cf.png";
import guildMark9 from "../../assets/d16db933517edb39f1a32fe5cefbf3e2dd27c9b0.png";
import guildMark10 from "../../assets/d2cf5b45d3c0f8440e11107885f52025ed7a7fd4.png";
import guildMark11 from "../../assets/6db6db849af9061e121d0190c05c842bf29c4add.png";
import guildMark12 from "../../assets/e2fe657c6c96bc8aa78421a2067989062590b60a.png";
import guildMark13 from "../../assets/44092d538f085749d922defad0730b1b8111c33e.png";
import guildMark14 from "../../assets/c48793867aef63b93990fc3714daf316725eaaec.png";

interface GuildMark {
  id: number;
  name: string;
  imageData: string;
}

// Guild marks database using actual images
const guildMarksDatabase: GuildMark[] = [
  {
    id: 1,
    name: "길드 마크 1",
    imageData: guildMark1,
  },
  {
    id: 2,
    name: "길드 마크 2",
    imageData: guildMark2,
  },
  {
    id: 3,
    name: "길드 마크 3",
    imageData: guildMark3,
  },
  {
    id: 4,
    name: "길드 마크 4",
    imageData: guildMark4,
  },
  {
    id: 5,
    name: "길드 마크 5",
    imageData: guildMark5,
  },
  {
    id: 6,
    name: "길드 마크 6",
    imageData: guildMark6,
  },
  {
    id: 7,
    name: "길드 마크 7",
    imageData: guildMark7,
  },
  {
    id: 8,
    name: "길드 마크 8",
    imageData: guildMark8,
  },
  {
    id: 9,
    name: "길드 마크 9",
    imageData: guildMark9,
  },
  {
    id: 10,
    name: "길드 마크 10",
    imageData: guildMark10,
  },
  {
    id: 11,
    name: "길드 마크 11",
    imageData: guildMark11,
  },
  {
    id: 12,
    name: "길드 마크 12",
    imageData: guildMark12,
  },
  {
    id: 13,
    name: "길드 마크 13",
    imageData: guildMark13,
  },
  {
    id: 14,
    name: "길드 마크 14",
    imageData: guildMark14,
  },
];

export function GuildMarkPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [showPopup, setShowPopup] = useState(true);

  const handleDownload = (mark: GuildMark) => {
    const link = document.createElement("a");
    link.href = mark.imageData;
    link.download = `${mark.name.replace(/\s+/g, "_")}_17x17.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-50">

          </div>
        </div>
      )}

      <div className="flex gap-4 p-2 md:p-4">

        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div
            className="rounded-2xl shadow-2xl p-4 md:p-8 mb-4 md:mb-6 border-2 md:border-4 border-purple-400 relative overflow-hidden"
            style={{
              backgroundImage: `url(${headerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
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
                    "0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)",
                  filter: "drop-shadow(0 4px 20px rgba(168, 85, 247, 0.5))",
                }}
              >
                Maple_Hub
                <span className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-30 -z-10">
                  Maple_Hub
                </span>
              </h1>
            </div>
            <p
              className="relative z-10 text-purple-700 font-semibold text-center text-sm md:text-xl mt-2 md:mt-4 tracking-wide"
              style={{
                textShadow:
                  "0 2px 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(168, 85, 247, 0.3)",
              }}
            >
              메이플 컨텐츠 디멘션 게이트
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
            <button
              onClick={() => onNavigate("main")}
              className="flex-1 bg-purple-100 py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-300 hover:bg-purple-200 transition-colors text-sm md:text-base"
            >
              🏠 메인 허브
            </button>
            <button
              onClick={() => onNavigate("events")}
              className="flex-1 bg-purple-100 py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-300 hover:bg-purple-200 transition-colors text-sm md:text-base"
            >
              📅 이벤트 캘린더
            </button>
            <button className="flex-1 bg-white py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-400 text-sm md:text-base">
              🎨 길드 마크
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
            <p className="text-purple-800 text-center text-sm md:text-base">
              ℹ️ 모든 길드 마크는 메이플스토리에 최적화된 17x17
              픽셀 크기입니다. 다운로드 버튼을 클릭하세요!
            </p>
          </div>

          {/* Guild Marks Grid */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
            <h2 className="text-xl md:text-2xl mb-4 md:mb-6 text-purple-700">
              사용 가능한 길드 마크 ({guildMarksDatabase.length}
              개)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {guildMarksDatabase.map((mark) => (
                <div
                  key={mark.id}
                  className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 hover:scale-105 flex flex-col items-center gap-3"
                >
                  {/* Preview Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center">
                    <img
                      src={mark.imageData}
                      alt={mark.name}
                      className="pixelated"
                      style={{
                        width: "68px",
                        height: "68px",
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>

                  {/* Mark Name */}
                  <div className="text-center">
                    <p className="text-sm line-clamp-2">
                      {mark.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      17x17px
                    </p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(mark)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">다운로드</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
