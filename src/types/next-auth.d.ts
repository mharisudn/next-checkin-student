// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }

  interface User {
    id: string;
    role: string;
    name: string;
    email: string;
  }

  interface JWT {
    id: string;
    role: string;
    name: string;
  }
}
