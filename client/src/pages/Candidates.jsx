import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Filter, ChevronRight, Calendar, Star, Users, Briefcase, Upload, FileText, X, Loader2 } from 'lucide-react';
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

  // Resume upload state
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [showParsedModal, setShowParsedModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleResumeFile = useCallback((file) => {
    if (!file) return;
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }
    setResumeFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleResumeFile(file);
  }, [handleResumeFile]);

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 15, 85));
      }, 200);

      const res = await fetch(`${apiBase}/api/v1/ai/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Failed to parse resume');
      }

      const result = await res.json();
      setParsedData(result.data);
      setShowResumeUpload(false);
      setShowParsedModal(true);
      toast.success('Resume parsed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleConfirmParsed = () => {
    if (!parsedData) return;
    addCandidate({
      name: parsedData.name || 'Unknown',
      role: parsedData.currentRole || '',
      roleLevel: '',
      email: parsedData.email || '',
      phone: parsedData.phone || '',
      company: parsedData.company || '',
      yearsExperience: parsedData.yearsExperience || '',
      skills: parsedData.skills || [],
      education: parsedData.education || '',
      summary: parsedData.summary || '',
      status: 'screening',
      stage: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      scores: { overall: 0, culture: 0, technical: 0, leadership: 0 },
      interviewCount: 0,
      nextInterview: null,
    });
    toast.success('Candidate created from resume');
    setParsedData(null);
    setShowParsedModal(false);
    setResumeFile(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-500 mt-1">Track candidates through the structured interview process</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => { setShowResumeUpload(true); setResumeFile(null); }}
            className="flex items-center px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Resume
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </button>
        </div>
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

      {/* Resume Upload Modal */}
      {showResumeUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Upload Resume</h3>
              <button onClick={() => { setShowResumeUpload(false); setResumeFile(null); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-teal-500 bg-teal-50' : resumeFile ? 'border-teal-300 bg-teal-50/50' : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => handleResumeFile(e.target.files[0])}
              />
              {resumeFile ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-10 w-10 text-teal-600 mb-2" />
                  <p className="text-sm font-medium text-slate-900">{resumeFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-700">Drop a resume here or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">Accepts PDF and DOCX files</p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Parsing resume with AI...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => { setShowResumeUpload(false); setResumeFile(null); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadResume}
                disabled={!resumeFile || uploading}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading ? 'Parsing...' : 'Upload & Parse'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parsed Resume Confirmation Modal */}
      {showParsedModal && parsedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Confirm Parsed Resume Data</h3>
              <button onClick={() => { setShowParsedModal(false); setParsedData(null); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-teal-800">AI has extracted the following information. Review and confirm to create the candidate.</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Name', value: parsedData.name },
                { label: 'Email', value: parsedData.email },
                { label: 'Phone', value: parsedData.phone },
                { label: 'Current Role', value: parsedData.currentRole },
                { label: 'Company', value: parsedData.company },
                { label: 'Experience', value: parsedData.yearsExperience ? `${parsedData.yearsExperience} years` : '' },
                { label: 'Education', value: parsedData.education },
              ].filter((f) => f.value).map((field) => (
                <div key={field.label} className="flex items-start">
                  <span className="text-xs font-medium text-slate-500 w-28 flex-shrink-0 pt-0.5">{field.label}</span>
                  <span className="text-sm text-slate-900">{field.value}</span>
                </div>
              ))}

              {parsedData.skills && parsedData.skills.length > 0 && (
                <div className="flex items-start">
                  <span className="text-xs font-medium text-slate-500 w-28 flex-shrink-0 pt-0.5">Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {parsedData.summary && (
                <div>
                  <span className="text-xs font-medium text-slate-500">Summary</span>
                  <p className="text-sm text-slate-700 mt-1 bg-slate-50 rounded-lg p-3">{parsedData.summary}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => { setShowParsedModal(false); setParsedData(null); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleConfirmParsed}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Create Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
