import { db } from "@/drizzle";
import { files } from "@/lib/models/schema";
import { auth } from "@clerk/nextjs";
import { eq,and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {
    key: string
}}){
    try{
        const { userId } = auth();
        if (!userId) {
          throw new Error('You must be authenticated');
        }
        const file = await db.select().from(files)
            .where(
                eq(files.key, params.key), 
            )
            .limit(1);
        if(!file[0]) return new NextResponse("File not found", {status: 404});
        
       return NextResponse.json(file[0]);
    }
    catch(err){
        console.log("UPLOAD/FILES/KEY", err);
        return new NextResponse("Failed to fetch file", {status: 500});
    }
}