'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Mail, Loader2, School, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/src/components/ui/alert';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const redirectByRole = (role?: string) => {
    if (role === 'PETUGAS') {
      router.push('/checkin');
    } else if (role === 'PANITIA') {
      router.push('/monitoring');
    } else {
      setMessage('Role tidak dikenali. Hubungi admin sistem.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Silakan masukkan email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        redirect: false,
        callbackUrl: '/monitoring',
      });

      if (result?.ok && !result?.error) {
        const session = await getSession();
        console.log('Session after sign in:', session);
        setTimeout(() => {
          redirectByRole(session?.user?.role);
        }, 100);
      } else {
        setMessage('Email tidak ditemukan atau tidak memiliki akses.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage('Terjadi kesalahan saat masuk. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <School className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Sistem Check-In Pesantren
          </CardTitle>
          <CardDescription className="text-gray-600">
            Masuk untuk mengakses sistem check-in santri baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@assalam.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>

          {message && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
