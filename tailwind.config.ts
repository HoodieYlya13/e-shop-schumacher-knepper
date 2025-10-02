/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        xs: "24rem",
        md: "54rem",
      },
      containers: {
        "5xs": "12rem",
        "4xs": "14rem",
      },
      colors: {
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
        'accent': 'var(--accent-color)',
        'accent-dark': 'var(--accent-dark-color)',
        'dark': 'var(--dark-color)',
        'light': 'var(--light-color)',
        'valid': 'var(--valid-color)',
        'invalid': 'var(--invalid-color)',
        'ultra-dark': 'var(--ultra-dark-color)',
        'ultra-light': 'var(--ultra-light-color)',
      },
      animation: {
        "star-movement-bottom":
          "star-movement-bottom linear infinite alternate",
        "star-movement-top": "star-movement-top linear infinite alternate",
      },
      keyframes: {
        "star-movement-bottom": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(-100%, 0%)", opacity: "0" },
        },
        "star-movement-top": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(100%, 0%)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};