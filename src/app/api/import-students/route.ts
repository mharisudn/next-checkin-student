import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/src/lib/db';
import * as XLSX from 'xlsx';

// Define the interface for Excel row data
interface ExcelRowData {
  'Kode Registrasi'?: string;
  'Nama'?: string;
  'Kelas'?: string;
  'Jenis Kelamin'?: string;
  'Nama Orang Tua'?: string;
  'Alamat'?: string;
  'Asal Sekolah'?: string;
  'No. Telepon'?: string;
}

// Define the interface for student data
interface StudentData {
  registration_code: string;
  name: string;
  classroom: string | null;
  gender: string | null;
  parent: string | null;
  address: string | null;
  school_origin: string | null;
  phone: string | null;
  status: string;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: ExcelRowData[] = XLSX.utils.sheet_to_json(worksheet);

    const validData: StudentData[] = data.map((row: ExcelRowData) => ({
      registration_code: row['Kode Registrasi'] || '',
      name: row['Nama'] || '',
      classroom: row['Kelas'] || null,
      gender: row['Jenis Kelamin'] || null,
      parent: row['Nama Orang Tua'] || null,
      address: row['Alamat'] || null,
      school_origin: row['Asal Sekolah'] || null,
      phone: row['No. Telepon'] || null,
      status: 'BELUM_DATANG', // Default
    })).filter((s: StudentData) =>
      s.registration_code && s.name && s.classroom && s.gender && s.parent && s.address && s.school_origin && s.phone
    );

    if (validData.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid atau kosong' }, { status: 400 });
    }

    const { data: inserted, error } = await supabase
      .from('students')
      .insert(validData);

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Gagal menyimpan ke database' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Data berhasil diimport',
      count: inserted?.length || validData.length
    });
  } catch (err) {
    console.error('Import error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan saat proses import' }, { status: 500 });
  }
}
