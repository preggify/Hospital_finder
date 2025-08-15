/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1rem',
      },
      fontFamily: {
        'sans': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // New vibrant color palette inspired by preggify.com
        'primary': '#FF6B8B', // Vibrant pink/coral
        'secondary': '#5271FF', // Bright blue
        'accent-1': '#FFD166', // Warm yellow
        'accent-2': '#06D6A0', // Bright teal
        'accent-3': '#9D4EDD', // Purple
        'brand-blue': '#5271FF', // Updated brand blue
        'blue-600': '#3D5DF5', // Darker brand blue
        'blue-700': '#2246E6', // Even darker brand blue
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
      }
    },
  },
  plugins: [],
}
