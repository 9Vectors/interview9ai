import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, Upload, CheckCircle2, AlertTriangle, Info,
  ArrowRight, ArrowLeft, XCircle, File, Trash2,
} from 'lucide-react';
import useStore from '../services/store';

const DOCUMENT_TIERS = [
  {
    tier: 'blocker',
    label: 'Blockers',
    description: 'Required before any interviews can proceed.',
    color: 'red',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-700',
    badgeClass: 'bg-red-100 text-red-700',
    icon: XCircle,
    documents: [
      { type: 'job-description', label: 'Job Description / Role Specification', hint: 'PDF, DOCX, or TXT with the full role spec.' },
      { type: 'competency-framework', label: 'Competency Framework / Scoring Rubric', hint: 'Defines what "good" looks like for each attribute.' },
    ],
  },
  {
    tier: 'required',
    label: 'Required',
    description: 'Needed for a complete hiring process. Can proceed without, but with gaps.',
    color: 'amber',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-700',
    badgeClass: 'bg-amber-100 text-amber-700',
    icon: AlertTriangle,
    documents: [
      { type: 'org-chart', label: 'Organizational Chart (Hiring Team Context)', hint: 'Shows where this role fits in the hierarchy.' },
      { type: 'department-strategy', label: 'Department Strategy / Goals', hint: 'Current departmental objectives and KPIs.' },
      { type: 'compensation-benchmarks', label: 'Compensation Benchmarks', hint: 'Market comp data or internal band info.' },
    ],
  },
  {
    tier: 'recommended',
    label: 'Recommended',
    description: 'Enhances interview quality and contextual intelligence.',
    color: 'blue',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-700',
    icon: Info,
    documents: [
      { type: 'previous-scorecards', label: 'Previous Interview Scorecards', hint: 'Past scoring patterns for similar roles.' },
      { type: 'culture-assessment', label: 'Team Culture Assessment (from Culture9)', hint: 'Culture9 report for this team or department.' },
      { type: 'evp-document', label: 'Employee Value Proposition Document', hint: 'What you offer candidates in return.' },
      { type: 'onboarding-plan', label: 'Onboarding Plan for the Role', hint: 'First 90-day expectations and ramp plan.' },
    ],
  },
];

function DocumentCard({ doc, uploaded, onUpload, onRemove }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${uploaded ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${uploaded ? 'bg-green-100' : 'bg-slate-100'}`}>
          {uploaded ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <File className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium ${uploaded ? 'text-green-800' : 'text-slate-700'}`}>{doc.label}</p>
          <p className="text-xs text-slate-500 truncate">{uploaded ? uploaded.fileName : doc.hint}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
        {uploaded ? (
          <button
            onClick={() => onRemove(uploaded.id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => onUpload(doc.type)}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
          >
            <Upload className="h-3.5 w-3.5 mr-1" /> Upload
          </button>
        )}
      </div>
    </div>
  );
}

export default function DocumentRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hiringProcesses, processDocuments, addProcessDocument } = useStore();
  const [uploading, setUploading] = useState(null);

  const process = hiringProcesses.find((p) => p.id === id);
  const docs = processDocuments.filter((d) => d.processId === id);

  if (!process) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Hiring process not found.</p>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const getUploadedDoc = (type) => docs.find((d) => d.type === type);

  const handleUpload = (type) => {
    // Mock upload: simulate selecting a file
    setUploading(type);
    setTimeout(() => {
      const tierDoc = DOCUMENT_TIERS.flatMap((t) => t.documents).find((d) => d.type === type);
      addProcessDocument({
        processId: id,
        type,
        fileName: `${tierDoc?.label || type}.pdf`,
        fileSize: Math.floor(Math.random() * 500 + 50) + 'KB',
        status: 'processed',
      });
      setUploading(null);
    }, 800);
  };

  const handleRemove = (docId) => {
    // In production, would call removeProcessDocument
    // For mock, this is a no-op since we don't have delete in store
  };

  // Readiness calculation
  const blockerDocs = DOCUMENT_TIERS.find((t) => t.tier === 'blocker').documents;
  const requiredDocs = DOCUMENT_TIERS.find((t) => t.tier === 'required').documents;
  const recommendedDocs = DOCUMENT_TIERS.find((t) => t.tier === 'recommended').documents;

  const blockerCount = blockerDocs.filter((d) => getUploadedDoc(d.type)).length;
  const requiredCount = requiredDocs.filter((d) => getUploadedDoc(d.type)).length;
  const recommendedCount = recommendedDocs.filter((d) => getUploadedDoc(d.type)).length;

  const allBlockersMet = blockerCount === blockerDocs.length;
  const totalUploaded = blockerCount + requiredCount + recommendedCount;
  const totalPossible = blockerDocs.length + requiredDocs.length + recommendedDocs.length;
  const completionPercent = Math.round((totalUploaded / totalPossible) * 100);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Document Room</h1>
          <p className="text-slate-500 text-sm mt-1">
            {process.roleName} &mdash; {process.department}
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{completionPercent}% complete</p>
              <p className="text-xs text-slate-500">{totalUploaded}/{totalPossible} documents</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={allBlockersMet ? 'text-teal-600' : 'text-amber-500'}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${completionPercent}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Readiness banner */}
      {allBlockersMet ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-semibold text-green-800">Ready to proceed</p>
              <p className="text-xs text-green-700">All blocker documents uploaded. You can start interviewing.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Blocker documents missing</p>
            <p className="text-xs text-red-700">Upload all blocker documents before you can start interviews.</p>
          </div>
        </div>
      )}

      {/* Document tiers */}
      <div className="space-y-6">
        {DOCUMENT_TIERS.map((tier) => {
          const TierIcon = tier.icon;
          const uploadedInTier = tier.documents.filter((d) => getUploadedDoc(d.type)).length;

          return (
            <div key={tier.tier} className={`rounded-xl border ${tier.borderClass} ${tier.bgClass} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <TierIcon className={`h-5 w-5 ${tier.textClass}`} />
                  <div>
                    <h2 className={`text-lg font-bold ${tier.textClass}`}>{tier.label}</h2>
                    <p className="text-xs text-slate-500">{tier.description}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tier.badgeClass}`}>
                  {uploadedInTier}/{tier.documents.length}
                </span>
              </div>

              <div className="space-y-3">
                {tier.documents.map((doc) => (
                  <DocumentCard
                    key={doc.type}
                    doc={doc}
                    uploaded={getUploadedDoc(doc.type)}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
