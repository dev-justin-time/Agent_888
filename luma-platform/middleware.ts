import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isProvider = pathname.startsWith("/provider");

  if (!isAdmin && !isProvider) return;

  if (!req.auth) {
    return Response.redirect(new URL("/sign-in", req.nextUrl.origin));
  }

  if (isAdmin && req.auth.user?.role !== "ADMIN") {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/provider/:path*", "/admin/:path*"],
};
