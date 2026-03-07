'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Clock, Loader2 } from 'lucide-react';

type Member = {
  id: string;
  whopMemberId: string;
  username: string | null;
  status: string;
  joinedAt: string;
};

export default function MemberTable() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/members')
      .then((r) => r.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) =>
    (m.username ?? '').toLowerCase().includes(search.toLowerCase()) ||
    m.whopMemberId.toLowerCase().includes(search.toLowerCase())
  );

  const escapeCsv = (value: string) => {
    const normalized = value.replace(/\r?\n|\r/g, ' ');
    if (/[",]/.test(normalized)) {
      return `"${normalized.replace(/"/g, '""')}"`;
    }
    return normalized;
  };

  const handleExportCsv = () => {
    if (!filtered.length) return;

    const headers = ['Member ID', 'Username', 'Whop ID', 'Status', 'Joined At'];
    const rows = filtered.map((member) => [
      member.id,
      member.username ?? '',
      member.whopMemberId,
      member.status,
      new Date(member.joinedAt).toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsv(String(cell))).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memberflow-members-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Members</h1>
          <p className="text-muted-foreground">
            {members.length} member{members.length !== 1 ? 's' : ''} in your community.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl font-bold border-gray-200"
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-gray-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members by name or Whop ID..."
                className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-indigo-500 transition-all bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                <UserCheck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {members.length === 0 ? 'No members yet' : 'No results found'}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {members.length === 0
                  ? 'Members will appear here once they join your Whop community.'
                  : 'Try a different search term.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/10 text-[10px] uppercase font-black tracking-widest text-gray-400">
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Whop ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            {(member.username ?? '?').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="font-bold text-gray-900">
                            {member.username ?? 'Unknown Member'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-mono text-gray-500">{member.whopMemberId}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${member.status === 'active'
                            ? 'bg-green-50 text-green-600'
                            : member.status === 'churn_risk'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-gray-50 text-gray-500'
                          }`}>
                          {member.status === 'active' ? (
                            <UserCheck className="h-3 w-3" />
                          ) : member.status === 'churn_risk' ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          {member.status.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-600 rounded-xl">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
