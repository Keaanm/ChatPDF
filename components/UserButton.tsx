"use client"
import { UserButton } from "@clerk/clerk-react"

const UserButton1 = () => {
  return (
    <UserButton
    afterSignOutUrl="/"
    />
  )
}

export default UserButton1