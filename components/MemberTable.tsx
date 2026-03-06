'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Clock } from 'lucide-react';

const members = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', joined: '2h ago', status: 'active', tier: 'Pro' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', joined: '5h ago', status: 'active', tier: 'Free' },
  { id: '3', name: 'Mike Ross', email: 'mike@example.com', joined: '1d ago', status: 'churn_risk', tier: 'Pro' },
  { id: '4', name: 'Elena Gilbert', email: 'elena@example.com', joined: '2d ago', status: 'inactive', tier: 'Free' },
  { id: '5', name: 'David Goggins', email: 'david@example.com', joined: '3d ago', status: 'active', tier: 'Business' },
];

export default function MemberTable() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Members</h1>
          <p className="text-muted-foreground">Manage your community members and their engagement status.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-gray-200">
            Export CSV
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-6 shadow-lg shadow-indigo-100">
            Invite Members
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-gray-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search members..." 
                className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-indigo-500 transition-all bg-white"
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
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/10 text-[10px] uppercase font-black tracking-widest text-gray-400">
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        member.status === 'active' ? 'bg-green-50 text-green-600' :
                        member.status === 'churn_risk' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {member.status === 'active' ? <UserCheck className="h-3 w-3" /> :
                         member.status === 'churn_risk' ? <Clock className="h-3 w-3" /> :
                         <UserX className="h-3 w-3" />}
                        {member.status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-700">{member.tier}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                      {member.joined}
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
        </CardContent>
      </Card>
    </div>
  );
}
