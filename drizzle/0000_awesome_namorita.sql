CREATE TABLE `beds` (
	`id` text PRIMARY KEY NOT NULL,
	`room_number` text NOT NULL,
	`bed_number` text NOT NULL,
	`type` text DEFAULT 'standard' NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `care_records` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`type` text DEFAULT 'normal' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`scheduled_at` text,
	`completed_at` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
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
	`bed_id` text,
	`phone` text,
	`emergency_contact` text NOT NULL,
	`medical_history` text,
	`status` text DEFAULT 'active' NOT NULL,
	`admitted_at` text NOT NULL,
	`discharged_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`bed_id`) REFERENCES `beds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `health_records` (
	`id` text PRIMARY KEY NOT NULL,
	`elder_id` text NOT NULL,
	`caregiver_id` text NOT NULL,
	`blood_pressure` text,
	`blood_sugar` integer,
	`heart_rate` integer,
	`temperature` integer,
	`weight` integer,
	`notes` text,
	`alert` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`elder_id`) REFERENCES `elders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`caregiver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'caregiver' NOT NULL,
	`name` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);