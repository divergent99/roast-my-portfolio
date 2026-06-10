/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-500', 'bg-blue-600', 'bg-orange-500',
    'text-black', 'text-white',
    'border-green-500', 'border-blue-600', 'border-orange-500',
    'bg-green-900', 'bg-[#1e2a3a]', 'bg-zinc-800',
    'text-green-300', 'text-slate-200', 'text-zinc-100',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}