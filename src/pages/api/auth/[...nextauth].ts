import { Awaitable, NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { authAxios } from "services";
import jwt from "jsonwebtoken";

interface IAuthoriseCredentials {
  address: string;
  signature: string;
  message: string;
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        address: { label: "Address", type: "text", placeholder: "0x..." },
        signature: { label: "Signature", type: "text", placeholder: "0x..." },
        message: { label: "Message", type: "text", placeholder: "0x..." }
      },
      async authorize(credentials: IAuthoriseCredentials | undefined, req) {
        if (!credentials) return null;
        try {
          const user = await authAxios.POST.login.wallet(
            credentials.address,
            credentials.signature,
            credentials.message
          );
          console.log("user => ", user);
          return user;
        } catch (error: any) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.jwt = token.jwt;
      }
      return session;
    }
  }
  // jwt: {
  //   async encode({ secret, token }) {
  //     if (!token || !secret) return null;
  //     try {
  //       const encodedToken = jwt.sign(token, secret, { algorithm: "HS512" });
  //       return encodedToken;
  //     } catch (error: any) {
  //       console.log("encoding Error => ", error);
  //       return null;
  //     }
  //   },
  //   async decode({ secret, token }) {
  //     if (!token || !secret) return null;
  //     try {
  //       const decodedToken = jwt.verify(token, secret, { algorithms: ["HS512"] });
  //       console.log("decodedToken", decodedToken);
  //       return decodedToken;
  //     } catch (error: any) {
  //       console.log("decoding Error => ", error);
  //       return null;
  //     }
  //   }
  // }
};

export default NextAuth(authOptions);
