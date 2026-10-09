import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "4mZ8xQ2vK9pL1wR7yT3uN6bV5cC8xM1z",
  providers: [
    Google({
      clientId:
        process.env.AUTH_GOOGLE_ID ||
        "503521376070-6gon5kieu1gfnf9gr5g7acoppviagrg.apps.googleusercontent.com",
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET ||
        "GOCSPX-YcILqjbRRA8B3lAudMp1OigKVx",
    }),
  ],
  // เพิ่มตั้งค่าเปลี่ยนชื่อคุกกี้ เพื่อล้างคุกกี้เก่าอัตโนมัติ
  cookies: {
    pkceCodeVerifier: {
      name: "authjs.pkce.code_verifier_v2",
    },
  },
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isProductManagementPage =
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);
      if (isProductManagementPage) {
        return Boolean(auth?.user);
      }
      return true;
    },
  },
});