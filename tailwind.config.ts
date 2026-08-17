import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4C085D',
        accent: '#F4B400',
        background: '#1A0A2E',
        card: '#2D1B4E',
      },
    },
  },
  plugins: [],
};
export default config;
