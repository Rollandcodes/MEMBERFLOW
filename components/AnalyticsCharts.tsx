'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Users, MessageSquare, DollarSign, Target, Activity } from 'lucide-react';

const performanceData = [
  { name: 'Jan', sent: 1200, retention: 85, revenue: 4500 },
  { name: 'Feb', sent: 2100, retention: 88, revenue: 5200 },
  { name: 'Mar', sent: 1800, retention: 86, revenue: 4800 },
  { name: 'Apr', sent: 2400, retention: 90, revenue: 6100 },
  { name: 'May', sent: 3200, retention: 92, revenue: 7500 },
  { name: 'Jun', sent: 2800, retention: 91, revenue: 6900 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsCharts() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track the impact of your community automation campaigns.</p>
        </div>
        <div className="flex gap-2">
          <select className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Sent', value: '13,542', icon: MessageSquare, trend: '+12.5%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Retention Rate', value: '92.4%', icon: Users, trend: '+4.2%', color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Engagement', value: '48.2%', icon: Activity, trend: '+8.1%', color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Influenced Revenue', value: '$24,850', icon: DollarSign, trend: '+15.3%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={stat.bg + " p-2 rounded-lg"}>
                  <stat.icon className={stat.color + " h-5 w-5"} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5 text-indigo-500" />
              Campaign Reach & Revenue
            </CardTitle>
            <CardDescription>Messages sent vs influenced monthly revenue.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                <Bar dataKey="sent" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Messages Sent" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
