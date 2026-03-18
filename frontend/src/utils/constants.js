export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
export const RESUME_SESSION_MINUTES = 20;
export const RESUME_WORD_WARNING_LIMIT = 700;
export const LOCAL_STORAGE_KEYS = {
  resumeId: "resume-builder-resume-id",
  sessionStartedAt: "resume-builder-session-started-at"
};

export const STEP_TITLES = [
  "Personal Info",
  "Summary",
  "Experience",
  "Education",
  "Skills",
  "Projects"
];
