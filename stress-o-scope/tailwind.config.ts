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
        'deep-space': {
          50: '#f0f0ff', 100: '#e6e6ff', 200: '#d1d1ff', 300: '#b3b3ff', 
          400: '#8080ff', 500: '#4d4dff', 600: '#3333ff', 700: '#1a1aff', 
          800: '#0d0d99', 900: '#0a0a66', 950: '#050533',
        },
        'nebula-purple': {
          50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 
          400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed', 
          800: '#6b21a8', 900: '#581c87', 950: '#3b0764',
        },
        'star-gold': {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 
          800: '#92400e', 900: '#78350f', 950: '#451a03',
        },
        'cosmic-blue': {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 
          800: '#1e40af', 900: '#1e3a8a', 950: '#172
