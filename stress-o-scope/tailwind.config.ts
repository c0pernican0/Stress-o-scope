import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern cosmic palette
        'deep-space': {
          50: '#f0f0ff',
          100: '#e6e6ff',
          200: '#d1d1ff',
          300: '#b3b3ff',
          400: '#8080ff',
          500: '#4d4dff',
          600: '#3333ff',
          700: '#1a1aff',
          800: '#0d0d99',
          900: '#0a0a66',
          950: '#050533',
        },
        'nebula-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        'star-gold': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        'cosmic-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Modern additions
        'aurora-pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        'void-black': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cosmic-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "aurora-gradient": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
        "space-gradient": "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 69, 19, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 69, 19, 0.8), 0 0 30px rgba(139, 69, 19, 0.6)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cosmic': '0 0 30px rgba(139, 69, 19, 0.3), 0 0 60px rgba(139, 69, 19, 0.1)',
        'nebula': '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)',
        'aurora': '0 0 30px rgba(236, 72, 153, 0.4), 0 0 60px rgba(236, 72, 153, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
