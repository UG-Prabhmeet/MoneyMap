/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["var(--font-poppins)", "sans-serif"], // Use variable for Poppins font
                playfair: ["var(--font-playfair)", "serif"], // Use variable for Playfair Display font
            },
        },
    },
    plugins: [],
};
