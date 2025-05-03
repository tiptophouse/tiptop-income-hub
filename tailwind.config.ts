
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        'fahkwang': ['Fahkwang', 'sans-serif'],
        'work-sans': ['Work Sans', 'sans-serif'],
      },
      colors: {
        'tiptop-accent': '#AA94E2',
        'tiptop-dark': '#552B1B',
        'tiptop-light': '#FFFDED',
        'tiptop-secondary': '#6E59A5',
        'tiptop-tertiary': '#E5DEFF',
        'tiptop-hover': '#9b87f5',
        'tiptop-background': '#FFFDED',
        custom: {
          background: '#FFFDED',
          text: '#552B1B',
          title: '#AA94E2'
        },
        'sidebar': {
          DEFAULT: '#6E59A5',
          'foreground': '#FFFFFF',
          'border': '#7E69AB',
          'accent': '#9b87f5',
          'accent-foreground': '#FFFFFF'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
