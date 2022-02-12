import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
      // @ts-ignore
      scope: "read:user",
    }),
  ],
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 day
  }
});
