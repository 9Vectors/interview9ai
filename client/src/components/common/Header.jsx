import { useMemo } from 'react';
import { Bell, HelpCircle, Search, User } from 'lucide-react';
import { authApi } from '../../services/api';

export default function Header() {
  const user = useMemo(() => {
    const token = authApi.getToken();
    if (!token) return null;
    const payload = authApi.decodeToken(token);
    if (!payload) return null;
    return {
      name: payload.name || payload.email || 'User',
      email: payload.email || '',
      role: payload.role || 'user',
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions, candidates, interviews..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full" />
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            {user?.name ? (
              <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-900">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
