import { fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { createInvitation } from '$lib/server/invitations';
import { createInvitationSchema } from '$lib/validation';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = form.get('name');
		const options = form.getAll('option');

		const result = v.safeParse(createInvitationSchema, { name, options });

		if (!result.success) {
			return fail(400, {
				name: typeof name === 'string' ? name : '',
				options: options.map(String),
				error: result.issues[0].message
			});
		}

		const code = await createInvitation(result.output);
		redirect(303, `/${code}/status?created`);
	}
} satisfies Actions;
