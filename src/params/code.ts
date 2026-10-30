import type { ParamMatcher } from '@sveltejs/kit';
import { isInvitationCode } from '$lib/invitation-code';

export const match: ParamMatcher = (param) => isInvitationCode(param);
