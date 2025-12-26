import { useState } from "react";
import { Download, X } from "lucide-react";
import { AdBanner } from "./AdBanner";

interface GuildMark {
  id: number;
  name: string;
  imageData: string;
}

// Mock guild mark database - auto-generated guild marks
const generateGuildMark = (id: number, name: string, color1: string, color2: string): GuildMark => {
  // Create a simple 17x17 pattern using canvas
  const canvas = document.createElement('canvas');
  canvas.width = 17;
  canvas.height = 17;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a gradient or pattern background
    const gradient = ctx.createLinearGradient(0, 0, 17, 17);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 17, 17);
    
    // Add some simple shapes to make it look like a guild mark
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 5, 7, 7);
    ctx.fillStyle = color1;
    ctx.fillRect(7, 7, 3, 3);
  }
  
  return {
    id,
    name,
    imageData: canvas.toDataURL('image/png')
  };
};

const guildMarksDatabase: GuildMark[] = [
  generateGuildMark(1, "드래곤 윙", "#ff6b6b", "#ee5a6f"),
  generateGuildMark(2, "피닉스 라이징", "#ffa500", "#ff8c00"),
  generateGuildMark(3, "블루 스타", "#4dabf7", "#339af0"),
  generateGuildMark(4, "그린 리프", "#51cf66", "#37b24d"),
  generateGuildMark(5, "퍼플 크라운", "#9775fa", "#845ef7"),
  generateGuildMark(6, "골든 쉴드", "#ffd43b", "#fab005"),
  generateGuildMark(7, "레드 소드", "#ff6b6b", "#fa5252"),
  generateGuildMark(8, "사이언 웨이브", "#22b8cf", "#15aabf"),
  generateGuildMark(9, "핑크 하트", "#ff6b9d", "#da77f2"),
  generateGuildMark(10, "오렌지 플레임", "#ff922b", "#fd7e14"),
  generateGuildMark(11, "틸 다이아몬드", "#20c997", "#12b886"),
  generateGuildMark(12, "바이올렛 문", "#845ef7", "#7950f2"),
  generateGuildMark(13, "라임 썬더", "#94d82d", "#82c91e"),
  generateGuildMark(14, "마젠타 스타", "#e64980", "#d6336c"),
  generateGuildMark(15, "엠버 썬", "#fd7e14", "#f76707"),
  generateGuildMark(16, "인디고 나이트", "#5c7cfa", "#4c6ef5"),
  generateGuildMark(17, "에메랄드 크로스", "#2f9e44", "#2b8a3e"),
  generateGuildMark(18, "루비 젬", "#c92a2a", "#a61e4d"),
  generateGuildMark(19, "사파이어 윙", "#1864ab", "#1971c2"),
  generateGuildMark(20, "실버 문", "#adb5bd", "#868e96"),
];

export function GuildMarkPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [showPopup, setShowPopup] = useState(true);

  const handleDownload = (mark: GuildMark) => {
    const link = document.createElement('a');
    link.href = mark.imageData;
    link.download = `${mark.name.replace(/\s+/g, '_')}_17x17.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      {/* Popup Ad Banner */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <AdBanner type="popup" />
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4 p-4">
        {/* Left Ad Banner */}
        <div className="hidden lg:block flex-shrink-0">
          <AdBanner type="vertical" />
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-2xl p-8 mb-6 border-4 border-purple-300">
            <h1 className="text-5xl text-white text-center mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              🎨 길드 마크 갤러리 🎨
            </h1>
            <p className="text-white/90 text-center text-lg">17x17 길드 마크 다운로드</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => onNavigate('main')}
              className="flex-1 bg-orange-100 py-3 px-6 rounded-lg shadow-md border-2 border-orange-300 hover:bg-orange-200 transition-colors"
            >
              🏠 메인 허브
            </button>
            <button
              className="flex-1 bg-white py-3 px-6 rounded-lg shadow-md border-2 border-purple-400"
            >
              🎨 길드 마크
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-center">
              ℹ️ 모든 길드 마크는 메이플스토리에 최적화된 17x17 픽셀 크기입니다. 다운로드 버튼을 클릭하세요!
            </p>
          </div>

          {/* Guild Marks Grid */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg border-2 border-purple-200">
            <h2 className="text-2xl mb-6 text-purple-700">사용 가능한 길드 마크 ({guildMarksDatabase.length}개)</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                        width: '68px', 
                        height: '68px',
                        imageRendering: 'pixelated'
                      }}
                    />
                  </div>

                  {/* Mark Name */}
                  <div className="text-center">
                    <p className="text-sm line-clamp-2">{mark.name}</p>
                    <p className="text-xs text-gray-500">17x17px</p>
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

        {/* Right Ad Banner */}
        <div className="hidden lg:block flex-shrink-0">
          <AdBanner type="vertical" />
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <div className="p-4 pt-0">
        <AdBanner type="horizontal" className="mx-auto max-w-6xl" />
      </div>
    </div>
  );
}