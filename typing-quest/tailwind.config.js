/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Define our custom fonts
      fontFamily: {
        sans: ['Inter', 'sans-serif'],    // Default for UI
        mono: ['JetBrains Mono', 'monospace'], // For the typing game
      },
    },
  },
  plugins: [],
}