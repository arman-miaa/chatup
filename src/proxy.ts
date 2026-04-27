import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

interface IUser {
  id: string;
  email: string;
  role: string;
}

const roleBasedRoutes = ["/", "/admin/dashboard", "/user/dashboard"];

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("accessToken", accessToken, "refreshToken", refreshToken);

  const { pathname } = request.nextUrl;

  if (!accessToken && !refreshToken && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url),
    );
  }

  let user: IUser | null = null;

  if (accessToken) {
    try {
      user = decodeJwt(accessToken);
      console.log({ proxyts: user });
    } catch (error) {
      console.log("error", error);
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url),
      );
    }
  }


}

export const config = {
  matcher: [
    "/about/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
