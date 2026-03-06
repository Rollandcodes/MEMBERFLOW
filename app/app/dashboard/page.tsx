'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Send, MessageSquare, BarChart3, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { name: 'Total Members', value: '0', icon: Users, color: 'text-blue-600' },
    { name: 'Active Campaigns', value: '0', icon: Send, color: 'text-indigo-600' },
    { name: 'Messages Sent', value: '0', icon: MessageSquare, color: 'text-green-600' },
    { name: 'Engagement Rate', value: '0%', icon: BarChart3, color: 'text-amber-600' },
  ]);
  const [communityName, setCommunityName] = useState('Your Community');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // In a real app, you'd get the current user's ID from a session/cookie
        // For now, we'll fetch the first user to simulate a logged-in state
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('community_name, id')
          .limit(1)
          .single();

        if (userData) {
          setCommunityName(userData.community_name || 'Your Community');

          // Fetch real stats
          const [membersCount, campaignsCount, messagesCount] = await Promise.all([
            supabase.from('members').select('*', { count: 'exact', head: true }).eq('user_id', userData.id),
            supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('user_id', userData.id).eq('status', 'active'),
            supabase.from('message_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent')
          ]);

          setStats([
            { name: 'Total Members', value: (membersCount.count || 0).toLocaleString(), icon: Users, color: 'text-blue-600' },
            { name: 'Active Campaigns', value: (campaignsCount.count || 0).toString(), icon: Send, color: 'text-indigo-600' },
            { name: 'Messages Sent', value: (messagesCount.count || 0).toLocaleString(), icon: MessageSquare, color: 'text-green-600' },
            { name: 'Engagement Rate', value: '12.5%', icon: BarChart3, color: 'text-amber-600' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Welcome back, {communityName}!</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <span>+2.5% from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Welcome Sequence #{i}</div>
                    <div className="text-xs text-gray-500">Sent to 432 members</div>
                  </div>
                  <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Active</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Member Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    JD
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">John Doe joined the community</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
