import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Prevent body scroll when the sidebar overlay is open on mobile
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Top bar (mobile) */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-30">
        <button
          onClick={handleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarOpen}
        >
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={handleSidebar}
        />
      )}

      {/* Sidebar – fixed on desktop */}
      <div
        className={`bg-gray-900 w-64 h-screen text-white fixed top-0 left-0
        transform md:translate-x-0 transition-transform duration-300 z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block overflow-hidden`}
      >
        <AdminSidebar />
      </div>

      {/* Main content – adds left padding on desktop so it clears the fixed sidebar */}
      <div className="flex-grow p-6 overflow-y-auto md:pl-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
