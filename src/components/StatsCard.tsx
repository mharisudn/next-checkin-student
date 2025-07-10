'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  percentage?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  percentage,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {percentage !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="secondary" className="text-xs">
              {percentage}%
            </Badge>
            <span className="text-xs text-gray-500">dari total</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
