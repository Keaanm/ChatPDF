import UpgradeButton from '@/components/UpgradeButton';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PLANS } from '@/lib/config/stripe';
import { auth } from '@clerk/nextjs';
import { ArrowRight, Check, HelpCircle, Minus } from 'lucide-react';
import Link from 'next/link';

const Page = () => {

    const { userId } : { userId: string | null } = auth();

    const pricingItems = [
        {
          plan: 'Free',
          tagline: 'For small side projects.',
          quota: 10,
          features: [
            {
              text: '5 pages per PDF',
              footnote: 'The maximum amount of pages per PDF-file.',
            },
            {
              text: '4MB file size limit',
              footnote: 'The maximum file size of a single PDF file.',
            },
            {
              text: 'Mobile-friendly interface',
            },
            {
              text: 'Higher-quality responses',
              footnote: 'Better algorithmic responses for enhanced content quality',
              negative: true,
            },
            {
              text: 'Priority support',
              negative: true,
            },
          ],
        },
        {
          plan: 'Pro',
          tagline: 'For larger projects with higher needs.',
          quota: PLANS.find((p) => p.slug === 'pro')!.quota,
          features: [
            {
              text: '25 pages per PDF',
              footnote: 'The maximum amount of pages per PDF-file.',
            },
            {
              text: '16MB file size limit',
              footnote: 'The maximum file size of a single PDF file.',
            },
            {
              text: 'Mobile-friendly interface',
            },
            {
              text: 'Higher-quality responses',
              footnote: 'Better algorithmic responses for enhanced content quality',
            },
            {
              text: 'Priority support',
            },
          ],
        },
      ];

    return (
        <div className='mb-8 mt-12 text-center lg:mt-10 max-w-5xl mx-auto max-h-[calc(100vh-2rem)]'>
            <div className='mx-auto mb-10 max-w-lg md:max-w-2xl lg:max-w-4xl'>
                <h1 className='text-6xl font-bold sm:text-7xl'>
                    Pricing
                </h1>
                <p className='mt-5 text-gray-600 sm:text-lg'>
                    Whether you&apos;re just trying out our service or you&apos;re a seasoned pro, we have a plan for you.
                </p>

                <div className='pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
                    <TooltipProvider>
                        {pricingItems.map(({plan, tagline, quota, features}) => {
                            const price = PLANS.find((p) => p.slug === plan.toLowerCase())!.price.amount || 0;

                            return (
                            <div key={plan} className={`relative rounded-2xl bg-white shadow-lg 
                            ${plan === "Pro" ? "border-2 border-blue-500 shadow-blue-200" : 
                            "border border-gray-200" }`}>
                                {plan === "Pro" && (
                                    <div className='absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-light'>
                                        Upgrade now
                                    </div>
                                )}

                                <div className='my-5'>
                                    <h3 className='my-3 text-center font-display text-2xl font-bold'>
                                        {plan}
                                    </h3>
                                    <p className='text-gray-500'>{tagline}</p>
                                    <p className='my-5 font-display text-6xl font-semibold'>{price}</p>
                                    <p className='text-gray-500'>per month</p>
                                </div>

                                <div className='flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50'>
                                    <div className='flex items-center space-x-1'>
                                        <p>{quota.toLocaleString()} PDFs/mo included</p>

                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger className='cursor-default ml-1.5'>
                                                <HelpCircle className='w-4 h-4 text-zinc-500' />
                                            </TooltipTrigger>

                                            <TooltipContent className='w-80 p-2'>
                                                How many PDFs you can upload per month
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                <ul className='my-10 space-y-5 px-8'>
                                    {features.map(({text, footnote, negative}) => (
                                        <li key={text} className='flex space-x-5'>
                                            <div className='flex-shrink-0'>
                                                {negative ? (
                                                    <Minus className='h-6 w-6 text-gray-300'/>
                                                ) : (
                                                    <Check className='h-6 w-6 text-blue-500'/>
                                                )}
                                            </div>
                                            {footnote ? (
                                                <div className='flex items-center space-x-1'>
                                                    <p className={`${negative ? 'text-gray-600 ' : 'text-gray-400'}`}>
                                                        {text}
                                                    </p>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger className='cursor-default ml-1.5'>
                                                            <HelpCircle className='w-4 h-4 text-zinc-500' />
                                                        </TooltipTrigger>

                                                        <TooltipContent className='w-80 p-2'>
                                                           {footnote}
                                                        </TooltipContent>
                                                </Tooltip>
                                                </div>
                                            ): (
                                                <p className={`${negative ? 'text-gray-600 ' : 'text-gray-400'}`}>
                                                        {text}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <div className='border-t border-gray-200'/>
                                <div className='p-5'>
                                    {plan === 'Free' ? (
                                        <Link href={userId ? '/dashboard' : '/sign-in'} 
                                        className={buttonVariants({
                                            className: 'w-full',
                                            variant: 'secondary'
                                        })}>
                                            {userId ? 'Upgrade' : 'Sign Up'}
                                            <ArrowRight className='h-5 w-5 ml-1.5'/>
                                        </Link>
                                    ) : userId ? (
                                        <UpgradeButton/>
                                    ) : (
                                        <Link href='/sign-in' className={buttonVariants({
                                            className: 'w-full'
                                        })}>
                                            {userId ? 'Upgrade' : 'Sign Up'}
                                            <ArrowRight className='h-5 w-5 ml-1.5'/>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            )
                        })}
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}

export default Page;