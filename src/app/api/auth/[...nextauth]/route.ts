import supabase from '@/src/lib/db';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
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
          email: user.email,
          name: user.name,
          role: user.role, // e.g. "PETUGAS" / "PANITIA"
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role; // ini yang penting
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },

  session: {
    strategy: 'jwt' as const,
  },

  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
