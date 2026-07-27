import type { Metadata } from 'next';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';

export const metadata: Metadata = {
  title: 'Deniz Sevinç - Admin Panel',
  description: 'Admin Dashboard',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  );
}
