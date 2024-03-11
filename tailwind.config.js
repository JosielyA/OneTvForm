/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        turquesa: "#02425B",
        celeste: "#62B9DE",
        grisOscuro: "#ABABAB",
        grisClaro: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
