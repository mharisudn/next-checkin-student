'use client';

import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center bg-white rounded-lg p-10 shadow-lg border">
        <div className="flex items-center justify-center mb-6 text-yellow-500">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">
          Anda tidak memiliki hak akses untuk melihat halaman ini.
        </p>
        <Link href="/">
          <Button variant="outline">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
}
