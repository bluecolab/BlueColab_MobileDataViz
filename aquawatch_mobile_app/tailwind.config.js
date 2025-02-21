/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        defaultbackground: 'rgb(240, 240, 240)',
        defaultdarkbackground: '#1a202c'
      },
      padding: {
        default: '10',
      },
      margin: {
        default: '10',
      },
    },
  },
  plugins: [],
}

