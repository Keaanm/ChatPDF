import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs"; 
import { db } from "@/drizzle";
import {files, File} from "@/lib/models/schema";
import { revalidatePath } from "next/cache";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {pinecone} from "@/lib/pinecone";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { eq, and } from 'drizzle-orm';
import { client } from "@/lib/weaviate";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/lib/config/stripe";
const f = createUploadthing();
 
const getUser = async () => await currentUser();

const middleware = async () => {
      // This code runs on your server before upload
      const user = await getUser();
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      const subscriptionPlan = await getUserSubscriptionPlan();
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { subscriptionPlan, userId: user.id };
}
 
  const onUploadComplete = async ({
    metadata,
    file,
  }: {
    metadata: Awaited<ReturnType<typeof middleware>>
    file: {
      key: string
      name: string
      url: string
    }
  }) => {
    // This code RUNS ON YOUR SERVER after upload
    console.log("Upload complete for userId:", metadata.userId);

    console.log("file url", file.url);

    const isFileExist = await db.select().from(files).where(eq(files.key, file.key));
    if (isFileExist) return

    const [createdFile] = await db.insert(files).values({
      name: file.name,
      url: `https://uploadthing-prod.s3.amazonaws.com/${file.key}`,
      key: file.key,
      userId: metadata.userId,
      createAt: new Date(),
      uploadStatus: 'PROCESSING'
    }).returning();
  
    revalidatePath('/dashboard');
    
    try{
    const response = await fetch(`https://uploadthing-prod.s3.amazonaws.com/${file.key}`);
    const blob = await response.blob();

    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();

    const pagesAmt = pageLevelDocs.length;

    const {subscriptionPlan} = metadata;
    const {isSubscribed} = subscriptionPlan;

    const isProExceeded = pagesAmt > PLANS.find(plan => plan.name === "Pro")!.pagesPerPef;
    const isFreeExceeded = pagesAmt > PLANS.find(plan => plan.name === "Free")!.pagesPerPef;

    if(isSubscribed && isProExceeded || !isSubscribed && isFreeExceeded){
      await db.update(files).set({uploadStatus: "FAILED"}).where(eq(files.id, createdFile.id));
    }

    const pineconeIndex = pinecone.Index("chatpdf")
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, 
      {
      pineconeIndex,
    });

    //try to migrate to weaviate

    await WeaviateStore.fromDocuments(pageLevelDocs, embeddings, {
      client,
      indexName: `Chatpdf${createdFile.id}`,
      textKey: 'test',
    })

    await db.update(files).set({uploadStatus: "SUCCESS"}).where(eq(files.id, createdFile.id));

    } catch (error) {
      console.log(error);
      await db.update(files).set({uploadStatus: "FAILED"}).where(eq(files.id, createdFile.id));
    }

  };
 
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter