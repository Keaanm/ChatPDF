"use server";

import { auth } from '@clerk/nextjs';
import { db } from "@/drizzle";
import { eq, and, sql} from 'drizzle-orm';
import {files, messages } from '@/lib/models/schema';
import { revalidatePath } from 'next/cache'

export async function getUserFiles(){
    try{
        const { userId } = auth();
    if (!userId) {
      throw new Error('You must be authenticated');
    }

    const userFiles = await db.selectDistinctOn([files.id],{
        userId: files.userId,
        id: files.id,
        name: files.name,
        url: files.url,
        key: files.key,
        uploadStatus: files.uploadStatus,
        createAt: files.createAt,
        updatedAt: files.updatedAt,
        textCount: sql<number>`COUNT(${messages.text})`
    })
    .from(files)
    .leftJoin(messages, eq(messages.fileId, files.id, ))
    .where(eq(files.userId, userId))
    .groupBy(files.userId, files.id, files.name, files.url, files.key, files.uploadStatus, files.createAt, files.updatedAt)
    .limit(10)

    
    return userFiles;
    }
    catch(err){
        console.log(err);
    }
}

export async function deleteUserFile(fileId: number, pathname: string){
    try{
        const { userId } = auth();
    if (!userId) {
      throw new Error('You must be authenticated');
    }
    const deletedFile = await db.delete(files).where(eq(files.id, fileId)).returning({name: files.name});
    revalidatePath(pathname)
    return deletedFile;
    }
    catch(err){
        console.log(err);
    }
    

}

export async function getUserFile(fileId: number){
    try{
        const { userId } = auth();
    if (!userId) {
      throw new Error('You must be authenticated');
    }
    const file = await db.query.files.findFirst({
        where: (and(
            eq(files.id, fileId), eq(files.userId, userId)
        ))
    })
    return file;
    }
    catch(err){
        console.log(err);
    }
}



