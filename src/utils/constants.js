export const BOTS = {
  personal: {
    id: "personal",
    label: "Personal Problems Assistant",
    description:
      "An internal AVOCarbon professional coach who helps employees overcome workplace challenges, strengthen well-being, and improve effectiveness—while respecting industrial constraints and AVOCarbon values.",
    icon: "🧠",
    color: "bg-brand-blue",
  },
  product: {
    id: "product",
    label: "Product and Product Lines Assistant",
    description:
      "A dedicated AVOCarbon coach for strategy, product lines, and detailed product knowledge, delivering fact-based, step-by-step training with quizzes to confirm understanding.",
    icon: "📱",
    color: "bg-brand-orange",
  },
  formalization: {
    id: "formalization",
    label: "Problem Formalization Assistant",
    description:
      "Collaborative managerial coaching and problem-solving assistant with narrative synthesis and stepwise action definition.",
    icon: "📝",
    color: "bg-brand-graphite",
  },
  training: {
    id: "training",
    label: "Generic Training Assistant",
    description:
      "An interactive, role-based training module that guides users through personalized lessons and quizzes.",
    icon: "🎓",
    color: "bg-primary-600",
  },
  email: {
    id: "email",
    label: "Write Email Assistant",
    description:
      "Provides step-by-step guidance to help AVOCarbon employees draft professional, efficient emails—structured for clarity, accountability, and fast decision-making—while aligning with IATF/ISO expectations and AVOCarbon values.",
    icon: "✉️",
    color: "bg-secondary-600",
  },
};

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
