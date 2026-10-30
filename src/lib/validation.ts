import * as v from 'valibot';

export const MAX_NAME_LENGTH = 40;
export const MAX_OPTION_LENGTH = 80;
export const MAX_OPTIONS = 6;

export const createInvitationSchema = v.object({
	name: v.pipe(
		v.string('Wpisz jej imię.'),
		v.trim(),
		v.nonEmpty('Wpisz jej imię.'),
		v.maxLength(MAX_NAME_LENGTH, `Imię może mieć najwyżej ${MAX_NAME_LENGTH} znaków.`)
	),
	options: v.pipe(
		v.array(
			v.pipe(
				v.string(),
				v.trim(),
				v.maxLength(
					MAX_OPTION_LENGTH,
					`Propozycja może mieć najwyżej ${MAX_OPTION_LENGTH} znaków.`
				)
			)
		),
		v.transform((list) => list.filter((label) => label.length > 0)),
		v.minLength(1, 'Dodaj przynajmniej jedną propozycję randki.'),
		v.maxLength(MAX_OPTIONS, `Możesz dodać najwyżej ${MAX_OPTIONS} propozycji.`)
	)
});

export type CreateInvitationInput = v.InferOutput<typeof createInvitationSchema>;
