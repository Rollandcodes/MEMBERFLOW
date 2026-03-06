'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, UserMinus, Star, Zap } from 'lucide-react';

const segments = [
  { name: 'New Members', count: 124, growth: '+12%', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Power Users', count: 45, growth: '+5%', icon: Star, iconColor: 'text-yellow-500', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'At Risk', count: 12, growth: '-2%', icon: UserMinus, color: 'text-red-600', bg: 'bg-red-50' },
  { name: 'Trialing', count: 89, growth: '+18%', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function MemberSegmentation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {segments.map((segment) => (
        <Card key={segment.name} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${segment.bg} p-2.5 rounded-xl`}>
                <segment.icon className={`${segment.iconColor || segment.color} h-5 w-5`} />
              </div>
              <span className={`text-xs font-bold ${segment.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {segment.growth}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{segment.count}</div>
              <div className="text-sm font-bold text-gray-500">{segment.name}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
