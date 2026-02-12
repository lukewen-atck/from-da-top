import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 定義公開路由（不需要登入即可訪問）
const isPublicRoute = createRouteMatcher([
  '/',
  '/bind(.*)',
  '/api/card/bind(.*)',
  '/api/auth/request-otp(.*)',
  '/api/auth/verify-otp(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // 如果不是公開路由，則需要驗證登入
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}





