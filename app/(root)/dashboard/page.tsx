import React from 'react'
import { SignOutButton, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs'
import Dashboard from '@/components/Dashboard'
const page = async () => {
  const user = await currentUser()
  console.log(user?.id)
  return (
    <Dashboard/>
  )
}

export default page