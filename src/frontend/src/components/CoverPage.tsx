export default function CoverPage() {
  return (
    <div
      className="relative w-full min-h-[900px] flex flex-col overflow-hidden rounded-xl"
      style={{
        background:
          "linear-gradient(135deg, #1a1f5e 0%, #2d2060 40%, #3730a3 70%, #1e3a8a 100%)",
      }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/ai-innovators-cover-bg.dim_1200x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glowing orbs */}
      <div
        className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-40 left-16 w-48 h-48 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
        {/* Top badges */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#c7d2fe",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Grades 8–10
          </span>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(99,102,241,0.4)",
              color: "#e0e7ff",
              border: "1px solid rgba(165,180,252,0.4)",
            }}
          >
            Advanced AI &amp; Technology
          </span>
        </div>

        {/* AI Brain icon area */}
        <div
          className="mb-8 flex items-center justify-center w-24 h-24 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="AI neural network icon"
            role="img"
          >
            <title>AI neural network icon</title>
            <circle cx="24" cy="24" r="10" stroke="#a5b4fc" strokeWidth="2" />
            <circle cx="24" cy="8" r="3" fill="#818cf8" />
            <circle cx="24" cy="40" r="3" fill="#818cf8" />
            <circle cx="8" cy="24" r="3" fill="#818cf8" />
            <circle cx="40" cy="24" r="3" fill="#818cf8" />
            <circle cx="11" cy="11" r="3" fill="#6366f1" />
            <circle cx="37" cy="11" r="3" fill="#6366f1" />
            <circle cx="11" cy="37" r="3" fill="#6366f1" />
            <circle cx="37" cy="37" r="3" fill="#6366f1" />
            <line
              x1="24"
              y1="11"
              x2="24"
              y2="14"
              stroke="#a5b4fc"
              strokeWidth="1.5"
            />
            <line
              x1="24"
              y1="34"
              x2="24"
              y2="37"
              stroke="#a5b4fc"
              strokeWidth="1.5"
            />
            <line
              x1="11"
              y1="24"
              x2="14"
              y2="24"
              stroke="#a5b4fc"
              strokeWidth="1.5"
            />
            <line
              x1="34"
              y1="24"
              x2="37"
              y2="24"
              stroke="#a5b4fc"
              strokeWidth="1.5"
            />
            <line
              x1="13.5"
              y1="13.5"
              x2="16"
              y2="16"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
            <line
              x1="34.5"
              y1="13.5"
              x2="32"
              y2="16"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
            <line
              x1="13.5"
              y1="34.5"
              x2="16"
              y2="32"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
            <line
              x1="34.5"
              y1="34.5"
              x2="32"
              y2="32"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
            <circle cx="24" cy="24" r="4" fill="#6366f1" />
          </svg>
        </div>

        {/* Main Title */}
        <h1
          className="font-display font-bold text-white mb-3 leading-tight"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            textShadow: "0 2px 20px rgba(99,102,241,0.5)",
          }}
        >
          AI Innovators Lab
        </h1>

        {/* Subtitle */}
        <p
          className="font-display font-medium mb-2"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "#a5b4fc" }}
        >
          Advanced AI &amp; Technology Classes
        </p>

        {/* Tagline */}
        <p className="font-body text-lg mb-10" style={{ color: "#c7d2fe" }}>
          ✦ Shaping Future Minds ✦
        </p>

        {/* Duration badge */}
        <div
          className="mb-10 px-8 py-3 rounded-2xl text-sm font-semibold"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(165,180,252,0.4)",
            color: "#e0e7ff",
            backdropFilter: "blur(8px)",
          }}
        >
          🗓 6 Days &nbsp;|&nbsp; 🛠 Hands-on Projects &nbsp;|&nbsp; 🏆
          Certificate of Completion
        </div>

        {/* Separator */}
        <div
          className="w-24 h-px mb-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, #818cf8, transparent)",
          }}
        />

        {/* Stats row */}
        <div className="flex flex-wrap gap-8 justify-center mb-12">
          {[
            { value: "6", label: "Days" },
            { value: "18+", label: "Activities" },
            { value: "6", label: "Projects" },
            { value: "∞", label: "Curiosity" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-display font-bold text-3xl"
                style={{ color: "#818cf8" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs tracking-widest uppercase"
                style={{ color: "#94a3b8" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom contact bar */}
      <div
        className="relative z-10 px-8 py-5"
        style={{
          background: "rgba(0,0,0,0.3)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex flex-wrap gap-4 items-center justify-between max-w-3xl mx-auto">
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#94a3b8" }}
          >
            <span style={{ color: "#818cf8" }}>✉</span>
            <span>info@aiinnovatorslab.com</span>
          </div>
          <div
            className="font-display font-semibold text-sm"
            style={{ color: "#a5b4fc" }}
          >
            AI Innovators Lab
          </div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#94a3b8" }}
          >
            <span style={{ color: "#818cf8" }}>📞</span>
            <span>+977-98XXXXXXXX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
