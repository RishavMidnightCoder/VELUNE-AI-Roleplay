import { NextResponse, type NextRequest } from 'next/server'

const AUTH_PAGES = ['/login', '/signup']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const role = req.cookies.get('role')?.value
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p))

  if (!role) {
    if (isAuthPage) return NextResponse.next()
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?next=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/', req.url))
  }
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next()
}

// Skips _next and any path containing a dot (images, favicon, etc.)
export const config = { matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'] }