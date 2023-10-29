import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server"
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { db } from "@/drizzle";
import { eq, and, desc } from "drizzle-orm";
import { files, messages, users } from "@/lib/models/schema";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { openai } from "@/lib/openai";
import {OpenAIStream, StreamingTextResponse} from "ai"

import { WeaviateStore } from 'langchain/vectorstores/weaviate';;
import { client } from '@/lib//weaviate';

export const POST = async(req: NextRequest) => {
    const { userId } = auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

    const body = await req.json()

    //const { fileId, message} = SendMessageValidator.parse(body);
    const {fileId, message} = body;

    const file = await db.query.files.findFirst({
        where: (and(
            eq(files.id, fileId), eq(files.userId, userId)
        )) 
    });

    if(!file){
        return new Response("File not found in client", { status: 404 });
    }

    await db.insert(messages).values({
        text: message,
        isUserMessage: true,
        userId: userId,
        fileId: fileId,
        createAt: new Date()
    })

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY!,
      });

      //With pinecone

      // const pineconeIndex = pinecone.Index("chatpdf")

      // const vectorStore = await PineconeStore.fromExistingIndex(embeddings,{
      //   pineconeIndex,
      // })

      // const results = await vectorStore.similaritySearch(message, 4)

      //try to use weaviate

      const vectorStore = await WeaviateStore.fromExistingIndex(embeddings, {
        client,
        indexName: `Chatpdf${fileId}`,
        textKey: 'test',
      });

      const results = await vectorStore.similaritySearch(message, 2);
      console.log(results);



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