<!--
	The whole invitee experience: the question, picking an option, reviewing it
	and the final thank-you. Used by the real invitation page and by the demo
	the sender can try before creating one (`demo` skips saving anything).
-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import RunawayButton from '$lib/components/RunawayButton.svelte';
	import { launchFireworks } from '$lib/fireworks';
	import type { Theme } from '$lib/themes';

	interface Props {
		theme: Theme;
		name: string;
		options: { id: number; label: string }[];
		/** Label of the option she already confirmed, if any. */
		answer: string | null;
		error?: string;
		demo?: boolean;
	}

	let { theme, name, options, answer, error, demo = false }: Props = $props();

	type Step = 'ask' | 'pick' | 'review';

	let step = $state<Step>('ask');
	let selectedId = $state<number | null>(null);
	let noAttempts = $state(0);
	let submitting = $state(false);
	let demoAnswer = $state<string | null>(null);
	let yesButton = $state<HTMLButtonElement>();

	const copy = $derived(theme.copy);
	const finalAnswer = $derived(answer ?? demoAnswer);
	const selected = $derived(options.find((option) => option.id === selectedId));
	const tease = $derived(copy.teases[Math.min(noAttempts, copy.teases.length - 1)]);
	const yesScale = $derived(1 + Math.min(noAttempts, 6) * 0.08);

	function choose(id: number) {
		selectedId = id;
		step = 'review';
	}

	function confirmDemo() {
		if (!selected) return;
		demoAnswer = selected.label;
		launchFireworks(theme.fireworks);
	}
</script>

{#snippet windowBar()}
	<div class="card-bar" aria-hidden="true">
		<span>zaproszenie.exe</span>
		<span class="card-bar-close">✕</span>
	</div>
{/snippet}

<div class="flow" data-theme={theme.id}>
	<div class="stage">
		{#if finalAnswer}
			<section class="card step" in:fly={{ y: 24, duration: 500 }}>
				{@render windowBar()}
				<h1 class="themed-title">{copy.doneTitle}</h1>
				<p class="choice">{finalAnswer}</p>
				<p class="lead">{copy.doneMessage}</p>
			</section>
		{:else if step === 'ask'}
			<section class="card step" out:fade={{ duration: 150 }}>
				{@render windowBar()}
				<h1 class="themed-title question">Hej, {name}. Umówimy się?</h1>

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
			<section class="card step" in:fly={{ y: 24, duration: 400, delay: 150 }}>
				{@render windowBar()}
				<h1 class="themed-title">{copy.pickTitle}</h1>
				<ul class="options">
					{#each options as option (option.id)}
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
			<section class="card step" in:fly={{ y: 24, duration: 400 }}>
				{@render windowBar()}
				<h1 class="themed-title">{copy.reviewTitle}</h1>
				<p class="lead">Wybrałaś:</p>
				<p class="choice">{selected.label}</p>

				{#if demo}
					<div class="review-actions">
						<button type="button" class="btn btn-yes" onclick={confirmDemo}>{copy.confirm}</button>
						<button type="button" class="btn btn-ghost" onclick={() => (step = 'pick')}>
							Zmień wybór
						</button>
					</div>
				{:else}
					<form
						method="POST"
						action="?/accept"
						class="review-actions"
						use:enhance={() => {
							submitting = true;
							return async ({ result, update }) => {
								await update();
								submitting = false;
								if (result.type === 'success') launchFireworks(theme.fireworks);
							};
						}}
					>
						<input type="hidden" name="optionId" value={selected.id} />
						<input type="hidden" name="noAttempts" value={noAttempts} />
						<button class="btn btn-yes" disabled={submitting}>
							{submitting ? 'Zapisuję…' : copy.confirm}
						</button>
						<button type="button" class="btn btn-ghost" onclick={() => (step = 'pick')}>
							Zmień wybór
						</button>
					</form>
				{/if}

				{#if error}
					<p class="error" role="alert">{error}</p>
				{/if}
			</section>
		{/if}
	</div>
</div>

<style>
	/* Covers the whole viewport so the theme's background also shows when scrolling past the edges. */
	.flow {
		position: fixed;
		inset: 0;
		overflow-x: clip;
		overflow-y: auto;
	}

	.stage {
		display: grid;
		place-items: center;
		min-height: 100%;
		padding: var(--gutter);
	}

	/* Steps share one grid cell so the outgoing and incoming ones overlap during transitions. */
	.stage > * {
		grid-area: 1 / 1;
	}

	.step {
		container-type: inline-size;
		display: grid;
		gap: 1.25rem;
		width: 100%;
		max-width: 32rem;
		text-align: center;
	}

	/* Sized to the card, not the screen, so words don't break inside padded themes. */
	h1 {
		font-size: clamp(1.75rem, 10cqi, 3.25rem);
	}

	.question {
		font-size: clamp(2.25rem, 14cqi, 4.5rem);
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
		color: var(--muted);
	}

	.lead {
		font-size: 1.125rem;
		color: var(--muted);
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
		border: 2px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--text);
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
		border-color: var(--accent);
	}

	.option:active {
		transform: scale(0.98);
	}

	.choice {
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius);
		background: var(--accent);
		color: var(--accent-text);
		box-shadow: var(--button-shadow);
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

	.error {
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--text);
		font-weight: 600;
	}
</style>
