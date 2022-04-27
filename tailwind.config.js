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
  theme: {
    extend: {
      colors: {
        'tomato-white': '#FFFFFF',
        'tomato-dark': '#120E18',
        'tomato-cerulean': '#3F86C7',
        'tomato-purple': '#4D38A2',
        'tomato-scarlet': '#FF4848'
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
