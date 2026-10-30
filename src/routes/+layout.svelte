<script lang="ts">
	// Fontsource only downloads a font file once a page actually uses that font,
	// so importing every theme's typeface here costs nothing up front.
	import '@fontsource-variable/figtree';
	import '@fontsource/dm-serif-display';
	import '@fontsource/shrikhand';
	import '@fontsource-variable/baloo-2';
	import '@fontsource-variable/bricolage-grotesque';
	import '@fontsource-variable/pixelify-sans';
	import '@fontsource-variable/instrument-sans';
	import '../app.css';
	import '$lib/themes.css';

	let { children } = $props();
</script>

{@render children()}
