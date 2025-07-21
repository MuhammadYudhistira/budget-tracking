import Sidebar from '@/ui/Sidebar';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen md:flex bg-gray-100">
      <Sidebar />

      <main className="w-full md:ml-16 md:p-4 mb-20">{children}</main>
    </div>
  );
};

export default DashboardLayout;
