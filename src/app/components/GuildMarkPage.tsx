import { useState } from "react";
import { Download, X, Upload, Image as ImageIcon } from "lucide-react";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import mapleLeaf from "../../assets/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";
import headerBg from "../../assets/0bbd438f2659f0b454ed2b2e5656ebd71721c84f.png";
import guildMark1 from "../../assets/37054ac47711735d313eb47d69a54f4a420ef083.png";
import guildMark2 from "../../assets/fa5d7b8ec19e56cea522c837b3b62beccf298c97.png";
import guildMark3 from "../../assets/79408069b3fab66c0adcfcd422efae2cc16530be.png";
import guildMark4 from "../../assets/58efac54a6b823182959b99d1e3522c6506a443d.png";
import guildMark5 from "../../assetst/8af61065057704089c6b9691fc5bef9cd01c5fe3.png";
import guildMark6 from "../../assets/1078649af6e0553b79e72a33f95eeddba24aaa93.png";
import guildMark7 from "../../assets/97765b83b1d9353ebb75d6f68adbbd74a894e672.png";
import guildMark8 from "../../assets/57540101e51d5aaa9c38270cbb40e85112f3955a.png";
import guildMark9 from "../../assets/144d40d1fc14b18ac520247084d3c993179c726a.png";
import guildMark10 from "../../assets/7c74c4cdb5d5862e704d6835f1c6ae598a742e76.png";
import guildMark11 from "../../assets/2b32148dc44feed59768f52dae582465d3aff910.png";
import guildMark12 from "../../assets/ef5d812bfb42e4f20917c4ab9e572cf5d9148852.png";
import guildMark13 from "../../assets/f9d492fc5d3d59e62beff11bdcc165ad2f28fb5a.png";
import guildMark14 from "../../assets/c1a07312b472761911b68e6975ca26bb298dbd41.png";
import guildMark15 from "../../assets/c16ccd9a1c66da563cf47e1c76e7146aed995f93.png";
import guildMark16 from "../../assets/94bd0443ae3cffc3b809fb6f60710068d28e2b63.png";
import guildMark17 from "../../assets/4c5d2957d4e27c878c034ea79c460b254c1f4a0a.png";
import guildMark18 from "../../assets/736ef186cd9ada8b5df3b8547841c9b433bf2beb.png";
import guildMark19 from "../../assets/f7f44cadcce6419559e1e6d0830834e472c1a7df.png";
import guildMark20 from "../../assets/5db261524e5874633aceee914b918f7aa0ab0d64.png";
import guildMark21 from "../../assets/0c5b009170e175e2e24f74eaa0d88039e124ea80.png";

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
  {
    id: 15,
    name: "길드 마크 15",
    imageData: guildMark15,
  },
  {
    id: 16,
    name: "길드 마크 16",
    imageData: guildMark16,
  },
  {
    id: 17,
    name: "길드 마크 17",
    imageData: guildMark17,
  },
  {
    id: 18,
    name: "길드 마크 18",
    imageData: guildMark18,
  },
  {
    id: 19,
    name: "길드 마크 19",
    imageData: guildMark19,
  },
  {
    id: 20,
    name: "길드 마크 20",
    imageData: guildMark20,
  },
  {
    id: 21,
    name: "길드 마크 21",
    imageData: guildMark21,
  },
];

export function GuildMarkPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [showPopup, setShowPopup] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDownload = (mark: GuildMark) => {
    const link = document.createElement("a");
    link.href = mark.imageData;
    link.download = `${mark.name.replace(/\s+/g, "_")}_17x17.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertImageTo17x17 = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for 17x17 conversion
        const canvas = document.createElement("canvas");
        canvas.width = 17;
        canvas.height = 17;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Disable image smoothing for pixelated effect
          ctx.imageSmoothingEnabled = false;
          
          // Draw the image scaled down to 17x17
          ctx.drawImage(img, 0, 0, 17, 17);
          
          // Get the converted image as data URL
          const convertedDataUrl = canvas.toDataURL("image/png");
          setConvertedImage(convertedDataUrl);
        }
      };
      img.src = e.target?.result as string;
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      convertImageTo17x17(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      convertImageTo17x17(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDownloadConverted = () => {
    if (convertedImage) {
      const link = document.createElement("a");
      link.href = convertedImage;
      link.download = "my_guild_mark_17x17.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setConvertedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-50">
      <div className="p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
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
            <button className="flex-1 bg-white py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-400 text-sm md:text-base">
              🎨 길드 마크
            </button>
            <button
              onClick={() => onNavigate("events")}
              className="flex-1 bg-purple-100 py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-300 hover:bg-purple-200 transition-colors text-sm md:text-base"
            >
              📅 이벤트 캘린더
            </button>
          </div>

          {/* Main Layout: Content + Sidebar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <div className="flex-1">
              {/* Info Box */}
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 md:p-4 mb-4">
                <p className="text-purple-800 text-center text-sm md:text-base">
                  ℹ️ 모든 길드 마크는 메이플스토리에 최적화된 17x17
                  픽셀 크기입니다. 다운로드 버튼을 클릭하세요!
                </p>
              </div>

              {/* Guild Mark Creator Section */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200 mb-4">
                <h2 className="text-xl md:text-2xl mb-4 text-purple-700 flex items-center gap-2">
                  <Upload className="w-6 h-6" />
                  길드 마크 만들기
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Upload Area */}
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      이미지를 업로드하면 자동으로 17x17 픽셀 도트 이미지로 변환됩니다.
                    </p>
                    
                    {!convertedImage ? (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-3 border-dashed rounded-lg p-8 text-center transition-all ${
                          isDragging
                            ? "border-purple-500 bg-purple-50"
                            : "border-purple-300 bg-gray-50"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-purple-700 font-semibold mb-1">
                              이미지 선택 또는 드래그
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF 등 모든 이미지 형식 지원
                            </p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Preview of converted image */}
                        <div className="bg-gray-50 rounded-lg p-6 border-2 border-purple-200">
                          <p className="text-sm text-gray-600 mb-3 text-center">
                            변환된 길드 마크
                          </p>
                          <div className="flex justify-center items-center gap-6">
                            {/* 1x preview */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="bg-white rounded border-2 border-gray-300 p-3">
                                <img
                                  src={convertedImage}
                                  alt="Converted 1x"
                                  className="pixelated"
                                  style={{
                                    width: "23px",
                                    height: "23px",
                                    imageRendering: "pixelated",
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">1x (23px)</span>
                            </div>

                            {/* 2x preview */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="bg-white rounded border-2 border-gray-300 p-3">
                                <img
                                  src={convertedImage}
                                  alt="Converted 2x"
                                  className="pixelated"
                                  style={{
                                    width: "46px",
                                    height: "46px",
                                    imageRendering: "pixelated",
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">2x (46px)</span>
                            </div>

                            {/* 4x preview */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="bg-white rounded border-2 border-gray-300 p-3">
                                <img
                                  src={convertedImage}
                                  alt="Converted 4x"
                                  className="pixelated"
                                  style={{
                                    width: "92px",
                                    height: "92px",
                                    imageRendering: "pixelated",
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">4x (92px)</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleDownloadConverted}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            <Download className="w-5 h-5" />
                            <span>17x17 이미지 다운로드</span>
                          </button>
                          <button
                            onClick={handleReset}
                            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            <span>초기화</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info/Tips Section */}
                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                    <h3 className="font-semibold text-purple-700 mb-3">💡 사용 팁</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>
                          17x17 픽셀은 매우 작은 크기이므로 단순한 도안이나 로고를 추천합니다.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>
                          배경이 투명한 PNG 파일을 사용하면 더 깔끔한 결과를 얻을 수 있습니다.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>
                          복잡한 이미지는 17x17로 축소되면서 디테일이 손실될 수 있습니다.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>
                          변환된 이미지는 메이플스토리 게임 내 길드 마크로 바로 사용 가능합니다.
                        </span>
                      </li>
                    </ul>

                    {uploadedImage && (
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <p className="text-xs text-gray-600 mb-2">원본 이미지 미리보기:</p>
                        <div className="bg-white rounded p-2 border border-purple-200 flex justify-center">
                          <img
                            src={uploadedImage}
                            alt="Original"
                            className="max-w-full max-h-32 object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                      {/* Preview Images - 1x and 2x */}
                      <div className="flex items-center gap-4">
                        {/* 1x Size (23px) */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center p-2">
                            <img
                              src={mark.imageData}
                              alt={mark.name}
                              className="pixelated"
                              style={{
                                width: "23px",
                                height: "23px",
                                imageRendering: "pixelated",
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">1x</span>
                        </div>

                        {/* 2x Size (46px) */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center p-2">
                            <img
                              src={mark.imageData}
                              alt={mark.name}
                              className="pixelated"
                              style={{
                                width: "46px",
                                height: "46px",
                                imageRendering: "pixelated",
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">2x</span>
                        </div>
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
                  ))}</div>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
