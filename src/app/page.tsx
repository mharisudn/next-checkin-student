'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { School, Users, Activity, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    } else if (status === 'authenticated') {
      // Redirect based on user role
      if (session?.user?.role === 'PETUGAS') {
        redirect('/checkin');
      } else {
        redirect('/monitoring');
      }
    }
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <School className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistem Check-In Pesantren
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistem manajemen check-in terintegrasi untuk santri baru. Pantau
            progress, verifikasi dokumen, dan kelola proses penerimaan dengan
            mudah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Check-In Santri</CardTitle>
              <CardDescription>
                Proses check-in cepat untuk santri baru yang datang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/checkin">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Mulai Check-In
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Dashboard Monitoring</CardTitle>
              <CardDescription>
                Pantau progress dan status semua santri secara real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Lihat Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Verifikasi Dokumen</CardTitle>
              <CardDescription>
                Verifikasi dokumen dan kelengkapan administrasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Verifikasi
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Real-time Updates
                </h3>
                <p className="text-gray-600">
                  Pantau status santri secara real-time dengan update otomatis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-lg p-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Multi-Role Access
                </h3>
                <p className="text-gray-600">
                  Sistem dengan pembagian peran untuk petugas dan panitia
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-lg p-2">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Responsive Design
                </h3>
                <p className="text-gray-600">
                  Interface yang responsif untuk tablet dan perangkat mobile
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 rounded-lg p-2">
                <School className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Comprehensive Tracking
                </h3>
                <p className="text-gray-600">
                  Lacak setiap perubahan status dengan log lengkap
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
