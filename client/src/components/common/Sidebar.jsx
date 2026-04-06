import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  Star,
  PhoneCall,
  Brain,
  FileText,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Question Library', href: '/app/questions', icon: BookOpen },
  { name: 'Interview Builder', href: '/app/builder', icon: ClipboardList },
  { name: 'Candidates', href: '/app/candidates', icon: Users },
  { name: 'Scoring', href: '/app/scoring', icon: Star },
  { name: 'Reference Checks', href: '/app/references', icon: PhoneCall },
  { type: 'divider' },
  { name: 'AI Insights', href: '/app/ai-insights', icon: Brain },
  { name: 'Reports', href: '/app/reports', icon: FileText },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <Link to="/app" className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">i9</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Interview9<span className="text-brand-orange">.ai</span></h1>
            <p className="text-xs text-slate-500">Structured Interview Intelligence</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-4">
        {navigation.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={index} className="my-3 mx-4 border-t border-slate-200" />;
          }

          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700 font-medium border-l-4 border-teal-600 ml-0 pl-3'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-teal-600' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-teal-50 rounded-lg p-3">
          <p className="text-xs font-medium text-teal-700">TheGreyMatter.ai</p>
          <p className="text-xs text-teal-600 mt-1">Connected to Platform</p>
        </div>
      </div>
    </aside>
  );
}
