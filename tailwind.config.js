/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors from design system
        brand: {
          "purple-gray": "#6E6B86",
          "orchid-purple": "#6C5CE7",
          "dark-text": "#212121",
          "tarmac-grey": "#475161",
        },
        // UI colors
        ui: {
          "border-gray": "#DDE3EE",
          "light-bg": "#F7F9FC",
          "tulip-purple": "#F9F8FF",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        // Design system typography
        "body-p1": ["16px", { lineHeight: "150%", letterSpacing: "0.16px" }],
        "body-p2": ["14px", { lineHeight: "150%" }],
        "body-p3": ["12px", { lineHeight: "150%", letterSpacing: "0.24px" }],
        "stat-count": ["28px", { lineHeight: "150%" }],
      },
      spacing: {
        // Common spacing values
        192: "192px", // Stat card width
        206: "206px", // Stat card height
      },
      width: {
        "stat-card": "192px",
      },
      height: {
        "stat-card": "206px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        wave: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        breathing: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
        wave: "wave 2s infinite linear",
        breathing: "breathing 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
