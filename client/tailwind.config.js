/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0847A8',     // Bitbucket deep navy blue
          default: '#0166FF',  // Bitbucket brand blue
          light: '#4C9AFF',    // Lighter blue
          mild: '#B3D4FF',     // Pale blue for soft backgrounds
        },
        text: {
          dark: '#0847A8',
          light: '#DFECFF',    // Bright but readable text over darks
        },
        accent: '#4C9AFF',       // Can be reused as accent
        warning: {
          light: '#fff3cd',
          dark: '#e0a800',
        },
        success: {
          light: '#c8e6c9',
          dark: '#388e3c',
        },
        error: {
          light: '#ffcdd2',
          dark: '#d32f2f',
        },
      },
    },
  },
  plugins: [],
});
