"use server";

import { auth, currentUser } from '@clerk/nextjs';
import { db } from "@/drizzle";
import { eq, and, desc, lt, gt} from 'drizzle-orm';
import {files, File, users, User, messages } from '@/lib/models/schema';
import { revalidatePath } from 'next/cache'
import { sql } from 'drizzle-orm' 

export async function fetchUser(){

    const { userId } : { userId: string | null } = auth();
    if(!userId) return null;

    const Users = await db.select().from(users).where(eq(users.user_id, userId)).limit(1);
    const dbUser = Users[0];
    return dbUser;
}