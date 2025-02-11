/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            code: {
              color: 'inherit',
              backgroundColor: 'transparent',
              padding: '0',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          }
        }
      },
      colors: {
        // Light mode colors
        'light-bg': '#FFFFFF',
        'light-sidebar': '#F3F4F6',
        'light-accent': '#E5E7EB',
        'light-text': '#111827',
        'light-border': '#D1D5DB',

        // Dark mode colors (keeping existing dark theme)
        'dark-bg': '#111827',
        'dark-sidebar': '#1F2937',
        'dark-accent': '#374151',
        'dark-text': '#F9FAFB',
        'dark-border': '#374151',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}