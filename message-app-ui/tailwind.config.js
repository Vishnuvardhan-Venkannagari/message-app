/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customPurple: '#6a11cb',
        customBlue: '#778fb4',
        customBrown: "#cda97d",
        customGold: 'rgb(165, 134, 77)',
        customHeaderButtonColor:"#555",
        priceContainerCustomColor: 'rgb(238, 234, 227)',
      }
    },
  },
  plugins: [],
}

