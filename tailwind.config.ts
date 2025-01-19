import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        tubelight: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        tubelight: 'tubelight 1.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
} satisfies Config;
