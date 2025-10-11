<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import URLForm from '$lib/components/URLForm.svelte';
	import SiteGallery from '$lib/components/SiteGallery.svelte';
	import AnalysisResults from '$lib/components/AnalysisResults.svelte';
	import Alert from '$lib/components/Alert.svelte';

	import AnalysisService, { type SiteData } from '$lib/components/AnalysisService.svelte';

	import { analysisConfig } from '$lib/stores/analysisConfig.svelte';
	import { apiKey, baseURL } from '$lib/stores/apiKeyStore.svelte';
	import { curatedSites } from '$lib/data/curated-sites';
	import { onMount } from 'svelte';

	// State management
	let url = $state('');
	let userApiKey = $state(apiKey.value);
	let userBaseURL = $state(baseURL.value);
	let userModel = $state(analysisConfig.model);
	let generating = $state(false);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let summary = $state('');
	let showAnalysisForm = $state(false);

	// Analysis service instance
	let analysisService: AnalysisService;

	async function handleFormSubmit({
		url: formUrl,
		apiKey: formApiKey,
		baseURL: formBaseURL,
		model: formModel
	}: {
		url: string;
		apiKey: string;
		baseURL: string;
		model: string;
	}) {
		error = null;
		summary = '';
		generating = false;

		// Save settings to localStorage
		apiKey.value = formApiKey;
		userApiKey = formApiKey;
		baseURL.value = formBaseURL;
		userBaseURL = formBaseURL;
		userModel = formModel;

		// Update config with user's settings
		analysisConfig.apiKey = formApiKey;
		analysisConfig.baseURL = formBaseURL;
		analysisConfig.model = formModel;

		loading = true;

		try {
			// Fetch website data
			const response = await fetch('/extract', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ urls: [formUrl] })
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || 'Failed to extract website data');
			}

			const data = await response.json();
			const sites = data.sites as SiteData[];

			if (sites.length === 0) {
				throw new Error('No website data extracted');
			}

			// Use analysis service
			await analysisService.analyzeSites(sites);

			// Check if analysis succeeded (only if no error was already set)
			if (!summary.trim() && !error) {
				throw new Error('Failed to generate analysis. Please try again.');
			}
		} catch (err: any) {
			error = err?.message || 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}

	function handleAnalysisUpdate(index: number, content: string, isComplete: boolean, isStarting: boolean = false) {
		if (isStarting) {
			generating = true;
		} else if (!isComplete) {
			summary += content;
		} else {
			generating = false;
		}
	}

	function handleAnalysisError(errorMessage: string) {
		error = errorMessage;
		generating = false;
		loading = false;
	}

	function dismissError() {
		error = null;
	}

	onMount(() => {
		userApiKey = apiKey.value;
		userBaseURL = baseURL.value;
		userModel = analysisConfig.model;
	});
</script>

<div class="main-container">
	<!-- Hero Section -->
	<HeroSection
		title="Design <span class='text-[var(--color-accent-primary)]'></span> Gallery"
	/>

	<!-- Curated Sites Gallery -->
	<SiteGallery sites={curatedSites} />

	<!-- Analyze Your Own Site Section -->
	<div class="custom-analysis-section">
		<button
			class="toggle-analysis-button"
			onclick={() => (showAnalysisForm = !showAnalysisForm)}
		>
			<svg class="toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<span>Analyze Your Own Site</span>
			<svg
				class="chevron-icon"
				class:rotated={showAnalysisForm}
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if showAnalysisForm}
			<div class="analysis-form-container">
				<!-- URL Input Form -->
				<URLForm
					bind:url
					bind:apiKey={userApiKey}
					bind:baseURL={userBaseURL}
					bind:model={userModel}
					{loading}
					onSubmit={handleFormSubmit}
				/>

				<!-- Error Display -->
				{#if error}
					<Alert
						variant="danger"
						title="Analysis Error"
						dismissible
						onDismiss={dismissError}
						class="error-alert"
					>
						{error}
					</Alert>
				{/if}

				<!-- Analysis Results -->
				{#if summary}
					<AnalysisResults summaries={[summary]} generating={[generating]} urls={[url]} />
				{/if}
			</div>
		{/if}
	</div>

	<!-- Analysis Service -->
	<AnalysisService
		bind:this={analysisService}
		config={analysisConfig}
		onAnalysisUpdate={handleAnalysisUpdate}
		onError={handleAnalysisError}
	/>
</div>

<style>
	.main-container {
		max-width: 68rem;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.main-container :global(.error-alert) {
		margin-bottom: var(--spacing-8);
		max-width: 42rem;
		margin-left: auto;
		margin-right: auto;
	}

	/* Ensure proper spacing between sections */
	.main-container > :global(* + *) {
		margin-top: var(--spacing-8);
	}

	.system-prompt-button-container {
		max-width: 42rem;
		margin: 0 auto;
		display: flex;
		justify-content: center;
	}

	.system-prompt-button {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-3) var(--spacing-4);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		background: var(--color-bg-surface);
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--duration-normal) var(--easing-standard);
	}

	.system-prompt-button:hover {
		background: var(--color-bg-secondary);
		color: var(--color-text-primary);
		border-color: var(--color-border-muted);
	}

	.button-icon {
		width: 1rem;
		height: 1rem;
		color: inherit;
	}

	.custom-analysis-section {
		margin-top: var(--spacing-12);
		max-width: 42rem;
		margin-left: auto;
		margin-right: auto;
	}

	.toggle-analysis-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-3);
		padding: var(--spacing-4) var(--spacing-6);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		background: var(--color-bg-surface);
		color: var(--color-text-primary);
		font-size: var(--font-size-base);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--duration-normal) var(--easing-standard);
	}

	.toggle-analysis-button:hover {
		background: var(--color-bg-secondary);
		border-color: var(--color-accent-primary);
	}

	.toggle-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.chevron-icon {
		width: 1.25rem;
		height: 1.25rem;
		transition: transform var(--duration-normal) var(--easing-standard);
	}

	.chevron-icon.rotated {
		transform: rotate(180deg);
	}

	.analysis-form-container {
		margin-top: var(--spacing-6);
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.main-container {
			padding: 0 var(--spacing-4);
		}

		.main-container > :global(* + *) {
			margin-top: var(--spacing-6);
		}

		.custom-analysis-section {
			margin-top: var(--spacing-8);
		}
	}
</style>
