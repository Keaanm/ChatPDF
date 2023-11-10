import {notFound, redirect} from 'next/navigation'
import { auth } from '@clerk/nextjs';
import { getUserFile} from '@/lib/actions/file.actions';
import ChatWrapper from '@/components/chat/ChatWrapper';
import PdfRenderer from '@/components/PdfRenderer';
import { getUserSubscriptionPlan } from '@/lib/stripe';

interface PageProps {
    params: {
        fileId: number
    }
}

const page = async ({params}: PageProps) => {
    const { userId } : { userId: string | null } = auth();
    if(!userId) redirect('/login');
    const {fileId} = params;
    const file = await getUserFile(fileId)
    if(!file) notFound();
    
    const plan = await getUserSubscriptionPlan()
    return (
        <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
            <div className='mx-auto w-full grow lg:flex xl:px-2'>
                <div className='flex-1 xl:flex'>
                    <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
                        <PdfRenderer url={file.url}/>
                    </div>
                </div>

                <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
                    <ChatWrapper
                    fileId={fileId}
                    isSubscribed={plan.isSubscribed}
                    />
                </div>
            </div>
        </div>
    )
}

export default page