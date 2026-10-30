import { error, fail } from '@sveltejs/kit';
import { acceptInvitation, findInvitation, markViewed } from '$lib/server/invitations';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const invitation = await findInvitation(params.code);
	if (!invitation) error(404, 'Nie ma takiego zaproszenia.');

	if (!invitation.viewedAt) await markViewed(params.code);

	return {
		name: invitation.inviteeName,
		options: invitation.options.map(({ id, label }) => ({ id, label })),
		answer: invitation.chosenOption?.label ?? null
	};
};

export const actions = {
	accept: async ({ request, params }) => {
		const form = await request.formData();
		const optionId = Number(form.get('optionId'));
		const noAttempts = Number(form.get('noAttempts')) || 0;

		if (!Number.isInteger(optionId) || optionId <= 0) {
			return fail(400, { error: 'Wybierz jedną z propozycji.' });
		}

		const accepted = await acceptInvitation(params.code, optionId, noAttempts);
		if (!accepted) {
			return fail(409, { error: 'Nie udało się zapisać odpowiedzi. Odśwież stronę.' });
		}

		return { accepted: true };
	}
} satisfies Actions;
