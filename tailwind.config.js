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
        'tomato-light': '#FFFFFF',
        'tomato-light-secondary': '#EFF3F3',
        'tomato-dark': '#222526',
        'tomato-dark-slight': '#272B2C',
        'tomato-dark-secondary': '#33383B',
        'tomato-orange': '#F16506',
        'tomato-orange-secondary': '#E77326',
        'tomato-red': '#BD3207',
        'tomato-red-secondary': '#7A3015',
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
