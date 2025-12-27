/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#16161d",
        surface: "#1e1e26", // Slightly lighter than background
        surfaceHighlight: "#272730", // For hover states
        primary: "#4f46e5", // Indigo-600 (kept for brand identity or can change to gold if desired)
        text: {
            primary: "#ffffff",
            secondary: "#a1a1aa", // Gray-400
            muted: "#71717a", // Gray-500
        }
      },
      fontFamily: {
         sans: ['Inter', 'sans-serif'], // Ensuring a clean font if not already default
      }
    },
  },
  plugins: [],
}
