export type SectionType =
  | "theory"
  | "activity"
  | "handson"
  | "assignment"
  | "presentation"
  | "discussion"
  | "reflection";

export interface SectionBlock {
  type: SectionType;
  label: string;
  duration: string;
  content: string[];
}

export interface DayData {
  day: number;
  title: string;
  objective: string;
  totalTime: string;
  sections: SectionBlock[];
}

export const days: DayData[] = [
  {
    day: 1,
    title: "Introduction to AI and Its Applications",
    objective:
      "Understand what AI is, its types, and how it is used in the real world.",
    totalTime: "2–3 hours",
    sections: [
      {
        type: "theory",
        label: "Theory",
        duration: "45 min",
        content: [
          "What is Artificial Intelligence? — Definition, brief history, and the difference between AI, Machine Learning, and Deep Learning.",
          "Types of AI: Narrow AI (task-specific), General AI (human-level), and Super AI (theoretical).",
          "Real-world AI applications: healthcare diagnostics, self-driving cars, recommendation systems, chatbots, and smart assistants.",
          "Introduction to AI ethics: bias, fairness, transparency, and the importance of responsible AI development.",
        ],
      },
      {
        type: "activity",
        label: "Activity",
        duration: "30 min",
        content: [
          "Group brainstorming: Where do students encounter AI in their daily lives? (phones, apps, games, Netflix, Spotify, Google Maps)",
          "Watch a short introductory video: '3Blue1Brown – What is Machine Learning?' or 'CrashCourse AI Episode 1'.",
          "Class discussion: What surprised you most about AI? What questions do you still have?",
        ],
      },
      {
        type: "handson",
        label: "Hands-on",
        duration: "45 min",
        content: [
          "Open Teachable Machine (teachablemachine.withgoogle.com) in pairs.",
          "Create a simple image classification model using webcam images — e.g., thumbs up vs. thumbs down.",
          "Test the model live and observe how it learns from examples.",
          "Complete the 'AI Quiz' worksheet: 10 questions covering the day's key concepts.",
        ],
      },
      {
        type: "assignment",
        label: "Assignment",
        duration: "Take-home",
        content: [
          "List 5 AI tools or apps you use in your daily life (e.g., Siri, YouTube recommendations, face unlock).",
          "For each tool, describe: (1) What it does, (2) How you think it uses AI, (3) Whether you think it's helpful or harmful.",
          "Write a short paragraph: 'How could AI improve one aspect of life in Nepal?'",
        ],
      },
    ],
  },
  {
    day: 2,
    title: "Data – The Fuel of AI",
    objective:
      "Learn why data is essential for AI, how it is collected, processed, and visualized.",
    totalTime: "2–3 hours",
    sections: [
      {
        type: "theory",
        label: "Theory",
        duration: "40 min",
        content: [
          "Why data matters: 'Garbage in, garbage out' — AI is only as good as the data it learns from.",
          "Types of data: structured (tables, spreadsheets), unstructured (images, audio, text), and semi-structured (JSON, XML).",
          "Data collection methods: surveys, sensors, web scraping, APIs, user activity logs.",
          "Data quality: cleaning, handling missing values, removing duplicates, and normalization.",
          "Introduction to data visualization: bar charts, scatter plots, histograms — reading and interpreting data stories.",
        ],
      },
      {
        type: "activity",
        label: "Activity",
        duration: "40 min",
        content: [
          "Group exercise: Each group receives a messy dataset (on paper or screen) and must identify errors, missing values, and outliers.",
          "Class debate: 'Should companies collect personal data to improve AI services?' — Discuss privacy vs. convenience.",
          "Mapping exercise: Identify what data your school could collect to improve student learning outcomes.",
        ],
      },
      {
        type: "handson",
        label: "Hands-on",
        duration: "60 min",
        content: [
          "Create a simple dataset in Google Sheets: survey classmates about favorite subjects, hours of screen time, etc.",
          "Visualize the data using Google Sheets charts (bar chart, pie chart, line graph).",
          "Analyze the chart: What patterns do you see? What story does the data tell?",
          "Introduction to Google Colab: open a notebook and run basic Python code for data inspection.",
        ],
      },
      {
        type: "assignment",
        label: "Assignment",
        duration: "Take-home",
        content: [
          "Create a small dataset from home: track 5 household items (e.g., daily temperature, steps walked, meals eaten).",
          "Build a chart in Google Sheets or on paper visualizing your data.",
          "Write 3 observations or 'insights' from your chart.",
        ],
      },
    ],
  },
  {
    day: 3,
    title: "Machine Learning Basics",
    objective:
      "Understand how machine learning works, its types, and apply it using a no-code tool.",
    totalTime: "2–3 hours",
    sections: [
      {
        type: "theory",
        label: "Theory",
        duration: "45 min",
        content: [
          "What is Machine Learning? — Teaching computers to learn from data without being explicitly programmed.",
          "Supervised Learning: labeled data, classification (spam/not spam), regression (price prediction).",
          "Unsupervised Learning: finding hidden patterns — clustering (customer segments), dimensionality reduction.",
          "The ML Pipeline: Collect data → Clean data → Choose model → Train → Test → Evaluate → Deploy.",
          "Overfitting vs. Underfitting: why a model can be 'too good' or 'not good enough' on training data.",
          "Real-world examples: email spam filters, movie recommendations, credit scoring.",
        ],
      },
      {
        type: "activity",
        label: "Activity",
        duration: "30 min",
        content: [
          "Class discussion: How does Netflix or Spotify know what you want to watch/listen to next?",
          "Card sorting game: Students categorize tasks as 'Supervised' or 'Unsupervised' learning problems.",
          "Reflection: What kind of data would a self-driving car need to learn from?",
        ],
      },
      {
        type: "handson",
        label: "Hands-on",
        duration: "60 min",
        content: [
          "Return to Teachable Machine: This time, train a multi-class image classifier (3–4 categories of your choice).",
          "Experiment with different numbers of training samples — see how accuracy changes.",
          "Test the model with edge cases: what happens when you show it something ambiguous?",
          "Optional: use Teachable Machine's audio or pose recognition mode for bonus exploration.",
        ],
      },
      {
        type: "assignment",
        label: "Assignment",
        duration: "Take-home",
        content: [
          "Train a Teachable Machine model using at least 10 different objects found at home.",
          "Screenshot your training results and accuracy.",
          "Write a reflection: What worked well? What was hard to classify? Why do you think that happened?",
        ],
      },
    ],
  },
  {
    day: 4,
    title: "Neural Networks & Deep Learning",
    objective:
      "Explore the architecture of neural networks and understand how deep learning enables complex AI tasks.",
    totalTime: "2–3 hours",
    sections: [
      {
        type: "theory",
        label: "Theory",
        duration: "45 min",
        content: [
          "Biological inspiration: how the human brain works and how artificial neurons mimic brain cells.",
          "Structure of a neural network: Input layer, Hidden layers, Output layer — and how data flows forward.",
          "Weights and biases: how the network adjusts to minimize errors during training (backpropagation).",
          "Activation functions: ReLU, Sigmoid, Softmax — why they're needed to introduce non-linearity.",
          "Deep Learning: neural networks with many layers — enabling image recognition, language translation, and more.",
          "Famous architectures: CNNs for vision, RNNs for sequences, Transformers for language (GPT, BERT).",
        ],
      },
      {
        type: "activity",
        label: "Activity",
        duration: "30 min",
        content: [
          "Paper neuron game: Each student is a neuron — pass 'signals' (paper balls) based on rules (thresholds). Experience how a network processes information.",
          "Diagram exercise: Draw a simple 3-layer neural network for a given problem (e.g., classifying fruit by color and size).",
          "Quick quiz: Match the neural network type (CNN, RNN, Transformer) to its application.",
        ],
      },
      {
        type: "handson",
        label: "Hands-on",
        duration: "60 min",
        content: [
          "Use Teachable Machine's image model to train a deep learning classifier with more complex categories.",
          "Open Google Colab: run a pre-written Python notebook that demonstrates a simple neural network on toy data.",
          "Visualize the training process: observe how loss decreases and accuracy improves over epochs.",
          "Experiment: change the number of training images and observe the effect on performance.",
        ],
      },
      {
        type: "assignment",
        label: "Assignment",
        duration: "Take-home",
        content: [
          "Draw a neural network diagram for a real-world problem of your choice (e.g., detecting disease in plants, recognizing hand gestures).",
          "Label all layers, describe what each layer might be learning, and explain how training would work.",
          "Research question: Find one example of deep learning that surprised you and write 3–5 sentences about it.",
        ],
      },
    ],
  },
  {
    day: 5,
    title: "AI in Problem Solving & Everyday Life",
    objective:
      "Apply AI thinking to real problems and build a prototype solution using no-code tools.",
    totalTime: "2–3 hours",
    sections: [
      {
        type: "theory",
        label: "Theory",
        duration: "30 min",
        content: [
          "AI for social good: applications in agriculture (crop disease detection), healthcare (early diagnosis), education (personalized learning), and disaster response.",
          "Design thinking meets AI: empathize → define the problem → ideate AI solutions → prototype → test.",
          "No-code AI tools: Teachable Machine, Runway ML, Lobe, Scratch ML extensions — making AI accessible.",
          "Case study: Farmers in Nepal using image recognition to identify crop diseases with a smartphone.",
        ],
      },
      {
        type: "activity",
        label: "Activity",
        duration: "30 min",
        content: [
          "Brainstorm session: In groups, identify 3 real problems in your school, community, or city that AI could help solve.",
          "Pitch session: Each group presents their problem and proposed AI solution in 2 minutes.",
          "Class votes on the most impactful, most creative, and most feasible solutions.",
        ],
      },
      {
        type: "handson",
        label: "Hands-on",
        duration: "90 min",
        content: [
          "Each group chooses one AI solution idea and builds a working prototype.",
          "Prototype options: (a) Teachable Machine image/audio classifier, (b) Scratch AI interactive program, (c) Simple chatbot using rule-based logic, (d) Data visualization showing the problem.",
          "Prepare a short presentation: Problem statement, AI solution, how you built it, limitations, and next steps.",
          "Instructor circulates to provide guidance and troubleshooting.",
        ],
      },
      {
        type: "assignment",
        label: "Assignment",
        duration: "Take-home",
        content: [
          "Finalize your prototype and prepare a 5-minute presentation for Day 6.",
          "Create a simple slide deck (3–5 slides): Problem, AI Solution, Demo, Impact, Challenges.",
          "Think about potential ethical issues with your AI solution and prepare to discuss them.",
        ],
      },
    ],
  },
  {
    day: 6,
    title: "Project Presentation & Ethics",
    objective:
      "Showcase student projects, reflect on the course, and critically engage with AI ethics.",
    totalTime: "2–3 hours",
    sections: [
      {
        type: "presentation",
        label: "Project Presentations",
        duration: "90 min",
        content: [
          "Each group presents their mini AI project (5 minutes + 2 minutes Q&A).",
          "Include a live demo of the prototype, explanation of the AI technique used, and real-world impact.",
          "Peer evaluation: students fill out a structured feedback form for each group.",
          "Teacher assessment based on creativity, technical understanding, and presentation clarity.",
        ],
      },
      {
        type: "discussion",
        label: "Ethics Discussion",
        duration: "30 min",
        content: [
          "AI safety: what happens when AI systems fail? (autonomous vehicles, medical AI errors)",
          "Algorithmic bias: how biased training data leads to discriminatory AI (facial recognition, hiring algorithms).",
          "Privacy in the AI age: data surveillance, deepfakes, and the right to be forgotten.",
          "Structured debate: 'AI will do more good than harm in the next 20 years' — argue for and against.",
        ],
      },
      {
        type: "reflection",
        label: "Reflection & Certificates",
        duration: "30 min",
        content: [
          "Reflection exercise: 'The most important thing I learned about AI is…' — students share aloud.",
          "What excites you most about the future of AI? What worries you?",
          "Course wrap-up: key takeaways, further learning resources, and how to keep exploring AI.",
          "Certificate of Completion distribution — celebrating student achievement!",
        ],
      },
    ],
  },
];

export interface NavItem {
  id: number;
  label: string;
  sublabel?: string;
}

export const navItems: NavItem[] = [
  { id: 0, label: "Cover Page" },
  { id: 1, label: "Table of Contents" },
  { id: 2, label: "Day 1", sublabel: "Introduction to AI" },
  { id: 3, label: "Day 2", sublabel: "Data – The Fuel of AI" },
  { id: 4, label: "Day 3", sublabel: "Machine Learning Basics" },
  { id: 5, label: "Day 4", sublabel: "Neural Networks" },
  { id: 6, label: "Day 5", sublabel: "AI in Problem Solving" },
  { id: 7, label: "Day 6", sublabel: "Presentation & Ethics" },
  { id: 8, label: "Teaching Materials" },
];

export const totalPages = navItems.length;
