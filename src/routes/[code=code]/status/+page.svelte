<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import InvitationPreview from '$lib/components/InvitationPreview.svelte';
	import { formatDateTime, formatTimes } from '$lib/format';
	import { getTheme } from '$lib/themes';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const REFRESH_EVERY_MS = 15_000;

	let copied = $state(false);
	let canShare = $state(false);

	const answered = $derived(data.answeredAt !== null);
	const chosen = $derived(data.options.find((option) => option.id === data.chosenOptionId));
	const theme = $derived(getTheme(data.theme));

	/** Demo of her invitation. Opening her real link would count as her first visit. */
	const demoUrl = $derived.by(() => {
		const params = new URLSearchParams({ styl: theme.id, imie: data.name });
		for (const option of data.options) params.append('opcja', option.label);
		return `/podglad?${params}`;
	});

	onMount(() => {
		canShare = typeof navigator.share === 'function';

		// Keep checking for her answer while the page is open.
		const timer = setInterval(() => {
			if (!answered && document.visibilityState === 'visible') invalidateAll();
		}, REFRESH_EVERY_MS);
		return () => clearInterval(timer);
	});

	async function copyLink() {
		await navigator.clipboard.writeText(data.inviteUrl);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function shareLink() {
		try {
			await navigator.share({ title: 'Mam do Ciebie pytanie 💌', url: data.inviteUrl });
		} catch {
			// Closing the share sheet rejects the promise – nothing to do.
		}
	}
</script>

<svelte:head>
	<title>Zaproszenie: {data.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="page">
	{#if data.justCreated && !answered}
		<p class="banner">Zaproszenie gotowe. Wyślij jej link poniżej.</p>
	{/if}

	<section class="status" class:answered aria-live="polite">
		{#if data.answeredAt && chosen}
			<h1>{data.name} się zgodziła!</h1>
			<p class="choice">{chosen.label}</p>
			<p class="meta">
				Odpowiedziała {formatDateTime(data.answeredAt)}.
				{#if data.noAttempts > 0}
					Wcześniej próbowała kliknąć „Nie” {formatTimes(data.noAttempts)}.
				{:else}
					Ani razu nie próbowała kliknąć „Nie”.
				{/if}
			</p>
		{:else if data.viewedAt}
			<h1>{data.name} otworzyła zaproszenie</h1>
			<p class="meta">
				Pierwszy raz weszła {formatDateTime(data.viewedAt)}, ale jeszcze nic nie wybrała.
			</p>
		{:else}
			<h1>{data.name} jeszcze nie otworzyła linku</h1>
			<p class="meta">Ta strona sama się odświeża, więc możesz ją zostawić otwartą.</p>
		{/if}
	</section>

	<section class="share" aria-labelledby="share-title">
		<h2 id="share-title">Link dla niej</h2>
		<p class="link">{data.inviteUrl}</p>
		<div class="share-actions">
			{#if canShare}
				<button type="button" class="btn btn-yes" onclick={shareLink}>Wyślij link</button>
			{/if}
			<button type="button" class="btn btn-ghost" onclick={copyLink}>
				{copied ? 'Skopiowano' : 'Kopiuj link'}
			</button>
		</div>
		<p class="hint">
			Ta strona to Twój podgląd. Jeśli zgubisz jej adres, dopisz <code>/status</code> na końcu linku
			dla niej.
		</p>
	</section>

	<section class="style" aria-labelledby="style-title">
		<h2 id="style-title">Styl: {theme.name}</h2>
		<a class="style-preview" href={demoUrl} target="_blank" rel="noopener">
			<InvitationPreview themeId={theme.id} name={data.name} compact />
			<span>Zobacz, jak to u niej wygląda</span>
		</a>
	</section>

	<section class="proposals" aria-labelledby="proposals-title">
		<h2 id="proposals-title">Twoje propozycje</h2>
		<ul>
			{#each data.options as option (option.id)}
				<li class:picked={option.id === data.chosenOptionId}>
					{option.label}
					{#if option.id === data.chosenOptionId}<span class="tag">wybrała</span>{/if}
				</li>
			{/each}
		</ul>
	</section>

	<a class="new" href="/">Stwórz nowe zaproszenie</a>
</main>

<style>
	.page {
		display: grid;
		gap: 2.5rem;
		max-width: 34rem;
		margin: 0 auto;
		padding: clamp(2rem, 8vh, 4rem) var(--gutter) 4rem;
	}

	.banner {
		padding: 0.875rem 1.25rem;
		border-radius: var(--radius);
		background: var(--surface);
		border: 2px solid var(--accent);
		font-weight: 600;
	}

	.status {
		display: grid;
		gap: 1rem;
	}

	h1 {
		font-size: clamp(2rem, 8vw, 2.75rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		overflow-wrap: anywhere;
	}

	h2 {
		font-weight: 700;
		font-size: 1.125rem;
	}

	.meta {
		color: var(--muted);
	}

	.choice {
		justify-self: start;
		padding: 1.25rem 1.5rem;
		border-radius: 20px;
		background: var(--accent);
		color: var(--accent-text);
		font-weight: 700;
		font-size: 1.25rem;
		transform: rotate(-1.5deg);
	}

	.share,
	.style,
	.proposals {
		display: grid;
		gap: 0.75rem;
	}

	.link {
		padding: 0.875rem 1rem;
		border-radius: 14px;
		background: var(--surface);
		border: 2px solid var(--line);
		font-weight: 600;
		overflow-wrap: anywhere;
		user-select: all;
	}

	.share-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.hint {
		font-size: 0.9375rem;
		color: var(--muted);
	}

	code {
		font-family: inherit;
		font-weight: 700;
		color: var(--text);
	}

	ul {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.875rem 1rem;
		border: 2px solid var(--line);
		background: var(--surface);
		border-radius: 14px;
	}

	li.picked {
		border-color: var(--accent);
	}

	.tag {
		flex: none;
		padding: 0.125rem 0.625rem;
		border-radius: var(--radius-pill);
		background: var(--accent);
		color: var(--accent-text);
		font-size: 0.875rem;
		font-weight: 700;
	}

	.style-preview {
		display: grid;
		grid-template-columns: 9rem 1fr;
		align-items: center;
		gap: 1rem;
		font-weight: 700;
	}

	.new {
		justify-self: start;
		font-weight: 700;
	}
</style>
