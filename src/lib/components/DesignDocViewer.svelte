<script lang="ts">
	import { onMount } from 'svelte';
	import type { CuratedSite } from '$lib/data/curated-sites';
	import Button from './Button.svelte';
	import Card from './Card.svelte';

	interface Props {
		site: CuratedSite | null;
		onClose: () => void;
	}

	let { site, onClose }: Props = $props();

	let markdownContent = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Fetch markdown content when site changes
	$effect(() => {
		if (site) {
			loadMarkdown();
		}
	});

	async function loadMarkdown() {
		if (!site) return;

		loading = true;
		error = null;

		try {
			const response = await fetch(`/prompts/${site.promptFile}`);
			if (!response.ok) throw new Error('Failed to load documentation');
			markdownContent = await response.text();
		} catch (err: any) {
			error = err.message || 'Failed to load documentation';
			markdownContent = '';
		} finally {
			loading = false;
		}
	}

	async function copyToClipboard() {
		if (!markdownContent) return;
		try {
			await navigator.clipboard.writeText(markdownContent);
			// Could add a toast notification here
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function downloadMarkdown() {
		if (!markdownContent || !site) return;

		const blob = new Blob([markdownContent], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${site.id}-design-system.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Simple markdown to HTML converter (basic)
	function renderMarkdown(md: string): string {
		if (!md) return '';

		return md
			// Headers
			.replace(/^### (.*$)/gim, '<h3>$1</h3>')
			.replace(/^## (.*$)/gim, '<h2>$1</h2>')
			.replace(/^# (.*$)/gim, '<h1>$1</h1>')
			// Bold
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			// Lists
			.replace(/^\- (.*$)/gim, '<li>$1</li>')
			// Paragraphs
			.replace(/\n\n/g, '</p><p>')
			// Wrap in paragraph
			.replace(/^(.+)$/gim, '<p>$1</p>')
			// Clean up lists
			.replace(/<\/p>\s*<li>/g, '<ul><li>')
			.replace(/<\/li>\s*<p>/g, '</li></ul>');
	}
</script>

{#if site}
	<div class="modal-overlay" onclick={onClose}>
		<div class="modal-container" onclick={(e) => e.stopPropagation()}>
			<Card class="doc-viewer">
				<div class="doc-header">
					<div class="header-content">
						<div class="site-category">{site.category}</div>
						<h2 class="doc-title">{site.title}</h2>
						<a href={site.url} target="_blank" rel="noopener noreferrer" class="site-url">
							{site.url}
							<svg class="external-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
						</a>
					</div>
					<button class="close-button" onclick={onClose} aria-label="Close">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
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

				<div class="doc-content">
					{#if loading}
						<div class="loading-state">
							<div class="loading-spinner"></div>
							<p>Loading documentation...</p>
						</div>
					{:else if error}
						<div class="error-state">
							<p>Error: {error}</p>
						</div>
					{:else}
						<div class="markdown-content">
							{@html renderMarkdown(markdownContent)}
						</div>
					{/if}
				</div>
			</Card>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-4);
		z-index: 1000;
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		width: 100%;
		max-width: 56rem;
		max-height: 90vh;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.doc-viewer {
		display: flex;
		flex-direction: column;
		max-height: 90vh;
	}

	.doc-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--spacing-4);
		padding-bottom: var(--spacing-4);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.header-content {
		flex: 1;
	}

	.site-category {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-accent-primary);
		margin-bottom: var(--spacing-2);
	}

	.doc-title {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}

	.site-url {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-1);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing-standard);
	}

	.site-url:hover {
		color: var(--color-accent-primary);
	}

	.external-icon {
		width: 1rem;
		height: 1rem;
	}

	.close-button {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		border-radius: var(--radius-md);
		transition: all var(--duration-fast) var(--easing-standard);
	}

	.close-button:hover {
		background: var(--color-bg-secondary);
		color: var(--color-text-primary);
	}

	.close-button svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.doc-actions {
		display: flex;
		gap: var(--spacing-3);
		margin-bottom: var(--spacing-6);
	}

	.button-icon {
		width: 1rem;
		height: 1rem;
	}

	.doc-content {
		flex: 1;
		overflow-y: auto;
		min-height: 20rem;
	}

	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 20rem;
		gap: var(--spacing-4);
		color: var(--color-text-secondary);
	}

	.loading-spinner {
		width: 2.5rem;
		height: 2.5rem;
		border: 3px solid var(--color-border-subtle);
		border-top-color: var(--color-accent-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.markdown-content {
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-primary);
	}

	.markdown-content :global(h1) {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		margin: var(--spacing-8) 0 var(--spacing-4) 0;
		color: var(--color-text-primary);
	}

	.markdown-content :global(h1:first-child) {
		margin-top: 0;
	}

	.markdown-content :global(h2) {
		font-size: var(--font-size-xl);
		font-weight: 600;
		margin: var(--spacing-6) 0 var(--spacing-3) 0;
		color: var(--color-text-primary);
	}

	.markdown-content :global(h3) {
		font-size: var(--font-size-lg);
		font-weight: 600;
		margin: var(--spacing-4) 0 var(--spacing-2) 0;
		color: var(--color-text-primary);
	}

	.markdown-content :global(p) {
		margin: var(--spacing-3) 0;
		color: var(--color-text-secondary);
	}

	.markdown-content :global(ul) {
		margin: var(--spacing-3) 0;
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

	@media (max-width: 768px) {
		.modal-container {
			max-height: 95vh;
		}

		.doc-viewer {
			max-height: 95vh;
		}

		.doc-header {
			flex-direction: column;
			gap: var(--spacing-4);
		}

		.close-button {
			align-self: flex-end;
		}
	}
</style>
