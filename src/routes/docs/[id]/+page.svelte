<script lang="ts">
	import { marked } from 'marked';
	import Button from '$lib/components/Button.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function renderMarkdown(md: string): string {
		if (!md) return '';
		return marked(md) as string;
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(data.markdown);
			// Could add toast notification
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function downloadMarkdown() {
		const blob = new Blob([data.markdown], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${data.site.id}-design-system.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>{data.site.title} - Design Documentation</title>
	<meta name="description" content={data.site.description} />
</svelte:head>

<div class="doc-page">
	<div class="doc-container">
		<!-- Header -->
		<header class="doc-header">
			<a href="/" class="back-link">
				<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Gallery
			</a>

			<div class="header-content">
				<div class="site-category">{data.site.category}</div>
				<h1 class="doc-title">{data.site.title}</h1>
				<a href={data.site.url} target="_blank" rel="noopener noreferrer" class="site-url">
					{data.site.url}
					<svg class="external-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</a>
				<p class="site-description">{data.site.description}</p>
			</div>

			<div class="doc-actions">
				<Button variant="outline" size="sm" onclick={copyToClipboard}>
					<svg class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					Copy
				</Button>
				<Button variant="outline" size="sm" onclick={downloadMarkdown}>
					<svg class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
					Download
				</Button>
			</div>
		</header>

		<!-- Content -->
		<article class="doc-content markdown-content">
			{@html renderMarkdown(data.markdown)}
		</article>
	</div>
</div>

<style>
	.doc-page {
		min-height: 100vh;
		background: var(--color-bg-primary);
	}

	.doc-container {
		max-width: 48rem;
		margin: 0 auto;
		padding: var(--spacing-8) var(--spacing-6);
	}

	.doc-header {
		margin-bottom: var(--spacing-12);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--font-size-sm);
		font-weight: 500;
		margin-bottom: var(--spacing-6);
		transition: color var(--duration-fast) var(--easing-standard);
	}

	.back-link:hover {
		color: var(--color-accent-primary);
	}

	.back-link svg {
		width: 1rem;
		height: 1rem;
	}

	.header-content {
		margin-bottom: var(--spacing-6);
	}

	.site-category {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-accent-primary);
		margin-bottom: var(--spacing-3);
	}

	.doc-title {
		font-size: var(--font-size-3xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-3);
		line-height: 1.2;
	}

	.site-url {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing-standard);
		margin-bottom: var(--spacing-3);
	}

	.site-url:hover {
		color: var(--color-accent-primary);
	}

	.external-icon {
		width: 1rem;
		height: 1rem;
	}

	.site-description {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.doc-actions {
		display: flex;
		gap: var(--spacing-3);
	}

	.button-icon {
		width: 1rem;
		height: 1rem;
	}

	.doc-content {
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-primary);
	}

	/* Markdown Styling */
	.markdown-content :global(h1) {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		margin: var(--spacing-10) 0 var(--spacing-4) 0;
		color: var(--color-text-primary);
	}

	.markdown-content :global(h1:first-child) {
		margin-top: 0;
	}

	.markdown-content :global(h2) {
		font-size: var(--font-size-xl);
		font-weight: 600;
		margin: var(--spacing-8) 0 var(--spacing-3) 0;
		color: var(--color-text-primary);
	}

	.markdown-content :global(h3) {
		font-size: var(--font-size-lg);
		font-weight: 600;
		margin: var(--spacing-6) 0 var(--spacing-2) 0;
		color: var(--color-text-primary);
	}

	.markdown-content :global(p) {
		margin: var(--spacing-4) 0;
		color: var(--color-text-secondary);
	}

	.markdown-content :global(ul) {
		margin: var(--spacing-4) 0;
		padding-left: var(--spacing-6);
	}

	.markdown-content :global(li) {
		margin: var(--spacing-2) 0;
		color: var(--color-text-secondary);
	}

	.markdown-content :global(strong) {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.markdown-content :global(code) {
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
		background: var(--color-bg-secondary);
		padding: 0.2em 0.4em;
		border-radius: var(--radius-sm);
		color: var(--color-accent-primary);
	}

	.markdown-content :global(a) {
		color: var(--color-accent-primary);
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing-standard);
	}

	.markdown-content :global(a:hover) {
		text-decoration: underline;
	}

	.markdown-content :global(hr) {
		border: none;
		border-top: 1px solid var(--color-border-subtle);
		margin: var(--spacing-8) 0;
	}

	@media (max-width: 768px) {
		.doc-container {
			padding: var(--spacing-6) var(--spacing-4);
		}

		.doc-title {
			font-size: var(--font-size-2xl);
		}

		.doc-actions {
			flex-direction: column;
		}
	}
</style>
