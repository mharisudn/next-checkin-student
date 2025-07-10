'use client';

import { useEffect, useState } from 'react';
import ConfirmationModal from '@/src/components/ConfirmationModal';
import SearchBar from '@/src/components/SearchBar';
import StatsCard from '@/src/components/StatsCard';
import StudentCard from '@/src/components/StudentCard';
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardContent } from '@/src/components/ui/card';
import { RefreshCw, School, UserCheck } from 'lucide-react';
import { IStudent } from '@/src/types/student';
import { StudentStatus } from '@/src/types/enums';
import supabase from '@/src/lib/db';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const CheckInPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [students, setStudents] = useState<IStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    studentId: 0,
    studentName: '',
    newStatus: '' as StudentStatus,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'PETUGAS') {
      router.push('/unauthorized'); // arahkan ke halaman akses ditolak
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user) {
      loadStudents();
    }
  }, [session]);

  const loadStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      setStudents(data);
      setFilteredStudents(data.filter((s) => s.status === 'BELUM_DATANG'));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStatusChange = (studentId: number, newStatus: StudentStatus) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setConfirmModal({
      isOpen: true,
      studentId,
      studentName: student.name,
      newStatus,
    });
  };

  const confirmStatusChange = async () => {
    const { studentId, newStatus } = confirmModal;
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    await supabase
      .from('students')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', studentId);

    await supabase.from('checkin_logs').insert({
      student_id: studentId,
      status_from: student.status,
      status_to: newStatus,
      handled_by: 'petugas@checkin.local',
      notes: 'Check-in oleh petugas di halaman Check-In',
    });

    setConfirmModal({ ...confirmModal, isOpen: false });
    loadStudents();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length === 0) {
      setFilteredStudents(students.filter((s) => s.status === 'BELUM_DATANG'));
      return;
    }

    const filtered = students.filter(
      (s) =>
        s.status === 'BELUM_DATANG' &&
        (s.name.toLowerCase().includes(term.toLowerCase()) ||
          s.registration_code.toLowerCase().includes(term.toLowerCase())),
    );
    setFilteredStudents(filtered);
  };

  const total = students.length;
  const belum = students.filter((s) => s.status === 'BELUM_DATANG').length;
  const sudah = students.filter((s) => s.status !== 'BELUM_DATANG').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <School className="h-8 w-8 text-blue-600" />
                Check-In Santri
              </h1>
              <p className="text-gray-600 mt-1">
                Sistem check-in untuk santri baru - Petugas:
              </p>
            </div>
            <Button
              onClick={loadStudents}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              title="Belum Check-In"
              value={belum}
              icon={UserCheck}
              color="text-red-600"
            />
            <StatsCard
              title="Sudah Check-In"
              value={sudah}
              icon={UserCheck}
              color="text-green-600"
            />
            <StatsCard
              title="Total Santri"
              value={total}
              icon={UserCheck}
              color="text-blue-600"
            />
          </div>

          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Cari nama santri atau kode registrasi..."
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm
                    ? 'Tidak ada santri yang ditemukan'
                    : 'Semua santri sudah check-in'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? 'Coba ubah kata kunci pencarian Anda'
                    : 'Tidak ada santri yang perlu di-check-in saat ini'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onStatusChange={handleStatusChange}
                  showActions={true}
                  userRole="PETUGAS"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmStatusChange}
        title="Konfirmasi Check-In"
        description="Apakah Anda yakin ingin melakukan check-in untuk santri ini?"
        studentName={confirmModal.studentName}
        confirmText="Ya, Check-In"
        cancelText="Batal"
      />
    </div>
  );
};

export default CheckInPage;
