'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ImportStudentForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Pilih file terlebih dahulu');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/import-students', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      setMessage(`✅ ${result.message} (${result.count} data)`);
    } else {
      setMessage(`❌ ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
        Import Data
      </Button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
