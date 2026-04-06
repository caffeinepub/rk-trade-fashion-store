interface TableOfContentsProps {
  onNavigate: (page: number) => void;
}

const tocItems = [
  { page: 0, label: "Cover Page", desc: "Course overview and branding" },
  { page: 1, label: "Table of Contents", desc: "This page" },
  { page: 2, label: "Day 1", desc: "Introduction to AI and Its Applications" },
  { page: 3, label: "Day 2", desc: "Data – The Fuel of AI" },
  { page: 4, label: "Day 3", desc: "Machine Learning Basics" },
  { page: 5, label: "Day 4", desc: "Neural Networks & Deep Learning" },
  { page: 6, label: "Day 5", desc: "AI in Problem Solving & Everyday Life" },
  { page: 7, label: "Day 6", desc: "Project Presentation & Ethics" },
  {
    page: 8,
    label: "Additional Materials",
    desc: "Tools, resources, assessments, mini-projects",
  },
];

export default function TableOfContents({ onNavigate }: TableOfContentsProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: "linear-gradient(180deg, #3E4A8A, #6366f1)" }}
          />
          <h2 className="font-display font-bold text-3xl text-foreground">
            Table of Contents
          </h2>
        </div>
        <p className="text-muted-foreground text-sm ml-4">
          AI Innovators Lab — 6-Day Advanced AI Course for Grades 8–10
        </p>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {tocItems.map((item, idx) => (
          <button
            type="button"
            key={item.page}
            data-ocid={`toc.item.${idx + 1}`}
            onClick={() => onNavigate(item.page)}
            className="w-full group flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-150 hover:bg-accent hover:shadow-xs"
          >
            {/* Page number */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-display"
              style={{
                background:
                  idx === 0 || idx === 1 || idx === 8
                    ? "rgba(62,74,138,0.08)"
                    : `hsl(${220 + (idx - 2) * 15}, 70%, 92%)`,
                color: "#3E4A8A",
              }}
            >
              {idx + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {item.desc}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
              →
            </div>
          </button>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Click any item to navigate directly to that section · Use ← → arrow
          keys or the navigation buttons to move between pages
        </p>
      </div>
    </div>
  );
}
