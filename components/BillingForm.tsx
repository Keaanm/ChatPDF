"use client"

import { getUserSubscriptionPlan } from "@/lib/stripe"
import { useToast } from "./ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

interface BillingFormProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const BillingForm = ({subscriptionPlan}: BillingFormProps) => {
    const {toast} = useToast()

    const {mutate: createStripeSession, isLoading} = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/createStripeSession')
            if(!res.ok) throw new Error('Failed to create stripe session')
            return await res.json()
        },
        onSuccess: ({url}) => {
            if(url) window.location.href = url;
            if(!url) toast({
                title: 'There was a problem...',
                description: 'Please try again in a moment.',
                variant: 'destructive'
            })
        }
    })  
  return (
    <div className="max-w-5xl mx-auto">
        <form className="mt-12" onSubmit={e => {
            e.preventDefault()
            createStripeSession()
        }}>
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>You are currently on the <strong>{subscriptionPlan.name}</strong> plan.</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
                    <Button type="submit">
                        {isLoading ?  (
                            <Loader2 className="mr-4 h-4 w-4 animate-spin"/>
                        ): null}
                        {subscriptionPlan.isSubscribed ? 'Mange Subscription' : 'Upgrade to PRO'}
                    </Button>

                    {subscriptionPlan.isSubscribed ? (
                        <p className="rounded-full text-xs font-medium">
                            {subscriptionPlan.isCanceled ? 
                            "Your plan will be canceled on" :
                            "Your plan will renew on"}{" "}
                            {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
                        </p>
                        ): null}
                </CardFooter>
            </Card>
        </form>
    </div>
  )
}

export default BillingForm