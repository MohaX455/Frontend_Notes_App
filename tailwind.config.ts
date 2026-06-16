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
                primary: {
                    DEFAULT: "#1A1A2E",
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#4F46E5",
                    foreground: "#FFFFFF",
                },
                surface: {
                    DEFAULT: "#F8F8FC",
                    foreground: "#1A1A2E",
                },
                muted: {
                    DEFAULT: "#6B7280",
                    foreground: "#FFFFFF",
                },
            },
            fontFamily: {
                sans: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "'Segoe UI'",
                    "'Inter'",
                    "sans-serif",
                ],
                display: [
                    "'Sora'",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "sans-serif",
                ],
                mono: [
                    "'JetBrains Mono'",
                    "'Fira Code'",
                    "monospace",
                ],
            },
        },
    },
    plugins: [],
};

export default config;
