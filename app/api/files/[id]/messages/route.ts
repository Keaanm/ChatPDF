import { db } from "@/drizzle";
import { INFINITE_QUERY_LIMIT } from "@/lib/infinite-query";
import { files, messages } from "@/lib/models/schema";
import { auth } from "@clerk/nextjs";
import { and, desc, eq, gt } from "drizzle-orm";
import { NextResponse, NextRequest  } from "next/server";

export async function GET(req: NextRequest, {params}: {
    params: {
        id: number
    }
}){
try{
    const { userId } = auth();
    if (!userId) {
        throw new Error('You must be authenticated');
    }
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('cursor')
    const cursor = parseInt(query!);
    
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { id } = params;
        const filesQuery = await db.select()
        .from(files)
        .where(and(
            eq(files.id, id), eq(files.userId, userId)
        ))
        .limit(1)
        
        const file = filesQuery[0];
        if(!file){
            return new NextResponse("File not found", { status: 404 });
        }

        const limit = INFINITE_QUERY_LIMIT;
        const userMessages = await db.query.messages.findMany({
            where: (and(
                eq(messages.fileId, file.id), gt(messages.id, cursor)
            )),
            orderBy: desc(messages.createAt),
            limit: limit + 1,
            columns: {
                id: true,
                isUserMessage: true,
                createAt: true,
                text: true,
                streamId: true,
            },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if(userMessages.length > limit){
            const nextItem = userMessages.pop();
            nextCursor = nextItem?.id;
        }
        
        return NextResponse.json(
            {
            messages: userMessages,
            nextCursor: nextCursor
            }
        )
    }
    catch(error){
        console.log("[FILES/[ID]/MESSAGES]", error)
        return new NextResponse("Something went wrong", { status: 500 })
    }
}