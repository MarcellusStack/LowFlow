import { auth } from "@server/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth();

  const loginUrl = new URL("/", nextUrl);
  const onboardingUrl = new URL("/user-onboarding", nextUrl);
  const organizationOnboardingUrl = new URL(
    "/organization-onboarding",
    nextUrl
  );
  const dashboardUrl = new URL("/dashboard", nextUrl);

  if (!session) {
    if (nextUrl.pathname !== loginUrl.pathname) {
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

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

  if (user.firstName === null || user.lastName === null) {
    if (nextUrl.pathname !== onboardingUrl.pathname) {
      return NextResponse.redirect(onboardingUrl);
    }
  } else if (user.organizationId === null) {
    if (nextUrl.pathname !== organizationOnboardingUrl.pathname) {
      return NextResponse.redirect(organizationOnboardingUrl);
    }
  } else {
    if (
      nextUrl.pathname === onboardingUrl.pathname ||
      nextUrl.pathname === organizationOnboardingUrl.pathname
    ) {
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
