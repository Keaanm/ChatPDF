'use client'
import {useState} from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import Dropzone from 'react-dropzone'
import { Cloud,File } from 'lucide-react'
import { Progress } from './ui/progress'
import { useUploadThing } from '@/lib/uploadthing'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import { getFile } from '@/lib/actions/file.actions'
import { useMutation } from '@tanstack/react-query'

const UploadDropZone = ({isSubscribed}: {isSubscribed: boolean}) => {

    const [isUpLoading, setIsUpLoading] = useState(true)
    const [uploadProgress, setUploadProgress] = useState(0)
    const {startUpload} = useUploadThing(
        isSubscribed ? 'proPlanUploader' : 'freePlanUploader'
    )
    const {toast} = useToast()
    const router = useRouter()

    const mutation = useMutation({
        mutationKey: ['file'],
        mutationFn: (key: string) => getFile(key),
        onSuccess: (file) => {
            router.push(`/dashboard/${file!.id}`);
        },
        retry: true,
        retryDelay: 500,
    })

    const startSimulatedProgress = () => {
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((oldProgress) => {
                if(oldProgress >= 95){
                    clearInterval(interval);
                    return oldProgress;
                }
                return oldProgress + 5;
            });
        }, 500);

        return interval;
    }

    return (
    <Dropzone multiple={false} onDrop={ async (acceptedFile) => {
        setIsUpLoading(true)

        const progressInterval = startSimulatedProgress()

        const res = await startUpload(acceptedFile)

        if(!res) {
            return toast({
                title: 'Something went wrong uploading',
                description: 'Please try again later',
                variant: 'destructive',
            })
        }

        const [fileResponse] = res;

        const key = fileResponse?.key
        if(!key){
            return toast({
                title: 'Something went wrong, key not found',
                description: 'Please try again later',
                variant: 'destructive',
            })
        }

        clearInterval(progressInterval)
        setUploadProgress(100);
        
        mutation.mutate(key)

        console.log("file from the client: " + mutation.data)

    }}>
        {({getRootProps, getInputProps, acceptedFiles}) => (
            <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
                <label htmlFor='dropzone-file' className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <Cloud className="h-6 w-6 text-zinc-500 mb-2"/>
                        <p className='mb-2 text-sm text-zinc-700'>
                            <span className='font-semibold'>
                                Click to Upload
                            </span>
                            {" "}or drag and drop
                        </p>
                        <p className='text-xs text-zinc-500'>PDF (up to {isSubscribed ? "16" : "4"}MB)</p>
                    </div>
                    {acceptedFiles && acceptedFiles[0] ? (
                        <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                            <div className='px-3 py-2 h-full grid place-items-center'>
                                <File className='h-4 w-4 text-blue-500'/>
                            </div>
                            <div className='px-3 py-2 h-full text-sm truncate'>
                                {acceptedFiles[0].name}
                            </div>
                        </div>
                    ): null}
                    

                    {isUpLoading ? (
                        <div className='w-full mt-4 max-w-xs mx-auto'>
                            <Progress className='h-1 w-full bg-zinc-200' value={uploadProgress}/>
                        </div>
                    ) : null}

                    <input type='file '{...getInputProps()} id='dropzone-file' className='hidden'/>
                </label>
            </div>
        )}
    </Dropzone>
    )
}

const UploadButton = ({isSubscribed}: {isSubscribed: boolean}) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={v => {
            if(!v) setIsOpen(v)
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Upload PDF</Button>
            </DialogTrigger>

            <DialogContent>
                <UploadDropZone isSubscribed={isSubscribed}/>
            </DialogContent>
        </Dialog>
    )
    }
export default UploadButton