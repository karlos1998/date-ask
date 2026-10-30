<!--
	A button that can't be pressed. It jumps to a random spot on screen when
	the mouse comes near (desktop) or the moment a finger touches it (mobile).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Element the button should never land on top of (e.g. the "yes" button). */
		avoid?: HTMLElement;
		onescape?: (attempts: number) => void;
		children: Snippet;
	}

	let { avoid, onescape, children }: Props = $props();

	const EDGE_MARGIN = 16;
	const MAX_PLACEMENT_TRIES = 30;

	let button: HTMLButtonElement;
	let position = $state<{ x: number; y: number } | null>(null);
	/** Size of the button's original spot, kept so the layout doesn't jump once it escapes. */
	let slot = $state<{ width: number; height: number } | null>(null);
	let attempts = 0;

	function overlaps(x: number, y: number, width: number, height: number, rect: DOMRect) {
		const gap = 12;
		return !(
			x + width + gap < rect.left ||
			x > rect.right + gap ||
			y + height + gap < rect.top ||
			y > rect.bottom + gap
		);
	}

	function randomBetween(min: number, max: number) {
		return min + Math.random() * Math.max(0, max - min);
	}

	function flee() {
		const { width, height } = button.getBoundingClientRect();
		slot ??= { width, height };

		const maxX = window.innerWidth - width - EDGE_MARGIN;
		const maxY = window.innerHeight - height - EDGE_MARGIN;
		const blocked = avoid?.getBoundingClientRect();

		let next = { x: randomBetween(EDGE_MARGIN, maxX), y: randomBetween(EDGE_MARGIN, maxY) };
		for (let i = 0; i < MAX_PLACEMENT_TRIES && blocked; i++) {
			if (!overlaps(next.x, next.y, width, height, blocked)) break;
			next = { x: randomBetween(EDGE_MARGIN, maxX), y: randomBetween(EDGE_MARGIN, maxY) };
		}

		position = next;
		attempts += 1;
		onescape?.(attempts);
	}

	function handlePointerEnter(event: PointerEvent) {
		if (event.pointerType === 'mouse') flee();
	}

	function handlePointerDown(event: PointerEvent) {
		event.preventDefault();
		flee();
	}

	function handleClick(event: MouseEvent) {
		event.preventDefault();
		// `detail === 0` means keyboard activation; pointer clicks were already handled.
		if (event.detail === 0) flee();
	}
</script>

<span
	class="slot"
	style:width={slot ? `${slot.width}px` : null}
	style:height={slot ? `${slot.height}px` : null}
>
	<button
		bind:this={button}
		type="button"
		class="btn btn-ghost runaway"
		class:loose={position}
		style:left={position ? `${position.x}px` : null}
		style:top={position ? `${position.y}px` : null}
		onpointerenter={handlePointerEnter}
		onpointerdown={handlePointerDown}
		onclick={handleClick}
	>
		{@render children()}
	</button>
</span>

<style>
	.slot {
		display: inline-block;
	}

	.runaway {
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	.loose {
		position: fixed;
		z-index: 10;
		transition:
			left 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2),
			top 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2);
	}
</style>
