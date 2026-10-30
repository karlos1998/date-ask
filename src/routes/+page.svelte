<script lang="ts">
	import { enhance } from '$app/forms';
	import { MAX_NAME_LENGTH, MAX_OPTION_LENGTH, MAX_OPTIONS } from '$lib/validation';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const placeholders = [
		'Kino, horror, czwartek 19:00',
		'Kolacja we włoskiej knajpce',
		'Spacer nad Wisłą i lody',
		'Kręgle w sobotę',
		'Wieczór gier planszowych',
		'Śniadanie na mieście'
	];

	let name = $state(form?.name ?? '');
	let options = $state(form?.options?.length ? form.options : ['', '', '']);
	let submitting = $state(false);

	const previewName = $derived(name.trim() || 'Basia');

	function addOption() {
		if (options.length < MAX_OPTIONS) options.push('');
	}

	function removeOption(index: number) {
		options.splice(index, 1);
	}
</script>

<svelte:head>
	<title>date-ask · Zaproś ją na randkę</title>
	<meta name="description" content="Stwórz zaproszenie na randkę, na które nie da się odpowiedzieć „nie”." />
</svelte:head>

<main class="page">
	<section class="hero">
		<h1 class="intro">Wyślij jej link z pytaniem, na które nie da się odpowiedzieć „nie”.</h1>
		<div class="preview" aria-hidden="true">
			<p class="preview-question">Hej, {previewName}. Umówimy się?</p>
			<div class="preview-buttons">
				<span class="btn btn-yes">Tak</span>
				<span class="btn btn-ghost preview-no">Nie</span>
			</div>
		</div>
	</section>

	<form
		class="creator"
		method="POST"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update({ reset: false });
				submitting = false;
			};
		}}
	>
		<div class="field">
			<label for="name">Jak ma na imię?</label>
			<input
				id="name"
				name="name"
				bind:value={name}
				maxlength={MAX_NAME_LENGTH}
				autocomplete="off"
				autocapitalize="words"
				placeholder="Basia"
				required
			/>
		</div>

		<fieldset class="field">
			<legend>Co proponujesz?</legend>
			<p class="hint">Po kliknięciu „Tak” wybierze jedną z tych opcji.</p>

			<ol class="options">
				{#each options as _, i}
					<li class="option-row">
						<label class="visually-hidden" for="option-{i}">Propozycja {i + 1}</label>
						<input
							id="option-{i}"
							name="option"
							bind:value={options[i]}
							maxlength={MAX_OPTION_LENGTH}
							autocomplete="off"
							placeholder={placeholders[i]}
						/>
						{#if options.length > 1}
							<button
								type="button"
								class="remove"
								onclick={() => removeOption(i)}
								aria-label="Usuń propozycję {i + 1}">×</button
							>
						{/if}
					</li>
				{/each}
			</ol>

			{#if options.length < MAX_OPTIONS}
				<button type="button" class="add" onclick={addOption}>+ Dodaj propozycję</button>
			{/if}
		</fieldset>

		{#if form?.error}
			<p class="error" role="alert">{form.error}</p>
		{/if}

		<button class="btn btn-yes submit" disabled={submitting}>
			{submitting ? 'Tworzę zaproszenie…' : 'Stwórz zaproszenie'}
		</button>
	</form>
</main>

<style>
	.page {
		max-width: 34rem;
		margin: 0 auto;
		padding: clamp(2rem, 8vh, 5rem) var(--gutter) 4rem;
	}

	.intro {
		font-family: var(--font-body);
		font-weight: 600;
		line-height: 1.4;
		font-size: 1.125rem;
		max-width: 26ch;
		color: color-mix(in srgb, var(--milk) 80%, transparent);
	}

	.preview {
		margin-top: 1.5rem;
		padding: 2rem 1.5rem 1.75rem;
		border-radius: 28px;
		background: var(--cherry-deep);
		transform: rotate(-1.5deg);
		box-shadow: 0 1.5rem 3rem -1.5rem rgb(20 0 8 / 0.6);
	}

	.preview-question {
		font-family: var(--font-display);
		line-height: 1.05;
		text-wrap: balance;
		font-size: clamp(2.25rem, 9vw, 3.25rem);
		overflow-wrap: anywhere;
	}

	.preview-buttons {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.preview-no {
		transform: translate(0.75rem, 0.5rem) rotate(6deg);
	}

	.creator {
		display: grid;
		gap: 2rem;
		margin-top: 3rem;
	}

	.field {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		border: 0;
		min-width: 0;
	}

	label,
	legend {
		padding: 0;
		font-weight: 700;
		font-size: 1.125rem;
	}

	.hint {
		margin-bottom: 0.25rem;
		font-size: 0.9375rem;
		color: color-mix(in srgb, var(--milk) 70%, transparent);
	}

	input {
		width: 100%;
		min-height: 3.25rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--cherry-soft);
		border-radius: var(--radius-field);
		background: var(--cherry-deep);
		font-size: 1.0625rem; /* ≥16px stops iOS from zooming into the field */
	}

	input::placeholder {
		color: color-mix(in srgb, var(--milk) 40%, transparent);
	}

	input:focus-visible {
		outline: none;
		border-color: var(--blush);
	}

	.options {
		display: grid;
		gap: 0.625rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.option-row {
		display: flex;
		gap: 0.5rem;
	}

	.remove {
		flex: none;
		width: 3.25rem;
		border: 0;
		border-radius: var(--radius-field);
		background: transparent;
		font-size: 1.5rem;
		line-height: 1;
		color: color-mix(in srgb, var(--milk) 60%, transparent);
		cursor: pointer;
	}

	.remove:hover {
		color: var(--milk);
	}

	.add {
		justify-self: start;
		padding: 0.5rem 0;
		border: 0;
		background: none;
		font-weight: 700;
		color: var(--butter);
		cursor: pointer;
	}

	.error {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-field);
		background: var(--milk);
		color: var(--ink);
		font-weight: 600;
	}

	.submit {
		width: 100%;
		font-size: 1.125rem;
	}
</style>
