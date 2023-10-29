"use client"
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

const UpgradeButton = () => {

    const {mutate: createStripeSession} = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/createStripeSession')
            if(!res.ok) throw new Error('Failed to create stripe session')
            return await res.json()
        },
        onSuccess: ({url}) => {
            window.location.href = url ?? "/dashboard/billing"
        }
    })    
    return (
        <Button onClick={() => createStripeSession()} className='w-full'>
            Upgrade now <ArrowRight className='h-5 w-5 ml-1.5'/>
        </Button>
    )
}

export default UpgradeButton