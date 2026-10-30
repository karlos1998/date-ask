<!-- Static, scaled-down rendering of the invitation's first screen in a given theme. -->
<script lang="ts">
	import { getTheme } from '$lib/themes';

	interface Props {
		themeId: string;
		name: string;
		/** Small tile for the theme picker instead of the large hero preview. */
		compact?: boolean;
	}

	let { themeId, name, compact = false }: Props = $props();

	const theme = $derived(getTheme(themeId));
</script>

<div class="preview" class:compact data-theme={theme.id} aria-hidden="true">
	<div class="card">
		<div class="card-bar">
			<span>zaproszenie.exe</span>
			<span class="card-bar-close">✕</span>
		</div>
		<p class="themed-title question">Hej, {name}. Umówimy się?</p>
		<div class="buttons">
			<span class="btn btn-yes">Tak</span>
			<span class="btn btn-ghost no">Nie</span>
		</div>
	</div>
</div>

<style>
	.preview {
		container-type: inline-size;
		display: grid;
		place-items: center;
		padding: clamp(1.25rem, 6cqi, 2.5rem);
		border-radius: 24px;
		overflow: hidden;
		text-align: center;
	}

	.card {
		width: 100%;
	}

	.question {
		font-size: clamp(1.75rem, 11cqi, 3.25rem);
	}

	.buttons {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.25rem;
	}

	.no {
		transform: translate(0.5rem, 0.375rem) rotate(5deg);
	}

	/* Tiles are tiny, so everything is scaled down and the card padding tightened. */
	.compact {
		--card-padding: 0.75rem;
		aspect-ratio: 4 / 3;
		padding: 0.625rem;
		border-radius: 14px;
	}

	.compact .question {
		font-size: clamp(0.875rem, 11cqi, 1.25rem);
	}

	.compact .buttons {
		gap: 0.375rem;
		margin-top: 0.5rem;
	}

	.compact .card-bar {
		margin-bottom: 0.5rem;
		padding: 0.125rem 0.25rem;
		font-size: 0.625rem;
	}

	.compact .card-bar-close {
		width: 0.75rem;
		height: 0.75rem;
		font-size: 0.5rem;
	}

	.compact .btn {
		min-width: 0;
		min-height: 0;
		padding: 0.25em 0.75em;
		border-width: 1px;
		font-size: 0.6875rem;
		outline-offset: -3px;
	}
</style>
