import { ExternalLink, Youtube, Link, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface LinkItemProps {
  name: string;
  description: string;
  url: string;
  icon?: React.ReactNode;
}

function LinkItem({
  name,
  description,
  url,
  icon,
}: LinkItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 hover:scale-105"
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white">
          {icon || <Link className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm group-hover:text-purple-600 transition-colors">
              {name}
            </h3>
            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
          </div>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}

interface YouTuberCardProps {
  name: string;
  url: string;
  channelId?: string;
  apiKey?: string | null;
  checkLive?: boolean;
}

function YouTuberCard({
  name,
  url,
  channelId,
  apiKey,
  checkLive = false,
}: YouTuberCardProps) {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checkLive || !apiKey || !channelId) return;

    const checkLiveStatus = async () => {
      setLoading(true);
      try {
        // Use search endpoint to find live broadcasts
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`,
        );
        const data = await response.json();

        console.log(`Live check for ${name}:`, data);

        if (data.error) {
          console.error(`API Error for ${name}:`, data.error);
          setIsLive(false);
        } else if (data.items && data.items.length > 0) {
          setIsLive(true);
          console.log(`${name} is LIVE!`);
        } else {
          setIsLive(false);
          console.log(`${name} is not live`);
        }
      } catch (error) {
        console.error(
          `Error checking live status for ${name}:`,
          error,
        );
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    // Function to get check interval based on current time (KST)
    const getCheckInterval = () => {
      const now = new Date();
      // Convert to KST (UTC+9)
      const kstOffset = 9 * 60; // 9 hours in minutes
      const utc =
        now.getTime() + now.getTimezoneOffset() * 60000;
      const kstTime = new Date(utc + kstOffset * 60000);
      const kstHour = kstTime.getHours();

      // 11:00 - 21:00 (오전 11시 ~ 오후 9시): 60분마다 확인
      // 23:00 - 10:00 (오후 9시 ~ 오전 11시): 90분마다 확인
      if (kstHour >= 11 && kstHour < 21) {
        return 60 * 60 * 1000; // 60 minutes
      } else {
        return 90 * 60 * 1000; // 90 minutes
      }
    };

    checkLiveStatus();

    // Set up dynamic interval that rechecks the interval time
    let interval: NodeJS.Timeout;

    const setupNextCheck = () => {
      const nextInterval = getCheckInterval();
      interval = setTimeout(() => {
        checkLiveStatus();
        setupNextCheck(); // Schedule next check
      }, nextInterval);
    };

    setupNextCheck();

    return () => clearTimeout(interval);
  }, [channelId, apiKey, checkLive, name]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-purple-50 rounded-lg p-2 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-100 relative block"
    >
      {checkLive && isLive && (
        <div className="absolute -top-1 -right-1 z-10">
          <span className="relative flex h-5 w-12">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-12 bg-red-500 items-center justify-center text-white text-xs font-bold">
              LIVE
            </span>
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Youtube
          className={`w-4 h-4 flex-shrink-0 ${checkLive && isLive ? "text-red-600" : "text-purple-600"}`}
        />
        <span className="flex-1 min-w-0 truncate group-hover:text-purple-600 transition-colors text-xs">
          {name}
        </span>
        <ExternalLink className="w-3 h-3 flex-shrink-0 text-gray-400 group-hover:text-purple-600 transition-colors" />
      </div>
    </a>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  
  // YouTube API Key removed - Live status check disabled
  const youtubeApiKey = AIzaSyAd4etpm11A82r5QZnyUW2uQOHgrxX_IEk;

  const mapleLinks = [
    {
      name: "메이플스토리 공식",
      description: "메이플스토리 공식 홈페이지",
      url: "https://maplestory.nexon.com",
    },
    {
      name: "메이플로드",
      description:
        "메이플 플레이에 필요한 각종 계산기를 제공하는 사이트. 주로 사냥터 효율 분석, 경험치 계산 등 레벨업 및 사냥 최적화를 위해 사용.",
      url: "https://mapleroad.kr",
    },
    {
      name: "환산주스탯",
      description:
        "캐릭터 스펙을 수치화·비교·최적화 분석해주는 사이트. 주로 환산 점수 기반 보스 최소 컷 확인과 스펙업 방향 설정에 활용.",
      url: "https://maplescouter.com",
    },
    {
      name: "메애기",
      description:
        "캐릭터 정보와 코디, 각종 통계를 제공하는 사이트. 주로 룩북, 드레스룸 기능을 활용한 코디 확인 및 시뮬레이션 용도로 사용.",
      url: "https://meaegi.com",
    },
    {
      name: "츄츄.gg",
      description:
        "콘텐츠 및 컨셉별 랭킹 제공과 프로필형 메이플 카드 제작 기능을 지원하는 사이트. 주로 랭킹 확인이나 캐릭터 검색 목적으로 이용.",
      url: "https://chuchu.gg",
    },
    {
      name: "메수.live",
      description:
        "아이템 강화와 관련된 확률 및 기댓값 계산, 각종 시뮬레이션을 제공하는 사이트. 주로 스타포스, 잠재능력 등 강화 효율 분석에 사용.",
      url: "https://mesu.live",
    },
    {
      name: "메이플 인벤",
      description:
        "전통적인 공식·유저 기반 커뮤니티이자 정보 DB 사이트. 다수의 유저들이 공유하는 팁과 노하우, 그리고 메이플스토리에 대한 유저들의 애정과 경험이 축적된 공간.",
      url: "https://maple.inven.co.kr/",
    },
  ];

  const liveZoneYoutubers = [
    {
      name: "청묘",
      url: "https://youtube.com/@cheongmyo?si=LlDLOT-PNCnhfm71",
      channelId: "UCCL77mfaS0LwgJqry7ph_zA",
    },
    {
      name: "글자네",
      url: "https://youtube.com/channel/UCb5NLtXAsTBrmaZVhyFa-Wg?si=S167kJkvxfZct-yA",
      channelId: "UCb5NLtXAsTBrmaZVhyFa-Wg",
    },
    {
      name: "진격캐넌",
      url: "https://youtube.com/channel/UCmRL_430mSNs-6M6tcGXFCw?si=M1Wq_wwh4vmVM2l-",
      channelId: "UCmRL_430mSNs-6M6tcGXFCw",
    },
    {
      name: "후닝",
      url: "https://youtube.com/@maplehooni?si=c4T2SBiz36OpuyDd",
      channelId: "UCq6bX1rAJqwt3LmYuHrDPqg",
    },
  ];

  const officialChannel = {
    name: "메이플 공식",
    url: "https://youtube.com/@maplestorykr?si=j_LkHNF7_bdwnQMe",
    channelId: "UCU_hKD03cUTCvnOJpEmKvCg",
  };

  const contentCreators = [
    {
      name: "팡이요",
      url: "https://youtube.com/@bjpange?si=9pmYorIdBPWwkx08",
      channelId: "UCgNeivlagZU_S8bW2KkPY7w",
    },
    {
      name: "타요",
      url: "https://youtube.com/@tayo_ty?si=wCNcABIGkwbBfrSV",
      channelId: "UC6RoBuM4Xhi6gHHWRLAFucA",
    },
    {
      name: "맑음",
      url: "https://youtube.com/channel/UC1dHu9GhbHH7RcHKyJdaOvA?si=Y31LoGUsiB86Bm1l",
      channelId: "UC1dHu9GhbHH7RcHKyJdaOvA",
    },
    {
      name: "온앤온",
      url: "https://youtube.com/channel/UCop7QCLcdzTpcYZzMu1mFAg?si=H8sZOt5Td-V6HFrE",
      channelId: "UCop7QCLcdzTpcYZzMu1mFAg",
    },
  ];

  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
      {/* MapleStory Resources */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg border-2 border-purple-200">
        <h2 className="text-base mb-3 text-purple-700 flex items-center gap-2 font-semibold border-b border-purple-100 pb-2">
          <Link className="w-4 h-4" />
          메이플스토리 링크
        </h2>
        <div className="space-y-2">
          {mapleLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block hover:bg-purple-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium group-hover:text-purple-600 transition-colors">
                  {link.name}
                </h3>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* YouTubers Section */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg border-2 border-purple-200">
        <h2 className="text-base mb-3 text-purple-700 flex items-center gap-2 font-semibold border-b border-purple-100 pb-2">
          <Youtube className="w-4 h-4" />
          메이플스토리 유튜브
        </h2>

        {/* Live Zone */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-200 mb-3">
          <h3 className="text-xs mb-2 text-red-700 flex items-center gap-1 font-semibold">
            🔴 Live 존
          </h3>
          {/* Official Channel */}
          <div className="mb-2">
            <YouTuberCard
              name={officialChannel.name}
              url={officialChannel.url}
              channelId={officialChannel.channelId}
              apiKey={youtubeApiKey}
              checkLive={true}
            />
          </div>
          {/* Live Zone Youtubers */}
          <div className="grid grid-cols-2 gap-2">
            {liveZoneYoutubers.map((youtuber) => (
              <YouTuberCard
                key={youtuber.name}
                name={youtuber.name}
                url={youtuber.url}
                channelId={youtuber.channelId}
                apiKey={youtubeApiKey}
                checkLive={true}
              />
            ))}
          </div>
        </div>

        {/* Other Content Creators */}
        <div>
          <h3 className="text-xs mb-2 text-gray-600 font-medium">크리에이터</h3>
          <div className="grid grid-cols-2 gap-2">
            {contentCreators.map((youtuber) => (
              <YouTuberCard
                key={youtuber.name}
                name={youtuber.name}
                url={youtuber.url}
                channelId={youtuber.channelId}
                apiKey={youtubeApiKey}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
