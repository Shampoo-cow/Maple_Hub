﻿﻿import { useState, useEffect, useMemo, useLayoutEffect, useRef } from "react";

const SUPABASE_URL = "https://oemhkfjwqpmiiugpfgvu.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbWhrZmp3cXBtaWl1Z3BmZ3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MTc3MzYsImV4cCI6MjA5ODA5MzczNn0.LDMpg-eNzZuITtqR1K5YlqiqoN09TofJLixgOxgH4y4";

type Job = { id: string; name: string; job_group: string };

type TimelineSkill = { t: number; s: string; seq: string; h: boolean };
type StatSkill  = { s: string; pct: number; dps: number; cnt: number };
type BpCache = {
  rank: number;
  character_name: string;
  world_name: string;
  total_dps: number;
  season: number;
  skill_timeline: TimelineSkill[];
  skill_stats: StatSkill[];
};
type Segment =
  | { type: "seq"; seq: string; skills: TimelineSkill[] }
  | { type: "normal"; skill: TimelineSkill };
type Skill = {
  id: string;
  name: string;
  advancement: string;
  skill_type: string | null;
  master_level: number;
  description: string | null;
  max_effect: string | null;
  cooldown: string | null;
  required_skill: string | null;
  icon_url: string | null;
};

const JOB_ORDER: Record<string, string[]> = {
  전사: ["히어로","팔라딘","다크나이트","소울마스터","미하일","블래스터","데몬 슬레이어","데몬 어벤져","아란","카이저","아델","렌","제로"],
  마법사: ["아크메이지(불,독)","아크메이지(썬,콜)","비숍","플레임위자드","배틀메이지","에반","루미너스","일리움","라라","키네시스","레테"],
  궁수: ["보우마스터","신궁","패스파인더","윈드브레이커","와일드헌터","메르세데스","카인"],
  도적: ["나이트로드","섀도어","듀얼블레이드","나이트워커","팬텀","카데나","칼리","호영"],
  해적: ["바이퍼","캡틴","캐논슈터","스트라이커","메카닉","은월","엔젤릭버스터","아크","제논"],
};
const GROUP_ORDER = ["전사", "마법사", "궁수", "도적", "해적"];
const ADV_ORDER = ["0차", "1차", "2차", "3차", "4차", "하이퍼", "5차", "6차"];

const ADV_STYLE: Record<string, { btn: string; badge: string; effect: string; iconBg: string }> = {
  "0차":   { btn: "bg-gray-500 text-white",    badge: "bg-gray-100 text-gray-600 border-gray-300",         effect: "bg-gray-50 border-gray-200 text-gray-700",      iconBg: "bg-gray-100" },
  "1차":   { btn: "bg-emerald-500 text-white", badge: "bg-emerald-50 text-emerald-700 border-emerald-300", effect: "bg-emerald-50 border-emerald-200 text-emerald-800", iconBg: "bg-emerald-50" },
  "2차":   { btn: "bg-blue-500 text-white",    badge: "bg-blue-50 text-blue-700 border-blue-300",           effect: "bg-blue-50 border-blue-200 text-blue-800",       iconBg: "bg-blue-50" },
  "3차":   { btn: "bg-indigo-600 text-white",  badge: "bg-indigo-50 text-indigo-700 border-indigo-300",    effect: "bg-indigo-50 border-indigo-200 text-indigo-800",  iconBg: "bg-indigo-50" },
  "4차":   { btn: "bg-violet-600 text-white",  badge: "bg-violet-50 text-violet-700 border-violet-300",    effect: "bg-violet-50 border-violet-200 text-violet-800",  iconBg: "bg-violet-50" },
  "하이퍼":{ btn: "bg-orange-500 text-white",  badge: "bg-orange-50 text-orange-700 border-orange-300",    effect: "bg-orange-50 border-orange-200 text-orange-800",  iconBg: "bg-orange-50" },
  "5차":   { btn: "bg-rose-600 text-white",    badge: "bg-rose-50 text-rose-700 border-rose-300",          effect: "bg-rose-50 border-rose-200 text-rose-800",        iconBg: "bg-rose-50" },
  "6차":   { btn: "bg-pink-600 text-white",    badge: "bg-pink-50 text-pink-700 border-pink-300",          effect: "bg-pink-50 border-pink-200 text-pink-800",        iconBg: "bg-pink-50" },
};

const supaFetch = <T,>(path: string): Promise<T> =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  }).then((r) => r.json() as Promise<T>);

// ── 링크스킬 데이터 ──────────────────────────────────────────────────────
type LinkSkillDatum = {
  jobLabel: string;
  jobs: string[];
  skillName: string;
  maxLevel: number;
  effects: { lv: number; text: string }[];
  category: "데미지" | "방어율무시" | "크리티컬" | "생존" | "스탯" | "경험치" | "기타";
};

const LINK_SKILLS: LinkSkillDatum[] = [
  // ─── 그룹 링크스킬 (직업군 공유) ───
  {
    jobLabel:"모험가 전사", jobs:["히어로","팔라딘","다크나이트"], skillName:"인빈서블 빌리프", maxLevel:9, category:"생존",
    effects:[
      { lv:1, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 20% 회복\n재발동 대기시간 410초" },
      { lv:2, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 23% 회복\n재발동 대기시간 380초" },
      { lv:3, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 26% 회복\n재발동 대기시간 350초" },
      { lv:4, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 29% 회복\n재발동 대기시간 320초" },
      { lv:5, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 32% 회복\n재발동 대기시간 290초" },
      { lv:6, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 35% 회복\n재발동 대기시간 260초" },
      { lv:7, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 38% 회복\n재발동 대기시간 230초" },
      { lv:8, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 41% 회복\n재발동 대기시간 200초" },
      { lv:9, text:"HP 15% 이하 시 자동 발동 — 3초간 매초 최대 HP 44% 회복\n재발동 대기시간 150초" },
    ],
  },
  {
    jobLabel:"모험가 마법사", jobs:["아크메이지(불,독)","아크메이지(썬,콜)","비숍"], skillName:"임피리컬 널리지", maxLevel:9, category:"방어율무시",
    effects:[
      { lv:1, text:"공격한 적의 약점 15% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 1%, 방어율 무시 1% 증가" },
      { lv:2, text:"공격한 적의 약점 17% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 1%, 방어율 무시 2% 증가" },
      { lv:3, text:"공격한 적의 약점 18% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 2%, 방어율 무시 2% 증가" },
      { lv:4, text:"공격한 적의 약점 20% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 2%, 방어율 무시 3% 증가" },
      { lv:5, text:"공격한 적의 약점 22% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 2%, 방어율 무시 3% 증가" },
      { lv:6, text:"공격한 적의 약점 23% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 3%, 방어율 무시 4% 증가" },
      { lv:7, text:"공격한 적의 약점 25% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 3%, 방어율 무시 4% 증가" },
      { lv:8, text:"공격한 적의 약점 27% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 3%, 방어율 무시 5% 증가" },
      { lv:9, text:"공격한 적의 약점 31% 확률로 파악 (최대 3중첩, 10초 지속)\n중첩당 데미지 5%, 방어율 무시 5% 증가" },
    ],
  },
  {
    jobLabel:"모험가 궁수", jobs:["보우마스터","신궁","패스파인더"], skillName:"어드벤쳐러 큐리어스", maxLevel:9, category:"크리티컬",
    effects:[
      { lv:1, text:"몬스터 컬렉션 등록 확률 10% 증가, 크리티컬 확률 3% 증가" },
      { lv:2, text:"몬스터 컬렉션 등록 확률 13% 증가, 크리티컬 확률 4% 증가" },
      { lv:3, text:"몬스터 컬렉션 등록 확률 17% 증가, 크리티컬 확률 5% 증가" },
      { lv:4, text:"몬스터 컬렉션 등록 확률 20% 증가, 크리티컬 확률 6% 증가" },
      { lv:5, text:"몬스터 컬렉션 등록 확률 23% 증가, 크리티컬 확률 7% 증가" },
      { lv:6, text:"몬스터 컬렉션 등록 확률 27% 증가, 크리티컬 확률 9% 증가" },
      { lv:7, text:"몬스터 컬렉션 등록 확률 30% 증가, 크리티컬 확률 10% 증가" },
      { lv:8, text:"몬스터 컬렉션 등록 확률 35% 증가, 크리티컬 확률 12% 증가" },
      { lv:9, text:"몬스터 컬렉션 등록 확률 50% 증가, 크리티컬 확률 15% 증가" },
    ],
  },
  {
    jobLabel:"모험가 도적", jobs:["나이트로드","섀도어","듀얼블레이드"], skillName:"시프 커닝", maxLevel:9, category:"데미지",
    effects:[
      { lv:1, text:"상태 이상 적용 시 10초간 데미지 3% 증가\n재발동 대기시간 20초" },
      { lv:2, text:"상태 이상 적용 시 10초간 데미지 6% 증가\n재발동 대기시간 20초" },
      { lv:3, text:"상태 이상 적용 시 10초간 데미지 9% 증가\n재발동 대기시간 20초" },
      { lv:4, text:"상태 이상 적용 시 10초간 데미지 12% 증가\n재발동 대기시간 20초" },
      { lv:5, text:"상태 이상 적용 시 10초간 데미지 14% 증가\n재발동 대기시간 20초" },
      { lv:6, text:"상태 이상 적용 시 10초간 데미지 16% 증가\n재발동 대기시간 20초" },
      { lv:7, text:"상태 이상 적용 시 10초간 데미지 18% 증가\n재발동 대기시간 20초" },
      { lv:8, text:"상태 이상 적용 시 10초간 데미지 22% 증가\n재발동 대기시간 20초" },
      { lv:9, text:"상태 이상 적용 시 10초간 데미지 27% 증가\n재발동 대기시간 20초" },
    ],
  },
  {
    jobLabel:"모험가 해적", jobs:["바이퍼","캡틴","캐논슈터"], skillName:"파이렛 블레스", maxLevel:9, category:"스탯",
    effects:[
      { lv:1, text:"힘·민첩·지력·운 20, 최대 HP·MP 350 증가\n피격 데미지 5% 감소" },
      { lv:2, text:"힘·민첩·지력·운 27, 최대 HP·MP 473 증가\n피격 데미지 7% 감소" },
      { lv:3, text:"힘·민첩·지력·운 35, 최대 HP·MP 613 증가\n피격 데미지 9% 감소" },
      { lv:4, text:"힘·민첩·지력·운 42, 최대 HP·MP 735 증가\n피격 데미지 11% 감소" },
      { lv:5, text:"힘·민첩·지력·운 50, 최대 HP·MP 875 증가\n피격 데미지 13% 감소" },
      { lv:6, text:"힘·민첩·지력·운 57, 최대 HP·MP 998 증가\n피격 데미지 15% 감소" },
      { lv:7, text:"힘·민첩·지력·운 65, 최대 HP·MP 1138 증가\n피격 데미지 17% 감소" },
      { lv:8, text:"힘·민첩·지력·운 72, 최대 HP·MP 1260 증가\n피격 데미지 19% 감소" },
      { lv:9, text:"힘·민첩·지력·운 100, 최대 HP·MP 1750 증가\n피격 데미지 21% 감소" },
    ],
  },
  {
    jobLabel:"시그너스 직업군", jobs:["소울마스터","플레임위자드","윈드브레이커","나이트워커","스트라이커"], skillName:"시그너스 블레스", maxLevel:15, category:"스탯",
    effects:[
      { lv:1,  text:"공격력·마력 7 증가, 상태 이상 내성 1, 모든 속성 내성 1% 증가" },
      { lv:2,  text:"공격력·마력 8 증가, 상태 이상 내성 2, 모든 속성 내성 2% 증가" },
      { lv:3,  text:"공격력·마력 9 증가, 상태 이상 내성 3, 모든 속성 내성 3% 증가" },
      { lv:4,  text:"공격력·마력 10 증가, 상태 이상 내성 4, 모든 속성 내성 4% 증가" },
      { lv:5,  text:"공격력·마력 11 증가, 상태 이상 내성 5, 모든 속성 내성 5% 증가" },
      { lv:6,  text:"공격력·마력 13 증가, 상태 이상 내성 7, 모든 속성 내성 7% 증가" },
      { lv:7,  text:"공격력·마력 14 증가, 상태 이상 내성 8, 모든 속성 내성 8% 증가" },
      { lv:8,  text:"공격력·마력 15 증가, 상태 이상 내성 9, 모든 속성 내성 9% 증가" },
      { lv:9,  text:"공격력·마력 17 증가, 상태 이상 내성 11, 모든 속성 내성 11% 증가" },
      { lv:10, text:"공격력·마력 18 증가, 상태 이상 내성 12, 모든 속성 내성 12% 증가" },
      { lv:11, text:"공격력·마력 19 증가, 상태 이상 내성 13, 모든 속성 내성 13% 증가" },
      { lv:12, text:"공격력·마력 21 증가, 상태 이상 내성 15, 모든 속성 내성 15% 증가" },
      { lv:13, text:"공격력·마력 28 증가, 상태 이상 내성 17, 모든 속성 내성 17% 증가" },
      { lv:14, text:"공격력·마력 32 증가, 상태 이상 내성 19, 모든 속성 내성 19% 증가" },
      { lv:15, text:"공격력·마력 35 증가, 상태 이상 내성 22, 모든 속성 내성 22% 증가" },
    ],
  },
  {
    jobLabel:"레지스탕스 직업군", jobs:["블래스터","배틀메이지","와일드헌터","메카닉"], skillName:"스피릿 오브 프리덤", maxLevel:12, category:"생존",
    effects:[
      { lv:1,  text:"부활 시 1초간 무적 상태 (맵 이동 시 해제)" },
      { lv:2,  text:"부활 시 2초간 무적 상태 (맵 이동 시 해제)" },
      { lv:3,  text:"부활 시 3초간 무적 상태 (맵 이동 시 해제)" },
      { lv:4,  text:"부활 시 4초간 무적 상태 (맵 이동 시 해제)" },
      { lv:5,  text:"부활 시 5초간 무적 상태 (맵 이동 시 해제)" },
      { lv:6,  text:"부활 시 6초간 무적 상태 (맵 이동 시 해제)" },
      { lv:7,  text:"부활 시 7초간 무적 상태 (맵 이동 시 해제)" },
      { lv:8,  text:"부활 시 8초간 무적 상태 (맵 이동 시 해제)" },
      { lv:9,  text:"부활 시 9초간 무적 상태 (맵 이동 시 해제)" },
      { lv:10, text:"부활 시 10초간 무적 상태 (맵 이동 시 해제)" },
      { lv:11, text:"부활 시 11초간 무적 상태 (맵 이동 시 해제)" },
      { lv:12, text:"부활 시 12초간 무적 상태 (맵 이동 시 해제)" },
    ],
  },
  // ─── 개인 링크스킬 ───
  {
    jobLabel:"미하일", jobs:["미하일"], skillName:"빛의 수호", maxLevel:3, category:"생존",
    effects:[
      { lv:1, text:"상태 이상 내성 100 증가 (지속시간 10초)\n재사용 대기시간 120초" },
      { lv:2, text:"상태 이상 내성 100 증가 (지속시간 15초)\n재사용 대기시간 120초" },
      { lv:3, text:"상태 이상 내성 100 증가 (지속시간 20초)\n재사용 대기시간 120초" },
    ],
  },
  {
    jobLabel:"아란", jobs:["아란"], skillName:"콤보킬 어드밴티지", maxLevel:3, category:"경험치",
    effects:[
      { lv:1, text:"콤보킬 구슬 경험치 획득량 400% 영구 증가" },
      { lv:2, text:"콤보킬 구슬 경험치 획득량 650% 영구 증가" },
      { lv:3, text:"콤보킬 구슬 경험치 획득량 900% 영구 증가" },
    ],
  },
  {
    jobLabel:"에반", jobs:["에반"], skillName:"룬 퍼시스턴스", maxLevel:3, category:"기타",
    effects:[
      { lv:1, text:"해방된 룬의 힘 지속시간 30% 증가" },
      { lv:2, text:"해방된 룬의 힘 지속시간 50% 증가" },
      { lv:3, text:"해방된 룬의 힘 지속시간 70% 증가" },
    ],
  },
  {
    jobLabel:"루미너스", jobs:["루미너스"], skillName:"퍼미에이트", maxLevel:3, category:"방어율무시",
    effects:[
      { lv:1, text:"방어율 무시 10% 증가" },
      { lv:2, text:"방어율 무시 15% 증가" },
      { lv:3, text:"방어율 무시 20% 증가" },
    ],
  },
  {
    jobLabel:"메르세데스", jobs:["메르세데스"], skillName:"엘프의 축복", maxLevel:3, category:"경험치",
    effects:[
      { lv:1, text:"사용 시 에우렐 귀환 (재사용 600초)\n[패시브] 경험치 획득량 10%, 데미지 5% 증가" },
      { lv:2, text:"사용 시 에우렐 귀환 (재사용 600초)\n[패시브] 경험치 획득량 15%, 데미지 5% 증가" },
      { lv:3, text:"사용 시 에우렐 귀환 (재사용 600초)\n[패시브] 경험치 획득량 20%, 데미지 5% 증가" },
    ],
  },
  {
    jobLabel:"팬텀", jobs:["팬텀"], skillName:"데들리 인스팅트", maxLevel:3, category:"크리티컬",
    effects:[
      { lv:1, text:"크리티컬 확률 10% 증가" },
      { lv:2, text:"크리티컬 확률 15% 증가" },
      { lv:3, text:"크리티컬 확률 20% 증가" },
    ],
  },
  {
    jobLabel:"은월", jobs:["은월"], skillName:"구사 일생", maxLevel:3, category:"생존",
    effects:[
      { lv:1, text:"사망에 이르는 공격을 당할 시 5% 확률로 생존 (재발동 대기시간 300초)" },
      { lv:2, text:"사망에 이르는 공격을 당할 시 10% 확률로 생존 (재발동 대기시간 300초)" },
      { lv:3, text:"사망에 이르는 공격을 당할 시 15% 확률로 생존 (재발동 대기시간 300초)" },
    ],
  },
  {
    jobLabel:"제논", jobs:["제논"], skillName:"하이브리드 로직", maxLevel:3, category:"스탯",
    effects:[
      { lv:1, text:"힘·민첩·지력 5% 증가" },
      { lv:2, text:"힘·민첩·지력 10% 증가" },
      { lv:3, text:"힘·민첩·지력 15% 증가" },
    ],
  },
  {
    jobLabel:"데몬 슬레이어", jobs:["데몬 슬레이어"], skillName:"데몬스 퓨리", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"보스 몬스터 공격 시 데미지 10% 증가" },
      { lv:2, text:"보스 몬스터 공격 시 데미지 15% 증가" },
      { lv:3, text:"보스 몬스터 공격 시 데미지 20% 증가" },
    ],
  },
  {
    jobLabel:"데몬 어벤져", jobs:["데몬 어벤져"], skillName:"와일드 레이지", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"데미지 5% 증가" },
      { lv:2, text:"데미지 10% 증가" },
      { lv:3, text:"데미지 15% 증가" },
    ],
  },
  {
    jobLabel:"카이저", jobs:["카이저"], skillName:"아이언 윌", maxLevel:3, category:"생존",
    effects:[
      { lv:1, text:"최대 HP 10% 증가" },
      { lv:2, text:"최대 HP 15% 증가" },
      { lv:3, text:"최대 HP 20% 증가" },
    ],
  },
  {
    jobLabel:"카인", jobs:["카인"], skillName:"프라이어 프리퍼레이션", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"적 8명 처치 또는 보스에게 5회 적중 시 사전 준비 1회 완료\n사전 준비 5회 달성 시 20초간 데미지 9% 증가\n재발동 대기시간 40초" },
      { lv:2, text:"적 8명 처치 또는 보스에게 5회 적중 시 사전 준비 1회 완료\n사전 준비 5회 달성 시 20초간 데미지 17% 증가\n재발동 대기시간 40초" },
      { lv:3, text:"적 8명 처치 또는 보스에게 5회 적중 시 사전 준비 1회 완료\n사전 준비 5회 달성 시 20초간 데미지 25% 증가\n재발동 대기시간 40초" },
    ],
  },
  {
    jobLabel:"카데나", jobs:["카데나"], skillName:"인텐시브 인썰트", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"자신보다 레벨 낮은 몬스터 공격 시 데미지 3% 증가\n상태 이상 몬스터 공격 시 데미지 3% 증가" },
      { lv:2, text:"자신보다 레벨 낮은 몬스터 공격 시 데미지 6% 증가\n상태 이상 몬스터 공격 시 데미지 6% 증가" },
      { lv:3, text:"자신보다 레벨 낮은 몬스터 공격 시 데미지 9% 증가\n상태 이상 몬스터 공격 시 데미지 9% 증가" },
    ],
  },
  {
    jobLabel:"엔젤릭버스터", jobs:["엔젤릭버스터"], skillName:"소울 컨트랙트", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"MP 30 소비, 10초간 데미지 30% 증가\n재사용 대기시간 90초" },
      { lv:2, text:"MP 30 소비, 10초간 데미지 45% 증가\n재사용 대기시간 60초" },
      { lv:3, text:"MP 30 소비, 10초간 데미지 60% 증가\n재사용 대기시간 60초" },
    ],
  },
  {
    jobLabel:"아델", jobs:["아델"], skillName:"노블레스", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"보스 몬스터 공격 시 데미지 2% 증가\n파티원 1명당 데미지 1% 증가 (최대 4%)" },
      { lv:2, text:"보스 몬스터 공격 시 데미지 4% 증가\n파티원 1명당 데미지 2% 증가 (최대 8%)" },
      { lv:3, text:"보스 몬스터 공격 시 데미지 6% 증가\n파티원 1명당 데미지 3% 증가 (최대 12%)" },
    ],
  },
  {
    jobLabel:"일리움", jobs:["일리움"], skillName:"전투의 흐름", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"일정 거리 이동 시 발동 (최대 4중첩, 지속 25초)\n중첩당 데미지 2% 증가\n링크 스킬 사용 시 지속시간 10초로 감소" },
      { lv:2, text:"일정 거리 이동 시 발동 (최대 4중첩, 지속 25초)\n중첩당 데미지 3% 증가\n링크 스킬 사용 시 지속시간 10초로 감소" },
      { lv:3, text:"일정 거리 이동 시 발동 (최대 4중첩, 지속 25초)\n중첩당 데미지 4% 증가\n링크 스킬 사용 시 지속시간 10초로 감소" },
    ],
  },
  {
    jobLabel:"칼리", jobs:["칼리"], skillName:"이네이트 기프트", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"데미지 3% 증가\n공격 시 5초간 매초 최대 HP·MP 1% 회복\n재발동 대기시간 30초" },
      { lv:2, text:"데미지 5% 증가\n공격 시 5초간 매초 최대 HP·MP 2% 회복\n재발동 대기시간 30초" },
      { lv:3, text:"데미지 7% 증가\n공격 시 5초간 매초 최대 HP·MP 3% 회복\n재발동 대기시간 30초" },
    ],
  },
  {
    jobLabel:"아크", jobs:["아크"], skillName:"무아", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"전투 상태 5초 지속 시 발동 (최대 5중첩, 지속 5초)\n중첩당 데미지 1% 증가" },
      { lv:2, text:"전투 상태 5초 지속 시 발동 (최대 5중첩, 지속 5초)\n중첩당 데미지 2% 증가" },
      { lv:3, text:"전투 상태 5초 지속 시 발동 (최대 5중첩, 지속 5초)\n중첩당 데미지 3% 증가" },
    ],
  },
  {
    jobLabel:"렌", jobs:["렌"], skillName:"강체", maxLevel:3, category:"생존",
    effects:[
      { lv:1, text:"최대 HP 비율 피해 포함 피해 2% 감소" },
      { lv:2, text:"최대 HP 비율 피해 포함 피해 4% 감소" },
      { lv:3, text:"최대 HP 비율 피해 포함 피해 6% 감소" },
    ],
  },
  {
    jobLabel:"라라", jobs:["라라"], skillName:"자연의 벗", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"데미지 3% 증가\n일반 몬스터 20마리 처치 시 자연의 도움 발동\n자연의 도움: 30초간 일반 몬스터 데미지 7% 증가\n재발동 대기시간 30초" },
      { lv:2, text:"데미지 5% 증가\n일반 몬스터 20마리 처치 시 자연의 도움 발동\n자연의 도움: 30초간 일반 몬스터 데미지 11% 증가\n재발동 대기시간 30초" },
      { lv:3, text:"데미지 7% 증가\n일반 몬스터 20마리 처치 시 자연의 도움 발동\n자연의 도움: 30초간 일반 몬스터 데미지 15% 증가\n재발동 대기시간 30초" },
    ],
  },
  {
    jobLabel:"호영", jobs:["호영"], skillName:"자신감", maxLevel:3, category:"방어율무시",
    effects:[
      { lv:1, text:"방어율 무시 5% 증가\nHP 100%인 몬스터 공격 시 데미지 9% 추가 증가" },
      { lv:2, text:"방어율 무시 10% 증가\nHP 100%인 몬스터 공격 시 데미지 14% 추가 증가" },
      { lv:3, text:"방어율 무시 15% 증가\nHP 100%인 몬스터 공격 시 데미지 19% 추가 증가" },
    ],
  },
  {
    jobLabel:"제로", jobs:["제로"], skillName:"륀느의 축복", maxLevel:6, category:"생존",
    effects:[
      { lv:1, text:"받는 데미지 3% 감소, 방어율 무시 2% 증가" },
      { lv:2, text:"받는 데미지 5% 감소, 방어율 무시 5% 증가" },
      { lv:3, text:"받는 데미지 8% 감소, 방어율 무시 7% 증가" },
      { lv:4, text:"받는 데미지 10% 감소, 방어율 무시 10% 증가" },
      { lv:5, text:"받는 데미지 15% 감소, 방어율 무시 12% 증가" },
      { lv:6, text:"받는 데미지 20% 감소, 방어율 무시 15% 증가" },
    ],
  },
  {
    jobLabel:"키네시스", jobs:["키네시스"], skillName:"판단", maxLevel:3, category:"크리티컬",
    effects:[
      { lv:1, text:"크리티컬 데미지 2% 증가" },
      { lv:2, text:"크리티컬 데미지 4% 증가" },
      { lv:3, text:"크리티컬 데미지 6% 증가" },
    ],
  },
  {
    jobLabel:"레테", jobs:["레테"], skillName:"커버넌트", maxLevel:3, category:"데미지",
    effects:[
      { lv:1, text:"소환수 데미지 4% 증가" },
      { lv:2, text:"소환수 데미지 8% 증가" },
      { lv:3, text:"소환수 데미지 12% 증가" },
    ],
  },
];

const LINK_CAT_STYLE: Record<string, { bg:string; text:string; border:string }> = {
  "데미지":    { bg:"bg-red-50",    text:"text-red-700",    border:"border-red-200" },
  "방어율무시": { bg:"bg-orange-50", text:"text-orange-700", border:"border-orange-200" },
  "크리티컬":  { bg:"bg-yellow-50", text:"text-yellow-700", border:"border-yellow-200" },
  "생존":      { bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200" },
  "스탯":      { bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200" },
  "경험치":    { bg:"bg-green-50",  text:"text-green-700",  border:"border-green-200" },
  "기타":      { bg:"bg-gray-50",   text:"text-gray-700",   border:"border-gray-200" },
};

const TYPE_DOT: Record<string, string> = {
  "패시브":          "bg-green-500",
  "액티브(즉발)":    "bg-red-500",
  "액티브(지속)":    "bg-orange-400",
  "액티브(온/오프)": "bg-violet-500",
  "액티브":          "bg-blue-500",
  "소환(지속)":      "bg-teal-500",
  "버프":            "bg-yellow-400",
};

function CycleSkillIcon({ name, iconUrl }: { name: string; iconUrl: string | null }) {
  const [err, setErr] = useState(false);
  const short = name.length > 9 ? name.slice(0, 8) + "…" : name;
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-14">
      <div className="w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
        {iconUrl && !err ? (
          <img
            src={iconUrl}
            alt={name}
            title={name}
            className="w-9 h-9 object-contain"
            onError={() => setErr(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-lg">⚔️</span>
        )}
      </div>
      <span className="text-[10px] text-gray-500 text-center leading-tight w-full truncate px-0.5" title={name}>
        {short}
      </span>
    </div>
  );
}

function LinkSkillCard({ data, iconUrl }: { data: LinkSkillDatum; iconUrl: string | null }) {
  const [imgErr, setImgErr] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isGroup = data.jobs.length > 1;
  const cat = LINK_CAT_STYLE[data.category] ?? LINK_CAT_STYLE["기타"];
  const needsCollapse = data.effects.length > 3;
  const visibleEffects = needsCollapse && !expanded
    ? [data.effects[0], data.effects[data.effects.length - 1]]
    : data.effects;

  return (
    <div className={`rounded-lg border overflow-hidden ${cat.border}`}>
      {/* 헤더 */}
      <div className={`flex gap-3 items-start p-3 ${cat.bg}`}>
        <div className="w-11 h-11 rounded-lg flex-shrink-0 bg-white/80 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
          {iconUrl && !imgErr ? (
            <img src={iconUrl} alt={data.skillName} className="w-9 h-9 object-contain" onError={() => setImgErr(true)} loading="lazy" />
          ) : (
            <span className="text-lg">🔗</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">{data.skillName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${cat.text} ${cat.border} bg-white/60`}>
              {data.category}
            </span>
            {isGroup && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-medium text-indigo-600 border-indigo-200 bg-white/60">
                그룹공유
              </span>
            )}
            <span className="text-[10px] text-gray-400 ml-auto">최대 Lv.{data.maxLevel}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {isGroup ? data.jobs.join(" · ") : data.jobLabel}
            <span className="text-gray-400"> 제공</span>
          </p>
        </div>
      </div>
      {/* 효과 테이블 */}
      <div className="border-t border-gray-200 bg-white">
        {visibleEffects.map((ef, i) => (
          <div key={ef.lv} className={`flex items-stretch text-xs ${i < visibleEffects.length - 1 ? "border-b border-gray-100" : ""}`}>
            <div className="w-10 flex-shrink-0 flex items-start justify-center pt-2 pb-2 border-r border-gray-100 bg-[#f0f4ff]">
              <span className="font-bold text-[#1a6fc4] text-[11px]">Lv.{ef.lv}</span>
            </div>
            <div className="flex-1 px-3 py-2 text-gray-700 leading-relaxed whitespace-pre-line">{ef.text}</div>
          </div>
        ))}
        {needsCollapse && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full py-1.5 text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
          >
            {expanded ? "▲ 접기" : `▼ 전체 ${data.effects.length}단계 보기`}
          </button>
        )}
      </div>
    </div>
  );
}

function LinkSkillView() {
  const [iconMap, setIconMap] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    const names = LINK_SKILLS.map((s) => s.skillName);
    const inParam = names.map((n) => `"${n}"`).join(",");
    supaFetch<{ name: string; icon_url: string | null }[]>(
      `skills?name=in.(${encodeURIComponent(inParam)})&select=name,icon_url&limit=200`
    ).then((icons) => {
      const map: Record<string, string> = {};
      icons.forEach((s) => { if (s.icon_url) map[s.name] = s.icon_url; });
      setIconMap(map);
    });
  }, []);

  const cats = ["전체", "데미지", "방어율무시", "크리티컬", "생존", "스탯", "경험치", "기타"];
  const filtered = filter === "전체" ? LINK_SKILLS : LINK_SKILLS.filter((s) => s.category === filter);
  const groups = filtered.filter((s) => s.jobs.length > 1);
  const individuals = filtered.filter((s) => s.jobs.length === 1);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-purple-800">🔗 링크 스킬</h2>
        <span className="text-sm text-gray-400 ml-auto">총 {LINK_SKILLS.length}개</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
              filter === cat
                ? "bg-purple-600 text-white shadow-sm scale-105"
                : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {groups.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">그룹 링크스킬 · 직업군 공유</p>
          <div className="flex flex-col gap-2">
            {groups.map((s) => <LinkSkillCard key={s.skillName} data={s} iconUrl={iconMap[s.skillName] ?? null} />)}
          </div>
        </div>
      )}
      {individuals.length > 0 && (
        <div>
          {groups.length > 0 && <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">개인 링크스킬</p>}
          <div className="flex flex-col gap-2">
            {individuals.map((s) => <LinkSkillCard key={s.skillName} data={s} iconUrl={iconMap[s.skillName] ?? null} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function BurstCyclePanel({ jobName, jobSkills }: { jobName: string; jobSkills: Skill[] }) {
  const [data, setData] = useState<BpCache[]>([]);
  const [activeRank, setActiveRank] = useState(1);
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [iconMap, setIconMap] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const map: Record<string, string | null> = {};
    jobSkills.forEach((s) => { if (s.icon_url) map[s.name] = s.icon_url; });
    setIconMap((prev) => ({ ...prev, ...map }));
  }, [jobSkills]);

  useEffect(() => {
    setLoading(true);
    setActiveRank(1);
    setActiveSeason(null);
    setIconMap({});
    const enc = encodeURIComponent(jobName);
    supaFetch<BpCache[]>(
      `battle_practice_cache?job_name=eq.${enc}&select=rank,character_name,world_name,total_dps,season,skill_timeline,skill_stats&order=season.desc,rank.asc&limit=10`
    ).then(async (d) => {
      setData(d);
      const seasons = [...new Set(d.map((x) => x.season))].sort((a, b) => a - b);
      setActiveSeason(seasons[seasons.length - 1] ?? null);
      const names = new Set<string>();
      d.forEach((bp) => {
        bp.skill_timeline?.forEach((sk) => names.add(sk.s.trim()));
        bp.skill_stats?.forEach((sk) => names.add(sk.s.trim()));
      });
      if (names.size > 0) {
        const inParam = [...names].map((n) => `"${n}"`).join(",");
        const icons = await supaFetch<{ name: string; icon_url: string | null }[]>(
          `skills?name=in.(${encodeURIComponent(inParam)})&select=name,icon_url&limit=200`
        );
        setIconMap((prev) => {
          const map = { ...prev };
          icons.forEach((s) => { if (s.icon_url) map[s.name] = s.icon_url; });
          return map;
        });
      }
      setLoading(false);
    });
  }, [jobName]);

  const availableSeasons = [...new Set(data.map((x) => x.season))].sort((a, b) => a - b);
  const seasonData = data.filter((d) => activeSeason === null || d.season === activeSeason);
  const current = seasonData.find((d) => d.rank === activeRank) ?? seasonData[0];

  const topStats = useMemo(() => {
    if (!current) return [];
    return [...(current.skill_stats ?? [])].sort((a, b) => b.pct - a.pct).slice(0, 7);
  }, [current]);

  const segments = useMemo<Segment[]>(() => {
    const tl = current?.skill_timeline ?? [];

    // 1단계: raw timeline → seq 연속 그룹 + 개별 노말 스킬로 분할
    const rawSegs: Segment[] = [];
    for (const sk of tl) {
      if (sk.seq) {
        const last = rawSegs[rawSegs.length - 1];
        if (last?.type === "seq" && last.seq === sk.seq) {
          last.skills.push(sk);
        } else {
          rawSegs.push({ type: "seq", seq: sk.seq, skills: [sk] });
        }
      } else {
        rawSegs.push({ type: "normal", skill: sk });
      }
    }

    // 2단계: 시퀀스는 seq 레이블 기준으로, 노말 스킬은 스킬명 기준으로 중복 제거
    const seenSeqs = new Set<string>();
    const seenSkills = new Set<string>();
    const deduped: Segment[] = [];
    for (const seg of rawSegs) {
      if (seg.type === "seq") {
        if (!seenSeqs.has(seg.seq)) {
          seenSeqs.add(seg.seq);
          seg.skills.forEach((sk) => seenSkills.add(sk.s));
          deduped.push(seg);
        }
      } else {
        if (!seenSkills.has(seg.skill.s)) {
          seenSkills.add(seg.skill.s);
          deduped.push(seg);
        }
      }
    }

    // 3단계: 스킬 3개 미만 시퀀스 → 개별 노말 스킬로 강등
    return deduped.flatMap((seg): Segment[] => {
      if (seg.type === "seq" && seg.skills.length < 3) {
        return seg.skills.map((sk) => ({ type: "normal", skill: sk }));
      }
      return [seg];
    });
  }, [current]);

  if (loading) return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-600 animate-pulse">
      극딜 사이클 불러오는 중...
    </div>
  );
  if (data.length === 0) return null;

  const maxPct = topStats[0]?.pct ?? 1;

  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white overflow-hidden shadow-sm">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-100/50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-amber-800">🔥 극딜 사이클</span>
          {availableSeasons.length > 1 ? (
            availableSeasons.map((s) => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); setActiveSeason(s); setActiveRank(1); }}
                className={`text-xs px-2 py-0.5 rounded-full border font-bold transition-colors ${
                  activeSeason === s
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-100"
                }`}
              >시즌{s}</button>
            ))
          ) : (
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              시즌{activeSeason} 기준
            </span>
          )}
          <span className="text-xs text-gray-400">연무장 top3 (2분 사이클)</span>
        </div>
        <span className="text-sm text-amber-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {/* Rank tabs */}
          <div className="flex gap-1.5 mb-3">
            {seasonData.map((d) => (
              <button
                key={d.rank}
                onClick={() => setActiveRank(d.rank)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeRank === d.rank
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300"
                }`}
              >
                <span>{d.rank}위</span>
                <span className="opacity-75">{d.character_name}</span>
                <span className={`opacity-60 ${activeRank === d.rank ? "text-amber-100" : "text-gray-400"}`}>
                  {(d.total_dps / 1e12).toFixed(2)}조
                </span>
              </button>
            ))}
          </div>

          {/* Skill cycle icon row */}
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              딜 사이클
              <span className="ml-2 normal-case font-normal text-red-500">빨간 박스 = 극딜 시퀀스</span>
            </p>
            {segments.length === 0 ? (
              <span className="text-sm text-gray-400">타임라인 정보 없음</span>
            ) : (
              <div className="overflow-x-auto pb-1">
                <div className="flex items-end gap-1.5 w-max">
                  {segments.map((seg, i) =>
                    seg.type === "seq" ? (
                      <div key={i} className="flex flex-col items-start gap-0.5">
                        <span className="text-[10px] text-red-500 font-bold leading-none ml-1">{seg.seq}</span>
                        <div className="flex gap-1 px-1.5 rounded-xl border-2 border-red-400 bg-red-50/60">
                          {seg.skills.map((sk, j) => (
                            <CycleSkillIcon key={j} name={sk.s} iconUrl={iconMap[sk.s.trim()] ?? null} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <CycleSkillIcon key={i} name={seg.skill.s} iconUrl={iconMap[seg.skill.s.trim()] ?? null} />
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DPS stats */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">DPS 기여도</p>
            <div className="space-y-1.5">
              {topStats.map((sk, i) => (
                <div key={i} className="flex items-center gap-2">
                  {iconMap[sk.s.trim()] ? (
                    <img
                      src={iconMap[sk.s.trim()]!}
                      alt={sk.s}
                      className="w-5 h-5 object-contain flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs w-5 text-center flex-shrink-0">⚔</span>
                  )}
                  <span className="text-xs text-gray-600 w-32 truncate flex-shrink-0">{sk.s}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${(sk.pct / maxPct) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-amber-700 w-10 text-right flex-shrink-0">
                    {sk.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillIcon({ iconUrl, name, advStyle, className }: { iconUrl: string | null; name: string; advStyle?: { iconBg: string }; className?: string }) {
  const [err, setErr] = useState(false);
  const wrap = className ?? `w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${advStyle?.iconBg ?? "bg-gray-100"}`;

  if (iconUrl && !err) {
    return (
      <div className={wrap}>
        <img src={iconUrl} alt={name} className="w-10 h-10 object-contain" onError={() => setErr(true)} loading="lazy" />
      </div>
    );
  }

  return (
    <div className={`${wrap} text-xl`}>⚔️</div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const [effExpanded, setEffExpanded]   = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const effRef  = useRef<HTMLParagraphElement>(null);
  const [descOverflows, setDescOverflows] = useState(false);
  const [effOverflows,  setEffOverflows]  = useState(false);

  useLayoutEffect(() => {
    if (descRef.current)
      setDescOverflows(descRef.current.scrollHeight > descRef.current.clientHeight + 2);
    if (effRef.current)
      setEffOverflows(effRef.current.scrollHeight > effRef.current.clientHeight + 2);
  }, []);

  const style    = ADV_STYLE[skill.advancement];
  const dotColor = TYPE_DOT[skill.skill_type ?? ""] ?? "bg-gray-400";

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">

      {/* ── 헤더: 아이콘 + 스킬명 + 배지 ── */}
      <div className={`flex gap-3 items-start p-3 ${style?.iconBg ?? "bg-gray-100"}`}>
        <SkillIcon
          iconUrl={skill.icon_url}
          name={skill.name}
          advStyle={style}
          className="w-11 h-11 rounded-lg flex-shrink-0 bg-white/80 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-gray-900 text-sm leading-tight">{skill.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${style?.btn ?? "bg-gray-500 text-white"}`}>
              {skill.advancement}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
              <span className="text-[10px] text-gray-600">{skill.skill_type ?? "—"}</span>
            </span>
            <span className="text-[10px] text-gray-400">마스터 Lv.{skill.master_level}</span>
            {skill.cooldown && (
              <span className="text-[10px] text-gray-400">쿨 {skill.cooldown}</span>
            )}
            {skill.required_skill && (
              <span className="text-[10px] text-amber-600">필요: {skill.required_skill}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <div className="border-t border-gray-200 bg-white">
        {skill.description && (
          <div className={`flex items-stretch text-xs ${skill.max_effect ? "border-b border-gray-100" : ""}`}>
            <div className="w-10 flex-shrink-0 flex items-start justify-center pt-2 pb-2 border-r border-gray-100 bg-gray-50">
              <span className="font-semibold text-gray-400 text-[10px]">설명</span>
            </div>
            <div className="flex-1 px-3 py-2 text-gray-700 leading-relaxed">
              <p ref={descRef} className={!descExpanded ? "line-clamp-4" : ""}>{skill.description}</p>
              {descOverflows && (
                <button onClick={() => setDescExpanded((v) => !v)} className="text-[10px] text-purple-500 hover:text-purple-700 mt-1 font-medium">
                  {descExpanded ? "▲ 접기" : "▼ 더보기"}
                </button>
              )}
            </div>
          </div>
        )}
        {skill.max_effect && (
          <div className="flex items-stretch text-xs">
            <div className="w-10 flex-shrink-0 flex items-start justify-center pt-2 pb-2 border-r border-gray-100 bg-[#f0f4ff]">
              <span className="font-bold text-[#1a6fc4] text-[11px]">Lv.{skill.master_level}</span>
            </div>
            <div className="flex-1 px-3 py-2 text-gray-700 leading-relaxed whitespace-pre-line">
              <p ref={effRef} className={!effExpanded ? "line-clamp-3" : ""}>{skill.max_effect}</p>
              {effOverflows && (
                <button onClick={() => setEffExpanded((v) => !v)} className="text-[10px] text-purple-500 hover:text-purple-700 mt-1 font-medium">
                  {effExpanded ? "▲ 접기" : "▼ 더보기"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SkillPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeAdv, setActiveAdv] = useState("0차");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["전사"]));
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"job" | "link">("job");

  useEffect(() => {
    supaFetch<Job[]>("jobs?select=id,name,job_group").then(setJobs);
  }, []);

  const selectJob = async (job: Job) => {
    setView("job");
    setSelectedJob(job);
    setLoading(true);
    const data = await supaFetch<Skill[]>(`skills?job_id=eq.${job.id}&select=*&limit=300`);
    setSkills(data);
    setLoading(false);
    const firstAdv = ADV_ORDER.find((a) => data.some((s) => s.advancement === a)) ?? "0차";
    setActiveAdv(firstAdv);
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  };

  const jobsByGroup = (group: string) => {
    const order = JOB_ORDER[group] ?? [];
    const groupJobs = jobs.filter((j) => j.job_group === group);
    return order.map((name) => groupJobs.find((j) => j.name === name)).filter(Boolean) as Job[];
  };

  const availableAdvs = ADV_ORDER.filter((a) => skills.some((s) => s.advancement === a));
  const filteredSkills = skills.filter((s) => s.advancement === activeAdv);

  return (
    <div className="flex gap-4">
      <div className="w-56 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-purple-200 overflow-hidden sticky top-4">
          <div className="bg-purple-600 px-3 py-2.5">
            <h3 className="text-sm font-bold text-white tracking-wide">직업 선택</h3>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            <button
              onClick={() => { setView("link"); setSelectedJob(null); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-bold border-b border-purple-100 transition-colors ${
                view === "link"
                  ? "bg-purple-600 text-white"
                  : "text-purple-700 bg-purple-50 hover:bg-purple-100"
              }`}
            >
              🔗 링크 스킬
            </button>
            {GROUP_ORDER.map((group) => (
              <div key={group}>
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border-b border-purple-100 transition-colors"
                >
                  {group}
                  <span className="text-purple-400 text-xs">{expandedGroups.has(group) ? "▲" : "▼"}</span>
                </button>
                {expandedGroups.has(group) &&
                  jobsByGroup(group).map((job) => (
                    <button
                      key={job.id}
                      onClick={() => selectJob(job)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors border-b border-gray-50 ${
                        selectedJob?.id === job.id
                          ? "bg-purple-100 text-purple-800 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {job.name}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {view === "link" ? (
          <LinkSkillView />
        ) : !selectedJob ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white/50 rounded-xl border-2 border-dashed border-purple-200">
            <span className="text-4xl mb-3">⚔️</span>
            <p className="text-sm">왼쪽에서 직업을 선택하세요</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-bold text-purple-800">{selectedJob.name}</h2>
              <span className="text-sm text-purple-500 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                {selectedJob.job_group}
              </span>
              <span className="text-sm text-gray-400 ml-auto">총 {skills.length}개 스킬</span>
            </div>

            <BurstCyclePanel jobName={selectedJob.name} jobSkills={skills} />

            <div className="flex flex-wrap gap-1.5 mb-4">
              {availableAdvs.map((adv) => {
                const count = skills.filter((s) => s.advancement === adv).length;
                const style = ADV_STYLE[adv];
                return (
                  <button
                    key={adv}
                    onClick={() => setActiveAdv(adv)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      activeAdv === adv
                        ? (style?.btn ?? "bg-gray-500 text-white") + " shadow-md scale-105"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
                    }`}
                  >
                    {adv} <span className="opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <span className="animate-pulse">스킬 정보 불러오는 중...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
                {filteredSkills.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-10 text-sm">
                    이 차수에 스킬 정보가 없습니다
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


