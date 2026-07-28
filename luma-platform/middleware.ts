import { auth } from "@/auth";

export default auth((req) => {
  const protectedPaths = ["/provider/apply", "/provider/dashboard", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!req.auth && isProtected) {
    return Response.redirect(new URL("/sign-in", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/provider/:path*", "/admin/:path*"],
};
