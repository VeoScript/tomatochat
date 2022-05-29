const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./public/**/*.html", 
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'tomato-white': '#F7F7FB',
        'tomato-lavender': '#786A9F',
        'tomato-lavender-light': '#D4C7ED'
      },
      fontFamily: {
        rowdies: ['Rowdies'],
        rubikglitch: ['Rubik Glitch'],
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  variants: {
    scrollbar: ['dark']
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'),
    require("@tailwindcss/forms")({
      strategy: 'className'
    })
  ]
}
