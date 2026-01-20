/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#678e7c",
                "background-light": "#fbfaf9",
                "background-dark": "#2f2d2f",
                "surface-light": "#ffffff",
                "surface-dark": "#3e3c3e",
            },
            fontFamily: {
                "display": ["Noto Serif", "serif"],
                "body": ["Manrope", "sans-serif"]
            },
            animation: {
                'breathe': 'breathe 8s ease-in-out infinite',
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
                    '50%': { transform: 'scale(1.1)', opacity: '0.8' },
                }
            }
        },
    },
    plugins: [],
}
