/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        juga: {
          blue: {
            5: '#F0F7FF',
            10: '#ECF4FF',
            20: '#DDEBFF',
            30: '#A3CAFF',
            35: '#7DB3FF',
            40: '#4992FF',
            50: '#2175F3',
            60: '#005BE4',
          },
          red: {
            20: '#FFECF1',
            60: '#FF3700',
          },
          grayscale: {
            50: '#F5F7F9',
            100: '#D2DAE0',
            200: '#879298',
            300: '#6E8091',
            400: '#5F6E76',
            500: '#4B5966',
            black: '#14212B',
          },
        },
      },
    },
  },
  plugins: [],
};
