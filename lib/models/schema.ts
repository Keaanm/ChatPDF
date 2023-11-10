import {integer,timestamp, serial, text, pgTable, pgEnum, boolean, varchar} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial("id").primaryKey(),
    user_id: text("user_id").unique().notNull(),
    email: text("email").unique().notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt"),

    stripeCustomerId: text("stripe customer id").unique(),
    stripeSubscriptionId: text("stripe subscription id").unique(),
    stripePriceId: text("stripe price id"),
    stripeCurrentPeriodEnd: timestamp("stripe current period end"),

});

export const userRelationsFile = relations(users, ({many}) => ({
    files: many(files),
}));
export const userRelationsMessage = relations(users, ({many}) => ({
    messages: many(messages),
}));
export type User = typeof users.$inferSelect;


export const UploadEnum = pgEnum('uploadStatus', ['PENDING', 'PROCESSING', 'FAILED', 'SUCCESS'])

export const files = pgTable('file', {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),

    uploadStatus: UploadEnum('uploadStatus').default('PENDING'),

    url: text("url").notNull(),
    key: text("key").notNull(),

    userId: text("userId").references(() => users.user_id),
    createAt: timestamp("createAt").notNull(),
    updatedAt: timestamp("updatedAt"),

});

export const fileRelationsUser = relations(files, ({one}) => ({
    author: one(users, {
        fields: [files.userId],
        references: [users.user_id],
    }),
}));
export const fileRelationsMessage = relations(files, ({many}) => ({
    messages: many(messages),
}));

export type File = typeof files.$inferSelect;

export const messages = pgTable('message', {
    id: serial("id").primaryKey(),
    text: text("text").notNull(),

    isUserMessage: boolean("isUserMessage").notNull(),

    fileId: integer("fileId").references(() => files.id),
    userId: text("userId").references(() => users.user_id),
    createAt: timestamp("createAt").notNull(),
    updatedAt: timestamp("updatedAt"),
    streamId: varchar('streamId', { length: 256 }),

});

export const messagesRelationsUser = relations(messages, ({one}) => ({
    author: one(users, {
        fields: [messages.userId],
        references: [users.user_id],
    }),
}));

export const messagesRelationsFile = relations(messages, ({one}) => ({
    author: one(files, {
        fields: [messages.fileId],
        references: [files.id],
    }),
}));

export type Message = typeof messages.$inferSelect;