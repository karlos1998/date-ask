import { error } from '@sveltejs/kit';
import { findInvitation } from '$lib/server/invitations';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const invitation = await findInvitation(params.code);
	if (!invitation) error(404, 'Nie ma takiego zaproszenia.');

	return {
		name: invitation.inviteeName,
		inviteUrl: `${url.origin}/${invitation.code}`,
		justCreated: url.searchParams.has('created'),
		options: invitation.options.map(({ id, label }) => ({ id, label })),
		chosenOptionId: invitation.chosenOptionId,
		viewedAt: invitation.viewedAt?.toISOString() ?? null,
		answeredAt: invitation.answeredAt?.toISOString() ?? null,
		noAttempts: invitation.noAttempts
	};
};
