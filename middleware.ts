import { auth } from "@server/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth();

  const loginUrl = new URL("/", nextUrl);
  const onboardingUrl = new URL("/user-onboarding", nextUrl);

  if (!session && nextUrl.pathname !== loginUrl.pathname) {
    return NextResponse.redirect(loginUrl);
  }

  if (session) {
    const user = await fetch(`http://localhost:3000/api/get-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        appApiKey: process.env.APP_API_KEY,
      }),
    }).then((data) => data.json());

    if (
      (user.firstName === null || user.lastName === null) &&
      nextUrl.pathname !== onboardingUrl.pathname
    ) {
      return NextResponse.redirect(onboardingUrl);
    }

    if (
      user.firstName !== null &&
      user.lastName !== null &&
      nextUrl.pathname === onboardingUrl.pathname
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
