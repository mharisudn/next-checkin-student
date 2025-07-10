import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import supabase from '@/src/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email Only',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({
  token,
  user,
}: {
  token: JWT;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}) {

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
