/** @type {import('tailwindcss').Config} */

// Colours are CSS variables (see src/index.css) so the two themes —
// "paper" (light, from the orange avatar) and "cyanotype" (dark, from the
// blueprint avatar) — swap by toggling the `dark` class on <html>.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: v('paper'),
        surface: v('surface'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        sun: v('sun'),
        'sun-ink': v('sun-ink'),
        lead: v('lead'),
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        page: '72rem',
      },
    },
  },
  plugins: [],
};
