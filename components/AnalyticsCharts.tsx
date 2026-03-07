'use client'

import React, { useState } from 'react';
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
  const [lastActiveDate, setLastActiveDate] = useState('2026-03-01');
  const [messageOpenRate, setMessageOpenRate] = useState('48.2');
  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');

  const generateChurnInsights = async () => {
    const openRateValue = Number(messageOpenRate);
    if (!lastActiveDate || Number.isNaN(openRateValue)) {
      setInsightsError('Enter a valid last active date and open rate.');
      return;
    }

    setInsightsLoading(true);
    setInsightsError('');

    try {
      const res = await fetch('/api/ai/churn-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastActiveDate,
          messageOpenRate: openRateValue,
        }),
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data?.insights)) {
        setInsights([]);
        setInsightsError(data?.error || 'Failed to generate churn insights.');
        return;
      }

      setInsights(data.insights);
    } catch {
      setInsights([]);
      setInsightsError('Network error while generating churn insights.');
    } finally {
      setInsightsLoading(false);
    }
  };

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

        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="mr-2 h-5 w-5 text-rose-500" />
              AI Churn Risk Insights
            </CardTitle>
            <CardDescription>Generate 3 actionable churn-risk bullets from recent engagement stats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active Date</label>
                <input
                  type="date"
                  value={lastActiveDate}
                  onChange={(e) => setLastActiveDate(e.target.value)}
                  className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Open Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={messageOpenRate}
                  onChange={(e) => setMessageOpenRate(e.target.value)}
                  className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={generateChurnInsights}
              disabled={insightsLoading}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {insightsLoading ? 'Generating...' : 'Generate AI Insights'}
            </button>

            {insightsError ? <p className="text-sm font-semibold text-red-600">{insightsError}</p> : null}

            {insights.length > 0 ? (
              <ul className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                {insights.map((item, index) => (
                  <li key={`insight-${index}`} className="text-sm text-slate-700 leading-relaxed">
                    - {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
