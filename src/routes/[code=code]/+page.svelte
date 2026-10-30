<script lang="ts">
	import InvitationFlow from '$lib/components/InvitationFlow.svelte';
	import { getTheme } from '$lib/themes';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const theme = $derived(getTheme(data.theme));
</script>

<svelte:head>
	<title>Mam do Ciebie pytanie 💌</title>
	<meta property="og:title" content="Mam do Ciebie pytanie 💌" />
	<meta property="og:description" content="Otwórz, to tylko jedno pytanie." />
	<meta name="robots" content="noindex" />
	<meta name="theme-color" content={theme.themeColor} />
</svelte:head>

<InvitationFlow
	{theme}
	name={data.name}
	options={data.options}
	answer={data.answer}
	error={form?.error}
/>
