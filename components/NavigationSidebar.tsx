'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Send,
  BarChart3,
  CreditCard,
  Compass,
  Zap,
  LogOut,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Discover', href: '/app/discover', icon: Compass },
  { name: 'Members', href: '/app/members', icon: Users },
  { name: 'Campaigns', href: '/app/campaigns', icon: Send },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/app/billing', icon: CreditCard },
  { name: 'Pricing', href: '/pricing', icon: Tag },
];

export default function NavigationSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm">
      <div className="p-8">
        <Link href="/app/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">MemberFlow</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-900"
              )} />
              {item.name}
              {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-indigo-50 rounded-3xl p-6 mb-6">
          <div className="text-sm font-black text-indigo-900 mb-1">Pro Plan</div>
          <div className="text-xs text-indigo-600 font-bold mb-4">Unlimited members &amp; AI</div>
          <div className="w-full bg-indigo-200 rounded-full h-1.5 mb-4">
            <div className="bg-indigo-600 h-1.5 rounded-full w-3/4" />
          </div>
          <Link
            href="/app/billing"
            className="block w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors text-center"
          >
            Upgrade Now
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3.5 w-full text-left text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all group"
        >
          <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
