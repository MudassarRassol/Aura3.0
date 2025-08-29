// middleware.ts
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;
    console.log(userId);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("userId", userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/protected/:path*", "/api/activity", "/api/mood" , "/api/session", "/api/chat" , "/api/getname" , "/api/process", "/api/ai"], 
};