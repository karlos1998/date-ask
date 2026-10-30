import { and, eq, isNull } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { CODE_ALPHABET, CODE_LENGTH } from '$lib/invitation-code';
import type { CreateInvitationInput } from '$lib/validation';
import { db } from './db';
import { invitations, options } from './db/schema';

const generateCode = customAlphabet(CODE_ALPHABET, CODE_LENGTH);
const MAX_CODE_ATTEMPTS = 5;

async function generateUniqueCode(): Promise<string> {
	for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
		const code = generateCode();
		const taken = await db.query.invitations.findFirst({
			columns: { code: true },
			where: eq(invitations.code, code)
		});
		if (!taken) return code;
	}
	throw new Error('Could not generate a unique invitation code');
}

export async function createInvitation(input: CreateInvitationInput): Promise<string> {
	const code = await generateUniqueCode();

	// A batch runs both inserts atomically in a single round trip.
	await db.batch([
		db.insert(invitations).values({ code, inviteeName: input.name }),
		db
			.insert(options)
			.values(input.options.map((label, position) => ({ invitationCode: code, label, position })))
	]);

	return code;
}

export function findInvitation(code: string) {
	return db.query.invitations.findFirst({
		where: eq(invitations.code, code),
		with: {
			options: { orderBy: (option, { asc }) => [asc(option.position)] },
			chosenOption: true
		}
	});
}

/** Records the first visit of the invitee. Later visits leave the timestamp untouched. */
export async function markViewed(code: string): Promise<void> {
	await db
		.update(invitations)
		.set({ viewedAt: new Date() })
		.where(and(eq(invitations.code, code), isNull(invitations.viewedAt)));
}

/**
 * Saves the invitee's answer. Returns `false` when the option doesn't belong
 * to the invitation or the invitation was already answered.
 */
export async function acceptInvitation(
	code: string,
	optionId: number,
	noAttempts: number
): Promise<boolean> {
	const option = await db.query.options.findFirst({
		columns: { id: true },
		where: and(eq(options.id, optionId), eq(options.invitationCode, code))
	});
	if (!option) return false;

	const updated = await db
		.update(invitations)
		.set({
			chosenOptionId: option.id,
			answeredAt: new Date(),
			noAttempts: Math.max(0, Math.floor(noAttempts))
		})
		.where(and(eq(invitations.code, code), isNull(invitations.answeredAt)))
		.returning({ code: invitations.code });

	return updated.length > 0;
}
