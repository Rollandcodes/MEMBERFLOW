'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Send, MessageSquare, BarChart3, Loader2, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/db';
import DashboardHero from '@/components/DashboardHero';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { name: 'Total Members', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50' },
    { name: 'Active Campaigns', value: '0', icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
    { name: 'Messages Sent', value: '0', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50/50' },
    { name: 'Engagement Rate', value: '0%', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50/50' },
  ]);
  const [communityName, setCommunityName] = useState('Your Community');
  const [loading, setLoading] = useState(true);
  const [customerProfile, setCustomerProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch User Data
        const { data: userData } = await supabase
          .from('users')
          .select('community_name, id')
          .limit(1)
          .single();

        if (userData) {
          setCommunityName(userData.community_name || 'Your Community');

          // Fetch Stats
          const [membersCount, campaignsCount, messagesCount] = await Promise.all([
            supabase.from('members').select('*', { count: 'exact', head: true }).eq('user_id', userData.id),
            supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('user_id', userData.id).eq('is_active', true),
            supabase.from('message_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent')
          ]);

          setStats([
            { name: 'Total Members', value: (membersCount.count || 0).toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50' },
            { name: 'Active Campaigns', value: (campaignsCount.count || 0).toString(), icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
            { name: 'Messages Sent', value: (messagesCount.count || 0).toLocaleString(), icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50/50' },
            { name: 'Engagement Rate', value: '12.5%', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50/50' },
          ]);
        }

        // Fetch Customer Profile Demo (New Keys)
        const demoResponse = await fetch('/api/demo/whop-customer');
        const demoData = await demoResponse.json();
        if (demoData.success) {
          setCustomerProfile(demoData.customer_profile);
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Syncing with Whop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardHero communityName={communityName} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                {stat.name}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-500 mt-2 flex items-center font-bold">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Growth active</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-gray-100 rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                <p className="text-sm text-gray-500">Live monitoring from {communityName}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      M{i}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Member Joined Community</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Globe className="h-3 w-3 mr-1" />
                        Whop Member ID: whop_mem_{i}0{i}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl group-hover:bg-indigo-100">
                    {i}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Customer Profile Insight (Using new keys) */}
          <Card className="shadow-lg border-none bg-gradient-to-br from-gray-900 to-indigo-950 text-white rounded-3xl p-1 overflow-hidden">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-[calc(1.5rem-4px)] p-6 h-full border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <ShieldCheck className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Customer Insight</h3>
                  <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Verified App Instance</p>
                </div>
              </div>

              {customerProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <img src={customerProfile.profile_pic_url} alt="Profile" className="h-12 w-12 rounded-xl shadow-lg" />
                    <div>
                      <div className="font-bold text-indigo-100">{customerProfile.username}</div>
                      <div className="text-xs text-indigo-400">ID: {customerProfile.id}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-indigo-400 uppercase font-bold">App Role</div>
                      <div className="text-sm font-bold">Developer</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-indigo-400 uppercase font-bold">Status</div>
                      <div className="text-sm font-bold text-green-400 flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
                        Online
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto">
                    <Loader2 className="h-8 w-8 text-indigo-400/50 animate-spin" />
                  </div>
                  <p className="text-xs text-indigo-300 font-medium">Connecting to Customer API...</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="shadow-sm border-gray-100 rounded-3xl p-6 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="font-black text-gray-900 mb-2">Automate more.</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">Unlock advanced AI sequences and custom webhook triggers with Pro.</p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold rounded-2xl py-6 shadow-indigo-200 shadow-xl">
              Upgrade Now
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
