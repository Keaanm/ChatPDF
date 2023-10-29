DO $$ BEGIN
 CREATE TYPE "uploadStatus" AS ENUM('PENDING', 'PROCESSING', 'FAILED', 'SUCCESS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"uploadStatus" "uploadStatus" DEFAULT 'PENDING',
	"url" text,
	"key" text,
	"userId" text,
	"createAt" timestamp NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "created at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updated at" TO "updatedAt";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file" ADD CONSTRAINT "file_userId_users_user_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
