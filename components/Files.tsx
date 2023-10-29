"use client"
import { useState } from 'react'
import { deleteUserFile} from '@/lib/actions/file.actions'
import {Ghost, Plus, MessageSquare, Trash, Loader2} from 'lucide-react'
import Link from 'next/link'
import {format} from "date-fns"
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { File} from "@/lib/models/schema";
import { useToast } from './ui/use-toast'


type ExtendedFile = File & {textCount: number}

interface PageProps {
    files: ExtendedFile[]
}
const Files = ({files}: PageProps) => {
    const {toast} = useToast()
    const pathname = usePathname()
    const [deletingFile, setDeletingFile] = useState(0)
    const deleteFile = async (fileId: number) => {
        setDeletingFile(fileId)
        const deletedFile = await deleteUserFile(fileId, pathname)
        if(deletedFile){
            toast({
                title: 'File deleted',
                description: 'Your file has been deleted',
            })
        }
        setDeletingFile(0);
    }
  return (
    <>
      {files && files.length > 0 ? (
                <ul className='mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3'>
                    {files.sort((a,b) => new Date(b.createAt).getTime()-
                    new Date(a.createAt).getTime()).map((file) => (
                        <li key={file.id} className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
                            <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
                                <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500'/>
                                    <div className='flex-1 truncate'>
                                        <div className='flex items-center space-x-3'>
                                            <h3 className='truncate text-lg font-medium text-zinc-900'>{file.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs'>
                                <div className='flex items-center gap-2'>
                                    <Plus className="h-4 w-4"/>
                                    {format(new Date(file.createAt), 'dd/MM/yyyy')}
                                </div>

                                <div className='flex items-center gap-2'>
                                <MessageSquare className='h-4 w-4'/>
                                {file.textCount}
                                </div>

                                <Button 
                                className='w-full' 
                                variant="destructive"
                                size='sm'
                                onClick={() => deleteFile(file.id)}
                                >
                                    { deletingFile === file.id ? (
                                        <Loader2 className='h-4 w-4 animate-spin'/>
                                    ) : <Trash className='h-4 w-4'/>}
                                </Button>
                            </div> 
                        </li>
                    ))}
                </ul>
            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    <Ghost className="h-8 w-8 text-zinc-800"/>
                    <h3 className='font-semibold text-xl'>No files uploaded yet</h3>
                    <p>Let&apos;s upload your first PDF.</p>
                </div>
            )}  
    </>
  )
}

export default Files