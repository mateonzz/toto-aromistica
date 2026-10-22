/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.html',
        './src/**/*.js',
        './scripts/templates/**/*.html'
    ],
    theme: {
        extend: {
            colors: {
                carmel: {
                    50: '#fdfbf7',
                    100: '#f7f2ea',
                    200: '#ede2d3',
                    300: '#e2ccb3',
                    600: '#8c6d53',
                    700: '#6e533d',
                    800: '#523e2d',
                    900: '#38291e'
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
            }
        }
    },
    plugins: []
};
