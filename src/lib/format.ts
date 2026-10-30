const dateTime = new Intl.DateTimeFormat('pl-PL', {
	dateStyle: 'medium',
	timeStyle: 'short',
	// Fixed zone so server-rendered and hydrated text always match.
	timeZone: 'Europe/Warsaw'
});

export function formatDateTime(iso: string): string {
	return dateTime.format(new Date(iso));
}

/** "1 raz", "2 razy", "5 razy" – Polish only changes the form for exactly one. */
export function formatTimes(count: number): string {
	return `${count} ${count === 1 ? 'raz' : 'razy'}`;
}
