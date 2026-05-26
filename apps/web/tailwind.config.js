/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui CSS variable tokens (keep for dashboard)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // AlloStudios Design System (overrides accent, muted, border for landing page)
        canvas:         '#FAFAF9',
        surface:        '#F4F3F1',
        border:         '#E8E6E3',
        muted:          '#A09D99',
        dim:            '#706D69',
        ink:            '#18181B',
        accent:         '#5B5BD6',
        'accent-mid':   '#7C7CE8',
        'accent-light': '#EEEFFF',
        'accent-dark':  '#3D3DAB',
        violet: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        display:  ['clamp(2.8rem, 6vw, 5.5rem)', { lineHeight: '1.06', letterSpacing: '-0.03em' }],
        headline: ['clamp(2rem, 4vw, 3.5rem)',   { lineHeight: '1.1',  letterSpacing: '-0.025em' }],
        title:    ['clamp(1.4rem, 2.5vw, 2rem)', { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
      },
      spacing: {
        section: 'clamp(5rem, 10vw, 9rem)',
      },
      boxShadow: {
        xs:   '0 1px 2px rgba(0,0,0,0.05)',
        sm:   '0 2px 8px rgba(0,0,0,0.06)',
        md:   '0 4px 24px rgba(0,0,0,0.08)',
        lg:   '0 12px 48px rgba(0,0,0,0.1)',
        xl:   '0 24px 80px rgba(0,0,0,0.12)',
        glow: '0 0 60px rgba(91,91,214,0.15)',
      },
      animation: {
        "fade-in":    "fade-in 0.5s ease-in-out",
        "slide-up":   "slide-up 0.5s ease-out",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "gradient":   "gradient 6s ease infinite",
        "fade-up":    "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "float":      "float 6s ease-in-out infinite",
        "orb":        "orb 12s ease-in-out infinite",
        "orb2":       "orb2 15s ease-in-out infinite",
        "wave":       "wave 1.5s ease-in-out infinite",
        "marquee":    "marquee 28s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        fadeUp:  { from: { opacity:'0', transform:'translateY(24px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { from: { opacity:'0' }, to: { opacity:'1' } },
        float:   { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        orb:     { '0%,100%': { transform:'translate(0,0) scale(1)' }, '33%': { transform:'translate(3%,2%) scale(1.08)' }, '66%': { transform:'translate(-2%,3%) scale(0.96)' } },
        orb2:    { '0%,100%': { transform:'translate(0,0) scale(1)' }, '33%': { transform:'translate(-4%,-3%) scale(1.05)' }, '66%': { transform:'translate(3%,2%) scale(0.98)' } },
        wave:    { '0%,100%': { transform:'scaleY(0.5)' }, '50%': { transform:'scaleY(1)' } },
        marquee: { from: { transform:'translateX(0)' }, to: { transform:'translateX(-50%)' } },
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
