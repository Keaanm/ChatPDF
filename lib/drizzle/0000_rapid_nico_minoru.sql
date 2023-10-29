CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"created at" timestamp NOT NULL,
	"stripe customer id" text,
	"stripe subscription id" text,
	"stripe price id" text,
	"stripe product id" text,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_stripe customer id_unique" UNIQUE("stripe customer id"),
	CONSTRAINT "users_stripe subscription id_unique" UNIQUE("stripe subscription id")
);
