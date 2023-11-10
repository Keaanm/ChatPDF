import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { absoluteUrl } from '@/lib/utils';
import { db } from '@/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/models/schema';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { PLANS } from '@/lib/config/stripe';

export async function GET(){
    const {userId} = auth();
 
    if(!userId){
      return new Response("Unauthorized from Clerk", { status: 401 });
    }

    // const billingURL = absoluteUrl("/dashboard/billing");
    const billingURL = "http://localhost:3000/dashboard/billing"

    const Users = await db.select().from(users).where(eq(users.user_id, userId)).limit(1);
    const dbUser = Users[0];
    
    if(!dbUser){
        return new Response("Unauthorized from db", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan();

    if(subscriptionPlan.isSubscribed && dbUser.stripeCustomerId){
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: billingURL,
        });
        return NextResponse.json({url: stripeSession.url})
    }

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingURL,
        cancel_url: billingURL,
        payment_method_types: ['card', 'paypal'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        line_items: [
            {
                price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
                quantity: 1,
            }
        ],
        metadata: {
            userId: userId,
        }
    });

    return NextResponse.json({url: stripeSession.url});

}