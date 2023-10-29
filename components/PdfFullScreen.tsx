
import React, {useState} from 'react'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import { Expand, Loader2 } from 'lucide-react'
import SimpleBar from 'simplebar-react'
import { useToast } from './ui/use-toast'
import { useResizeDetector } from 'react-resize-detector'
import {Document, Page} from "react-pdf"

interface PdfFullScreenProps{
    fileUrl: string
}

const PdfFullScreen = ({fileUrl}: PdfFullScreenProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const {toast} = useToast();
    const [numPages, setNumPages] = useState<number>()
    const {width, ref} = useResizeDetector()
  return (
    <Dialog 
    open={isOpen} 
    onOpenChange={(v) => {
        if(!v) setIsOpen(v);
    }}
    >
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
            <Button 
            aria-label='full screen' 
            variant="ghost" 
            className='gap-1.5'
            >
                <Expand className='h-4 w-4'/>
            </Button>
        </DialogTrigger>

        <DialogContent className='max-w-7xl w-full'>
            <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
            <div ref={ref}>
              <Document loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 animate-spin"/>
                </div>
              }
              onLoadError={() => toast({
                title: 'Error',
                description: 'An error occurred while loading the file',
                variant: 'destructive'
              })
              }
              onLoadSuccess={({numPages}) => setNumPages(numPages)}
              file={fileUrl} className="min-h-full">
                {new Array(numPages).fill(0).map((_, i) => (
                    <Page key={i} pageNumber={i + 1} width={width ? width : 1}/>
                ))}
              </Document>
            </div>
            </SimpleBar>
        </DialogContent>
    </Dialog>
  )
}

export default PdfFullScreen