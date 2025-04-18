import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		"text-hologram",
		"text-component-accent-secondary",
		"text-component-accent-primary",
		"text-component-accent-red",
	],
	theme: {
		extend: {
			height: {
				20: "5rem",
			},
			fontFamily: {
				pretendard: ["var(--font-pretendard)"],
			},
			fontSize: {
				/* Header */
				h1: ["48px", { lineHeight: "130%", fontWeight: "600" }],
				h2: ["40px", { lineHeight: "130%", fontWeight: "600" }],
				h3: ["32px", { lineHeight: "130%", fontWeight: "600" }],

				/* Title */
				t1: ["28px", { lineHeight: "130%", fontWeight: "600" }],
				t2: ["24px", { lineHeight: "140%", fontWeight: "600" }],
				t3: ["20px", { lineHeight: "150%", fontWeight: "600" }],

				/* Subtitle */
				s1: ["18px", { lineHeight: "145%", fontWeight: "600" }],
				s2: ["16px", { lineHeight: "145%", fontWeight: "600" }],
				s3: ["14px", { lineHeight: "150%", fontWeight: "600" }],

				/* Body */
				b1: ["18px", { lineHeight: "145%", fontWeight: "400" }],
				b2: ["16px", { lineHeight: "145%", fontWeight: "400" }],
				b3: ["14px", { lineHeight: "145%", fontWeight: "400" }],
				b3Bold: ["14px", { lineHeight: "145%", fontWeight: "600" }],

				/* Caption */
				c1: ["13px", { lineHeight: "150%", fontWeight: "400" }],
				c2: ["12px", { lineHeight: "150%", fontWeight: "500" }],
				c3: ["11px", { lineHeight: "150%", fontWeight: "500" }],

				/* Label */
				l1: ["18px", { lineHeight: "auto", fontWeight: "600" }],
				l2: ["16px", { lineHeight: "auto", fontWeight: "600" }],
				l3: ["16px", { lineHeight: "auto", fontWeight: "400" }],
				l4: ["14px", { lineHeight: "auto", fontWeight: "600" }],
				l5: ["14px", { lineHeight: "auto", fontWeight: "400" }],
				l6: ["13px", { lineHeight: "auto", fontWeight: "600" }],
			},
			colors: {
				gray: {
					normal: "#D7E1EF",
					alternative: "#7E8999",
					neutral: "#A7B4C7",
					inverse: "#0F1114",
					strong: "#E6EDF8",
					disabled: "#5D6470",
					0: "#FFFFFF",
					50: "#E6EDF8",
					100: "#D7E1EF",
					200: "#A7B4C7",
					300: "#7E8999",
					400: "#5D6470",
					500: "#3D424B",
					600: "#2A2F38",
					700: "#1F2127",
					800: "#17191F",
					900: "#0F1114",
					1000: "#121212",
				},

				icon: {
					red: "#E9838F",
					accent: "#6B6BE1",
					inverse: "#0F1114",
					primary: "#D7E1EF",
					secondary: "#A7B4C7",
					tertiary: "#7E8999",
				},

				main: {
					50: "#DFDFFA",
					75: "#C2C2F3",
					100: "#A9A9EE",
					200: "#8484E6",
					300: "#6B6BE1",
					400: "#4B4B9E",
					500: "#414189",
				},

				component: {
					accent: {
						primary: "#6B6BE1",
						red: "#E9838F",
						secondary: "#DFDFFA",
					},
					gray: {
						inverse: "#FFFFFF",
						primary: "#17191F",
						secondary: "#1F2127",
						tertiary: "#2A2F38",
					},
				},

				background: {
					primary: "#0F1114",
					purple: "rgba(65, 65, 137, 0.4)",
					skyblue: "#D7E1EF",
				},

				elevated: {
					color: "#6B6BE133",
					primary: "#121212E6",
					secondary: "#12121299",
					tertiary: "#1212124D",
				},

				line: {
					accent: "#6B6BE1",
					error: "#E9838F",
					inverse: "#FFFFFF",
					primary: "#1F2127",
					secondary: "#3D424B",
					tertiary: "#5D6470",
				},

				text: {
					/* Accent */
					primary: "#8484E6",
					red: "#E9838F",
					secondary: "#C2C2F3",

					/* Gray */
					alternative: "#7E8999",
					disabled: "#5D6470",
					inverse: "#0F1114",
					neutral: "#A7B4C7",
					normal: "#D7E1EF",
					strong: "#E6EDF8",
				},

				kakaoBg: "#FEE500",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			backgroundImage: {
				hologram:
					"conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #BBBBF1 50.06deg, #B8E2FB 85.94deg, #F2EFE8 134.97deg, #CCE4FF 172.05deg, #BBBBF1 224.67deg, #C7EDEB 259.36deg, #E7F5EB 298.82deg, #F2F0E7 328.72deg)",
				blur: "conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #C1A4E8 50.05925238132477deg, #B8E2FB 85.93856155872345deg, #F2EFE8 134.97360706329346deg, #CCE4FF 172.04889178276062deg, #BDAFE3 224.6718692779541deg, #C7EDEB 259.35521364212036deg, #E7F5EB 298.8224387168884deg, #F2F0E7 328.72185945510864deg))",
			},
			animation: {
				toast: "toast 2.5s ease-in-out forwards",
				"slide-left-out": "0.4s ease-in forwards slide-left-out",
				"slide-left-in": "0.4s ease-out slide-left-in",
				"slide-right-out": "0.4s ease-in forwards slide-right-out",
				"slide-right-in": "0.4s ease-out slide-right-in",
			},
			keyframes: {
				toast: {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"20%": { transform: "translateY(0)", opacity: "1" },
					"80%": { transform: "translateY(0)", opacity: "1" },
					"100%": { transform: "translateY(100%)", opacity: "0" },
				},
				"slide-left-out": {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(-100%)" },
				},
				"slide-left-in": {
					from: { transform: "translateX(100%)" },
					to: { transform: "translateX(0)" },
				},
				"slide-right-out": {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(100%)" },
				},
				"slide-right-in": {
					from: { transform: "translateX(-100%)" },
					to: { transform: "translateX(0)" },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
