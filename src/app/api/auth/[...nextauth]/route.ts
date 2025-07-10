import { createClient } from '@supabase/supabase-js';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { AuthOptions } from 'next-auth';

// Init Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// NextAuth Configuration
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' }
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
          role: user.role // Harus ditangani di JWT & session
        };
      }
    })
  ],

  session: {
    strategy: 'jwt'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Gunakan type augmentation agar tidak any
      }
      return session;
    }
  },

  pages: {
    signIn: '/auth/signin'
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
