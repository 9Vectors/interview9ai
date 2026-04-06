import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Filter, ChevronRight, Calendar, Star, Users, Briefcase } from 'lucide-react';
import useStore from '../services/store';
import { ROLE_LEVELS } from '../data/questions';

const STATUS_COLORS = {
  screening: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Screening' },
  interviewing: { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Interviewing' },
  offer: { bg: 'bg-green-50', text: 'text-green-700', label: 'Offer Extended' },
  hired: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Hired' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' },
};

function ScoreBar({ score, max = 5 }) {
  const pct = (score / max) * 100;
  const color = score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-teal-500' : score >= 2 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center space-x-2">
      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-600">{score > 0 ? score.toFixed(1) : '—'}</span>
    </div>
  );
}

export default function Candidates() {
  const { candidates, addCandidate } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: '', role: '', roleLevel: '' });

  const filtered = candidates.filter((c) => {
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.role) return;
    addCandidate({
      ...newCandidate,
      status: 'screening',
      stage: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      scores: { overall: 0, culture: 0, technical: 0, leadership: 0 },
      interviewCount: 0,
      nextInterview: null,
    });
    toast.success('Candidate added successfully');
    setNewCandidate({ name: '', role: '', roleLevel: '' });
    setShowAddModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-500 mt-1">Track candidates through the structured interview process</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            {['all', 'screening', 'interviewing', 'offer', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : STATUS_COLORS[status]?.label || status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(STATUS_COLORS).slice(0, 4).map(([key, val]) => {
          const count = candidates.filter((c) => c.status === key).length;
          return (
            <div key={key} className={`${val.bg} rounded-lg p-4`}>
              <p className={`text-sm font-medium ${val.text}`}>{val.label}</p>
              <p className={`text-2xl font-bold ${val.text} mt-1`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Candidate Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Score</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Culture</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Leadership</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((candidate) => {
              const statusInfo = STATUS_COLORS[candidate.status] || STATUS_COLORS.screening;
              return (
                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-700 font-semibold text-sm">
                          {candidate.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{candidate.name}</p>
                        <p className="text-xs text-slate-500">Applied {new Date(candidate.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900">{candidate.role}</p>
                    <p className="text-xs text-slate-500">{ROLE_LEVELS.find((r) => r.id === candidate.roleLevel)?.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{candidate.stage}</span>
                  </td>
                  <td className="px-6 py-4"><ScoreBar score={candidate.scores.overall} /></td>
                  <td className="px-6 py-4"><ScoreBar score={candidate.scores.culture} /></td>
                  <td className="px-6 py-4"><ScoreBar score={candidate.scores.leadership} /></td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{candidate.interviewCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Candidate</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role / Position</label>
                <input
                  type="text"
                  value={newCandidate.role}
                  onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., VP of Sales"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role Level</label>
                <select
                  value={newCandidate.roleLevel}
                  onChange={(e) => setNewCandidate({ ...newCandidate, roleLevel: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select level...</option>
                  {ROLE_LEVELS.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCandidate}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
