export interface CuratedSite {
	id: string;
	title: string;
	url: string;
	description: string;
	category: string;
	promptFile: string;
	previewImage?: string; // Optional: path to preview image, falls back to placeholder
}

export const curatedSites: CuratedSite[] = [
	{
		id: 'chroma',
		title: 'Chroma',
		url: 'https://www.trychroma.com/',
		description: 'AI-native database with modern, developer-focused design',
		category: 'Developer Tools',
		promptFile: 'chroma.md',
		previewImage: '/images/previews/chroma.png'
	},
	{
		id: 'linear',
		title: 'Linear',
		url: 'https://linear.app/',
		description: 'Streamlined issue tracking with elegant, minimal design',
		category: 'SaaS Products',
		promptFile: 'linear.md',
		previewImage: '/images/previews/linear.png'
	},
	{
		id: 'notion',
		title: 'Notion',
		url: 'https://www.notion.so/',
		description: 'Collaborative workspace with warm, approachable design',
		category: 'SaaS Products',
		promptFile: 'notion.md',
		previewImage: '/images/previews/notion.png'
	}
];

export const categories = [...new Set(curatedSites.map(site => site.category))];
