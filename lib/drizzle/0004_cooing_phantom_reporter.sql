CREATE TABLE IF NOT EXISTS "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"isUserMessage" boolean NOT NULL,
	"fileId" integer,
	"userId" text,
	"createAt" timestamp NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_fileId_file_id_fk" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_userId_users_user_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
