import NextAuth, { User, Session } from "next-auth";
import { SignInOptions } from "next-auth/react";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: {
      jwt: string;
    };
  }
  interface User {
    jwt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt: string;
  }
}

declare module "next-auth/react" {
  interface SignInOptions {
    address: string;
    signature: string;
    message: string;
    callbackUrl?: string;
    redirect?: boolean;
  }
}
