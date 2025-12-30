import { ExternalLink, Youtube, Link } from "lucide-react";
import { AdBanner } from "./AdBanner";
import { Footer } from "./Footer";
import mapleLeaf from "../../assets/images/maple-leaf.png";
import headerBg from "../../assets/images/header.png";

interface LinkItemProps {
  name: string;
  description: string;
  url: string;
  icon?: React.ReactNode;
}

function LinkItem({ name, description, url, icon }: LinkItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 hover:scale-105"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white">
          {icon || <Link className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="group-hover:text-purple-600 transition-colors">{name}</h3>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
}

export function MainPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const mapleLinks = [
    {
      name: "메이플스토리 공식",
      description: "메이플스토리 공식 홈페이지",
      url: "https://maplestory.nexon.com",
    },
    {
      name: "메이플로드",
      description: "메이플 플레이에 필요한 각종 계산기를 제공하는 사이트. 주로 사냥터 효율 분석, 경험치 계산 등 레벨업 및 사냥 최적화를 위해 사용.",
      url: "https://mapleroad.kr",
    },
    {
      name: "환산주스탯",
      description: "캐릭터 스펙을 수치화·비교·최적화 분석해주는 사이트. 주로 환산 점수 기반 보스 최소 컷 확인과 스펙업 방향 설정에 활용.",
      url: "https://maplescouter.com",
    },
    {
      name: "메애기",
      description: "캐릭터 정보와 코디, 각종 통계를 제공하는 사이트. 주로 룩북, 드레스룸 기능을 활용한 코디 확인 및 시뮬레이션 용도로 사용.",
      url: "https://meaegi.com",
    },
    {
      name: "츄츄.gg",
      description: "콘텐츠 및 컨셉별 랭킹 제공과 프로필형 메이플 카드 제작 기능을 지원하는 사이트. 주로 랭킹 확인이나 캐릭터 검색 목적으로 이용.",
      url: "https://chuchu.gg",
    },
    {
      name: "메수.live",
      description: "아이템 강화와 관련된 확률 및 기댓값 계산, 각종 시뮬레이션을 제공하는 사이트. 주로 스타포스, 잠재능력 등 강화 효율 분석에 사용.",
      url: "https://mesu.live",
    },
    {
      name: "메이플 인벤",
      description: "전통적인 공식·유저 기반 커뮤니티이자 정보 DB 사이트. 다수의 유저들이 공유하는 팁과 노하우, 그리고 메이플스토리에 대한 유저들의 애정과 경험이 축적된 공간.",
      url: "https://maple.inven.co.kr/",
    },
  ];

  const youtubers = [
    { name: "메이플스토리 공식 채널", url: "https://youtube.com/@maplestorykr?si=j_LkHNF7_bdwnQMe" },
    { name: "팡이요", url: "https://youtube.com/@bjpange?si=9pmYorIdBPWwkx08" },
    { name: "청묘", url: "https://youtube.com/@cheongmyo?si=LlDLOT-PNCnhfm71" },
    { name: "타요", url: "https://youtube.com/@tayo_ty?si=wCNcABIGkwbBfrSV" },
    { name: "글자네", url: "https://youtube.com/channel/UCb5NLtXAsTBrmaZVhyFa-Wg?si=S167kJkvxfZct-yA" },
    { name: "진격캐넌", url: "https://youtube.com/channel/UCmRL_430mSNs-6M6tcGXFCw?si=M1Wq_wwh4vmVM2l-" },
    { name: "맑음", url: "https://youtube.com/channel/UC1dHu9GhbHH7RcHKyJdaOvA?si=Y31LoGUsiB86Bm1l" },
    { name: "후닝", url: "https://youtube.com/@maplehooni?si=c4T2SBiz36OpuyDd" },
    { name: "온앤온", url: "https://youtube.com/channel/UCop7QCLcdzTpcYZzMu1mFAg?si=H8sZOt5Td-V6HFrE" },
  ];

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
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
              <img 
                src={mapleLeaf} 
                alt="Maple Leaf" 
                className="w-10 h-10 md:w-16 md:h-16 object-contain drop-shadow-lg"
              />
              <h1 className="text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient relative" style={{ 
                textShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)',
                filter: 'drop-shadow(0 4px 20px rgba(168, 85, 247, 0.5))'
              }}>
                Maple_Hub
                <span className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-30 -z-10">
                  Maple_Hub
                </span>
              </h1>
            </div>
            <p className="relative z-10 text-purple-700 font-semibold text-center text-sm md:text-xl mt-2 md:mt-4 tracking-wide" style={{ 
              textShadow: '0 2px 10px rgba(255,255,255,0.8), 0 0 20px rgba(168, 85, 247, 0.3)' 
            }}>
              메이플 컨텐츠 디멘션 게이트
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
            <button
              className="flex-1 bg-white py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-400 text-sm md:text-base"
            >
              🏠 메인 허브
            </button>
            <button
              onClick={() => onNavigate('events')}
              className="flex-1 bg-purple-100 py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-300 hover:bg-purple-200 transition-colors text-sm md:text-base"
            >
              📅 이벤트 캘린더
            </button>
            <button
              onClick={() => onNavigate('guildmarks')}
              className="flex-1 bg-purple-100 py-2 md:py-3 px-3 md:px-6 rounded-lg shadow-md border-2 border-purple-300 hover:bg-purple-200 transition-colors text-sm md:text-base"
            >
              🎨 길드 마크
            </button>
          </div>

          {/* MapleStory Resources */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg mb-4 md:mb-6 border-2 border-purple-200">
            <h2 className="text-xl md:text-2xl mb-3 md:mb-4 text-purple-700 flex items-center gap-2">
              <Link className="w-5 h-5 md:w-6 md:h-6" /> 메이플스토리 링크
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {mapleLinks.map((link) => (
                <LinkItem key={link.name} {...link} />
              ))}
            </div>
          </div>

          {/* YouTubers Section */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 md:p-6 shadow-lg border-2 border-purple-200">
            <h2 className="text-xl md:text-2xl mb-3 md:mb-4 text-purple-700 flex items-center gap-2">
              <Youtube className="w-5 h-5 md:w-6 md:h-6" />
              메이플스토리 유튜버
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {youtubers.map((youtuber) => (
                <a
                  key={youtuber.name}
                  href={youtuber.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-purple-50 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-100"
                >
                  <div className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-purple-600" />
                    <span className="group-hover:text-purple-600 transition-colors">{youtuber.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-purple-600 transition-colors ml-auto" />
                  </div>
                </a>
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
      <div className="p-2 md:p-4 pt-0">
        <AdBanner type="horizontal" className="mx-auto max-w-6xl" />
      </div>

      {/* Footer */}
      <div className="p-2 md:p-4">
        <Footer />
      </div>
    </div>
  );
}