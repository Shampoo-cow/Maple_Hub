import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import mapleLeaf from "../../assets/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";
import headerBg from "../../assets/0bbd438f2659f0b454ed2b2e5656ebd71721c84f.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface LedgerEntry {
  id: number;
  userId: string;
  item: string;
  startLevel: string;
  targetLevel: string;
  expectedMeso: number;
  usedMeso: number;
  profit: number;
}

export function BlacksmithLedgerPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [blacksmithName, setBlacksmithName] = useState("");
  const [inputMode, setInputMode] = useState<
    "direct" | "calculate"
  >("direct");
  const [showWarningModal, setShowWarningModal] =
    useState(true);
  const [newEntry, setNewEntry] = useState({
    userId: "",
    item: "",
    startLevel: "",
    targetLevel: "",
    expectedMeso: "",
    usedMeso: "",
    beforeMeso: "",
    afterMeso: "",
  });
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const handleAddEntry = () => {
    if (
      !newEntry.userId ||
      !newEntry.item ||
      !newEntry.startLevel ||
      !newEntry.targetLevel ||
      !newEntry.expectedMeso
    ) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    let usedMeso = 0;
    if (inputMode === "direct") {
      if (!newEntry.usedMeso) {
        alert("사용메소를 입력해주세요!");
        return;
      }
      usedMeso = Number(newEntry.usedMeso);
    } else {
      if (!newEntry.beforeMeso || !newEntry.afterMeso) {
        alert("강화 전후 메소를 입력해주세요!");
        return;
      }
      usedMeso =
        Number(newEntry.beforeMeso) -
        Number(newEntry.afterMeso);
    }

    const expectedMeso = Number(newEntry.expectedMeso);
    const profit = expectedMeso - usedMeso;

    const entry: LedgerEntry = {
      id: entries.length + 1,
      userId: newEntry.userId,
      item: newEntry.item,
      startLevel: newEntry.startLevel,
      targetLevel: newEntry.targetLevel,
      expectedMeso,
      usedMeso,
      profit,
    };

    setEntries([...entries, entry]);
    setNewEntry({
      userId: "",
      item: "",
      startLevel: "",
      targetLevel: "",
      expectedMeso: "",
      usedMeso: "",
      beforeMeso: "",
      afterMeso: "",
    });
  };

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleDownloadPDF = async () => {
    if (!pdfContentRef.current) {
      alert("콘텐츠를 찾을 수 없습니다.");
      return;
    }

    try {
      const element = pdfContentRef.current;

      // PDF 영역을 임시로 표시
      element.style.visibility = "visible";
      element.style.position = "fixed";
      element.style.top = "0";
      element.style.left = "0";
      element.style.zIndex = "-1";

      // 약간의 지연을 주어 렌더링 완료 대기
      await new Promise((resolve) => setTimeout(resolve, 100));

      // html2canvas로 캡처
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 900,
        height: element.scrollHeight,
      });

      // 캡처 후 다시 숨김
      element.style.visibility = "hidden";
      element.style.top = "-9999px";
      element.style.zIndex = "";

      const imgData = canvas.toDataURL("image/png");

      // PDF 생성
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight =
        (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지에 이미지 추가
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
      );
      heightLeft -= pdfHeight;

      // 추가 페이지가 필요한 경우
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
        );
        heightLeft -= pdfHeight;
      }

      // 파일명 생성
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const timeStr = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

      // PDF 저장
      pdf.save(`대장장이_가계부_${dateStr}_${timeStr}.pdf`);
    } catch (error) {
      console.error("PDF 생성 오류:", error);

      // 에러 발생 시에도 다시 숨김
      if (pdfContentRef.current) {
        pdfContentRef.current.style.visibility = "hidden";
        pdfContentRef.current.style.top = "-9999px";
      }

      alert("PDF 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const formatNumber = (num: number) => {
    const fixed = Number(num).toFixed(2);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const totalProfit = entries.reduce(
    (sum, entry) => sum + entry.profit,
    0,
  );

  const chartData = entries.map((entry, index) => {
    const cumulativeProfit = entries
      .slice(0, index + 1)
      .reduce((sum, e) => sum + e.profit, 0);
    return {
      id: `chart-${entry.id}-${index}`,
      순번: entry.id,
      누적손익: cumulativeProfit,
    };
  });

  // Y축 domain 계산 (0을 중앙에 고정)
  const getYAxisDomain = () => {
    if (chartData.length === 0) return [-100, 100];

    const values = chartData.map((d) => d.누적손익);
    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values, 0);
    const maxAbsValue = Math.max(
      Math.abs(maxValue),
      Math.abs(minValue),
    );

    // 여유 공간 추가 (10%)
    const padding = maxAbsValue * 0.1;
    const limit = maxAbsValue + padding;

    return [-limit, limit];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-50">
      {/* Warning Modal */}
      {showWarningModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-4 border-purple-400 transform transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6 rounded-t-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
                <span className="text-4xl">⚠️</span>
                <span>알림</span>
                <span className="text-4xl">⚠️</span>
              </h3>
            </div>
            <div className="p-6 md:p-8">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                <p className="text-center text-gray-800 leading-relaxed text-base md:text-lg">
                  가계부 컨텐츠는{" "}
                  <span className="font-bold text-red-600">
                    저장이 되지 않습니다
                  </span>
                  .
                  <br />
                  페이지를 나가면 내용이{" "}
                  <span className="font-bold text-red-600">
                    초기화
                  </span>{" "}
                  되니
                  <br />
                  필요시{" "}
                  <span className="font-bold text-blue-600">
                    PDF 다운로드
                  </span>
                  를 해주세요!
                </p>
              </div>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-bold"
              >
                확인했습니다! 🎮
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className="no-print rounded-2xl shadow-2xl p-4 md:p-8 mb-4 md:mb-6 border-2 md:border-4 border-purple-400 relative overflow-hidden"
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
                  filter:
                    "drop-shadow(0 4px 20px rgba(168, 85, 247, 0.5))",
                }}
              >
                Maple_Hub
                <span className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-30 -z-10">
                  Maple_Hub
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="no-print flex gap-2 md:gap-4 mb-4 md:mb-6">
            <button
              onClick={() => onNavigate("guildmarks")}
              className="flex-1 bg-purple-100 py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-300 hover:bg-purple-200 transition-colors text-sm md:text-base"
            >
              🎨 길드 마크
            </button>
            <button className="flex-1 bg-white py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-400 text-sm md:text-base">
              ⚒️ 대장장이 가계부
            </button>
          </div>

          {/* Main Layout: Content + Sidebar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Blacksmith Name Input */}
              <div className="no-print bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
                <label className="block mb-2 text-purple-700 font-semibold">
                  👤 대장장이 이름
                </label>
                <input
                  type="text"
                  placeholder="대장장이 이름을 입력하세요"
                  value={blacksmithName}
                  onChange={(e) =>
                    setBlacksmithName(e.target.value)
                  }
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              {/* Input Form */}
              <div className="no-print bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
                <h2 className="text-xl md:text-2xl mb-4 text-purple-700">
                  ⚒️ 새 기록 추가
                </h2>

                {/* Mode Selection */}
                <div className="mb-4 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMode"
                      checked={inputMode === "direct"}
                      onChange={() => setInputMode("direct")}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm md:text-base">
                      직접 입력
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMode"
                      checked={inputMode === "calculate"}
                      onChange={() => setInputMode("calculate")}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm md:text-base">
                      메소 계산
                    </span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      placeholder="아이디"
                      value={newEntry.userId}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          userId: e.target.value,
                        })
                      }
                      className="flex-1 min-w-[100px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="아이템"
                      value={newEntry.item}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          item: e.target.value,
                        })
                      }
                      className="flex-1 min-w-[100px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="시작"
                      value={newEntry.startLevel}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          startLevel: e.target.value,
                        })
                      }
                      className="flex-1 min-w-[80px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="목표"
                      value={newEntry.targetLevel}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          targetLevel: e.target.value,
                        })
                      }
                      className="flex-1 min-w-[80px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="기댓값"
                      value={newEntry.expectedMeso}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^0-9.]/g,
                          "",
                        );
                        const parts = value.split(".");
                        if (
                          parts.length <= 2 &&
                          (!parts[1] || parts[1].length <= 2)
                        ) {
                          setNewEntry({
                            ...newEntry,
                            expectedMeso: value,
                          });
                        }
                      }}
                      className="flex-1 min-w-[100px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    />

                    {inputMode === "direct" ? (
                      <input
                        type="text"
                        placeholder="사용메소"
                        value={newEntry.usedMeso}
                        onChange={(e) => {
                          const value = e.target.value.replace(
                            /[^0-9.]/g,
                            "",
                          );
                          const parts = value.split(".");
                          if (
                            parts.length <= 2 &&
                            (!parts[1] || parts[1].length <= 2)
                          ) {
                            setNewEntry({
                              ...newEntry,
                              usedMeso: value,
                            });
                          }
                        }}
                        className="flex-1 min-w-[100px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                      />
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="강화 전 메소"
                          value={newEntry.beforeMeso}
                          onChange={(e) => {
                            const value =
                              e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                            const parts = value.split(".");
                            if (
                              parts.length <= 2 &&
                              (!parts[1] ||
                                parts[1].length <= 2)
                            ) {
                              setNewEntry({
                                ...newEntry,
                                beforeMeso: value,
                              });
                            }
                          }}
                          className="flex-1 min-w-[120px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="강화 후 메소"
                          value={newEntry.afterMeso}
                          onChange={(e) => {
                            const value =
                              e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                            const parts = value.split(".");
                            if (
                              parts.length <= 2 &&
                              (!parts[1] ||
                                parts[1].length <= 2)
                            ) {
                              setNewEntry({
                                ...newEntry,
                                afterMeso: value,
                              });
                            }
                          }}
                          className="flex-1 min-w-[120px] px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                        />
                      </>
                    )}

                    <button
                      onClick={handleAddEntry}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      추가
                    </button>
                  </div>

                  <p className="text-xs text-gray-500">
                    (기본 메소의 단위는 억입니다. 천만, 백만
                    단위 소수점으로 표현해 주세요.)
                  </p>
                </div>
              </div>

              {/* Screen Display Area */}
              {entries.length > 0 && (
                <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200 mb-4">
                  {blacksmithName && (
                    <h3 className="text-2xl md:text-3xl font-bold text-purple-700 text-center mb-4">
                      {blacksmithName}의 메스피
                    </h3>
                  )}
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <h2 className="text-xl md:text-2xl text-purple-700">
                      📈 누적 손익 그래프
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-base text-purple-700">
                          💰 총 손익:
                        </span>
                        <div
                          className={`text-xl md:text-2xl flex items-center gap-1 ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {totalProfit >= 0 ? (
                            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                          ) : (
                            <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
                          )}
                          {totalProfit >= 0 ? "+" : ""}
                          {formatNumber(totalProfit)} 억 메소
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ResponsiveContainer
                      width="100%"
                      height={200}
                    >
                      <LineChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          key="grid"
                        />
                        <XAxis dataKey="순번" key="xaxis" />
                        <YAxis
                          tickFormatter={(value) =>
                            formatNumber(value)
                          }
                          domain={getYAxisDomain()}
                          key="yaxis"
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            formatNumber(value) + " 억 메소"
                          }
                          labelFormatter={(label) =>
                            `순번 ${label}`
                          }
                          key="tooltip"
                        />
                        <ReferenceLine
                          y={0}
                          stroke="#666"
                          strokeDasharray="3 3"
                          key="refline"
                        />
                        <Line
                          type="monotone"
                          dataKey="누적손익"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ fill: "#8b5cf6", r: 4 }}
                          activeDot={{ r: 6 }}
                          key="line"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Screen Table */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200 overflow-x-auto">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <h2 className="text-xl md:text-2xl text-purple-700">
                    📋 강화 기록
                  </h2>
                  {entries.length > 0 && (
                    <button
                      onClick={handleDownloadPDF}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      PDF 다운로드
                    </button>
                  )}
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-purple-100 border-b-2 border-purple-300">
                      <th
                        className="px-2 md:px-4 py-2 text-left"
                        rowSpan={2}
                      >
                        순번
                      </th>
                      <th
                        className="px-2 md:px-4 py-2 text-left"
                        rowSpan={2}
                      >
                        아이디
                      </th>
                      <th
                        className="px-2 md:px-4 py-2 text-left"
                        rowSpan={2}
                      >
                        아이템
                      </th>
                      <th
                        className="px-2 md:px-4 py-2 text-center border-b border-purple-200"
                        colSpan={2}
                      >
                        스타포스
                      </th>
                      <th
                        className="px-2 md:px-4 py-2 text-right"
                        rowSpan={2}
                      >
                        기댓값
                      </th>
                      <th
                        className="px-2 md:px-4 py-2 text-right"
                        rowSpan={2}
                      >
                        사용메소
                      </th>
                      <th
                        className="px-2 md:px-4 py-2 text-right"
                        rowSpan={2}
                      >
                        손익
                      </th>
                      <th
                        className="px-2 md:px-4 py-2 text-center"
                        rowSpan={2}
                      >
                        삭제
                      </th>
                    </tr>
                    <tr className="bg-purple-100 border-b-2 border-purple-300">
                      <th className="px-2 md:px-4 py-2 text-center">
                        시작
                      </th>
                      <th className="px-2 md:px-4 py-2 text-center">
                        목표
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-8 text-gray-500"
                        >
                          기록이 없습니다. 새 기록을
                          추가해보세요!
                        </td>
                      </tr>
                    ) : (
                      entries
                        .slice()
                        .reverse()
                        .map((entry) => (
                          <tr
                            key={entry.id}
                            className="border-b border-purple-100 hover:bg-purple-50"
                          >
                            <td className="px-2 md:px-4 py-2">
                              {entry.id}
                            </td>
                            <td className="px-2 md:px-4 py-2">
                              {entry.userId}
                            </td>
                            <td className="px-2 md:px-4 py-2">
                              {entry.item}
                            </td>
                            <td className="px-2 md:px-4 py-2 text-center">
                              {entry.startLevel}
                            </td>
                            <td className="px-2 md:px-4 py-2 text-center">
                              {entry.targetLevel}
                            </td>
                            <td className="px-2 md:px-4 py-2 text-right">
                              {formatNumber(entry.expectedMeso)}
                            </td>
                            <td className="px-2 md:px-4 py-2 text-right">
                              {formatNumber(entry.usedMeso)}
                            </td>
                            <td
                              className={`px-2 md:px-4 py-2 text-right ${entry.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {entry.profit >= 0 ? "+" : ""}
                              {formatNumber(entry.profit)}
                            </td>
                            <td className="px-2 md:px-4 py-2 text-center">
                              <button
                                onClick={() =>
                                  handleDeleteEntry(entry.id)
                                }
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Hidden PDF Content Area */}
              <div
                ref={pdfContentRef}
                style={{
                  position: "fixed",
                  top: "-9999px",
                  left: "0",
                  width: "900px",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  padding: "20px",
                  fontFamily:
                    "system-ui, -apple-system, sans-serif",
                  visibility: "hidden",
                  pointerEvents: "none",
                }}
              >
                {/* PDF Chart */}
                {entries.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      padding: "24px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "2px solid #e9d5ff",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#4b5563",
                        }}
                      >
                        {new Date().getFullYear()}-
                        {String(
                          new Date().getMonth() + 1,
                        ).padStart(2, "0")}
                        -
                        {String(new Date().getDate()).padStart(
                          2,
                          "0",
                        )}{" "}
                        {String(new Date().getHours()).padStart(
                          2,
                          "0",
                        )}
                        :
                        {String(
                          new Date().getMinutes(),
                        ).padStart(2, "0")}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "8px",
                        color: "#7c3aed",
                      }}
                    >
                      대장장이 가계부
                    </h2>
                    {blacksmithName && (
                      <h3
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          textAlign: "center",
                          marginBottom: "16px",
                          color: "#7c3aed",
                        }}
                      >
                        {blacksmithName}의 메스피
                      </h3>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: "18px",
                          color: "#7c3aed",
                        }}
                      >
                        📈 누적 손익 그래프
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#7c3aed",
                          }}
                        >
                          💰 총 손익:
                        </span>
                        <div
                          style={{
                            fontSize: "18px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color:
                              totalProfit >= 0
                                ? "#16a34a"
                                : "#dc2626",
                          }}
                        >
                          {totalProfit >= 0 ? (
                            <TrendingUp
                              style={{
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          ) : (
                            <TrendingDown
                              style={{
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          )}
                          {totalProfit >= 0 ? "+" : ""}
                          {formatNumber(totalProfit)} 억 메소
                        </div>
                      </div>
                    </div>
                    <div>
                      <ResponsiveContainer
                        width="100%"
                        height={200}
                      >
                        <LineChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            key="grid"
                          />
                          <XAxis dataKey="순번" key="xaxis" />
                          <YAxis
                            tickFormatter={(value) =>
                              formatNumber(value)
                            }
                            domain={getYAxisDomain()}
                            key="yaxis"
                          />
                          <Tooltip
                            formatter={(value: number) =>
                              formatNumber(value) + " 억 메소"
                            }
                            labelFormatter={(label) =>
                              `순번 ${label}`
                            }
                            key="tooltip"
                          />
                          <ReferenceLine
                            y={0}
                            stroke="#666666"
                            strokeDasharray="3 3"
                            key="refline"
                          />
                          <Line
                            type="monotone"
                            dataKey="누적손익"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ fill: "#8b5cf6", r: 4 }}
                            activeDot={{ r: 6 }}
                            key="line"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* PDF Table */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    border: "2px solid #e9d5ff",
                    overflowX: "auto",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      color: "#7c3aed",
                      marginBottom: "16px",
                    }}
                  >
                    📋 강화 기록
                  </h2>
                  <table
                    style={{
                      width: "100%",
                      fontSize: "14px",
                      borderCollapse: "collapse",
                      color: "#000000",
                      border: "1px solid #d8b4fe",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#e9d5ff",
                          color: "#000000",
                        }}
                      >
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "left",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "50px",
                          }}
                        >
                          순번
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "left",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "80px",
                          }}
                        >
                          아이디
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "left",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "80px",
                          }}
                        >
                          아이템
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "center",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "50px",
                          }}
                        >
                          시작
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "center",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "50px",
                          }}
                        >
                          목표
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "right",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "70px",
                          }}
                        >
                          기댓값
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "right",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "80px",
                          }}
                        >
                          사용메소
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "right",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "70px",
                          }}
                        >
                          손익
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            textAlign: "center",
                            color: "#000000",
                            border: "1px solid #d8b4fe",
                            minWidth: "50px",
                          }}
                        >
                          삭제
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            style={{
                              padding: "32px",
                              textAlign: "center",
                              color: "#6b7280",
                              border: "1px solid #d8b4fe",
                            }}
                          >
                            기록이 없습니다. 새 기록을
                            추가해보세요!
                          </td>
                        </tr>
                      ) : (
                        entries
                          .slice()
                          .reverse()
                          .map((entry) => (
                            <tr
                              key={entry.id}
                              style={{
                                backgroundColor: "#ffffff",
                              }}
                            >
                              <td
                                style={{
                                  padding: "8px",
                                  color: "#000000",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {entry.id}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  color: "#000000",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {entry.userId}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  color: "#000000",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {entry.item}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  color: "#000000",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {entry.startLevel}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  color: "#000000",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {entry.targetLevel}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "right",
                                  color: "#000000",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {formatNumber(
                                  entry.expectedMeso,
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "right",
                                  color: "#000000",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {formatNumber(entry.usedMeso)}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "right",
                                  color:
                                    entry.profit >= 0
                                      ? "#16a34a"
                                      : "#dc2626",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                {entry.profit >= 0 ? "+" : ""}
                                {formatNumber(entry.profit)}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  border: "1px solid #d8b4fe",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    handleDeleteEntry(entry.id)
                                  }
                                  style={{
                                    color: "#ef4444",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Trash2
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                    }}
                                  />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="no-print">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="no-print">
          <Footer />
        </div>
      </div>
    </div>
  );
}
