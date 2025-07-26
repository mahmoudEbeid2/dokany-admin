import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {/* Sidebar for desktop (lg and above) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Sidebar Drawer for mobile and tablet */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={closeSidebar}
          />
          {/* Drawer */}
          <div className="relative w-64 h-full bg-white shadow-lg z-50">
            <Sidebar onItemClick={closeSidebar} />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-lg font-bold">✕</span>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* Hamburger button for mobile and tablet */}
      {!sidebarOpen && (
        <button
          className="absolute top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      )}
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;