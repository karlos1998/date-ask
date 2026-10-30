<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import RunawayButton from '$lib/components/RunawayButton.svelte';
	import { launchFireworks } from '$lib/fireworks';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	type Step = 'ask' | 'pick' | 'review';

	const teases = [
		'',
		'Ups, wyślizgnął się.',
		'Ten przycisk jest bardzo nieśmiały.',
		'Może spróbuj tego żółtego?',
		'On naprawdę nie chce być kliknięty.',
		'Żółty jest dużo bliżej 😉'
	];

	let step = $state<Step>('ask');
	let selectedId = $state<number | null>(null);
	let noAttempts = $state(0);
	let submitting = $state(false);
	let yesButton = $state<HTMLButtonElement>();

	const selected = $derived(data.options.find((option) => option.id === selectedId));
	const tease = $derived(teases[Math.min(noAttempts, teases.length - 1)]);
	const yesScale = $derived(1 + Math.min(noAttempts, 6) * 0.08);

	function choose(id: number) {
		selectedId = id;
		step = 'review';
	}
</script>

<svelte:head>
	<title>Mam do Ciebie pytanie 💌</title>
	<meta property="og:title" content="Mam do Ciebie pytanie 💌" />
	<meta property="og:description" content="Otwórz, to tylko jedno pytanie." />
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="page">
	{#if data.answer}
		<section class="step done" in:fly={{ y: 24, duration: 500 }}>
			<p class="big-emoji" aria-hidden="true">🎆</p>
			<h1>Jesteśmy umówieni!</h1>
			<p class="lead">Dziękuję, że się zgodziłaś, {data.name}. Już nie mogę się doczekać.</p>
			<p class="choice">{data.answer}</p>
			<p class="small">Szczegóły dogadamy na wiadomościach.</p>
		</section>
	{:else if step === 'ask'}
		<section class="step ask" out:fade={{ duration: 150 }}>
			<h1 class="question">Hej, {data.name}. Umówimy się?</h1>

			<div class="answers">
				<button
					bind:this={yesButton}
					type="button"
					class="btn btn-yes yes"
					style:transform="scale({yesScale})"
					onclick={() => (step = 'pick')}
				>
					Tak
				</button>
				<RunawayButton avoid={yesButton} onescape={(attempts) => (noAttempts = attempts)}>
					Nie
				</RunawayButton>
			</div>

			<p class="tease" aria-live="polite">{tease}</p>
		</section>
	{:else if step === 'pick'}
		<section class="step" in:fly={{ y: 24, duration: 400, delay: 150 }}>
			<h1>Super! To gdzie idziemy?</h1>
			<ul class="options">
				{#each data.options as option (option.id)}
					<li>
						<button
							type="button"
							class="option"
							class:selected={option.id === selectedId}
							onclick={() => choose(option.id)}
						>
							{option.label}
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{:else if step === 'review' && selected}
		<section class="step" in:fly={{ y: 24, duration: 400 }}>
			<h1>Dobry wybór.</h1>
			<p class="lead">Wybrałaś:</p>
			<p class="choice">{selected.label}</p>

			<form
				method="POST"
				action="?/accept"
				class="review-actions"
				use:enhance={() => {
					submitting = true;
					return async ({ result, update }) => {
						await update();
						submitting = false;
						if (result.type === 'success') launchFireworks();
					};
				}}
			>
				<input type="hidden" name="optionId" value={selected.id} />
				<input type="hidden" name="noAttempts" value={noAttempts} />
				<button class="btn btn-yes" disabled={submitting}>
					{submitting ? 'Zapisuję…' : 'Potwierdzam'}
				</button>
				<button type="button" class="btn btn-ghost" onclick={() => (step = 'pick')}>
					Zmień wybór
				</button>
			</form>

			{#if form?.error}
				<p class="error" role="alert">{form.error}</p>
			{/if}
		</section>
	{/if}
</main>

<style>
	.page {
		display: grid;
		place-items: center;
		min-height: 100dvh;
		padding: var(--gutter);
		overflow: hidden;
	}

	/* Steps share one grid cell so the outgoing and incoming ones overlap during transitions. */
	.page > * {
		grid-area: 1 / 1;
	}

	.step {
		display: grid;
		gap: 1.25rem;
		width: 100%;
		max-width: 32rem;
		text-align: center;
	}

	h1 {
		font-size: clamp(2.25rem, 8vw, 3.25rem);
		overflow-wrap: anywhere;
	}

	.question {
		font-size: clamp(2.75rem, 12vw, 5rem);
	}

	.answers {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.yes {
		min-width: 8rem;
		font-size: 1.25rem;
		transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.4);
	}

	.tease {
		min-height: 1.5em;
		color: color-mix(in srgb, var(--milk) 75%, transparent);
	}

	.lead {
		font-size: 1.125rem;
	}

	.options {
		display: grid;
		gap: 0.75rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.option {
		width: 100%;
		min-height: 3.75rem;
		padding: 1rem 1.25rem;
		border: 2px solid var(--cherry-soft);
		border-radius: 20px;
		background: var(--cherry-deep);
		font-weight: 600;
		font-size: 1.125rem;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			transform 0.15s ease;
	}

	.option:hover,
	.option.selected {
		border-color: var(--butter);
	}

	.option:active {
		transform: scale(0.98);
	}

	.choice {
		padding: 1.25rem 1.5rem;
		border-radius: 20px;
		background: var(--butter);
		color: var(--ink);
		font-weight: 700;
		font-size: 1.25rem;
		transform: rotate(-1.5deg);
	}

	.review-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.big-emoji {
		font-size: 3.5rem;
		line-height: 1;
	}

	.small {
		font-size: 0.9375rem;
		color: color-mix(in srgb, var(--milk) 70%, transparent);
	}

	.error {
		padding: 0.75rem 1rem;
		border-radius: 14px;
		background: var(--milk);
		color: var(--ink);
		font-weight: 600;
	}
</style>
