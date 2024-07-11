import { auth } from "@server/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth();

  const loginUrl = new URL("/", nextUrl);

  if (!session && nextUrl.pathname !== loginUrl.pathname) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
