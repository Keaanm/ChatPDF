
import { getFileUploadStatus } from '@/lib/actions/file.actions'
import ChatInput from './ChatInput'
import Messages from './Messages'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'

interface ChatWrapperProps {
  fileId: number
}

const ChatWrapper = async ({fileId}: ChatWrapperProps) => {

  const status = await getFileUploadStatus(fileId)

  if(status === 'PROCESSING') return (
    <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 justify-between gap-2'>
      <div className='flex-1 flex justify-center items-center flex-col mb-28'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-500'/>
        <h3 className='font-semibold text-xl'>Loading...</h3>
        <p className='text-zinc-500 text-sm'>
          We&apos;re preparing your PDF.
        </p>
      </div>

      <ChatInput isDisabled/>
    </div>
  )

  if(status === 'FAILED') return (
    <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 justify-between gap-2'>
      <div className='flex-1 flex justify-center items-center flex-col mb-28'>
        <XCircle className='w-8 h-8 text-red-500'/>
        <h3 className='font-semibold text-xl'>
          Too many pages in PDF
          </h3>
        <p className='text-zinc-500 text-sm'>
          Your <span className='font-medium'>Free</span> plan supports up to 5 pages per PDF.
        </p>
        <Link href="/dashboard" className={buttonVariants({
          variant: 'secondary',
          className: 'mt-4'
        })}><ChevronLeft className='h-3 w-3 mr-1.5'/>Back</Link>
      </div>
    </div>
  )

  return (
    <ChatContextProvider fileId={fileId}>
      <div className='relative min-h-full flex bg-zinc-50 divide-y divide-zinc-200 flex-col'>
        <div className='flex-1 flex flex-col justify-between mb-28'>
          <Messages
          fileId={fileId}
          />
        </div>

        <ChatInput/>
      </div>
    </ChatContextProvider>
  )
}

export default ChatWrapper