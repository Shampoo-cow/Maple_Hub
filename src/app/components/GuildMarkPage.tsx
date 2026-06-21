import { useState, useEffect } from "react";
import { Download, X, Upload, Image as ImageIcon, Scissors, Loader2, Pencil, Eraser, Trash2, Pipette } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import mapleLeaf from "../../assets/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";
import headerBg from "../../assets/0bbd438f2659f0b454ed2b2e5656ebd71721c84f.png";
import guildMark1 from "../../assets/37054ac47711735d313eb47d69a54f4a420ef083.png";
import guildMark2 from "../../assets/fa5d7b8ec19e56cea522c837b3b62beccf298c97.png";
import guildMark3 from "../../assets/79408069b3fab66c0adcfcd422efae2cc16530be.png";
import guildMark4 from "../../assets/58efac54a6b823182959b99d1e3522c6506a443d.png";
import guildMark5 from "../../assets/8af61065057704089c6b9691fc5bef9cd01c5fe3.png";
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

const guildMarksDatabase: GuildMark[] = [
  { id: 1, name: "길드 마크 1", imageData: guildMark1 },
  { id: 2, name: "길드 마크 2", imageData: guildMark2 },
  { id: 3, name: "길드 마크 3", imageData: guildMark3 },
  { id: 4, name: "길드 마크 4", imageData: guildMark4 },
  { id: 5, name: "길드 마크 5", imageData: guildMark5 },
  { id: 6, name: "길드 마크 6", imageData: guildMark6 },
  { id: 7, name: "길드 마크 7", imageData: guildMark7 },
  { id: 8, name: "길드 마크 8", imageData: guildMark8 },
  { id: 9, name: "길드 마크 9", imageData: guildMark9 },
  { id: 10, name: "길드 마크 10", imageData: guildMark10 },
  { id: 11, name: "길드 마크 11", imageData: guildMark11 },
  { id: 12, name: "길드 마크 12", imageData: guildMark12 },
  { id: 13, name: "길드 마크 13", imageData: guildMark13 },
  { id: 14, name: "길드 마크 14", imageData: guildMark14 },
  { id: 15, name: "길드 마크 15", imageData: guildMark15 },
  { id: 16, name: "길드 마크 16", imageData: guildMark16 },
  { id: 17, name: "길드 마크 17", imageData: guildMark17 },
  { id: 18, name: "길드 마크 18", imageData: guildMark18 },
  { id: 19, name: "길드 마크 19", imageData: guildMark19 },
  { id: 20, name: "길드 마크 20", imageData: guildMark20 },
  { id: 21, name: "길드 마크 21", imageData: guildMark21 },
];

const PALETTE_COLORS = [
  "#000000", "#3d3d3d", "#7b7b7b", "#b0b0b0", "#d9d9d9", "#ffffff", "#ff0000", "#ff6600",
  "#ffcc00", "#ccff00", "#00cc00", "#00ff99", "#00ccff", "#0066ff", "#6600ff", "#cc00ff",
  "#ff9999", "#ffcc99", "#ffff99", "#ccff99", "#99ffee", "#99ddff", "#9999ff", "#dd99ff",
  "#7c3aed", "#db2777", "#ea580c", "#65a30d", "#0891b2", "#1d4ed8", "#7e22ce", "#be123c",
];

const CHECKERBOARD = {
  backgroundImage:
    "linear-gradient(45deg,#e0e0e0 25%,transparent 25%)," +
    "linear-gradient(-45deg,#e0e0e0 25%,transparent 25%)," +
    "linear-gradient(45deg,transparent 75%,#e0e0e0 75%)," +
    "linear-gradient(-45deg,transparent 75%,#e0e0e0 75%)",
  backgroundSize: "10px 10px",
  backgroundPosition: "0 0,0 5px,5px -5px,-5px 0px",
  backgroundColor: "#ffffff",
};

const emptyPixels = () =>
  Array.from({ length: 17 }, () => Array(17).fill("transparent") as string[]);

export function GuildMarkPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  const [pixels, setPixels] = useState<string[][]>(emptyPixels);
  const [selectedColor, setSelectedColor] = useState("#7c3aed");
  const [activeTool, setActiveTool] = useState<"draw" | "erase" | "pick">("draw");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const up = () => setIsMouseDown(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const handleDownload = (mark: GuildMark) => {
    const link = document.createElement("a");
    link.href = mark.imageData;
    link.download = `${mark.name.replace(/\s+/g, "_")}_17x17.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const initEditorFromImage = (imageDataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 17;
      canvas.height = 17;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, 17, 17);
      ctx.drawImage(img, 0, 0, 17, 17);
      const data = ctx.getImageData(0, 0, 17, 17).data;
      const newPixels = Array.from({ length: 17 }, (_, y) =>
        Array.from({ length: 17 }, (_, x) => {
          const i = (y * 17 + x) * 4;
          if (data[i + 3] < 10) return "transparent";
          return (
            "#" +
            data[i].toString(16).padStart(2, "0") +
            data[i + 1].toString(16).padStart(2, "0") +
            data[i + 2].toString(16).padStart(2, "0")
          );
        })
      );
      setPixels(newPixels);
      setShowEditor(true);
      setTimeout(
        () =>
          document
            .getElementById("pixel-editor")
            ?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    };
    img.src = imageDataUrl;
  };

  const convertImageTo17x17 = (imageSource: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 17;
      canvas.height = 17;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 17, 17);
      setConvertedImage(canvas.toDataURL("image/png"));
    };
    img.src = imageSource;
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;
    setIsRemovingBackground(true);
    try {
      const result = await removeBackground(uploadedImage);
      const reader = new FileReader();
      reader.onload = (e) => setProcessedImage(e.target?.result as string);
      reader.readAsDataURL(result);
    } catch (error) {
      console.error("배경 제거 실패:", error);
      alert("배경 제거에 실패했습니다. 다른 이미지로 다시 시도해주세요.");
    } finally {
      setIsRemovingBackground(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadConverted = () => {
    if (!convertedImage) return;
    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = "my_guild_mark_17x17.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setConvertedImage(null);
  };

  const paintPixel = (y: number, x: number) => {
    setPixels((prev) => {
      const next = prev.map((row) => [...row]);
      next[y][x] = activeTool === "erase" ? "transparent" : selectedColor;
      return next;
    });
  };

  const handlePixelMouseDown = (e: React.MouseEvent, y: number, x: number) => {
    e.preventDefault();
    if (activeTool === "pick") {
      const color = pixels[y][x];
      if (color !== "transparent") setSelectedColor(color);
      setActiveTool("draw");
      return;
    }
    setIsMouseDown(true);
    paintPixel(y, x);
  };

  const handlePixelMouseEnter = (y: number, x: number) => {
    if (isMouseDown && activeTool !== "pick") paintPixel(y, x);
  };

  const exportEditorImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 17;
    canvas.height = 17;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 17, 17);
    pixels.forEach((row, y) =>
      row.forEach((color, x) => {
        if (color !== "transparent") {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      })
    );
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "my_guild_mark_17x17.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openBlankEditor = () => {
    setPixels(emptyPixels());
    setShowEditor(true);
    setTimeout(
      () =>
        document
          .getElementById("pixel-editor")
          ?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const toolCursor = activeTool === "erase" ? "cell" : activeTool === "pick" ? "copy" : "crosshair";

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
          </div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              {/* Info Box */}
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 md:p-4 mb-4">
                <p className="text-purple-800 text-center text-sm md:text-base">
                  ℹ️ 모든 길드 마크는 메이플스토리에 최적화된 17x17 픽셀 크기입니다. 다운로드 버튼을 클릭하세요!
                </p>
              </div>

              {/* Guild Mark Creator */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl text-purple-700 flex items-center gap-2">
                    <Upload className="w-6 h-6" />
                    길드 마크 만들기
                  </h2>
                  <button
                    onClick={openBlankEditor}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg border-2 border-indigo-300 hover:bg-indigo-100 transition-colors text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4" />
                    빈 캔버스로 그리기
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Upload / Process Area */}
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      이미지를 업로드하면 자동으로 17x17 픽셀 도트 이미지로 변환됩니다.
                    </p>

                    {!uploadedImage ? (
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
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
                    ) : !processedImage && !convertedImage ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-purple-200">
                          <p className="text-sm text-gray-600 mb-3 text-center">업로드된 이미지</p>
                          <div className="flex justify-center">
                            <img src={uploadedImage} alt="Uploaded" className="max-w-full max-h-48 object-contain rounded" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={handleRemoveBackground}
                            disabled={isRemovingBackground}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isRemovingBackground ? (
                              <><Loader2 className="w-5 h-5 animate-spin" /><span>배경 제거 중...</span></>
                            ) : (
                              <><Scissors className="w-5 h-5" /><span>배경 우선 제거하기</span></>
                            )}
                          </button>
                          <button
                            onClick={() => convertImageTo17x17(uploadedImage)}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md"
                          >
                            <Upload className="w-5 h-5" /><span>바로 변환</span>
                          </button>
                          <button
                            onClick={handleReset}
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                          >
                            <X className="w-5 h-5" /><span>취소</span>
                          </button>
                        </div>
                      </div>
                    ) : processedImage && !convertedImage ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-300">
                          <p className="text-sm text-green-700 mb-3 text-center font-semibold">✅ 배경 제거 완료</p>
                          <div className="flex justify-center rounded p-2" style={CHECKERBOARD}>
                            <img src={processedImage} alt="Background Removed" className="max-w-full max-h-48 object-contain rounded" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => convertImageTo17x17(processedImage)}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md"
                          >
                            <Upload className="w-5 h-5" /><span>길드마크로 변환하기</span>
                          </button>
                          <button
                            onClick={handleReset}
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                          >
                            <X className="w-5 h-5" /><span>취소</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-6 border-2 border-purple-200">
                          <p className="text-sm text-gray-600 mb-3 text-center">변환된 길드 마크</p>
                          <div className="flex justify-center items-center gap-6">
                            {([{ size: 23, label: "1x" }, { size: 46, label: "2x" }, { size: 92, label: "4x" }] as const).map(({ size, label }) => (
                              <div key={size} className="flex flex-col items-center gap-2">
                                <div className="bg-white rounded border-2 border-gray-300 p-3">
                                  <img
                                    src={convertedImage!}
                                    alt={`Converted ${label}`}
                                    style={{ width: size, height: size, imageRendering: "pixelated" }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={handleDownloadConverted}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md"
                          >
                            <Download className="w-5 h-5" /><span>17x17 이미지 다운로드</span>
                          </button>
                          <button
                            onClick={() => initEditorFromImage(convertedImage!)}
                            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md"
                          >
                            <Pencil className="w-5 h-5" /><span>캔버스에서 편집하기</span>
                          </button>
                          <button
                            onClick={handleReset}
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                          >
                            <X className="w-5 h-5" /><span>초기화</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                    <h3 className="font-semibold text-purple-700 mb-3">💡 사용 팁</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>AI 배경 제거 기능을 사용하면 자동으로 누끼를 따서 깔끔한 길드 마크를 만들 수 있습니다.(누끼 작업은 PC 성능의 영향을 받습니다.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>17x17 픽셀은 매우 작은 크기이므로 단순한 도안이나 로고를 추천합니다.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>배경이 투명한 PNG 파일을 사용하면 더 깔끔한 결과를 얻을 수 있습니다.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>변환 후 캔버스 에디터로 세부 색상을 직접 수정할 수 있습니다.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>빈 캔버스에서 직접 픽셀 아트를 그릴 수도 있습니다.</span>
                      </li>
                    </ul>
                    {uploadedImage && !convertedImage && (
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <p className="text-xs text-gray-600 mb-2">원본 이미지 미리보기:</p>
                        <div className="bg-white rounded p-2 border border-purple-200 flex justify-center">
                          <img src={uploadedImage} alt="Original" className="max-w-full max-h-32 object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pixel Editor */}
              {showEditor && (
                <div id="pixel-editor" className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-indigo-200 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl text-indigo-700 flex items-center gap-2">
                      <Pencil className="w-6 h-6" />
                      픽셀 에디터
                    </h2>
                    <button
                      onClick={() => setShowEditor(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Grid */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(17, 20px)",
                          border: "2px solid #a5b4fc",
                          borderRadius: "6px",
                          overflow: "hidden",
                          userSelect: "none",
                          ...CHECKERBOARD,
                        }}
                        onMouseLeave={() => setIsMouseDown(false)}
                      >
                        {pixels.map((row, y) =>
                          row.map((color, x) => (
                            <div
                              key={`${y}-${x}`}
                              style={{
                                width: 20,
                                height: 20,
                                backgroundColor: color === "transparent" ? "transparent" : color,
                                outline: "0.5px solid rgba(0,0,0,0.08)",
                                cursor: toolCursor,
                                boxSizing: "border-box",
                              }}
                              onMouseDown={(e) => handlePixelMouseDown(e, y, x)}
                              onMouseEnter={() => handlePixelMouseEnter(y, x)}
                              onMouseUp={() => setIsMouseDown(false)}
                            />
                          ))
                        )}
                      </div>
                      <p className="text-xs text-gray-400">17 × 17 | 클릭 또는 드래그로 색칠</p>
                    </div>

                    {/* Tools Panel */}
                    <div className="flex-1 space-y-5 min-w-0">
                      {/* Tool buttons */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">도구</p>
                        <div className="flex flex-wrap gap-2">
                          {(["draw", "erase", "pick"] as const).map((tool) => (
                            <button
                              key={tool}
                              onClick={() => setActiveTool(tool)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                activeTool === tool
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400"
                              }`}
                            >
                              {tool === "draw" && <Pencil className="w-4 h-4" />}
                              {tool === "erase" && <Eraser className="w-4 h-4" />}
                              {tool === "pick" && <Pipette className="w-4 h-4" />}
                              {tool === "draw" ? "그리기" : tool === "erase" ? "지우기" : "색 따오기"}
                            </button>
                          ))}
                          <button
                            onClick={() => setPixels(emptyPixels())}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all bg-white text-red-500 border-red-200 hover:bg-red-50 hover:border-red-400"
                          >
                            <Trash2 className="w-4 h-4" />전체 지우기
                          </button>
                        </div>
                      </div>

                      {/* 색 따오기 안내 */}
                      {activeTool === "pick" && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-700">
                          <Pipette className="w-4 h-4 flex-shrink-0" />
                          캔버스의 픽셀을 클릭하면 해당 색상이 선택됩니다.
                        </div>
                      )}

                      {/* Color Canvas */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">색상 캔버스</p>
                        <div className="grid grid-cols-8 gap-1 mb-3">
                          {PALETTE_COLORS.map((color) => (
                            <button
                              key={color}
                              title={color}
                              onClick={() => { setSelectedColor(color); setActiveTool("draw"); }}
                              style={{ backgroundColor: color }}
                              className={`w-8 h-8 rounded-md transition-transform border ${
                                selectedColor === color && activeTool === "draw"
                                  ? "ring-2 ring-indigo-600 ring-offset-1 scale-110 border-transparent"
                                  : "border-gray-300 hover:scale-110"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">커스텀:</span>
                          <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => { setSelectedColor(e.target.value); setActiveTool("draw"); }}
                            className="w-10 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
                          />
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: selectedColor }}
                          />
                          <span className="text-xs font-mono text-gray-500">{selectedColor}</span>
                        </div>
                      </div>

                      {/* Live Preview */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">미리보기</p>
                        <div className="flex items-end gap-4">
                          {([{ size: 23, label: "1x" }, { size: 46, label: "2x" }, { size: 92, label: "4x" }] as const).map(({ size, label }) => (
                            <div key={size} className="flex flex-col items-center gap-1">
                              <div
                                style={{
                                  width: size + 8,
                                  height: size + 8,
                                  padding: 4,
                                  border: "1px solid #d1d5db",
                                  borderRadius: 4,
                                  backgroundImage:
                                    "linear-gradient(45deg,#e0e0e0 25%,transparent 25%)," +
                                    "linear-gradient(-45deg,#e0e0e0 25%,transparent 25%)," +
                                    "linear-gradient(45deg,transparent 75%,#e0e0e0 75%)," +
                                    "linear-gradient(-45deg,transparent 75%,#e0e0e0 75%)",
                                  backgroundSize: "6px 6px",
                                  backgroundPosition: "0 0,0 3px,3px -3px,-3px 0px",
                                  backgroundColor: "#ffffff",
                                }}
                              >
                                <div
                                  style={{
                                    width: size,
                                    height: size,
                                    display: "grid",
                                    gridTemplateColumns: "repeat(17, 1fr)",
                                  }}
                                >
                                  {pixels.map((row, y) =>
                                    row.map((color, x) => (
                                      <div
                                        key={`p-${size}-${y}-${x}`}
                                        style={{
                                          backgroundColor:
                                            color === "transparent" ? "transparent" : color,
                                        }}
                                      />
                                    ))
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={exportEditorImage}
                          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />17x17 PNG 다운로드
                        </button>
                        {convertedImage && (
                          <button
                            onClick={() => initEditorFromImage(convertedImage)}
                            className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <Upload className="w-4 h-4" />변환 이미지로 초기화
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Guild Marks Grid */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
                <h2 className="text-xl md:text-2xl mb-4 md:mb-6 text-purple-700">
                  사용 가능한 길드 마크 ({guildMarksDatabase.length}개)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {guildMarksDatabase.map((mark) => (
                    <div
                      key={mark.id}
                      className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 hover:scale-105 flex flex-col items-center gap-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center p-2">
                            <img
                              src={mark.imageData}
                              alt={mark.name}
                              style={{ width: 23, height: 23, imageRendering: "pixelated" }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">1x</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center p-2">
                            <img
                              src={mark.imageData}
                              alt={mark.name}
                              style={{ width: 46, height: 46, imageRendering: "pixelated" }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">2x</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm line-clamp-2">{mark.name}</p>
                        <p className="text-xs text-gray-500">17x17px</p>
                      </div>
                      <button
                        onClick={() => handleDownload(mark)}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md text-sm"
                      >
                        <Download className="w-4 h-4" />다운로드
                      </button>
                    </div>
                  ))}
                </div>
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
