import { error } from '@sveltejs/kit';
import { curatedSites } from '$lib/data/curated-sites';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const site = curatedSites.find((s) => s.id === params.id);

	if (!site) {
		throw error(404, 'Design documentation not found');
	}

	// Fetch the markdown content
	try {
		const response = await fetch(`/prompts/${site.promptFile}`);
		if (!response.ok) {
			throw new Error('Failed to load documentation');
		}
		const markdown = await response.text();

		return {
			site,
			markdown
		};
	} catch (err) {
		throw error(500, 'Failed to load design documentation');
	}
};
