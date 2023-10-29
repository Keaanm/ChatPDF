import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  return (
    <main className="mb-12 flex  flex-col items-center p-10 md:p-20 text-center space-y-0.5">
        <h1 className='text-4xl font-semibold max-w-4xl md:text-5xl lg:text-6xl mb-12'>
        Revolutionize Your <span className='text-primary'>PDF </span>Experience
        </h1>
        <p className='text-xl font-normal text-slate-600 md:text-2xl lg:text-3xl max-w-prose'>
          ChatPDF allows you to preform semantic search on your documents and chat with them in real time.
          Simpily upload your documents and start chatting with them.
        </p>

        <Link href="/dashboard" className="mt-2">
          <button className=" my-10 bg-primary rounded-lg text-white w-full py-4 px-6 md:px-8 lg:px-10 flex hover:bg-blue-700">
            Get started <ArrowRight className='ml-2 h-5 w-5' />
          </button>
        </Link>

        <div className="max-w-[1364px] w-full border-gray-300 rounded-lg border-8 bg-gray-300">
          <Image src="/assets/dashboard-preview.jpg" 
          width={1364} 
          height={866} 
          quality={100} 
          alt="Dashboard preview" 
          className="rounded-lg bg-white p-2 md:p-8 lg:p-12 object-cover" />
        </div>
    </main>
  )
}
  