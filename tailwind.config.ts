import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fef9ec',
          100: '#fdf0c8',
          200: '#fbe08c',
          300: '#f8c94a',
          400: '#f6b421',
          500: '#ef9610',
          600: '#d3720b',
          700: '#b0530d',
          800: '#8f4111',
          900: '#763612',
          950: '#441b05',
        },
        earth: {
          50:  '#f8f5f0',
          100: '#ede5d8',
          200: '#d9c9b0',
          300: '#c1a582',
          400: '#aa845a',
          500: '#986c44',
          600: '#85573a',
          700: '#6d4432',
          800: '#5a3830',
          900: '#4c302c',
          950: '#2a1816',
        },
        sage: {
          50:  '#f2f7f3',
          100: '#e1ede4',
          200: '#c4dbca',
          300: '#9bc2a6',
          400: '#6ea37e',
          500: '#4c8761',
          600: '#396b4d',
          700: '#2f563e',
          800: '#284534',
          900: '#22392b',
          950: '#101f17',
        }
      }
    },
  },
  plugins: [],
}
export default config
