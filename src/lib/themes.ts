/**
 * Visual styles an invitation can be sent in. Colors, fonts and shapes live in
 * `themes.css` under `[data-theme='<id>']`; this file holds what differs in code:
 * the copy and the fireworks palette.
 */
export interface Theme {
	id: string;
	name: string;
	/** One line shown in the picker so the sender knows the mood. */
	mood: string;
	themeColor: string;
	fireworks: readonly string[];
	copy: {
		/** Shown under the buttons as she keeps chasing "no". The first entry is shown before any attempt. */
		teases: readonly string[];
		pickTitle: string;
		reviewTitle: string;
		confirm: string;
		doneTitle: string;
		doneMessage: string;
	};
}

export const THEMES = [
	{
		id: 'romantic',
		name: 'Romantyczny',
		mood: 'Wiśniowo i z sercem',
		themeColor: '#6e0f2c',
		fireworks: ['#ffd45c', '#ff8fb1', '#fff1f4', '#ff5c8a'],
		copy: {
			teases: [
				'',
				'Ups, wyślizgnął się.',
				'Ten przycisk jest bardzo nieśmiały.',
				'Może spróbuj tego żółtego?',
				'On naprawdę nie chce być kliknięty.',
				'Żółty jest dużo bliżej 😉'
			],
			pickTitle: 'Super! To gdzie idziemy?',
			reviewTitle: 'Dobry wybór.',
			confirm: 'Potwierdzam',
			doneTitle: 'Jesteśmy umówieni!',
			doneMessage: 'Dziękuję, że się zgodziłaś. Już nie mogę się doczekać.'
		}
	},
	{
		id: 'evening',
		name: 'Wieczór',
		mood: 'Elegancko, na randkę',
		themeColor: '#18223a',
		fireworks: ['#e9c46a', '#f6efe4', '#e8a0a0'],
		copy: {
			teases: [
				'',
				'Ups, wyślizgnął się.',
				'Ten przycisk jest bardzo nieśmiały.',
				'Może spróbuj tego złotego?',
				'On naprawdę nie chce być kliknięty.',
				'Złoty jest dużo bliżej.'
			],
			pickTitle: 'Cudownie. To gdzie idziemy?',
			reviewTitle: 'Dobry wybór.',
			confirm: 'Potwierdzam',
			doneTitle: 'Jesteśmy umówieni',
			doneMessage: 'Dziękuję, że się zgodziłaś. Już nie mogę się doczekać.'
		}
	},
	{
		id: 'sweet',
		name: 'Słodki',
		mood: 'Uroczo i pastelowo',
		themeColor: '#f6e9ff',
		fireworks: ['#ff9f80', '#b388ff', '#7fd1ff', '#ffd166'],
		copy: {
			teases: [
				'',
				'Hihi, nie tędy 🙈',
				'Ten guzik się wstydzi.',
				'A może jednak ten pomarańczowy?',
				'Guzik „nie” poszedł na spacer.',
				'Pomarańczowy bardzo czeka 🥺'
			],
			pickTitle: 'Jeeej! To co wybierasz?',
			reviewTitle: 'Słodki wybór!',
			confirm: 'Tak, to!',
			doneTitle: 'Umówione! 🥳',
			doneMessage: 'Dziękuję! Będzie super.'
		}
	},
	{
		id: 'buddy',
		name: 'Ziomek',
		mood: 'Luźno, po koleżeńsku',
		themeColor: '#9fd8ff',
		fireworks: ['#ffe14d', '#ff6b6b', '#4dabf7', '#51cf66'],
		copy: {
			teases: [
				'',
				'Nice try.',
				'Ten przycisk jest tylko na pokaz.',
				'Wymówki nie przejdą.',
				'Serio, klikaj „Tak”.',
				'Nie ma odwrotu 😎'
			],
			pickTitle: 'No i elegancko. Co robimy?',
			reviewTitle: 'Dobra opcja.',
			confirm: 'Wchodzę w to',
			doneTitle: 'Widzimy się!',
			doneMessage: 'Dzięki, będzie grubo.'
		}
	},
	{
		id: 'retro',
		name: 'Retro PC',
		mood: 'Dla żartu, jak z Windowsa 95',
		themeColor: '#008080',
		fireworks: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
		copy: {
			teases: [
				'',
				'Błąd: przycisk nie odpowiada.',
				'Odmowa dostępu.',
				'Ta operacja jest niedozwolona.',
				'System wykrył próbę odmowy. Zablokowano.',
				'Spróbuj ponownie: [Tak]'
			],
			pickTitle: 'Wybierz opcję spotkania:',
			reviewTitle: 'Potwierdź wybór',
			confirm: 'OK',
			doneTitle: 'Operacja zakończona sukcesem',
			doneMessage: 'Spotkanie zostało zapisane w kalendarzu. Dziękujemy.'
		}
	},
	{
		id: 'clean',
		name: 'Prosty',
		mood: 'Minimalistycznie, do wszystkiego',
		themeColor: '#ffffff',
		fireworks: ['#111827', '#9ca3af', '#f59e0b'],
		copy: {
			teases: [
				'',
				'Ten przycisk nie działa.',
				'Nadal nie działa.',
				'Zostaje tylko „Tak”.',
				'Naprawdę.',
				'„Tak” jest tuż obok.'
			],
			pickTitle: 'Świetnie. Co wybierasz?',
			reviewTitle: 'Twój wybór',
			confirm: 'Potwierdzam',
			doneTitle: 'Do zobaczenia!',
			doneMessage: 'Dziękuję, że się zgodziłaś.'
		}
	}
] as const satisfies readonly Theme[];

export type ThemeId = (typeof THEMES)[number]['id'];

export const THEME_IDS = THEMES.map((theme) => theme.id) as [ThemeId, ...ThemeId[]];
export const DEFAULT_THEME: ThemeId = 'romantic';

export function getTheme(id: string): Theme {
	return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}
