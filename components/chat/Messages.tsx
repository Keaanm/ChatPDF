"use client"

import { getFileMessages } from '@/lib/actions/file.actions'
import { INFINITE_QUERY_LIMIT } from '@/lib/infinite-query'
import { Loader2, MessageSquare } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { useInfiniteQuery } from '@tanstack/react-query'
import Message from './Message'
import { useContext, useEffect, useRef } from 'react'
import { ChatContext } from './ChatContext'
import {useIntersection} from '@mantine/hooks'

interface MessagesProps {
  fileId: number
}

const Messages = ({fileId}: MessagesProps) => {

  const {isLoading: isAiThinking} = useContext(ChatContext)

const fetchMessages = async ({pageParam = 0}) => {
   return await getFileMessages(fileId, pageParam, INFINITE_QUERY_LIMIT)
}

  const {data, isLoading, fetchNextPage} = useInfiniteQuery({
    queryKey: ['messages', fileId],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    keepPreviousData: true,
  })


  const messages = data?.pages.flatMap((page) => page?.messages)

  const loadingMessage = {
    createdAt: new Date(),
    id: 'loading-message',
    isUserMessage: false,
    streamId: null,
    text: (
      <span className='flex h-full items-center justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </span>
    )
  }
  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? [])
  ]

  const lastMessageRef = useRef<HTMLDivElement>(null)

  const {ref, entry} = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  })

  useEffect(() => {
    if(entry?.isIntersecting){
      fetchNextPage()
    }
  },[entry, fetchNextPage])
  
  return (
    <div className='flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thrumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrolling-touch '>
      {combinedMessages &&  combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {

          const isNextMessageSamePerson = 
          combinedMessages[i - 1]?.isUserMessage === 
          combinedMessages[i]?.isUserMessage

          if(i === combinedMessages.length - 1){
            return <Message
            ref={ref}
            message={message} 
            isNextMessageSamePerson = {
              isNextMessageSamePerson
            }
            key={message!.id} />
          }
          else return <Message
          message={message}
          isNextMessageSamePerson = {
            isNextMessageSamePerson
          }
          key={message!.id}/>
        })
      ) : isLoading ? (
      <div className='w-full flex flex-col gap-2'>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
        <Skeleton className='h-16'/>
      </div>
      ) : (
      <div className='flex-1 flex flex-col items-center justify-center gap-2'>
        <MessageSquare className='h-8 w-8 text-blue-500'/>
        <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
        <p className='text-zinc-500 text-sm'>
          Ask you first question to get started.
        </p>
      </div>
      )}
    </div>
  )
}

export default Messages