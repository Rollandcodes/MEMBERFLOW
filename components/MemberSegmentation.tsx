'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Filter, Plus, Save, Trash2, CheckCircle2 } from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  count: number;
  criteria: string;
}

const initialSegments: Segment[] = [
  { id: '1', name: 'Pro Members', count: 124, criteria: 'Tier is Pro' },
  { id: '2', name: 'At Risk (Inactive 7d)', count: 45, criteria: 'Last active > 7 days ago' },
  { id: '3', name: 'New This Week', count: 89, criteria: 'Joined in last 7 days' },
];

export default function MemberSegmentation() {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Segmentation</h1>
          <p className="text-muted-foreground">Group your members based on behavior and membership status.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <Card key={segment.id} className="hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-4 text-xl">{segment.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Filter className="h-3 w-3 mr-1" />
                {segment.criteria}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <span className="text-3xl font-bold text-slate-900">{segment.count}</span>
                  <span className="text-slate-500 text-sm ml-2">members</span>
                </div>
                <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                  View Members
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {isCreating && (
          <Card className="border-2 border-dashed border-indigo-300 bg-indigo-50/30">
            <CardHeader>
              <CardTitle className="text-lg">New Segment</CardTitle>
              <CardDescription>Define filters for your new segment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Segment Name</label>
                <Input placeholder="e.g. High Value Members" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Tier</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm outline-none">
                  <option>All Tiers</option>
                  <option>Starter</option>
                  <option>Growth</option>
                  <option>Pro</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-indigo-600" onClick={() => setIsCreating(false)}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="ghost" className="flex-1" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-slate-900 text-white border-none shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center">
                <CheckCircle2 className="mr-2 h-6 w-6 text-green-400" />
                Auto-Segmentation is Active
              </h2>
              <p className="text-slate-400 max-w-md">
                MemberFlow is automatically syncing your Whop tiers and member activity to keep these segments up to date in real-time.
              </p>
            </div>
            <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-bold">
              Sync Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
