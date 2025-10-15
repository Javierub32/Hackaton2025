/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				"primary": "#3B82F6",
				"background-light": "#F8F9FA",
				"background-dark": "#101f22",
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