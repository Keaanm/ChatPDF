import { db } from "@/drizzle";
import { files } from "@/lib/models/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {
    params: {
        id: number
    }
}){
    try{
        const { userId } = auth();
        if (!userId) {
        return new NextResponse("You must be authenticated", { status: 401 });
        }
        const file = await db.query.files.findFirst({
            where: (and(    
                eq(files.id, params.id), eq(files.userId, userId)
            ))
        })
        return NextResponse.json(file);
    }
    catch(err){
        console.log(err);
    }
}