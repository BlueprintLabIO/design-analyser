<script lang="ts">
	import type { CuratedSite } from '$lib/data/curated-sites';

	interface Props {
		sites: CuratedSite[];
	}

	let { sites }: Props = $props();

	// Generate gradient colors based on site ID for visual variety
	function getGradientForSite(siteId: string): string {
		const gradients: Record<string, string> = {
			chroma: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			linear: 'linear-gradient(135deg, #5e6ad2 0%, #8b5cf6 100%)',
			vercel: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
			stripe: 'linear-gradient(135deg, #635bff 0%, #1a1f71 100%)',
			notion: 'linear-gradient(135deg, #ffedd5 0%, #fcd34d 100%)',
			tailwind: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
		};
		return gradients[siteId] || 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)';
	}
</script>

<div class="gallery-container">
	<h2 class="gallery-title">Curated Design Documentation</h2>
	<p class="gallery-description">
		Browse pre-analysed design systems from top websites
	</p>

	<div class="gallery-grid">
		{#each sites as site}
			<a href="/docs/{site.id}" class="site-card">
				<div class="site-preview" style="background: {getGradientForSite(site.id)}">
					{#if site.previewImage}
						<img
							src={site.previewImage}
							alt={`${site.title} preview`}
							class="preview-image"
						/>
					{:else}
						<div class="preview-placeholder">
							<div class="preview-text">{site.title}</div>
							<div class="preview-category">{site.category}</div>
						</div>
					{/if}
				</div>
				<div class="site-info">
					<div class="site-category">{site.category}</div>
					<h3 class="site-title">{site.title}</h3>
					<p class="site-description">{site.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.gallery-container {
		margin-bottom: var(--spacing-12);
	}

	.gallery-title {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		text-align: center;
		margin-bottom: var(--spacing-3);
	}

	.gallery-description {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		text-align: center;
		margin-bottom: var(--spacing-8);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--spacing-6);
	}

	.site-card {
		display: block;
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--color-bg-surface);
		transition: all var(--duration-normal) var(--easing-standard);
		cursor: pointer;
		text-align: left;
		width: 100%;
		padding: 0;
		text-decoration: none;
		color: inherit;
	}

	.site-card:hover {
		border-color: var(--color-accent-primary);
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
	}

	.site-preview {
		width: 100%;
		aspect-ratio: 16 / 10;
		position: relative;
		overflow: hidden;
	}

	.preview-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: var(--spacing-2);
		padding: var(--spacing-6);
	}

	.preview-text {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.preview-category {
		font-size: var(--font-size-sm);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.8);
	}

	.preview-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.site-info {
		padding: var(--spacing-4);
	}

	.site-category {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-accent-primary);
		margin-bottom: var(--spacing-2);
	}

	.site-title {
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}

	.site-description {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
