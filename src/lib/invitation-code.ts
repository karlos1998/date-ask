/** Alphabet for invitation codes: lowercase letters and digits, easy to type by hand. */
export const CODE_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
export const CODE_LENGTH = 6;

const CODE_PATTERN = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);

export function isInvitationCode(value: string): boolean {
	return CODE_PATTERN.test(value);
}
