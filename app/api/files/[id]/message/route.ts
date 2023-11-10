import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server"
import { db } from "@/drizzle";
import { eq, and, desc } from "drizzle-orm";
import { files, messages, users } from "@/lib/models/schema";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { openai } from "@/lib/openai";
import {OpenAIStream, StreamingTextResponse} from "ai"

import { WeaviateStore } from 'langchain/vectorstores/weaviate';;
import {client} from '@/lib/weaviate';

export const POST = async(req: NextRequest, {params}: {params: {id: number}}) => {
    const { userId } = auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

    const body = await req.json()

    const {message} = body;

    const file = await db.query.files.findFirst({
        where: (and(
            eq(files.id, params.id), eq(files.userId, userId)
        )) 
    });

    if(!file){
        return new Response("File not found in client", { status: 404 });
    }

    await db.insert(messages).values({
        text: message,
        isUserMessage: true,
        userId: userId,
        fileId: params.id,
        createAt: new Date()
    })

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY!,
      });

      const vectorStore = await WeaviateStore.fromExistingIndex(embeddings, {
        client,
        indexName: "ChatpdfV11",
        textKey : "text",
        tenant: `Chatpdf${file.id}`
      });

      const results = await vectorStore.similaritySearch(message, 2);
    //   console.log("result of simularity search", results);

      const prevMessages = await db.query.messages.findMany({
            where: eq(messages.fileId, file.id),
            orderBy: [desc(messages.createAt)],
            limit: 6,
      })

      const formattedPrevMessages = prevMessages.map((message) => ({
        role: message.isUserMessage ? "user" as const : "assistant" as const,
        content: message.text,
      }));


      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        stream: true,
        messages: [
            {
              role: 'system',
              content:
                'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
              role: 'user',
              content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
              
        \n----------------\n
        
        PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
          if (message.role === 'user') return `User: ${message.content}\n`
          return `Assistant: ${message.content}\n`
        })}
        
        \n----------------\n
        
        CONTEXT:
        ${results.map((r) => r.pageContent).join('\n\n')}
        
        USER INPUT: ${message}`,
            },
          ],

      });

      const stream = OpenAIStream(response, {
        async onCompletion(completion){
            await db.insert(messages).values({
                text: completion,
                isUserMessage: false,
                fileId: file.id,
                userId: file.userId,
                createAt: new Date(),
            })
        }
      });

      return new StreamingTextResponse(stream)
}