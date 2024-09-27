import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sf-pro": "var(--font-sf-pro)",
      },
      backgroundImage: {
        vignette:
          "radial-gradient(circle, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.5) 100%)",
      },
      gridTemplateRows: {
        "animate-height-open": "1fr",
        "animate-height-closed": "0fr",
      },
      keyframes: {
        slideDownFadeIn: {
          "0%": { transform: "scale(0.8) translateY(-130%)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        borderRadius: {
          "0%": { borderRadius: "50px" },
          "100%": { borderRadius: "0rem" },
        },
      },
      animation: {
        "slide-down-fade": "slideDownFadeIn 0.6s ease-out 0s forwards",
        "fade-in": "fadeIn 0.6s ease-out 0s forwards",
        "border-radius": "borderRadius ease-out",
      },
    },
  },
  plugins: [
    require("daisyui"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        },
      );
    }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-duration": (value) => {
            return {
              "animation-duration": value,
            };
          },
        },
        {
          values: theme("transitionDuration"),
        },
      );
    }),
  ],
  daisyui: {
    themes: [
      {
        lofi: {
          ...require("daisyui/src/theming/themes")["lofi"],
          "--animation-btn": "0.25s",
          "--btn-focus-scale": "0.95",
        },
      },
    ],
  },
};
export default config;
