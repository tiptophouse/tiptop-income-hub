
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
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'fahkwang': ['Fahkwang', 'sans-serif'],
        'work-sans': ['Work Sans', 'sans-serif'],
      },
      colors: {
        'tiptop-purple': '#7E69AB',
        'tiptop-dark-purple': '#6E59A5',
        'tiptop-light-purple': '#9b87f5',
        'tiptop-cream': '#F8F6F0',
        'tiptop-dark': '#2D2D2D',
        'tiptop-accent': '#7E69AB',
        'tiptop-secondary': '#6E59A5',
        'tiptop-tertiary': '#E5DEFF',
        'tiptop-hover': '#9b87f5',
        'tiptop-background': '#F8F6F0',
        custom: {
          background: '#F8F6F0',
          text: '#2D2D2D',
          title: '#7E69AB'
        },
        'sidebar': {
          DEFAULT: '#6E59A5',
          'foreground': '#FFFFFF',
          'border': '#7E69AB',
          'accent': '#9b87f5',
          'accent-foreground': '#FFFFFF'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
