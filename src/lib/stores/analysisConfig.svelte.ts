import type { AnalysisConfig } from '$lib/components/AnalysisService.svelte';

export const defaultConfig = {
   systemPrompt: 'You extract brand-safe, accessible, implementation-focused design briefs.',
   analysisPrompt: `You are a senior product designer and front-end lead. Analyze the single public reference below and produce an actionable, brand-agnostic design system brief that a human or AI can use`,
   model: 'gpt-4o-mini',
   apiKey: '',
   baseURL: 'https://api.openai.com/v1'
}

// Global analysis configuration store using Svelte 5 runes
export const analysisConfig = $state<AnalysisConfig>(defaultConfig);

// Show config modal state
export const showConfigState = $state({ value: false });
export const showConfig = {
	get value() { return showConfigState.value; },
	set value(v: boolean) { showConfigState.value = v; }
};