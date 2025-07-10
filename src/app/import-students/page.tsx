'use client';
import ImportStudentForm from '@/src/components/ImportStudentForm';

export default function ImportStudentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Import Data Santri
        </h1>

        <ImportStudentForm />
      </div>
    </div>
  );
}
