/* Config file for Tailwind (styles).
 * Uses:
 *  - Here you can set up custom classes for colors, margin, padding etc...
 *
 * More info: https://v2.tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
    darkMode: 'class',
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                defaultbackground: 'rgb(220, 220, 220)',
                defaultdarkbackground: '#1a202c',
            },
            padding: {
                default: '10',
            },
            margin: {
                default: '10',
            },
        },
    },
    plugins: [],
};
