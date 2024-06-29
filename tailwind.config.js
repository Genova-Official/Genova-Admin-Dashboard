/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        sm: ['14px', '1.5rem'], // 14px
        base: ['20px', '1.5rem'], // 20px
        lg: ['24px', '1.5rem'], // 24px
        xl: ['32px', '1.5rem'], // 32px
      },
      colors: {
        primary: '#1a202c', // Example primary color
        secondary: '#2d3748', // Example secondary color
        accent: '#660066', // Example accent color
        'gray-dark': '#2d3748',
        'gray-light': '#a0aec0',
        white: '#fff',
        black: '#000',
        green: {
          DEFAULT: '#4BB543', // Main green color
          light: '#6BC56E',
          dark: '#4BB543',
        },
        red: {
          DEFAULT: '#E3342F', // Main red color
          light: '#FF9494',
          dark: '#C02020',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        // Add other custom fonts here
      },
    },
  },
  plugins: [],
};
