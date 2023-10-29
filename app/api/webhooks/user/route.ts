import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/drizzle'
import { users } from '@/lib/models/user.model'

    interface UserInfo{
        id: string;
        email_address: string;
        created_at: Date;
    }

    async function handler(request: Request){

    const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET || ""
    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
      }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
        status: 400
        })
    }
    
    // Get the body
    const payload = await request.json()
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
 
    let evt: WebhookEvent
 
  // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
        status: 400
    })
    }
    const {id } = evt.data;
    const eventType = evt.type;
    console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
    console.log('Webhook body:', body)

    if(eventType === 'user.created' || eventType === 'user.updated'){
        const { email_addresses, primary_email_address_id } = evt.data;
        const emailObject = email_addresses?.find((email) => {
            return email.id === primary_email_address_id;
          });
          if (!emailObject) {
            return new Response("Error locating user", {
              status: 400,
            })
          }
          console.log("doing something")
          const updatedAt = new Date(evt.data.updated_at);
        const userInfo: UserInfo = {
            id: evt.data.id,
            email_address: emailObject.email_address,
            created_at: new Date(evt.data.created_at),
        }
        try{
            await db
            .insert(users)
            .values({user_id: userInfo.id, email: userInfo.email_address, createdAt: userInfo.created_at})
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    email: userInfo.email_address,
                    updatedAt: updatedAt,
                },
            })
        }
        catch(error){
            throw new Error(`Error inserting user into database: ${error}`);
        }
    }

 
    return new Response('', { status: 201 })
}
export const GET = handler;
export const POST = handler;
export const PUT = handler;