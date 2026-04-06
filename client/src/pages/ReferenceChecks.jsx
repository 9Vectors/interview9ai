import { useState } from 'react';
import toast from 'react-hot-toast';
import { PhoneCall, Plus, CheckCircle, Clock, AlertTriangle, User, Shield } from 'lucide-react';
import useStore from '../services/store';

const REFERENCE_QUESTIONS = [
  { category: 'Performance', questions: ['How would you rate their overall job performance?', 'What were their key accomplishments?', 'How did they handle pressure and deadlines?'] },
  { category: 'Leadership', questions: ['How would you describe their leadership style?', 'Did they develop their team members?', 'How did they handle conflict?'] },
  { category: 'Culture', questions: ['How well did they fit with the team culture?', 'Were they collaborative or more independent?', 'How would coworkers describe them?'] },
  { category: 'Areas for Growth', questions: ['What areas would they need to develop?', 'Would you rehire them? Why or why not?', 'Is there anything else we should know?'] },
];

export default function ReferenceChecks() {
  const { candidates, referenceChecks, addReferenceCheck } = useStore();
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRef, setNewRef] = useState({ referenceName: '', referenceTitle: '', relationship: '', notes: '' });

  const activeCandidates = candidates.filter((c) => c.status !== 'rejected');
  const candidateRefs = referenceChecks.filter((r) => r.candidateId === selectedCandidateId);

  const handleAdd = () => {
    if (!newRef.referenceName || !selectedCandidateId) return;
    addReferenceCheck({
      candidateId: selectedCandidateId,
      ...newRef,
      status: 'completed',
      scores: { overall: 4, leadership: 4, technical: 4, culture: 4 },
      validationGaps: [],
    });
    toast.success('Reference check added successfully');
    setNewRef({ referenceName: '', referenceTitle: '', relationship: '', notes: '' });
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reference Checks</h1>
          <p className="text-slate-500 mt-1">Structured reference validation with triangulation protocol</p>
        </div>
      </div>

      {/* Candidate Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedCandidateId}
            onChange={(e) => setSelectedCandidateId(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Select candidate...</option>
            {activeCandidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.role}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={!selectedCandidateId}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Reference
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* References */}
        <div className="lg:col-span-2 space-y-4">
          {candidateRefs.length === 0 && selectedCandidateId && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
              <PhoneCall className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No reference checks recorded yet.</p>
            </div>
          )}
          {candidateRefs.map((ref) => (
            <div key={ref.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{ref.referenceName}</p>
                    <p className="text-sm text-slate-500">{ref.referenceTitle} — {ref.relationship}</p>
                  </div>
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" /> Completed
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {Object.entries(ref.scores).map(([key, val]) => (
                  <div key={key} className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 capitalize">{key}</p>
                    <p className="text-lg font-bold text-teal-600">{val}/5</p>
                  </div>
                ))}
              </div>
              {ref.notes && <p className="text-sm text-slate-600 italic">"{ref.notes}"</p>}
              {ref.validationGaps.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs font-semibold text-amber-700 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Validation Gaps Detected
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Add Reference Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm border border-teal-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">New Reference Check</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  value={newRef.referenceName}
                  onChange={(e) => setNewRef({ ...newRef, referenceName: e.target.value })}
                  placeholder="Reference name"
                  className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  value={newRef.referenceTitle}
                  onChange={(e) => setNewRef({ ...newRef, referenceTitle: e.target.value })}
                  placeholder="Title"
                  className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <select
                  value={newRef.relationship}
                  onChange={(e) => setNewRef({ ...newRef, relationship: e.target.value })}
                  className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Relationship...</option>
                  <option value="Direct Manager">Direct Manager</option>
                  <option value="Peer">Peer</option>
                  <option value="Direct Report">Direct Report</option>
                  <option value="Board Member">Board Member</option>
                  <option value="Client/Customer">Client/Customer</option>
                </select>
              </div>
              <textarea
                value={newRef.notes}
                onChange={(e) => setNewRef({ ...newRef, notes: e.target.value })}
                placeholder="Reference check notes..."
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              />
              <div className="flex space-x-3">
                <button onClick={handleAdd} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-teal-600 mr-2" />
              <h3 className="text-sm font-semibold text-slate-900">Triangulation Protocol</h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Compare self-reported achievements against reference data. Flag discrepancies greater than 1 standard deviation.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center text-slate-600"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2" />Self-report weight: 0.3x</div>
              <div className="flex items-center text-slate-600"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2" />Reference weight: 0.7x (when discrepancies exist)</div>
              <div className="flex items-center text-slate-600"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2" />Store patterns in institutional memory</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Reference Question Guide</h3>
            <div className="space-y-4">
              {REFERENCE_QUESTIONS.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs font-semibold text-teal-600 mb-1">{cat.category}</p>
                  <ul className="space-y-1">
                    {cat.questions.map((q, i) => (
                      <li key={i} className="text-xs text-slate-600">• {q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!selectedCandidateId && (
        <div className="text-center py-16">
          <PhoneCall className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Select a candidate to view or add reference checks.</p>
        </div>
      )}
    </div>
  );
}
