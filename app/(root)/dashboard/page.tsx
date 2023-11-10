import Dashboard from '@/components/Dashboard'
import { Suspense } from 'react'
import Skeleton from "react-loading-skeleton";
const Page = () => {
  
  return (
    <Suspense fallback={<Skeleton height={100} className='my-2' count={3}/>}>
      <Dashboard/>
    </Suspense>
  )
}

export default Page