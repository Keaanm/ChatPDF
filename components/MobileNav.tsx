"use client"

import { SignOutButton, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'

interface MobileNavProps {
    userId: string | null;
}

const MobileNav = ({userId}: MobileNavProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);

    const router = useRouter()
    const pathname = usePathname();

    const { signOut } = useClerk();

    useEffect(() => {
        if(isOpen) {
            toggleMenu()
        }
    }, [pathname]);

    const closeOnCurrent = (href: string) => {
        console.log(pathname, href)
        if(pathname === href) {
            toggleMenu()
        }
    }

    return (
        <div className="sm:hidden">
            <Menu 
            onClick={() => setIsOpen(!isOpen)}
            className=" relative z-50 h-5 w-5 text-zinc-700"
            />

            {isOpen ? (
                <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
                    <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
                        {!userId ? (
                            <>
                            <li>
                                <Link 
                                className="flex items-center w-full font-semibold text-green-600" 
                                href="/sign-up"
                                onClick={() => closeOnCurrent("/sign-up")}
                                >
                                    Get Started <ArrowRight className="ml-2 h-5 w-5"/>
                                </Link>
                            </li>
                            <li className="my-3 h-px w-full bg-gray-300"/>
                            <li>
                                <Link 
                                className="flex items-center w-full font-semibold" 
                                href="/sign-in"
                                onClick={() => closeOnCurrent("/sign-in")}
                                >
                                    Sign in
                                </Link>
                            </li>
                            <li className="my-3 h-px w-full bg-gray-300"/>
                            <li>
                                <Link 
                                className="flex items-center w-full font-semibold" 
                                href="/pricing"
                                onClick={() => closeOnCurrent("/pricing")}
                                >
                                    Pricing
                                </Link>
                            </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link 
                                    className="flex items-center w-full font-semibold" 
                                    href="/dashboard"
                                    onClick={() => closeOnCurrent("/dashboard")}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="my-3 h-px w-full bg-gray-300"/>
                                <li>
                                    <button 
                                    className="flex items-center w-full font-semibold" 
                                    onClick={() => {
                                        closeOnCurrent("/dashboard")
                                        signOut(() => router.push("/"))
                                    }}
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            ): null}
        </div>
    )
}

export default MobileNav