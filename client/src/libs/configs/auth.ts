import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google" 
import Credentials from "next-auth/providers/credentials"
import { cookies } from "next/headers";
import { compare } from "bcrypt";
import { ulid } from "ulid";


class InvalidLoginError extends CredentialsSignin {
  code = "Email ou senha incorretos."
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { 
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  // cookies: {
  //   sessionToken: {
  //     name: "next-auth.session-token",
  //     options: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //     },
  //   },
  // },
  providers: [
    Google({
      name: 'google',
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      profile: async profile => {        
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    Credentials({
      name: 'Credentials',
      
      credentials: {
        email: { 
          label: "Email", 
          type: "text", 
        },
        password: { 
          label: "Password", 
          type: "password" 
        },
        type: {
          label: "Type",
          type: "text",
        },
      },
      async authorize(credentials) { 
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: { token: any, user: any, trigger?: any, session?: any }) {
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      return session;
    }, // TO-DO: upload user picture if signIn with provider
    async signIn({ user, account }: { user: any, account: any }) {
      return true;
    }
  }
})