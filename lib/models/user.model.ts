import {integer,timestamp, serial, text, pgTable } from "drizzle-orm/pg-core";
import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { relations } from 'drizzle-orm';
import {files} from './schema'

export const users = pgTable('users', {
    id: serial("id").primaryKey(),
    user_id: text("user_id").unique().notNull(),
    email: text("email").unique().notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt"),

    stripeCustomerId: text("stripe customer id").unique(),
    stripeSubscriptionId: text("stripe subscription id").unique(),
    stripePriceId: text("stripe price id"),
    stripeCurrentPeriodEnd: text("stripe product id"),

});

export const userRelations = relations(users, ({many}) => ({
    files: many(files),
}));
export type User = typeof users.$inferSelect;

