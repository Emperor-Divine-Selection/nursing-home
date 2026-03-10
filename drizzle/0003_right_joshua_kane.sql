CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`room_number` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_room_number_unique` ON `rooms` (`room_number`);--> statement-breakpoint
ALTER TABLE `beds` ADD `room_id` text REFERENCES rooms(id);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_room_bed` ON `beds` (`room_id`,`bed_number`);--> statement-breakpoint
ALTER TABLE `beds` DROP COLUMN `room_number`;--> statement-breakpoint
ALTER TABLE `beds` DROP COLUMN `type`;--> statement-breakpoint
ALTER TABLE `elders` ADD `room_id` text REFERENCES rooms(id);--> statement-breakpoint
ALTER TABLE `elders` DROP COLUMN `room`;