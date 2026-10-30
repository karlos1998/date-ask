<script lang="ts">
	import { page } from '$app/state';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Nie ma takiego zaproszenia' : 'Coś poszło nie tak'}</title>
</svelte:head>

<main class="page">
	<h1>{notFound ? 'Nie ma takiego zaproszenia' : 'Coś poszło nie tak'}</h1>
	<p>
		{notFound
			? 'Sprawdź, czy link został skopiowany w całości. Kod ma 6 znaków.'
			: 'Spróbuj odświeżyć stronę za chwilę.'}
	</p>
	<a href="/">Stwórz własne zaproszenie</a>
</main>

<style>
	.page {
		display: grid;
		gap: 1.25rem;
		max-width: 32rem;
		margin: 0 auto;
		padding: clamp(3rem, 15vh, 8rem) var(--gutter);
	}

	h1 {
		font-size: clamp(2.25rem, 9vw, 3.25rem);
	}

	a {
		font-weight: 700;
	}
</style>
