<script lang="ts">
	import InvitationFlow from '$lib/components/InvitationFlow.svelte';
	import { getTheme } from '$lib/themes';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const theme = $derived(getTheme(data.themeId));
	let run = $state(0);

	function close() {
		window.close();
		// Browsers only allow closing tabs opened by a link or script; otherwise go back home.
		setTimeout(() => (window.location.href = '/'), 150);
	}
</script>

<svelte:head>
	<title>Podgląd: {theme.name}</title>
	<meta name="robots" content="noindex" />
	<meta name="theme-color" content={theme.themeColor} />
</svelte:head>

{#key run}
	<InvitationFlow {theme} name={data.name} options={data.options} answer={null} demo />
{/key}

<aside class="demo-bar">
	<p>Podgląd stylu „{theme.name}”. Nic się nie zapisuje.</p>
	<div class="demo-actions">
		<button type="button" onclick={() => run++}>Od nowa</button>
		<button type="button" onclick={close}>Zamknij</button>
	</div>
</aside>

<style>
	/* Deliberately outside the theme: this bar belongs to the app, not to the invitation. */
	.demo-bar {
		position: fixed;
		left: 50%;
		bottom: max(0.75rem, env(safe-area-inset-bottom));
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: max-content;
		max-width: calc(100% - 1.5rem);
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		border-radius: 999px;
		background: #1c1b22;
		color: #ffffff;
		font-family: 'Figtree Variable', system-ui, sans-serif;
		font-size: 0.875rem;
		transform: translateX(-50%);
		box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.25);
	}

	.demo-actions {
		display: flex;
		flex: none;
		gap: 0.25rem;
	}

	button {
		padding: 0.375rem 0.875rem;
		border: 0;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.14);
		color: inherit;
		font-weight: 700;
		cursor: pointer;
	}
</style>
