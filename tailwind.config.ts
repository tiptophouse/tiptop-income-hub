
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
        // Add Fahkwang and Work Sans to the font families
        'fahkwang': ['Fahkwang', 'sans-serif'],
        'work-sans': ['Work Sans', 'sans-serif'],
      },
      colors: {
        // Extend existing colors with your specific colors
        custom: {
          background: '#FFFDED',
          text: '#552B1B',
          title: '#AA94E2'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
