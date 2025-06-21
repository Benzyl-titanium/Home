import type {
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Benzyl titanium's blog",
	subtitle: "苄钛博客",
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 0, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/image.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "bottom", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 3, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "/favicon/favicon.png", // Path of the favicon, relative to the /public directory
			// theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			// sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "友链",
			url: "/friends/",
		},
		{
			name: "GitHub repo",
			url: "https://github.com/Benzyl-titanium/fuwari", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/a.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Benzyl titanium",
	bio: "Tetrabenzyl titanium 四苄基钛 苄钛 死变态 mtf 无证不含🍥 Fuck Organic Chemistry 友姬花穴 喜欢研究药物化学,有机合成,精神药理学,网络药理学,计算机辅助药物设计",
	links: [
		{
			name: "Home",
			icon: "mdi:home",
			url: "https://biantai.pages.dev",
		},
		{
			name: "X", // Visit https://icones.js.org/ for icon codes
			icon: "fa6-brands:x-twitter", // You will need to install the corresponding icon set if it's not already included
			url: "https://x.com/Benzyl_titanium", // `pnpm add @iconify-json/<icon-set-name>`
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Benzyl-titanium",
		},
		{
			name: "Telegram",
			icon: "fa6-brands:telegram",
			url: "https://t.me/Benzyl_titanium",
		},
		{
			name: "Email",
			icon: "mdi:email-outline",
			url: "mailto:Benzyl-titanium@proton.me",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
