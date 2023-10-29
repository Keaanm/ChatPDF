"use server";

import { auth } from '@clerk/nextjs';
import { db } from "@/drizzle";
import { eq, and, desc, lt, gt, sql} from 'drizzle-orm';
import {files, File, users, User, messages } from '@/lib/models/schema';
import { revalidatePath } from 'next/cache'
import { INFINITE_QUERY_LIMIT } from '../infinite-query';

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

    console.log(userFiles);
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

export async function getFile(key: string){
    console.log(key)
    try{
        const { userId } = auth();
        if (!userId) {
          throw new Error('You must be authenticated');
        }
        const file = await db.select().from(files)
            .where(
                (and(
                eq(files.key, key), 
                eq(files.userId, userId)
            )))
            .limit(1);

        console.log("Fetching file from server: " + file);
        return file[0] as File;
    }
    catch(err){
        console.log(err);
    }
}

export async function getFileUploadStatus(id: number){
    try {
        const { userId } = auth();
        if (!userId) {
          throw new Error('You must be authenticated');
        }
        const file = await db.query.files.findFirst({
            where: (and(
                eq(files.id, id), eq(files.userId, userId)
            ))
        });
        if(!file) return "PENDING" as const;

        return file.uploadStatus;
    } catch (error) {
        console.log(error);
    }
}

export async function getFileMessages(fileId: number, cursor: number | undefined, limit: number | null){
    console.log("this is the cursor: " + cursor)
    console.log("this is the limit: " + limit)
    try{
        const { userId } = auth();
        if (!userId) {
          throw new Error('You must be authenticated');
        }
        const finalLimit = limit ?? INFINITE_QUERY_LIMIT;
        const file = await db.query.files.findFirst({
            where: (and(
                eq(files.id, fileId), eq(files.userId, userId)
            ))
        })
        if(!file) throw new Error('File not found');

        const userMessages = await db.query.messages.findMany({
            where: (and(
                eq(messages.fileId, file.id), gt(messages.id, cursor!)
            )),
            orderBy: desc(messages.createAt),
            limit: finalLimit + 1,
            columns: {
                id: true,
                isUserMessage: true,
                createAt: true,
                text: true,
                streamId: true,
            },
            //cursor: cursor ? {id: cursor} : undefined,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if(userMessages.length > finalLimit){
            const nextItem = userMessages.pop();
            nextCursor = nextItem?.id;
        }

        return {
            messages: userMessages,
            nextCursor: nextCursor
        }
    }
    catch(err){
        console.log(err);
    }
}

