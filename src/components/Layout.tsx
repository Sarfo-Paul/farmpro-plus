import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Table as TableIcon, LogOut, Tractor, ShieldCheck } from 'lucide-react';
import { storage } from '../utils/storage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = storage.getUser();

  const handleLogout = () => {
    storage.saveUser(null);
    storage.saveToken(null);
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'Add Record', path: '/add' },
    { icon: TableIcon, label: 'View Records', path: '/records' },
  ];

  if (user?.isAdmin) {
    menuItems.push({ icon: ShieldCheck, label: 'Admin', path: '/admin' });
  }

  if (!user && location.pathname !== '/' && location.pathname !== '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-emerald-900 text-white">
        <div className="p-6 flex items-center gap-3">
          <Tractor className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">FarmTrack Pro</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-emerald-800 text-white'
                  : 'text-emerald-100 hover:bg-emerald-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-emerald-300 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="px-4 py-3 mb-2">
            <Link to="/profile" className="block text-sm text-emerald-100 hover:underline">Profile</Link>
            <Link to="/settings" className="block text-sm text-emerald-100 hover:underline">Settings</Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-emerald-100 hover:bg-emerald-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Navbar */}
      <div className="md:hidden bg-emerald-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Tractor className="w-6 h-6 text-emerald-400" />
          <span className="font-bold">FarmTrack Pro</span>
        </div>
        <div className="flex gap-4">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="p-1">
              <item.icon className={`w-6 h-6 ${location.pathname === item.path ? 'text-emerald-400' : 'text-white'}`} />
            </Link>
          ))}
          <button onClick={handleLogout} className="p-1">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
          <footer className="mt-12 py-6 border-t border-stone-200 text-center text-stone-500 text-sm">
            <p>Made by Paul Sarfo &bull; FarmTrack Pro &copy; 2026</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
