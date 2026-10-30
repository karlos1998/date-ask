const COLORS = ['#ffd45c', '#ff8fb1', '#fff1f4', '#ff5c8a'];

/** Launches a few seconds of confetti fireworks from both sides of the screen. */
export async function launchFireworks(durationMs = 4000): Promise<void> {
	// Loaded lazily: the library touches `window` and is only needed after a "yes".
	const { default: confetti } = await import('canvas-confetti');
	const end = Date.now() + durationMs;

	const burst = (xMin: number, xMax: number, particleCount: number) =>
		confetti({
			particleCount,
			startVelocity: 32,
			spread: 360,
			ticks: 70,
			gravity: 0.9,
			colors: COLORS,
			origin: { x: xMin + Math.random() * (xMax - xMin), y: Math.random() * 0.4 + 0.05 },
			disableForReducedMotion: true
		});

	const timer = setInterval(() => {
		const remaining = end - Date.now();
		if (remaining <= 0) {
			clearInterval(timer);
			return;
		}
		const particleCount = Math.round(60 * (remaining / durationMs));
		burst(0.1, 0.35, particleCount);
		burst(0.65, 0.9, particleCount);
	}, 280);
}
