"use client"

import { createContext, useRef, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'

type Messages = InfiniteData<{
    messages: {
        id: number;
        createAt: Date;
        text: string;
        isUserMessage: boolean;
        streamId: string | null;
    }[]
    nextCursor: number;
  } | undefined> | undefined;

type StreamResponse = {
    addMessage: () => void
    message: string,
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    isLoading: boolean,
}
export const ChatContext = createContext<StreamResponse>({
    addMessage: () => {},
    message: '',
    handleInputChange: () => {},
    isLoading: false,
})

interface Props{
    fileId: number,
    children: React.ReactNode
}
export const ChatContextProvider = ({fileId, children}: Props) => {
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {toast} = useToast();

    const utils = useQueryClient();

    const backupMessage = useRef('');
    
    const {mutate: sendMessage} = useMutation({
        mutationFn: async ({message}: {message: string}) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({
                    fileId,
                    message
                })
            })

            if(!response.ok){
                throw new Error('Failed to send message');
            }

            return response.body;
        },
        onMutate: async ({message}) => {
            backupMessage.current = message;
            setMessage('')
            
           await utils.cancelQueries(['messages', fileId]);

           const previousMessages = utils.getQueryData<Messages>(['messages', fileId]);

           utils.setQueryData<Messages>(
            ['messages', fileId], 
            (old) => {
                if(!old) {
                    return {
                        pages: [],
                        pageParams: [],
                    }
                }
               let newPages = [...old.pages]

               let latestPage = newPages[0]!

               latestPage.messages = [
                     {
                        id: Math.random(),
                        text: message,
                        isUserMessage: true,
                        createAt: new Date(),
                        streamId: null,
                     },
                     ...latestPage.messages
                ]
                
                newPages[0] = latestPage;

                return {
                    ...old,
                    pages: newPages
                }
              });

              setIsLoading(true);

              return {
                previousMessages: previousMessages?.pages.flatMap((page) => page?.messages ?? [])
            };
        },
        onSuccess: async (stream) => {
            setIsLoading(false);

            if(!stream){
                return toast({
                    title: 'There was a problem sending your message',
                    description: 'Please refresh the page and try again',
                    variant: 'destructive' 
                })
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let done = false;

            //accumated response

            let accResponse = '';

            while(!done){
                const {value, done: doneReading} = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);

                accResponse += chunkValue;
                console.log(accResponse)

                //append the chucnk to the message
                utils.setQueryData<Messages>(
                    ['messages', fileId],
                    (old) => {
                        if(!old){
                            return {
                                pages: [],
                                pageParams: [],
                            }
                        }

                        let isAiResponseCreate = old.pages.some(
                            (page) => page?.messages.some((message) => message.streamId === 'ai-response')
                            )
                            let updatedPages = old.pages.map((page) => {
                                if(page === old.pages[0]){
                                    let updatedMessages

                                    if(!isAiResponseCreate){
                                        updatedMessages = [
                                            {
                                                id: Math.random(),
                                                createdAt: new Date(),
                                                text: accResponse,
                                                isUserMessage: false,
                                                streamId: 'ai-response',
                                            },
                                            ...page!.messages
                                        ]
                                    }
                                    else{
                                        updatedMessages = page?.messages.map((message) => {
                                            if(message.streamId === 'ai-response'){
                                                return {
                                                    ...message,
                                                    text: accResponse
                                                }
                                            }
                                            return message;
                                        })
                                    }

                                    return {
                                        ...page,
                                        messages: updatedMessages
                                    }
                                }

                                return page;
                            })

                            return {
                                ...old, 
                                pages: updatedPages
                            }
                    }
                    )

            }
        },
        onError: (_, __, context) => {
            setMessage(backupMessage.current);
            utils.setQueryData(['messages', fileId], () => context?.previousMessages)
        },
        onSettled: async () => {
            setIsLoading(false);

            await utils.invalidateQueries(['messages', fileId]);
        },
    })


    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    }
    const addMessage = () => sendMessage({message});

    return (
        <ChatContext.Provider value={{
            addMessage,
            message,
            handleInputChange,
            isLoading
        }}>
            {children}
        </ChatContext.Provider>
    )

}