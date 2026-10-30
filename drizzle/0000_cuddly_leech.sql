CREATE TABLE `invitations` (
	`code` text PRIMARY KEY NOT NULL,
	`invitee_name` text NOT NULL,
	`theme` text DEFAULT 'romantic' NOT NULL,
	`created_at` integer NOT NULL,
	`viewed_at` integer,
	`answered_at` integer,
	`chosen_option_id` integer,
	`no_attempts` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invitation_code` text NOT NULL,
	`label` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`invitation_code`) REFERENCES `invitations`(`code`) ON UPDATE no action ON DELETE cascade
);
