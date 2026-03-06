'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/app/campaigns', icon: Send },
  { name: 'Members', href: '/app/members', icon: Users },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/app/billing', icon: Settings },
];

export default function NavigationSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className="text-xl font-bold text-indigo-600">MemberFlow</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto pt-4">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  pathname === item.href ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-4 gap-4">
        <div className="flex items-center w-full">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700">Creator Account</p>
            <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center">
              <LogOut className="mr-1 h-3 w-3" />
              Sign out
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-3 border-t border-gray-50 pt-3">
          <Link href="/privacy" className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-indigo-600 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
