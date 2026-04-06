import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    icon: "🛠",
    title: "Digital Tools",
    color: "#3E4A8A",
    bg: "rgba(238,241,255,0.7)",
    border: "#a5b4fc",
    items: [
      {
        name: "Teachable Machine",
        desc: "teachablemachine.withgoogle.com — Train image, audio, and pose models with zero code",
        url: "https://teachablemachine.withgoogle.com",
      },
      {
        name: "Scratch AI Extensions",
        desc: "scratch.mit.edu — Visual programming with ML blocks for kids and beginners",
        url: "https://scratch.mit.edu",
      },
      {
        name: "Google Colab",
        desc: "colab.research.google.com — Free cloud-based Jupyter notebooks for Python & ML experiments",
        url: "https://colab.research.google.com",
      },
      {
        name: "Google Sheets",
        desc: "sheets.google.com — Data collection, cleaning, and visualization with built-in charts",
        url: "https://sheets.google.com",
      },
      {
        name: "Runway ML",
        desc: "runwayml.com — No-code generative AI for images, video, and audio",
        url: "https://runwayml.com",
      },
    ],
  },
  {
    icon: "🎬",
    title: "Videos & Online Resources",
    color: "#166534",
    bg: "rgba(220,252,231,0.5)",
    border: "#86efac",
    items: [
      {
        name: "CrashCourse AI",
        desc: "YouTube playlist — 20 engaging episodes covering all major AI topics at a beginner level",
        url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtO65LeD2p4_Sb5XQ51par_b",
      },
      {
        name: "MIT AI for Kids",
        desc: "MIT CSAIL resources designed to explain AI concepts accessibly for young learners",
        url: "https://raise.mit.edu",
      },
      {
        name: "3Blue1Brown — Neural Networks",
        desc: "YouTube series — beautifully visualized deep dives into how neural networks actually work",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
      },
      {
        name: "Elements of AI",
        desc: "elementsofai.com — Free course by the University of Helsinki covering core AI concepts",
        url: "https://www.elementsofai.com",
      },
    ],
  },
  {
    icon: "📋",
    title: "Worksheets & Activities",
    color: "#9a3412",
    bg: "rgba(255,237,213,0.5)",
    border: "#fdba74",
    items: [
      {
        name: "Data Visualization Worksheet",
        desc: "Students create bar charts and scatter plots from provided datasets and write 3 insights",
        url: "",
      },
      {
        name: "Neural Network Diagram Sheet",
        desc: "Blank diagram template for students to fill in layers, neurons, and labels",
        url: "",
      },
      {
        name: "AI Ethics Reflection Card",
        desc: "Scenario-based prompts asking students to identify bias, privacy, and fairness issues",
        url: "",
      },
      {
        name: "Daily AI Log",
        desc: "Track AI interactions throughout the week — app name, purpose, and reflection",
        url: "",
      },
    ],
  },
  {
    icon: "🚀",
    title: "Mini-Projects",
    color: "#6b21a8",
    bg: "rgba(243,232,255,0.5)",
    border: "#c4b5fd",
    items: [
      {
        name: "Image Classifier",
        desc: "Build a 3-category image classifier using Teachable Machine (e.g., rock/paper/scissors)",
        url: "",
      },
      {
        name: "AI Recommendation Mockup",
        desc: "Design a paper prototype of a recommendation system — what data would it need?",
        url: "",
      },
      {
        name: "Smart Alarm Prototype",
        desc: "Use Teachable Machine pose detection to create an alarm that triggers on a specific gesture",
        url: "",
      },
      {
        name: "Data Story",
        desc: "Collect a real dataset, visualize it in Google Sheets, and present insights to the class",
        url: "",
      },
      {
        name: "AI Solution Pitch",
        desc: "Identify a real community problem and pitch an AI-powered solution with a prototype demo",
        url: "",
      },
    ],
  },
];

export default function MaterialsPage() {
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
            Additional Teaching Materials
          </h2>
        </div>
        <p className="text-muted-foreground text-sm ml-4">
          Curated resources, tools, worksheets, and mini-projects for the AI
          Innovators Lab curriculum
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl overflow-hidden"
            style={{
              background: section.bg,
              border: `1.5px solid ${section.border}`,
            }}
          >
            {/* Section header */}
            <div
              className="flex items-center gap-3 px-5 py-3"
              style={{ borderBottom: `1px solid ${section.border}` }}
            >
              <span className="text-xl">{section.icon}</span>
              <h3
                className="font-display font-bold text-sm tracking-wide uppercase"
                style={{ color: section.color }}
              >
                {section.title}
              </h3>
            </div>

            {/* Items */}
            <div
              className="divide-y"
              style={{ borderColor: `${section.border}60` }}
            >
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="px-5 py-3 flex items-start gap-3"
                >
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: section.border }}
                  >
                    ▸
                  </span>
                  <div>
                    <span className="font-semibold text-sm text-foreground">
                      {item.name}
                    </span>
                    {item.url && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.url.replace("https://", "").split("/")[0]}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Assessment section */}
      <div
        className="mt-6 rounded-xl p-5"
        style={{
          background: "rgba(238,241,255,0.8)",
          border: "1.5px solid #a5b4fc",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">📊</span>
          <h3
            className="font-display font-bold text-sm tracking-wide uppercase"
            style={{ color: "#3E4A8A" }}
          >
            Assessment Criteria
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Participation",
              weight: "30%",
              desc: "Active engagement in discussions, activities, and group work",
            },
            {
              label: "Mini-Projects",
              weight: "50%",
              desc: "Quality, creativity, and technical execution of project work",
            },
            {
              label: "Worksheets",
              weight: "20%",
              desc: "Completion and accuracy of daily worksheets and assignments",
            },
          ].map((criterion) => (
            <div key={criterion.label} className="bg-white/70 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">
                  {criterion.label}
                </span>
                <span className="text-primary font-bold text-lg">
                  {criterion.weight}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {criterion.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Separator className="my-6" />
      <div className="text-center space-y-1">
        <p className="font-display font-semibold text-primary">
          AI Innovators Lab
        </p>
        <p className="text-xs text-muted-foreground">
          info@aiinnovatorslab.com &nbsp;·&nbsp; +977-98XXXXXXXX
        </p>
        <p className="text-xs text-muted-foreground">
          Empowering young minds to shape the future through AI education
        </p>
      </div>
    </div>
  );
}
