import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { AdBanner } from "./AdBanner";
import { Footer } from "./Footer";
import mapleLeaf from "../../assets/images/maple-leaf.png";
import headerBg from "../../assets/images/header.png";

interface Event {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  url: string;
  color: string;
}

// Sample events (you can add more later)
const sampleEvents: Event[] = [
  {
    id: 1,
    name: "뉴네임 옥션",
    startDate: new Date(2025, 11, 24), // Dec 24, 2025
    endDate: new Date(2026, 0, 14), // Jan 14, 2026
    url: "https://maplestory.nexon.com",
    color: "#f59e0b", // amber
  },
  {
    id: 2,
    name: "작은 눈사람의 행복",
    startDate: new Date(2025, 11, 25), // Dec 25, 2025
    endDate: new Date(2025, 11, 31), // Dec 31, 2025
    url: "https://maplestory.nexon.com",
    color: "#06b6d4", // cyan
  },
  {
    id: 3,
    name: "챌린저스 월드 시즌3",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 3, 16), // Apr 16, 2026
    url: "https://maplestory.nexon.com",
    color: "#8b5cf6", // violet
  },
  {
    id: 4,
    name: "아이템 버닝 PLUS",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 3, 22), // Apr 22, 2026
    url: "https://maplestory.nexon.com",
    color: "#ef4444", // red
  },
  {
    id: 5,
    name: "하이퍼 버닝 MAX",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 5, 17), // Jun 17, 2026
    url: "https://maplestory.nexon.com",
    color: "#dc2626", // dark red
  },
  {
    id: 6,
    name: "버닝 BEYOND",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 5, 17), // Jun 17, 2026
    url: "https://maplestory.nexon.com",
    color: "#f97316", // orange
  },
  {
    id: 7,
    name: "닉네임 익스프레스",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 0, 14), // Jan 14, 2026
    url: "https://maplestory.nexon.com",
    color: "#10b981", // emerald
  },
  {
    id: 8,
    name: "KINETIC 뷰티 익스프레스",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 0, 14), // Jan 14, 2026
    url: "https://maplestory.nexon.com",
    color: "#ec4899", // pink
  },
  {
    id: 9,
    name: "커스텀 일러스트 이벤트",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 0, 14), // Jan 14, 2026
    url: "https://maplestory.nexon.com",
    color: "#a855f7", // purple
  },
  {
    id: 10,
    name: "카이 최초 격파 이벤트",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 3, 15), // Apr 15, 2026
    url: "https://maplestory.nexon.com",
    color: "#3b82f6", // blue
  },
  {
    id: 11,
    name: "챌린저스 파트너",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 3, 15), // Apr 15, 2026
    url: "https://maplestory.nexon.com",
    color: "#6366f1", // indigo
  },
  {
    id: 12,
    name: "챌린저스 패스",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 1, 11), // Feb 11, 2026
    url: "https://maplestory.nexon.com",
    color: "#14b8a6", // teal
  },
  {
    id: 13,
    name: "의문의 결계",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 3, 15), // Apr 15, 2026
    url: "https://maplestory.nexon.com",
    color: "#9333ea", // purple
  },
  {
    id: 14,
    name: "모멘텀 패스",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 2, 18), // Mar 18, 2026
    url: "https://maplestory.nexon.com",
    color: "#0ea5e9", // sky
  },
  {
    id: 15,
    name: "엘라노스 크로니클",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 2, 18), // Mar 18, 2026
    url: "https://maplestory.nexon.com",
    color: "#84cc16", // lime
  },
  {
    id: 16,
    name: "탈라하트 판타지아",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 2, 18), // Mar 18, 2026
    url: "https://maplestory.nexon.com",
    color: "#d946ef", // fuchsia
  },
  {
    id: 17,
    name: "KINETIC",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 0, 14), // Jan 14, 2026
    url: "https://maplestory.nexon.com",
    color: "#22c55e", // green
  },
  {
    id: 18,
    name: "겨울나기 미션",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 2, 18), // Mar 18, 2026
    url: "https://maplestory.nexon.com",
    color: "#06b6d4", // cyan
  },
  {
    id: 19,
    name: "일루전 코인샵&환영의 기억",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 2, 18), // Mar 18, 2026
    url: "https://maplestory.nexon.com",
    color: "#8b5cf6", // violet
  },
  {
    id: 20,
    name: "프리미엄 PC방 접속 보상 이벤트",
    startDate: new Date(2025, 11, 19), // Dec 19, 2025
    endDate: new Date(2026, 0, 15), // Jan 15, 2026
    url: "https://maplestory.nexon.com",
    color: "#f59e0b", // amber
  },
  {
    id: 21,
    name: "VIP 사우나",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2026, 5, 17), // Jun 17, 2026
    url: "https://maplestory.nexon.com",
    color: "#10b981", // emerald
  },
  {
    id: 22,
    name: "월드 리프",
    startDate: new Date(2025, 11, 18), // Dec 18, 2025
    endDate: new Date(2025, 11, 31), // Dec 31, 2025
    url: "https://maplestory.nexon.com",
    color: "#22c55e", // green
  },
  {
    id: 23,
    name: "윈터 카운트 다운",
    startDate: new Date(2025, 10, 20), // Nov 20, 2025
    endDate: new Date(2025, 11, 31), // Dec 31, 2025
    url: "https://maplestory.nexon.com",
    color: "#3b82f6", // blue
  },
];

// Update schedules
const updateSchedules = [
  {
    id: 1,
    name: "솔헤카테 / 찬란한 흉성 / 아스트라 보조무기 업데이트",
    date: new Date(2026, 0, 15), // Jan 15, 2026
    url: "https://maplestory.nexon.com",
    color: "#3b82f6", // blue
  },
  {
    id: 2,
    name: "유피테르 / 데스티니 2차 해방 / 길드 캐슬 / 기어드락 업데이트",
    date: new Date(2026, 1, 12), // Feb 12, 2026
    url: "https://maplestory.nexon.com",
    color: "#22c55e", // green
  },
];

export function EventCalendarPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [currentDate, setCurrentDate] = useState(
    new Date(2025, 11, 1),
  ); // Dec 2025
  const getToday = () => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
};

  const today = getToday();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get events for the current month
  const eventsInMonth = sampleEvents.filter((event) => {
    return (
      (event.startDate.getFullYear() === year &&
        event.startDate.getMonth() === month) ||
      (event.endDate.getFullYear() === year &&
        event.endDate.getMonth() === month) ||
      (event.startDate < firstDayOfMonth &&
        event.endDate > lastDayOfMonth)
    );
  }).sort((a, b) => {
    // Sort by end date descending (events ending later appear first)
    return b.endDate.getTime() - a.endDate.getTime();
  });

  // Get update schedules for the current month
  const updatesInMonth = updateSchedules.filter((schedule) => {
    return (
      schedule.date.getFullYear() === year &&
      schedule.date.getMonth() === month
    );
  }).sort((a, b) => {
    // Sort by date ascending (earlier dates first)
    return a.date.getTime() - b.date.getTime();
  });

  // Check if a day has an event
  const getEventsForDay = (day: number) => {
    const currentDay = new Date(year, month, day);
    return sampleEvents.filter((event) => {
      return (
        currentDay >= event.startDate &&
        currentDay <= event.endDate
      );
    });
  };

  // Check if a day has an update schedule
  const getUpdateForDay = (day: number) => {
    const currentDay = new Date(year, month, day);
    return updateSchedules.find((schedule) => {
      return (
        currentDay.getFullYear() === schedule.date.getFullYear() &&
        currentDay.getMonth() === schedule.date.getMonth() &&
        currentDay.getDate() === schedule.date.getDate()
      );
    });
  };

  // Check if a day is the start of an event
  const isEventStart = (day: number, event: Event) => {
    const currentDay = new Date(year, month, day);
    return (
      currentDay.getFullYear() ===
        event.startDate.getFullYear() &&
      currentDay.getMonth() === event.startDate.getMonth() &&
      currentDay.getDate() === event.startDate.getDate()
    );
  };

  // Check if a day is the end of an event
  const isEventEnd = (day: number, event: Event) => {
    const currentDay = new Date(year, month, day);
    return (
      currentDay.getFullYear() ===
        event.endDate.getFullYear() &&
      currentDay.getMonth() === event.endDate.getMonth() &&
      currentDay.getDate() === event.endDate.getDate()
    );
  };

  // Get events that span across a week
  const getWeekEvents = (week: (number | null)[]) => {
    const weekEvents: {
      event: Event;
      startCol: number;
      endCol: number;
      row: number;
    }[] = [];

    sampleEvents.forEach((event) => {
      let startCol = -1;
      let endCol = -1;

      week.forEach((day, colIdx) => {
        if (day) {
          const dayEvents = getEventsForDay(day);
          if (dayEvents.includes(event)) {
            if (startCol === -1) startCol = colIdx;
            endCol = colIdx;
          }
        }
      });

      if (startCol !== -1) {
        weekEvents.push({ event, startCol, endCol, row: 0 });
      }
    });

    // Assign rows to avoid overlapping
    weekEvents.forEach((we, idx) => {
      let row = 0;
      for (let i = 0; i < idx; i++) {
        const other = weekEvents[i];
        if (
          we.startCol <= other.endCol &&
          we.endCol >= other.startCol
        ) {
          row = Math.max(row, other.row + 1);
        }
      }
      we.row = row;
    });

    return weekEvents;
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null); // Empty cells before the first day
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Group calendar days into weeks
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // Calculate days remaining until event ends
  const getDaysRemaining = (event: Event) => {
    // Check if event hasn't started yet
    if (event.startDate > today) {
      return "시작전";
    }
    
    const timeDiff = event.endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(
      timeDiff / (1000 * 60 * 60 * 24),
    );

    if (daysDiff < 0) {
      return "종료됨";
    } else if (daysDiff === 0) {
      return "오늘 종료";
    } else {
      return `남은 기간 ${daysDiff}일`;
    }
  };

  // Calculate total event duration
  const getEventDuration = (event: Event) => {
    const timeDiff = event.endDate.getTime() - event.startDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    const weeks = Math.floor(totalDays / 7);
    return `(총 ${totalDays}일/${weeks}주)`;
  };

  // Get all Sundays in the current month
  const getSundaysInMonth = () => {
    const sundays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      if (currentDay.getDay() === 0) { // 0 = Sunday
        sundays.push(day);
      }
    }
    return sundays;
  };

  const sundaysInMonth = getSundaysInMonth();

  // Sunday Maple benefits for specific dates
  const getSundayBenefit = (day: number) => {
    // December 2025 specific benefits
    if (year === 2025 && month === 11) {
      if (day === 7) {
        return "트헌 3배 / 몬파 250%";
      } else if (day === 14) {
        return "샤타포스(30% 할인, 21성 이하 파괴확률 감소)";
      } else if (day === 21) {
        return "트헌 3배 / 룰 시간 감소 / 룰 경험치 100% / 콤보킬 경험치 300% / 몬파 250% / 사냥 솔에르다 2배";
      } else if (day === 28) {
        return "트헌 3배 / 어빌 50% / 룰 시간 감소 / 룰 경험치 100% / 콤보킬 경험치 300% / 몬파 250% / 사냥 솔에르다 2개 / 챌섭 샤타포스(30%할인, 21성 파괴확률 감소)";
      }
    }
    
    // If year is 2026 or later (January 2026 onwards), show "아직 몰라요"
    if (year >= 2026) {
      return "아직 몰라요";
    }
    
    // Default for other months
    return "아직 몰라요";
  };

  const getSundayBenefitColor = (day: number) => {
    // December 2025 specific colors
    if (year === 2025 && month === 11) {
      if (day === 7) {
        return "#3b82f6"; // blue
      } else if (day === 14) {
        return "#f59e0b"; // amber
      } else if (day === 21) {
        return "#8b5cf6"; // violet
      } else if (day === 28) {
        return "#ec4899"; // pink
      }
    }
    
    // If year is 2026 or later, show gray color
    if (year >= 2026) {
      return "#9ca3af"; // gray
    }
    
    // Default gray for unknown
    return "#9ca3af";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-50">
      <div className="flex gap-4 p-2 md:p-4">
        {/* Left Ad Banner */}
        <div className="hidden lg:block flex-shrink-0">
          <AdBanner type="vertical" />
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
            <p
              className="relative z-10 text-purple-700 font-semibold text-center text-sm md:text-xl mt-2 md:mt-4 tracking-wide"
              style={{
                textShadow:
                  "0 2px 10px rgba(255,255,255,0.8), 0 0 20px rgba(168, 85, 247, 0.3)",
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
            <button className="flex-1 bg-white py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-400 text-sm md:text-base">
              📅 이벤트 캘린더
            </button>
            <button
              onClick={() => onNavigate("guildmarks")}
              className="flex-1 bg-purple-100 py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-300 hover:bg-purple-200 transition-colors text-sm md:text-base"
            >
              🎨 길드 마크
            </button>
          </div>

          {/* Event List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Left: Event List */}
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1.5 md:p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <h2 className="text-xl md:text-2xl text-purple-700">
                  {year}년 {monthNames[month]}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="p-1.5 md:p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <h3 className="text-lg md:text-xl mb-3 md:mb-4 text-purple-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  이벤트 목록
                </div>
                <div className="text-sm md:text-base text-purple-600 font-semibold">
                  오늘: {formatDate(today)}
                </div>
              </h3>

              {eventsInMonth.length > 0 ? (
                <div className="space-y-2 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                  {eventsInMonth.map((event) => (
                    <a
                      key={event.id}
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group rounded-lg p-2 md:p-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 hover:scale-102 flex items-start gap-2 ${
                        getDaysRemaining(event) === "종료됨"
                          ? "bg-gray-200"
                          : "bg-white"
                      }`}
                      style={{ borderColor: event.color }}
                    >
                      <div
                        className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1 min-w-0">
                        {/* Event Name */}
                        <h3 className="text-sm md:text-base font-semibold group-hover:opacity-80 transition-opacity mb-1">
                          {event.name}
                        </h3>
                        {/* Event Details */}
                        <div className="flex flex-wrap items-center gap-1 text-xs md:text-sm">
                          <p className="text-gray-600">
                            {formatDate(event.startDate).slice(5)} ~{" "}
                            {formatDate(event.endDate).slice(5)}
                          </p>
                          <span className="text-gray-400">|</span>
                          <p
                            className={`font-semibold ${
                              getDaysRemaining(event) === "종료됨"
                                ? "text-gray-400"
                                : getDaysRemaining(event) === "오늘 종료"
                                  ? "text-red-500"
                                  : getDaysRemaining(event) === "시작전"
                                    ? "text-blue-500"
                                    : "text-purple-600"
                            }`}
                          >
                            {getDaysRemaining(event)}
                          </p>
                          <span className="text-gray-400">|</span>
                          <p className="text-gray-500">
                            {getEventDuration(event)}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  이번 달에는 등록된 이벤트가 없습니다.
                </p>
              )}
            </div>

            {/* Right: Sunday Maple & Update Schedule */}
            <div className="flex flex-col gap-4">
              {/* Sunday Maple */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
                <h3 className="text-lg md:text-xl mb-3 md:mb-4 text-purple-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  썬데이 메이플
                </h3>
                <div className="space-y-2">
                  <p className="text-sm md:text-base text-gray-600 mb-2">
                    {year}년 {monthNames[month]} 일요일 혜택
                  </p>
                  {sundaysInMonth.length > 0 ? (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                      {sundaysInMonth.map((sunday) => (
                        <a
                          key={sunday}
                          href="https://maplestory.nexon.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white rounded-lg p-2 md:p-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 hover:scale-102 flex items-start gap-2"
                          style={{ borderColor: getSundayBenefitColor(sunday) }}
                        >
                          <div
                            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: getSundayBenefitColor(sunday) }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm md:text-base font-semibold group-hover:opacity-80 transition-opacity mb-1">
                              {getSundayBenefit(sunday)}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1 text-xs md:text-sm">
                              <p className="text-gray-600">
                                {month + 1}/{sunday} (일)
                              </p>
                              <span className="text-gray-400">|</span>
                              <p className="text-gray-500">
                                00:00 ~ 23:59
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8 text-sm">
                      이번 달에는 일요일이 없습니다.
                    </p>
                  )}
                </div>
              </div>

              {/* Update Schedule */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
                <h3 className="text-lg md:text-xl mb-3 md:mb-4 text-purple-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  업데이트 일정
                </h3>
                {updatesInMonth.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                    {updatesInMonth.map((schedule) => (
                      <a
                        key={schedule.id}
                        href={schedule.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 hover:scale-102 flex items-center gap-2 block"
                        style={{ borderColor: schedule.color }}
                      >
                        <div className="flex-1">
                          <p className="text-sm md:text-base font-semibold text-gray-800 group-hover:opacity-80">
                            {schedule.name}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            {formatDate(schedule.date)}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    이번 달에는 예정된 업데이트가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg border-2 border-purple-200">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-300">
              {["일", "월", "화", "수", "목", "금", "토"].map(
                (day, idx) => (
                  <div
                    key={day}
                    className={`text-center py-2 border-r last:border-r-0 relative ${
                      idx === 4
                        ? "border-l-2 border-l-blue-400 border-dashed border-r-2 border-r-blue-400"
                        : "border-gray-300"
                    } ${
                      idx === 0
                        ? "text-red-600"
                        : idx === 6
                          ? "text-blue-600"
                          : "text-gray-700"
                    }`}
                  >
                    {idx === 4 && (
                      <div className="text-xs text-blue-400 font-semibold mb-1">
                        컨텐츠 초기화
                      </div>
                    )}
                    {day}
                  </div>
                ),
              )}
            </div>

            {/* Calendar grid */}
            <div className="border-l border-r border-b border-gray-300">
              {weeks.map((week, weekIdx) => {
                return (
                  <div
                    key={weekIdx}
                    className="relative border-t border-gray-300"
                  >
                    {/* Day cells */}
                    <div className="grid grid-cols-7">
                      {week.map((day, dayIdx) => {
                        const dayEvents = day
                          ? getEventsForDay(day)
                          : [];
                        const dayUpdate = day
                          ? getUpdateForDay(day)
                          : null;

                        return (
                          <div
                            key={dayIdx}
                            className={`border-r last:border-r-0 p-2 pt-1 min-h-[100px] relative ${
                              dayIdx === 4
                                ? "border-l-2 border-l-blue-400 border-dashed border-r-2 border-r-blue-400"
                                : "border-gray-300"
                            } ${
                              day
                                ? dayEvents.length > 0
                                  ? "bg-purple-50/30"
                                  : "bg-white"
                                : "bg-gray-50"
                            }`}
                          >
                            {day && (
                              <>
                                <div
                                  className={`text-sm mb-2 ${
                                    dayIdx === 0
                                      ? "text-red-600"
                                      : dayIdx === 6
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                  }`}
                                >
                                  {day}
                                </div>
                                
                                {/* Update Schedule Badge */}
                                {dayUpdate && (
                                  <a
                                    href={dayUpdate.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group mb-2 block"
                                  >
                                    <div
                                      className="px-2 py-1 rounded text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                                      style={{
                                        backgroundColor: dayUpdate.color,
                                      }}
                                    >
                                      🔄 업데이트
                                    </div>
                                    {/* Tooltip on hover */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-8 hidden group-hover:block z-10 pointer-events-none whitespace-nowrap">
                                      <div
                                        className="rounded px-3 py-2 text-white text-xs shadow-lg"
                                        style={{
                                          backgroundColor: dayUpdate.color,
                                        }}
                                      >
                                        <div className="font-semibold">
                                          {dayUpdate.name}
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                )}
                                
                                {/* Event dots */}
                                {dayEvents.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {dayEvents.map((event) => (
                                      <a
                                        key={event.id}
                                        href={event.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                        title={event.name}
                                      >
                                        <div
                                          className="w-2 h-2 rounded-full hover:scale-150 transition-transform cursor-pointer"
                                          style={{
                                            backgroundColor:
                                              event.color,
                                          }}
                                        />
                                        {/* Tooltip on hover */}
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 pointer-events-none">
                                          <div
                                            className="rounded px-2 py-1.5 text-white text-xs whitespace-nowrap shadow-lg"
                                            style={{
                                              backgroundColor:
                                                event.color,
                                            }}
                                          >
                                            <div className="font-semibold">
                                              {event.name}
                                            </div>
                                            <div className="text-[10px] opacity-90">
                                              {formatDate(
                                                event.startDate,
                                              ).slice(5)}{" "}
                                              ~{" "}
                                              {formatDate(
                                                event.endDate,
                                              ).slice(5)}
                                            </div>
                                          </div>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
        <AdBanner
          type="horizontal"
          className="mx-auto max-w-6xl"
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}