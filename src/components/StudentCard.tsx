'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  User,
  School,
  Hash,
  Home,
  MapPin,
  UserCheck,
  Phone,
} from 'lucide-react';
import { IStudent } from '@/src/types/student';
import StatusBadge from './StatusBadge';
import { StudentStatus } from '@/src/types/enums';

interface StudentCardProps {
  student: IStudent;
  onStatusChange?: (studentId: number, newStatus: StudentStatus) => void;
  showActions?: boolean;
  userRole?: 'PETUGAS' | 'PANITIA';
}

export default function StudentCard({
  student,
  onStatusChange,
  showActions = false,
  userRole = 'PETUGAS',
}: StudentCardProps) {
  const handleStatusChange = (newStatus: StudentStatus) => {
    onStatusChange?.(student.id, newStatus);
  };

  const getAvailableActions = () => {
    if (!showActions) return [];

    switch (student.status) {
      case 'BELUM_DATANG':
        return userRole === 'PETUGAS'
          ? [
              {
                label: 'Tandai Datang',
                status: 'DATANG',
                color: 'bg-yellow-500 hover:bg-yellow-600',
              },
            ]
          : [];

      case 'DATANG':
        return userRole === 'PANITIA'
          ? [
              {
                label: 'Verifikasi Berkas & Pembayaran',
                status: 'VERIFIKASI',
                color: 'bg-blue-500 hover:bg-blue-600',
              },
            ]
          : [];

      case 'VERIFIKASI':
        return userRole === 'PANITIA'
          ? [
              {
                label: 'Ambil Kartu',
                status: 'KARTU',
                color: 'bg-indigo-500 hover:bg-indigo-600',
              },
            ]
          : [];

      case 'KARTU':
        return userRole === 'PANITIA'
          ? [
              {
                label: 'Pengarahan AIIS',
                status: 'PENGARAHAN_AIIS',
                color: 'bg-purple-500 hover:bg-purple-600',
              },
            ]
          : [];

      case 'PENGARAHAN_AIIS':
        return userRole === 'PANITIA'
          ? [
              {
                label: 'Wawancara',
                status: 'WAWANCARA',
                color: 'bg-pink-500 hover:bg-pink-600',
              },
              {
                label: 'Selesaikan',
                status: 'SELESAI',
                color: 'bg-green-500 hover:bg-green-600',
              },
            ]
          : [];

      case 'WAWANCARA':
        return userRole === 'PANITIA'
          ? [
              {
                label: 'Selesaikan',
                status: 'SELESAI',
                color: 'bg-green-500 hover:bg-green-600',
              },
            ]
          : [];

      default:
        return [];
    }
  };

  const actions = getAvailableActions();

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            {student.name}
          </CardTitle>
          <StatusBadge size="sm" status={student.status as StudentStatus} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="h-4 w-4" />
            <span className="font-medium">No. Registrasi:</span>
            <span>{student.registration_code}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="font-medium">Jenis Kelamin:</span>
            <Badge variant="outline">{student.gender}</Badge>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Home className="h-4 w-4" />
            <span className="font-medium">Kelas:</span>
            <Badge variant="outline">{student.classroom}</Badge>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Alamat:</span>
            <span className="truncate">{student.address}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCheck className="h-4 w-4" />
            <span className="font-medium">Orang Tua:</span>
            <span>{student.parent}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="font-medium">Telepon:</span>
            <span>{student.phone}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <School className="h-4 w-4" />
            <span className="font-medium">Asal Sekolah:</span>
            <span>{student.school_origin}</span>
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex gap-2 pt-2 border-t">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={() => handleStatusChange(action.status)}
                className={`${action.color} flex-1`}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
