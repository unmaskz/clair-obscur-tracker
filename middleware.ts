import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/'])


export default clerkMiddleware(async (auth, req) => {
  console.log("✅ Clerk middleware hit: ", req.nextUrl.pathname);
  if (isProtectedRoute(req)) await auth.protect();
  
  return NextResponse.next();
})

export const config = {
  matcher: ['/((?!_next).*)'],
}