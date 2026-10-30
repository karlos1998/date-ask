import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const invitations = sqliteTable('invitations', {
	/** Short public code used in the URL, e.g. `dr5hg1`. */
	code: text('code').primaryKey(),
	inviteeName: text('invitee_name').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	/** First time the invitee opened her link. */
	viewedAt: integer('viewed_at', { mode: 'timestamp' }),
	answeredAt: integer('answered_at', { mode: 'timestamp' }),
	chosenOptionId: integer('chosen_option_id'),
	/** How many times she tried to catch the "no" button. */
	noAttempts: integer('no_attempts').notNull().default(0)
});

export const options = sqliteTable('options', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	invitationCode: text('invitation_code')
		.notNull()
		.references(() => invitations.code, { onDelete: 'cascade' }),
	label: text('label').notNull(),
	position: integer('position').notNull()
});

export const invitationsRelations = relations(invitations, ({ many, one }) => ({
	options: many(options, { relationName: 'invitationOptions' }),
	chosenOption: one(options, {
		fields: [invitations.chosenOptionId],
		references: [options.id]
	})
}));

export const optionsRelations = relations(options, ({ one }) => ({
	invitation: one(invitations, {
		relationName: 'invitationOptions',
		fields: [options.invitationCode],
		references: [invitations.code]
	})
}));

export type Invitation = typeof invitations.$inferSelect;
export type Option = typeof options.$inferSelect;
