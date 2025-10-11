<script lang="ts">
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Card from './Card.svelte';

	let {
		url = $bindable(''),
		apiKey = $bindable(''),
		baseURL = $bindable('https://api.openai.com/v1'),
		model = $bindable('gpt-4o-mini'),
		loading = false,
		onSubmit,
		class: className = ''
	}: {
		url?: string;
		apiKey?: string;
		baseURL?: string;
		model?: string;
		loading?: boolean;
		onSubmit?: (data: { url: string; apiKey: string; baseURL: string; model: string }) => void;
		class?: string;
	} = $props();

	let formErrors: Record<string, string> = $state({});

	function handleUrlBlur() {
		const trimmedUrl = url.trim();
		if (trimmedUrl && !/^https?:\/\//i.test(trimmedUrl)) {
			url = `https://${trimmedUrl}`;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formErrors = {};

		const trimmedUrl = url.trim();
		const trimmedApiKey = apiKey.trim();
		const trimmedBaseURL = baseURL.trim();
		const trimmedModel = model.trim();

		// Validation
		if (!trimmedUrl) {
			formErrors.url = 'Please enter a URL';
			return;
		}

		if (!trimmedApiKey) {
			formErrors.apiKey = 'Please enter your OpenAI API key';
			return;
		}

		if (!trimmedBaseURL) {
			formErrors.baseURL = 'Please enter a base URL';
			return;
		}

		if (!trimmedModel) {
			formErrors.model = 'Please enter a model name';
			return;
		}

		// Clean URL
		const cleanUrl = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;

		// Validate URL
		try {
			new URL(cleanUrl);
		} catch {
			formErrors.url = 'Please enter a valid URL';
			return;
		}

		// Validate base URL
		try {
			new URL(trimmedBaseURL);
		} catch {
			formErrors.baseURL = 'Please enter a valid base URL';
			return;
		}

		onSubmit?.({ url: cleanUrl, apiKey: trimmedApiKey, baseURL: trimmedBaseURL, model: trimmedModel });
	}

	const urlIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
	</svg>`;

	const keyIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
	</svg>`;

</script>

<Card class="form-card {className}">
	<div class="form-header">
		<h2 class="form-title">Analyze a Website</h2>
		<p class="form-description">
			Enter a website URL and your OpenAI API key to generate a design analysis.
		</p>
	</div>

	<form onsubmit={handleSubmit} class="form-content">
		<div class="url-inputs">
			<div class="input-section">
				<h3 class="input-section-title">Website URL</h3>
				{#if formErrors.url}
					<p class="section-error">{formErrors.url}</p>
				{/if}
			</div>

			<Input
				type="url"
				bind:value={url}
				placeholder="example.com"
				icon={urlIcon}
				required
				error={formErrors.url || ''}
				class="url-input"
				onblur={handleUrlBlur}
			/>

			<div class="input-section">
				<h3 class="input-section-title">OpenAI API Key</h3>
				{#if formErrors.apiKey}
					<p class="section-error">{formErrors.apiKey}</p>
				{/if}
				<p class="input-hint">Your API key is stored locally and never sent to our servers.</p>
			</div>

			<Input
				type="password"
				bind:value={apiKey}
				placeholder="sk-..."
				icon={keyIcon}
				required
				error={formErrors.apiKey || ''}
				class="url-input"
			/>

			<div class="input-section">
				<h3 class="input-section-title">OpenAI Base URL</h3>
				{#if formErrors.baseURL}
					<p class="section-error">{formErrors.baseURL}</p>
				{/if}
				<p class="input-hint">Default is https://api.openai.com/v1. Change for custom endpoints.</p>
			</div>

			<Input
				type="url"
				bind:value={baseURL}
				placeholder="https://api.openai.com/v1"
				icon={urlIcon}
				required
				error={formErrors.baseURL || ''}
				class="url-input"
			/>

			<div class="input-section">
				<h3 class="input-section-title">OpenAI Model</h3>
				{#if formErrors.model}
					<p class="section-error">{formErrors.model}</p>
				{/if}
				<p class="input-hint">Model to use for analysis (e.g., gpt-4o-mini, gpt-4o)</p>
			</div>

			<Input
				type="text"
				bind:value={model}
				placeholder="gpt-4o-mini"
				icon={keyIcon}
				required
				error={formErrors.model || ''}
				class="url-input"
			/>
		</div>


		<div class="form-actions">
			<Button type="submit" variant="primary" size="lg" {loading} fullWidth class="submit-button">
				{#if loading}
					Analyzing Website...
				{:else}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					Generate Analysis
				{/if}
			</Button>
		</div>
	</form>
</Card>

<style>
	.form-card {
		max-width: 42rem;
		margin: 0 auto;
		margin-bottom: var(--spacing-12);
	}

	.form-header {
		margin-bottom: var(--spacing-8);
		text-align: center;
	}

	.form-title {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-3);
	}

	.form-description {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-6);
	}

	.url-inputs {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.input-section {
		margin-bottom: var(--spacing-2);
	}

	.input-section-title {
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}

	.input-hint {
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
		margin: var(--spacing-1) 0 0 0;
	}

	.section-error {
		font-size: var(--font-size-sm);
		color: var(--color-danger);
		margin: 0;
	}

	.form-actions {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
		padding-top: var(--spacing-4);
	}

	@media (min-width: 640px) {
		.form-actions {
			flex-direction: row;
			align-items: center;
		}

		.submit-button {
			flex: 1;
		}
	}
</style>
