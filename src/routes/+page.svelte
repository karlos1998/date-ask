<script lang="ts">
	import { enhance } from '$app/forms';
	import InvitationPreview from '$lib/components/InvitationPreview.svelte';
	import ThemePicker from '$lib/components/ThemePicker.svelte';
	import { DEFAULT_THEME, getTheme } from '$lib/themes';
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
	let theme = $state(getTheme(form?.theme ?? DEFAULT_THEME).id);
	let options = $state(form?.options?.length ? form.options : ['', '', '']);
	let submitting = $state(false);

	const previewName = $derived(name.trim() || 'Basia');

	/** Opens the full invitation in demo mode with what has been typed so far. */
	const demoUrl = $derived.by(() => {
		const params = new URLSearchParams({ styl: theme, imie: previewName });
		for (const option of options) if (option.trim()) params.append('opcja', option.trim());
		return `/podglad?${params}`;
	});

	function addOption() {
		if (options.length < MAX_OPTIONS) options.push('');
	}

	function removeOption(index: number) {
		options.splice(index, 1);
	}
</script>

<svelte:head>
	<title>date-ask: zaproszenie, na które nie da się odmówić</title>
	<meta
		name="description"
		content="Stwórz zaproszenie na randkę albo spotkanie, na które nie da się odpowiedzieć „nie”."
	/>
</svelte:head>

<main class="page">
	<header class="hero">
		<h1>Zaproszenie, na które nie da się odpowiedzieć „nie”</h1>
		<p class="intro">
			Wpisz imię, wybierz styl i propozycje spotkania. Dostaniesz link do wysłania i swoją stronę,
			na której zobaczysz odpowiedź.
		</p>
	</header>

	<div class="hero-preview">
		<InvitationPreview themeId={theme} name={previewName} />
	</div>

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
			<label for="name">Kogo zapraszasz?</label>
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
			<legend>Styl zaproszenia</legend>
			<ThemePicker bind:value={theme} name={previewName} />
			<a class="demo-link" href={demoUrl} target="_blank" rel="noopener">
				Wypróbuj ten styl na pełnym ekranie
			</a>
		</fieldset>

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
		display: grid;
		gap: 2rem;
		max-width: 40rem;
		margin: 0 auto;
		padding: clamp(2rem, 8vh, 4.5rem) var(--gutter) 4rem;
	}

	.hero {
		display: grid;
		gap: 0.875rem;
	}

	h1 {
		font-size: clamp(2rem, 7vw, 3rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.05;
		max-width: 18ch;
	}

	.intro {
		max-width: 52ch;
		color: var(--muted);
	}

	.hero-preview {
		box-shadow: 0 1.5rem 3rem -1.75rem rgb(28 27 34 / 0.45);
		border-radius: 24px;
	}

	.creator {
		display: grid;
		gap: 2.25rem;
		margin-top: 0.5rem;
	}

	.field {
		display: grid;
		gap: 0.625rem;
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

	legend {
		margin-bottom: 0.625rem;
	}

	.hint {
		font-size: 0.9375rem;
		color: var(--muted);
	}

	input {
		width: 100%;
		min-height: 3.25rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		font-size: 1.0625rem; /* ≥16px stops iOS from zooming into the field */
	}

	input::placeholder {
		color: color-mix(in srgb, var(--muted) 70%, transparent);
	}

	input:focus-visible {
		outline: none;
		border-color: var(--accent);
	}

	.demo-link {
		justify-self: start;
		font-weight: 700;
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
		border-radius: var(--radius);
		background: transparent;
		font-size: 1.5rem;
		line-height: 1;
		color: var(--muted);
		cursor: pointer;
	}

	.remove:hover {
		color: var(--text);
	}

	.add {
		justify-self: start;
		padding: 0.5rem 0;
		border: 0;
		background: none;
		font-weight: 700;
		color: var(--accent);
		cursor: pointer;
	}

	.error {
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		background: var(--danger-bg);
		color: var(--danger-text);
		font-weight: 600;
	}

	.submit {
		width: 100%;
		font-size: 1.125rem;
	}
</style>
