import { getTheme } from '$lib/themes';
import { MAX_NAME_LENGTH, MAX_OPTION_LENGTH, MAX_OPTIONS } from '$lib/validation';
import type { PageLoad } from './$types';

const SAMPLE_OPTIONS = ['Kino, horror, czwartek 19:00', 'Kolacja we włoskiej knajpce', 'Spacer i lody'];

/** Demo of an invitation built from query params, e.g. `/podglad?styl=retro&imie=Basia&opcja=Kino`. */
export const load: PageLoad = ({ url }) => {
	const theme = getTheme(url.searchParams.get('styl') ?? '');
	const name = url.searchParams.get('imie')?.trim().slice(0, MAX_NAME_LENGTH) || 'Basia';
	const labels = url.searchParams
		.getAll('opcja')
		.map((label) => label.trim().slice(0, MAX_OPTION_LENGTH))
		.filter(Boolean)
		.slice(0, MAX_OPTIONS);

	return {
		themeId: theme.id,
		name,
		options: (labels.length ? labels : SAMPLE_OPTIONS).map((label, index) => ({
			id: index + 1,
			label
		}))
	};
};
