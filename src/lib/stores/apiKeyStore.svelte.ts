// API key and base URL store using localStorage and Svelte 5 runes
import { browser } from '$app/environment';

const API_KEY_STORAGE_KEY = 'openai_api_key';
const BASE_URL_STORAGE_KEY = 'openai_base_url';

function getStoredApiKey(): string {
	if (!browser) return '';
	return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

function setStoredApiKey(key: string): void {
	if (!browser) return;
	if (key.trim()) {
		localStorage.setItem(API_KEY_STORAGE_KEY, key);
	} else {
		localStorage.removeItem(API_KEY_STORAGE_KEY);
	}
}

function getStoredBaseURL(): string {
	if (!browser) return 'https://api.openai.com/v1';
	return localStorage.getItem(BASE_URL_STORAGE_KEY) || 'https://api.openai.com/v1';
}

function setStoredBaseURL(url: string): void {
	if (!browser) return;
	if (url.trim()) {
		localStorage.setItem(BASE_URL_STORAGE_KEY, url);
	} else {
		localStorage.removeItem(BASE_URL_STORAGE_KEY);
	}
}

// Create reactive state for API key
export const apiKeyState = $state({ value: getStoredApiKey() });

export const apiKey = {
	get value() {
		return apiKeyState.value;
	},
	set value(key: string) {
		apiKeyState.value = key;
		setStoredApiKey(key);
	}
};

// Create reactive state for base URL
export const baseURLState = $state({ value: getStoredBaseURL() });

export const baseURL = {
	get value() {
		return baseURLState.value;
	},
	set value(url: string) {
		baseURLState.value = url;
		setStoredBaseURL(url);
	}
};
