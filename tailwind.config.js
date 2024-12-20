/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        primary2: "#010718",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        Centra1: ["Centra1", "sans-serif"],
        Centra2: ["Centra2", "sans-serif"],
        Centra3: ["Centra3", "sans-serif"],
      },
      animation: {
        pulseBorder: "pulse-border .8s infinite",
      },
      keyframes: {
        "pulse-border": {
          "0%": { boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.5)" },
          "70%": { boxShadow: "0 0 0 10px rgba(255, 255, 255, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)" },
        },
      }
    },
    screens: {
      xxs: "290px",
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
}

