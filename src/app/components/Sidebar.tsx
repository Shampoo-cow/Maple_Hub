import { ExternalLink, Link } from "lucide-react";

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

export function Sidebar() {

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
    </div>
  );
}