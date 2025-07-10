'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { StudentStatus } from '@/src/types/enums';

interface StatusFilterProps {
  value: StudentStatus | 'ALL';
  onValueChange: (value: StudentStatus | 'ALL') => void;
}

export default function StatusFilter({
  value,
  onValueChange,
}: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px] text-primary">
        <SelectValue placeholder="Filter status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Semua Status</SelectItem>
        <SelectItem value="BELUM_DATANG">Belum Datang</SelectItem>
        <SelectItem value="DATANG">Sudah Datang</SelectItem>
        <SelectItem value="VERIFIKASI">Verifikasi</SelectItem>
        <SelectItem value="KARTU">Kartu</SelectItem>
        <SelectItem value="PENGARAHAN_AIIS">Pengarahan AIIS</SelectItem>
        <SelectItem value="WAWANCARA">Wawancara</SelectItem>
        <SelectItem value="SELESAI">Selesai</SelectItem>
      </SelectContent>
    </Select>
  );
}
