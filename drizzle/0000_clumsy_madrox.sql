CREATE TABLE `care_records` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`type` text DEFAULT 'normal' NOT NULL,
	`created_at` text NOT NULL,
	`elder_id` text NOT NULL,
	`caregiver_id` text NOT NULL,
	FOREIGN KEY (`elder_id`) REFERENCES `elders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`caregiver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `elders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`gender` text DEFAULT 'unknown' NOT NULL,
	`room` text NOT NULL,
	`phone` text,
	`emergency_contact` text NOT NULL,
	`medical_history` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'caregiver' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);