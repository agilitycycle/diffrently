const { createThemes } = require('tw-colors');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [
    require('tailwind-hamburgers'),
    createThemes(
      ({ light, dark }) => ({
         light: light({
            primary: {
               DEFAULT: '#fbfbfc'
            },
            secondary: {
              DEFAULT: '#000423'
            },
            'page/section': '#fbfbfc'
         }),
         dark: dark({
            primary: {
               DEFAULT: '#000423'
            },
            secondary: {
              DEFAULT: '#ffffff'
            },
            'page/section': '#000423'
         }),
      }),
      {
        produceThemeVariant: (themeName) => `theme-${themeName}`,
      },
    )
  ],
}