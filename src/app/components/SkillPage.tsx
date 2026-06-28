import { useState, useEffect, useMemo, useLayoutEffect, useRef } from "react";

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

const TYPE_DOT: Record<string, string> = {
  "패시브":          "bg-green-500",
  "액티브(즉발)":    "bg-red-500",
  "액티브(지속)":    "bg-orange-400",
  "액티브(온/오프)": "bg-violet-500",
  "액티브":          "bg-blue-500",
  "소환(지속)":      "bg-teal-500",
  "버프":            "bg-yellow-400",
};

function CycleSkillIcon({
  name,
  iconUrl,
  isSeq,
}: {
  name: string;
  iconUrl: string | null;
  isSeq: boolean;
}) {
  const [err, setErr] = useState(false);
  const short = name.length > 9 ? name.slice(0, 8) + "…" : name;
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-12">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${
          isSeq
            ? "ring-2 ring-amber-400 bg-amber-50"
            : "bg-gray-100"
        }`}
      >
        {iconUrl && !err ? (
          <img
            src={iconUrl}
            alt={name}
            title={name}
            className="w-8 h-8 object-contain"
            onError={() => setErr(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-base">⚔️</span>
        )}
      </div>
      <span className="text-[8px] text-gray-500 text-center leading-tight w-full truncate px-0.5" title={name}>
        {short}
      </span>
    </div>
  );
}

function BurstCyclePanel({ jobName, jobSkills }: { jobName: string; jobSkills: Skill[] }) {
  const [data, setData] = useState<BpCache[]>([]);
  const [activeRank, setActiveRank] = useState(1);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const iconMap = useMemo(() => {
    const map: Record<string, string | null> = {};
    jobSkills.forEach((s) => { map[s.name] = s.icon_url; });
    return map;
  }, [jobSkills]);

  useEffect(() => {
    setLoading(true);
    setActiveRank(1);
    const enc = encodeURIComponent(jobName);
    supaFetch<BpCache[]>(
      `battle_practice_cache?job_name=eq.${enc}&select=rank,character_name,world_name,total_dps,season,skill_timeline,skill_stats&order=rank.asc&limit=3`
    ).then((d) => { setData(d); setLoading(false); });
  }, [jobName]);

  const current = data.find((d) => d.rank === activeRank) ?? data[0];

  const uniqueTimeline = useMemo(() => {
    if (!current) return [];
    const seen = new Set<string>();
    const result: TimelineSkill[] = [];
    for (const sk of current.skill_timeline ?? []) {
      if (!seen.has(sk.s)) {
        seen.add(sk.s);
        result.push(sk);
      }
    }
    return result;
  }, [current]);

  const topStats = useMemo(() => {
    if (!current) return [];
    return [...(current.skill_stats ?? [])].sort((a, b) => b.pct - a.pct).slice(0, 7);
  }, [current]);

  if (loading) return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-600 animate-pulse">
      극딜 사이클 불러오는 중...
    </div>
  );
  if (data.length === 0) return null;

  const maxPct = topStats[0]?.pct ?? 1;
  const season = current?.season;

  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white overflow-hidden shadow-sm">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-amber-100/50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-800">🔥 극딜 사이클</span>
          <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-200">
            시즌{season} 기준
          </span>
          <span className="text-[10px] text-gray-400">연무장 top3 (2분 사이클)</span>
        </div>
        <span className="text-xs text-amber-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {/* Rank tabs */}
          <div className="flex gap-1.5 mb-3">
            {data.map((d) => (
              <button
                key={d.rank}
                onClick={() => setActiveRank(d.rank)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
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
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              딜 사이클
              <span className="ml-2 normal-case font-normal text-amber-500">
                ■ 금색 테두리 = 극딜 시퀀스
              </span>
            </p>
            {uniqueTimeline.length === 0 ? (
              <span className="text-xs text-gray-400">타임라인 정보 없음</span>
            ) : (
              <div className="overflow-x-auto pb-1">
                <div className="flex gap-1.5 w-max">
                  {uniqueTimeline.map((sk, i) => (
                    <CycleSkillIcon
                      key={i}
                      name={sk.s}
                      iconUrl={iconMap[sk.s] ?? null}
                      isSeq={!!sk.seq}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DPS stats */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">DPS 기여도</p>
            <div className="space-y-1">
              {topStats.map((sk, i) => (
                <div key={i} className="flex items-center gap-2">
                  {iconMap[sk.s] ? (
                    <img
                      src={iconMap[sk.s]!}
                      alt={sk.s}
                      className="w-4 h-4 object-contain flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[10px] w-4 text-center flex-shrink-0">⚔</span>
                  )}
                  <span className="text-[10px] text-gray-600 w-28 truncate flex-shrink-0">{sk.s}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${(sk.pct / maxPct) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 w-10 text-right flex-shrink-0">
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

function SkillIcon({ iconUrl, name, advStyle }: { iconUrl: string | null; name: string; advStyle?: { iconBg: string } }) {
  const [err, setErr] = useState(false);

  if (iconUrl && !err) {
    return (
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${advStyle?.iconBg ?? "bg-gray-100"}`}>
        <img
          src={iconUrl}
          alt={name}
          className="w-8 h-8 object-contain"
          onError={() => setErr(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg ${advStyle?.iconBg ?? "bg-gray-100"}`}>
      ⚔️
    </div>
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
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="bg-[#1b2a4a] px-3 py-1.5">
        <span className="text-[#e8c96a] text-[10px] font-bold tracking-[0.2em]">SKILL</span>
      </div>
      <div className="flex items-stretch border-b border-gray-200">
        <div className="w-14 flex-shrink-0 flex items-center justify-center p-2 border-r border-gray-200 bg-gray-50">
          <SkillIcon iconUrl={skill.icon_url} name={skill.name} advStyle={style} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-2 px-2 min-w-0">
          <span className="text-sm font-bold text-gray-900 text-center leading-tight">{skill.name}</span>
        </div>
      </div>
      <div className="flex items-center border-b border-gray-200">
        <div className="w-14 flex-shrink-0 flex items-center justify-center p-2 border-r border-gray-200 bg-gray-50">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        </div>
        <div className="flex-1 px-3 py-1.5 text-xs text-gray-700">{skill.skill_type ?? "—"}</div>
      </div>
      <div className="flex items-center border-b border-gray-200">
        <div className="w-20 flex-shrink-0 px-3 py-1.5 bg-gray-50 border-r border-gray-200">
          <span className="text-[11px] text-gray-500">마스터 레벨</span>
        </div>
        <div className="flex-1 px-3 py-1.5 text-xs text-gray-800">{skill.master_level}</div>
      </div>
      {skill.cooldown && (
        <div className="flex items-center border-b border-gray-200">
          <div className="w-20 flex-shrink-0 px-3 py-1.5 bg-gray-50 border-r border-gray-200">
            <span className="text-[11px] text-gray-500">재사용 대기</span>
          </div>
          <div className="flex-1 px-3 py-1.5 text-xs text-blue-600">{skill.cooldown}</div>
        </div>
      )}
      {skill.required_skill && (
        <div className="flex items-center border-b border-gray-200">
          <div className="w-20 flex-shrink-0 px-3 py-1.5 bg-gray-50 border-r border-gray-200">
            <span className="text-[11px] text-gray-500">필요 스킬</span>
          </div>
          <div className="flex-1 px-3 py-1.5 text-xs text-amber-600">{skill.required_skill}</div>
        </div>
      )}
      {skill.description && (
        <div className="flex items-start border-b border-gray-200">
          <div className="w-20 flex-shrink-0 px-3 py-2 bg-gray-50 border-r border-gray-200">
            <span className="text-[11px] text-gray-500">설명</span>
          </div>
          <div className="flex-1 px-3 py-2 text-[11px] text-gray-700 leading-relaxed">
            <p ref={descRef} className={!descExpanded ? "line-clamp-4" : ""}>{skill.description}</p>
            {descOverflows && (
              <button onClick={() => setDescExpanded((v) => !v)} className="text-[10px] text-purple-500 hover:text-purple-700 mt-1 font-medium">
                {descExpanded ? "접기 ▲" : "더보기 ▼"}
              </button>
            )}
          </div>
        </div>
      )}
      {skill.max_effect && (
        <div className="flex items-start">
          <div className="w-20 flex-shrink-0 px-3 py-2 bg-gray-50 border-r border-gray-200">
            <span className="text-[11px] text-gray-500">효과</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start">
              <div className="w-8 flex-shrink-0 flex items-start justify-center pt-2 border-r border-gray-100">
                <span className="text-[10px] text-gray-400">{skill.master_level}</span>
              </div>
              <div className="flex-1 px-2 py-2 text-[11px] text-gray-700 leading-relaxed">
                <p ref={effRef} className={!effExpanded ? "line-clamp-3" : ""}>{skill.max_effect}</p>
                {effOverflows && (
                  <button onClick={() => setEffExpanded((v) => !v)} className="text-[10px] text-purple-500 hover:text-purple-700 mt-1 font-medium">
                    {effExpanded ? "접기 ▲" : "더보기 ▼"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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

  useEffect(() => {
    supaFetch<Job[]>("jobs?select=id,name,job_group").then(setJobs);
  }, []);

  const selectJob = async (job: Job) => {
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
      <div className="w-52 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-purple-200 overflow-hidden sticky top-4">
          <div className="bg-purple-600 px-3 py-2">
            <h3 className="text-xs font-bold text-white tracking-wide">직업 선택</h3>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            {GROUP_ORDER.map((group) => (
              <div key={group}>
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border-b border-purple-100 transition-colors"
                >
                  {group}
                  <span className="text-purple-400 text-[10px]">{expandedGroups.has(group) ? "▲" : "▼"}</span>
                </button>
                {expandedGroups.has(group) &&
                  jobsByGroup(group).map((job) => (
                    <button
                      key={job.id}
                      onClick={() => selectJob(job)}
                      className={`w-full text-left px-4 py-1.5 text-xs transition-colors border-b border-gray-50 ${
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
        {!selectedJob ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white/50 rounded-xl border-2 border-dashed border-purple-200">
            <span className="text-4xl mb-3">⚔️</span>
            <p className="text-sm">왼쪽에서 직업을 선택하세요</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-purple-800">{selectedJob.name}</h2>
              <span className="text-xs text-purple-500 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                {selectedJob.job_group}
              </span>
              <span className="text-xs text-gray-400 ml-auto">총 {skills.length}개 스킬</span>
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
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