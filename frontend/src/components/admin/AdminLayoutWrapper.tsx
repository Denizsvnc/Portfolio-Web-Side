'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname.includes('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-[#0B0F19]">
        {children}
      </main>
    </div>
  );
};
