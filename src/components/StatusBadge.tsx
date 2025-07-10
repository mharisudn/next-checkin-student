'use client';

import { Badge } from '@/src/components/ui/badge';
import { StudentStatus } from '@/src/types/enums';

interface StatusBadgeProps {
  status: StudentStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<
  StudentStatus,
  { label: string; color: string; textColor: string }
> = {
  BELUM_DATANG: {
    label: 'Belum Datang',
    color: 'bg-gray-300',
    textColor: 'text-gray-800',
  },
  DATANG: {
    label: 'Sudah Datang',
    color: 'bg-yellow-200',
    textColor: 'text-yellow-800',
  },
  VERIFIKASI: {
    label: 'Verifikasi',
    color: 'bg-blue-200',
    textColor: 'text-blue-800',
  },
  KARTU: {
    label: 'Ambil Kartu',
    color: 'bg-indigo-200',
    textColor: 'text-indigo-800',
  },
  PENGARAHAN_AIIS: {
    label: 'Pengarahan AIIS',
    color: 'bg-purple-200',
    textColor: 'text-purple-800',
  },
  WAWANCARA: {
    label: 'Wawancara',
    color: 'bg-pink-200',
    textColor: 'text-pink-800',
  },
  SELESAI: {
    label: 'Selesai',
    color: 'bg-green-200',
    textColor: 'text-green-800',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }[size];

  return (
    <Badge
      className={`${config.color} ${config.textColor} ${sizeClass} font-semibold`}
      variant="secondary"
    >
      {config.label}
    </Badge>
  );
}
