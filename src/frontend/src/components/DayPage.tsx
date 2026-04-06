import { Badge } from "@/components/ui/badge";
import type { DayData, SectionType } from "@/data/courseData";

interface DayPageProps {
  data: DayData;
}

const sectionConfig: Record<
  SectionType,
  {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    icon: string;
    badgeBg: string;
  }
> = {
  theory: {
    bg: "rgba(219,234,254,0.5)",
    border: "#93c5fd",
    text: "#1e40af",
    iconBg: "#dbeafe",
    icon: "📖",
    badgeBg: "rgba(219,234,254,0.8)",
  },
  activity: {
    bg: "rgba(220,252,231,0.5)",
    border: "#86efac",
    text: "#166534",
    iconBg: "#dcfce7",
    icon: "🎯",
    badgeBg: "rgba(220,252,231,0.8)",
  },
  handson: {
    bg: "rgba(255,237,213,0.5)",
    border: "#fdba74",
    text: "#9a3412",
    iconBg: "#ffedd5",
    icon: "💻",
    badgeBg: "rgba(255,237,213,0.8)",
  },
  assignment: {
    bg: "rgba(243,232,255,0.5)",
    border: "#c4b5fd",
    text: "#6b21a8",
    iconBg: "#f3e8ff",
    icon: "📝",
    badgeBg: "rgba(243,232,255,0.8)",
  },
  presentation: {
    bg: "rgba(219,234,254,0.5)",
    border: "#93c5fd",
    text: "#1e40af",
    iconBg: "#dbeafe",
    icon: "🎤",
    badgeBg: "rgba(219,234,254,0.8)",
  },
  discussion: {
    bg: "rgba(255,237,213,0.5)",
    border: "#fdba74",
    text: "#9a3412",
    iconBg: "#ffedd5",
    icon: "💬",
    badgeBg: "rgba(255,237,213,0.8)",
  },
  reflection: {
    bg: "rgba(243,232,255,0.5)",
    border: "#c4b5fd",
    text: "#6b21a8",
    iconBg: "#f3e8ff",
    icon: "🌟",
    badgeBg: "rgba(243,232,255,0.8)",
  },
};

const dayAccentColors = [
  "linear-gradient(135deg, #3E4A8A 0%, #6366f1 100%)",
  "linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)",
  "linear-gradient(135deg, #166534 0%, #4ade80 100%)",
  "linear-gradient(135deg, #7c3aed 0%, #c4b5fd 100%)",
  "linear-gradient(135deg, #c2410c 0%, #fb923c 100%)",
  "linear-gradient(135deg, #be123c 0%, #fb7185 100%)",
];

export default function DayPage({ data }: DayPageProps) {
  const accent = dayAccentColors[(data.day - 1) % dayAccentColors.length];

  return (
    <div className="w-full">
      {/* Day header accent bar */}
      <div
        className="-mx-8 -mt-8 mb-8 px-8 py-6 rounded-t-xl"
        style={{ background: accent }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-1">
              Day {data.day} of 6
            </div>
            <h2
              className="font-display font-bold text-white leading-tight"
              style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}
            >
              {data.title}
            </h2>
          </div>
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            {["🤖", "📊", "🧠", "🔬", "💡", "🏆"][data.day - 1]}
          </div>
        </div>
      </div>

      {/* Objective + Time badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-sm">
          <span className="text-primary">🎯</span>
          <span className="text-foreground font-medium">{data.objective}</span>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          ⏱ {data.totalTime}
        </Badge>
      </div>

      {/* Section blocks */}
      <div className="space-y-5">
        {data.sections.map((section, idx) => {
          const config = sectionConfig[section.type];
          const sectionKey = `${section.type}-${idx}`;
          return (
            <div
              key={sectionKey}
              className="rounded-xl overflow-hidden"
              style={{
                background: config.bg,
                border: `1.5px solid ${config.border}`,
              }}
            >
              {/* Section header */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: `1px solid ${config.border}` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{ background: config.iconBg }}
                  >
                    {config.icon}
                  </div>
                  <span
                    className="font-display font-bold text-sm tracking-wide uppercase"
                    style={{ color: config.text }}
                  >
                    {section.label}
                  </span>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: config.badgeBg, color: config.text }}
                >
                  {section.duration}
                </span>
              </div>

              {/* Section content */}
              <ul className="px-5 py-4 space-y-2">
                {section.content.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-foreground leading-relaxed"
                  >
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: config.border }}
                    >
                      ▸
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
