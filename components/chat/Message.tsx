import { ExtendedMessage } from '@/types/message'
import React from 'react'
import { Icons } from '../Icons'
import ReactMarkdown from 'react-markdown'
import format from 'date-fns/format'
import { forwardRef } from 'react'

interface MessageProps {
    message: ExtendedMessage
    isNextMessageSamePerson: boolean
    }

const Message = forwardRef<HTMLDivElement, MessageProps>(({message, isNextMessageSamePerson}, ref) => {
    console.log(message.createAt)
  return (
    <div ref={ref} className={`flex items-end ${message.isUserMessage ? 'justify-end' : ''}`}>
        <div className={`relative flex h-6 w-6 aspect-square items-center justify-center 
        ${message.isUserMessage ? 'order-2 bg-blue-500 rounded-sm' : 'order-1 bg-zinc-800 rounded-sm'} 
        ${isNextMessageSamePerson && 'invisible'}`}>
            {message.isUserMessage ? (
                <Icons.user className='fill-zinc-200 text-zinc-200 h-3/4 w-3/4'/>
            ) : (
                <Icons.logo className='fill-zinc-300 h-3/4 w-3/4'/>
            )}
        </div>

        <div className={`flex flex-col space-y-2 text-base max-w-md mx-2 first-letter
        ${message.isUserMessage ? 'order-1 items-end' : 'order-2 items-start'}`}>
            <div className={`px-4 py-2 rounded-lg inline-block first-letter
            ${message.isUserMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}
            ${!isNextMessageSamePerson && !message.isUserMessage ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {typeof message.text === 'string' ? (
                <ReactMarkdown className={`prose ${message.isUserMessage && 'text-white'}`}>
                    {message.text}
                </ReactMarkdown>
                ): (
                    message.text
                )}
                {message.id !== 'loading-message' ? (
                    <div className={`text-xs select-none mt-2 w-full text-right
                    ${message.isUserMessage ? 'text-white' : 'text-black'}`}>
                        {message.createAt ? format(new Date(message.createAt), 'HH:mm') : ''} 
                    </div>
                ): null}
            </div>
        </div>
    </div>
  )
}
)

Message.displayName = 'Message'

export default Message