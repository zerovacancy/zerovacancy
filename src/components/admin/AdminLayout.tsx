import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Settings, FileText, Users, Tag } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const navItems = [
    { label: 'Blog Posts', icon: <FileText size={18} />, path: '/admin/blog' },
    { label: 'Categories', icon: <Tag size={18} />, path: '/admin/categories' },
    { label: 'Authors', icon: <Users size={18} />, path: '/admin/authors' },
    { label: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-5 border-b">
          <h1 className="text-lg font-bold text-brand-purple-dark">ZeroVacancy Admin</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-brand-purple-light/20 text-brand-purple-dark'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors w-full px-3 py-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
          </h2>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;