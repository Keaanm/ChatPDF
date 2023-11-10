
import Link from "next/link"
import { RedirectToSignIn, auth, useClerk } from '@clerk/nextjs';
import UserButton1 from "./UserButton";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import MobileNav from "./MobileNav";

const Header = async () => {
  const { userId } = auth()
  const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <nav className="sticky inset-x-0 p-6 w-full border-b border-gray-200 bg-white backdrop-blur-md top-0 z-10">
        <div className="flex justify-between items-center">
          <Link href={userId ? "/dashboard" : "/"} className="z-40 font-bold text-3xl text-primary">Chat<span className="text-slate-300">PDF</span></Link>
        <div className="max-md:hidden">
          { !userId ? <div className="space-x-5 ml-auto">
            <Link href="/pricing" className="z-40 font-normal text-xl">Pricing</Link>
            <Link href="sign-in" className=' z-40 font-normal text-xl'>Sign In</Link>
            <Link href="/sign-up" className='z-40 font-normal text-xl'>Sign Up</Link>
            </div> :
            <div className="ml-auto space-x-5 flex items-center justify-between">
              <Link href={subscriptionPlan.isSubscribed ? "/dashboard/billing" : "/pricing"}>{subscriptionPlan.isSubscribed ? "Manage Subscription" : "Pricing"}</Link>
              <UserButton1 />
            </div>
            }
        </div>
          <MobileNav userId={userId} />
        </div>

    </nav>
  )
}

export default Header