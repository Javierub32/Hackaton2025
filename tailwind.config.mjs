/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				"primary": "#3B82F6",
				"background-light": "#FFFFFF",
				"background-dark": "#0F172A",
			},
			fontFamily: {
				"display": ["Inter", "sans-serif"]
			},
		},
	},
	plugins: [
		forms,
	],
}