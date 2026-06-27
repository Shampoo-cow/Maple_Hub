import { useState, useEffect } from "react";

const SUPABASE_URL = "https://oemhkfjwqpmiiugpfgvu.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbWhrZmp3cXBtaWl1Z3BmZ3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MTc3MzYsImV4cCI6MjA5ODA5MzczNn0.LDMpg-eNzZuITtqR1K5YlqiqoN09TofJLixgOxgH4y4";

type Job = { id: string; name: string; job_group: string };
type Skill = {
  id: string;
  name: string;
  advancement: string;
  skill_type: string | null;
  master_level: number;
  description: string | null;
  max_effect: string | null;
  cooldown: string | null;
};

const JOB_ORDER: Record<string, string[]> = {
  전사: [
    "히어로","팔라딘","다크나이트","소울마스터","미하일","블래스터",
    "데몬 슬레이어","데몬 어벤져","아란","카이저","아델","렌","제로",
  ],
  마법사: [
    "아크메이지(불,독)","아크메이지(썬,콜)","비숍","플레임위자드","배틀메이지",
    "에반","루미너스","일리움","라라","키네시스","레테",
  ],
  궁수: ["보우마스터","신궁","패스파인더","윈드브레이커","와일드헌터","메르세데스","카인"],
  도적: ["나이트로드","섀도어","듀얼블레이드","나이트워커","팬텀","카데나","칼리","호영"],
  해적: ["바이퍼","캡틴","캐논슈터","스트라이커","메카닉","은월","엔젤릭버스터","아크","제논"],
};
const GROUP_ORDER = ["전사", "마법사", "궁수", "도적", "해적"];
const ADV_ORDER = ["0차", "1차", "2차", "3차", "4차", "하이퍼", "5차", "6차"];

const ADV_STYLE: Record<string, { btn: string; badge: string }> = {
  "0차":   { btn: "bg-gray-500 text-white",    badge: "bg-gray-100 text-gray-600 border-gray-300" },
  "1차":   { btn: "bg-emerald-500 text-white", badge: "bg-emerald-50 text-emerald-700 border-emerald-300" },
  "2차":   { btn: "bg-blue-500 text-white",    badge: "bg-blue-50 text-blue-700 border-blue-300" },
  "3차":   { btn: "bg-indigo-600 text-white",  badge: "bg-indigo-50 text-indigo-700 border-indigo-300" },
  "4차":   { btn: "bg-violet-600 text-white",  badge: "bg-violet-50 text-violet-700 border-violet-300" },
  "하이퍼":{ btn: "bg-orange-500 text-white",  badge: "bg-orange-50 text-orange-700 border-orange-300" },
  "5차":   { btn: "bg-rose-600 text-white",    badge: "bg-rose-50 text-rose-700 border-rose-300" },
  "6차":   { btn: "bg-pink-600 text-white",    badge: "bg-pink-50 text-pink-700 border-pink-300" },
};

const supaFetch = <T,>(path: string): Promise<T> =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  }).then((r) => r.json() as Promise<T>);

export function SkillPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeAdv, setActiveAdv] = useState("0차");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["전사"])
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supaFetch<Job[]>("jobs?select=id,name,job_group").then(setJobs);
  }, []);

  const selectJob = async (job: Job) => {
    setSelectedJob(job);
    setLoading(true);
    const data = await supaFetch<Skill[]>(
      `skills?job_id=eq.${job.id}&select=*&limit=300`
    );
    setSkills(data);
    setLoading(false);
    const firstAdv =
      ADV_ORDER.find((a) => data.some((s) => s.advancement === a)) ?? "0차";
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
    return order
      .map((name) => groupJobs.find((j) => j.name === name))
      .filter(Boolean) as Job[];
  };

  const availableAdvs = ADV_ORDER.filter((a) =>
    skills.some((s) => s.advancement === a)
  );
  const filteredSkills = skills.filter((s) => s.advancement === activeAdv);

  return (
    <div className="flex gap-4">
      {/* Left: Job Selection */}
      <div className="w-44 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-purple-200 overflow-hidden sticky top-4">
          <div className="bg-purple-600 px-3 py-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              직업 선택
            </h3>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            {GROUP_ORDER.map((group) => (
              <div key={group}>
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border-b border-purple-100 transition-colors"
                >
                  {group}
                  <span className="text-purple-400 text-[10px]">
                    {expandedGroups.has(group) ? "▲" : "▼"}
                  </span>
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

      {/* Right: Skill Display */}
      <div className="flex-1 min-w-0">
        {!selectedJob ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white/50 rounded-xl border-2 border-dashed border-purple-200">
            <span className="text-4xl mb-3">⚔️</span>
            <p className="text-sm">왼쪽에서 직업을 선택하세요</p>
          </div>
        ) : (
          <>
            {/* Job Title Bar */}
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-purple-800">
                {selectedJob.name}
              </h2>
              <span className="text-xs text-purple-500 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                {selectedJob.job_group}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                총 {skills.length}개 스킬
              </span>
            </div>

            {/* Advancement Tabs */}
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
                        ? (style?.btn ?? "bg-gray-500 text-white") +
                          " shadow-md scale-105"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
                    }`}
                  >
                    {adv}{" "}
                    <span className="opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Skill Cards */}
            {loading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <span className="animate-pulse">스킬 정보 불러오는 중...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredSkills.map((skill) => {
                  const advStyle = ADV_STYLE[skill.advancement];
                  return (
                    <div
                      key={skill.id}
                      className="bg-white rounded-xl p-3 shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      {/* Skill Name + Badge */}
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                          {skill.name}
                        </h4>
                        {advStyle && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium border ${advStyle.badge}`}
                          >
                            {skill.advancement}
                          </span>
                        )}
                      </div>

                      {/* Type + Level + Cooldown */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {skill.skill_type && (
                          <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">
                            {skill.skill_type}
                          </span>
                        )}
                        {skill.master_level != null && (
                          <span className="text-[10px] text-gray-400">
                            Lv.{skill.master_level}
                          </span>
                        )}
                        {skill.cooldown && (
                          <span className="text-[10px] text-blue-500 ml-auto">
                            ⏱ {skill.cooldown}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {skill.description && (
                        <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  );
                })}
                {filteredSkills.length === 0 && (
                  <div className="col-span-3 text-center text-gray-400 py-10 text-sm">
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