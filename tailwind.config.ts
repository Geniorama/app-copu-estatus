import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        'cp-primary': '#1DF180',
        'cp-dark': '#212121',
        'cp-light': '#FFFFFF',
        'cp-primary-hover': '#39C462',
      },
      fontFamily: {
        sans: ['Buenos Aires', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
