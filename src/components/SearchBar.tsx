'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/src/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Cari nama atau kode registrasi...',
  debounceMs = 300,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, debounceMs]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-11 text-muted-foreground"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
