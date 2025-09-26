/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.8rem', { lineHeight: '1.1rem' }],
        'sm': ['0.9rem', { lineHeight: '1.35rem' }],
        'base': ['1.05rem', { lineHeight: '1.6rem' }],
        'lg': ['1.18rem', { lineHeight: '1.8rem' }],
        'xl': ['1.3rem', { lineHeight: '1.85rem' }],
        '2xl': ['1.55rem', { lineHeight: '2.05rem' }],
        '3xl': ['1.9rem', { lineHeight: '2.3rem' }],
        '4xl': ['2.3rem', { lineHeight: '2.55rem' }],
        '5xl': ['3.05rem', { lineHeight: '1' }],
        '6xl': ['3.8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        'glass': '8px',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'elevation-3': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "spring-bounce": "spring-bounce 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)",
        "float": "float 6s ease-in-out infinite",
        "float-delay-1": "float 6s ease-in-out 0.5s infinite",
        "float-delay-2": "float 6s ease-in-out 1s infinite",
        "float-delay-3": "float 6s ease-in-out 1.5s infinite",
        "float-delay-4": "float 6s ease-in-out 2s infinite",
        "float-delay-5": "float 6s ease-in-out 2.5s infinite",
        "pulse-delay": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "spring-bounce": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
        "float": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "33%": { transform: "translateY(-20px) translateX(10px) rotate(10deg)" },
          "66%": { transform: "translateY(-10px) translateX(-10px) rotate(-10deg)" },
          "100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}