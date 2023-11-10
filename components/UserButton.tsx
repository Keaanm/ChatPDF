"use client"

import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {useRouter} from "next/navigation"

const UserButton1 = () => {
  const router = useRouter()
  const {signOut} = useClerk()
  return (
    <>
    <Link href="user-profile">Settings</Link>
    <button onClick={() => signOut(() => router.push("/"))}>Sign Out</button>
    </>
  )
}

export default UserButton1