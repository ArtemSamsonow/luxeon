const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            xxs: "360px",
            xs: "390px",
            sm: "540px",
            ssm: "600px",
            md: "768px",
            lg: "1024px",
            xl: "1366px",
            "2xl": "1440px",
            "3xl": "1920px",
        },
        extend: {
            fontSize: {
                "5xl": ["60px", { lineHeight: "60px" }],
                "4xl": ["40px", { lineHeight: "44px" }],
                "3xl": ["32px", { lineHeight: "34px" }],
                "2xl": ["24px", { lineHeight: "26px" }],
                xl: ["20px", { lineHeight: "28px" }],
                lg: ["18px", { lineHeight: "28px" }],
                md: ["16px", { lineHeight: "24px" }],
                sm: ["14px", { lineHeight: "20px" }],
                xs: ["12px", { lineHeight: "16px" }],
            },
            fontFamily: {
                text: ["Inter", "sans-serif"],
            },
            boxShadow: {
                custom: "0px 0px 41px 6px rgba(0, 0, 0, 0.2)",
            },
            backgroundImage: {
                "gradient-blue": "linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%)",
                "slider-image-1": "url('/images/imageSlider1.jpg')",
                "slider-image-2": "url('/images/imageSlider2.jpg')",
                "slider-image-3": "url('/images/imageSlider3.jpg')",
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};
