/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          border: "var(--bg-border)"
        },
        accent: {
          primary: "var(--accent-primary)",
          glow: "var(--accent-glow)",
          secondary: "var(--accent-secondary)"
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)"
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)"
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" }
        },
        pulseDanger: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(229,62,62,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(229,62,62,0)" }
        },
        slideFade: {
          "0%": { opacity: 0, transform: "translateX(10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        slideInRight: {
          "0%": { opacity: 0, transform: "translateX(110%)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        }
      },
      animation: {
        "fade-up": "fadeUp 0.45s ease forwards",
        shake: "shake 0.35s ease",
        "pulse-danger": "pulseDanger 1.4s infinite",
        "slide-fade": "slideFade 0.2s ease",
        "slide-down": "slideDown 0.15s ease-out",
        "toast-in": "slideInRight 0.25s ease forwards"
      }
    }
  },
  plugins: []
};
