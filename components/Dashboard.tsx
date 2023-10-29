import React, {Suspense} from 'react'
import UploadButton from './UploadButton'
import { getUserFiles } from '@/lib/actions/file.actions'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Skeleton from "react-loading-skeleton";
import Files from './Files'
import Loading from '@/app/(root)/dashboard/loading'
import { getUserSubscriptionPlan } from '@/lib/stripe'

const Dashboard = async () => {
    const { userId } : { userId: string | null } = auth();
    if(!userId) redirect('/login');
    const files = await getUserFiles() || [];
    const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <main className='mx-auto max-w-7xl md:p-10'>
        <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 sm:flex-row sm:items-center sm:gap-0'>
            <h1 className='mt-3 font-bold text-5xl text-gray-900'>My Files</h1>

            <UploadButton isSubscribed={subscriptionPlan.isSubscribed}/>
        </div>

        <Suspense fallback={<Loading/>}>
            <Files files={files}/>
        </Suspense>
    </main>
  )
}

export default Dashboard