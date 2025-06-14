import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.append("x-pathname", req.nextUrl.pathname);
  res.headers.append("x-ip", (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0]);

  return res;
}