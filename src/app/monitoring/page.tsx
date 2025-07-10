'use client';

import { useEffect, useState } from 'react';
import { IStudent } from '@/src/types/student';
import { StudentStatus } from '@/src/types/enums';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import {
  RefreshCw,
  Users,
  Activity,
  CheckCircle,
  Clock,
  School,
} from 'lucide-react';
import SearchBar from '@/src/components/SearchBar';
import StatusFilter from '@/src/components/StatusFilter';
import StudentCard from '@/src/components/StudentCard';
import ConfirmationModal from '@/src/components/ConfirmationModal';
import StatsCard from '@/src/components/StatsCard';
import StatusBadge from '@/src/components/StatusBadge';
import supabase from '@/src/lib/db';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MonitoringPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'ALL'>(
    'ALL',
  );
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    studentId: 0,
    studentName: '',
    newStatus: 'BELUM_DATANG' as StudentStatus,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      loadStudents();

      const subscription = supabase
        .channel('students')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'students' },
          () => {
            loadStudents();
          },
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [session]);

  const loadStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setStudents(data);
    setLoading(false);
  };

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
      handled_by: session?.user?.email || '',
      notes: `Status changed by ${session?.user?.name || session?.user?.email}`,
    });

    setConfirmModal({
      isOpen: false,
      studentId: 0,
      studentName: '',
      newStatus: 'BELUM_DATANG',
    });
    loadStudents();
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registration_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: students.length,
    belumDatang: students.filter((s) => s.status === 'BELUM_DATANG').length,
    datang: students.filter((s) => s.status === 'DATANG').length,
    verifikasi: students.filter((s) => s.status === 'VERIFIKASI').length,
    kartu: students.filter((s) => s.status === 'KARTU').length,
    pengarahan: students.filter((s) => s.status === 'PENGARAHAN_AIIS').length,
    wawancara: students.filter((s) => s.status === 'WAWANCARA').length,
    selesai: students.filter((s) => s.status === 'SELESAI').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <School className="h-8 w-8 text-blue-600" />
                Dashboard Monitoring
              </h1>
              <p className="text-gray-600 mt-1">
                Pantau status check-in santri secara real-time
              </p>
            </div>
            <Button
              onClick={loadStudents}
              variant="outline"
              className="flex items-center gap-2 "
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Santri"
              value={stats.total}
              icon={Users}
              color="text-blue-600"
            />
            <StatsCard
              title="Belum Datang"
              value={stats.belumDatang}
              icon={Clock}
              color="text-gray-600"
            />
            <StatsCard
              title="Lapor Kedatangan"
              value={stats.datang}
              icon={Activity}
              color="text-yellow-600"
            />
            <StatsCard
              title="Verifikasi"
              value={stats.verifikasi}
              icon={CheckCircle}
              color="text-blue-600"
            />
            <StatsCard
              title="Ambil Kartu"
              value={stats.kartu}
              icon={CheckCircle}
              color="text-indigo-600"
            />
            <StatsCard
              title="Pengarahan"
              value={stats.pengarahan}
              icon={CheckCircle}
              color="text-purple-600"
            />
            <StatsCard
              title="Wawancara"
              value={stats.wawancara}
              icon={CheckCircle}
              color="text-pink-600"
            />
            <StatsCard
              title="Selesai"
              value={stats.selesai}
              icon={CheckCircle}
              color="text-green-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Cari nama santri atau kode registrasi..."
              />
            </div>
            <StatusFilter
              value={statusFilter}
              onValueChange={setStatusFilter}
            />
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onStatusChange={handleStatusChange}
                  showActions={true}
                  userRole="PANITIA"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Santri</CardTitle>
                <CardDescription>
                  Tampilan list lengkap semua santri dengan status terkini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          {student.registration_code} • {student.school_origin}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={student.status} />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(student.id, student.status)
                          }
                          className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Ubah Status
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmStatusChange}
        title="Konfirmasi Perubahan Status"
        description="Apakah Anda yakin ingin mengubah status santri ini?"
        studentName={confirmModal.studentName}
        confirmText="Ya, Ubah Status"
        cancelText="Batal"
      />
    </div>
  );
}
