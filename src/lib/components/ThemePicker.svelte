<!-- Radio group of live theme previews. Submits as `name="theme"`. -->
<script lang="ts">
	import InvitationPreview from '$lib/components/InvitationPreview.svelte';
	import { THEMES } from '$lib/themes';

	interface Props {
		value: string;
		/** Name shown inside every preview so the sender sees the real thing. */
		name: string;
	}

	let { value = $bindable(), name }: Props = $props();
</script>

<div class="themes">
	{#each THEMES as theme (theme.id)}
		<label class="theme">
			<input type="radio" name="theme" value={theme.id} bind:group={value} class="visually-hidden" />
			<InvitationPreview themeId={theme.id} {name} compact />
			<span class="theme-name">{theme.name}</span>
			<span class="theme-mood">{theme.mood}</span>
		</label>
	{/each}
</div>

<style>
	.themes {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 0.75rem;
	}

	.theme {
		display: grid;
		gap: 0.125rem;
		padding: 0.375rem 0.375rem 0.75rem;
		border: 2px solid transparent;
		border-radius: 20px;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.theme:hover {
		border-color: var(--line);
	}

	.theme:has(input:checked) {
		border-color: var(--accent);
		background: var(--surface);
	}

	.theme:has(input:focus-visible) {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	.theme-name {
		margin-top: 0.5rem;
		padding: 0 0.25rem;
		font-weight: 700;
	}

	.theme-mood {
		padding: 0 0.25rem;
		font-size: 0.875rem;
		line-height: 1.3;
		color: var(--muted);
	}
</style>
