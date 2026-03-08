PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_elders` (
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
	FOREIGN KEY (`bed_id`) REFERENCES `beds`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_elders`("id", "name", "age", "gender", "room", "bed_id", "phone", "emergency_contact", "medical_history", "status", "admitted_at", "discharged_at", "created_at", "updated_at") SELECT "id", "name", "age", "gender", "room", "bed_id", "phone", "emergency_contact", "medical_history", "status", "admitted_at", "discharged_at", "created_at", "updated_at" FROM `elders`;--> statement-breakpoint
DROP TABLE `elders`;--> statement-breakpoint
ALTER TABLE `__new_elders` RENAME TO `elders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `elders_bed_id_unique` ON `elders` (`bed_id`);