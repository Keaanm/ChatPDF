import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
    publicRoutes: ["/",'/api/uploadthing', '/pricing'],
    ignoredRoutes: ['/api/webhooks/user'],
    domain: "https://aea6-2601-600-9081-9560-d830-fd8-c640-d91c.ngrok-free.app/",
    isSatellite: false
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 
