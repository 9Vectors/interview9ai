import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, Download, Calendar, BarChart3, Users, TrendingUp, Loader2, ArrowLeft, Printer, X } from 'lucide-react';
import useStore from '../services/store';

const REPORT_TYPES = [
  { id: 'candidate-summary', name: 'Candidate Summary Report', description: 'Complete candidate evaluation with STAR scores, Measurement13 profile, and reference validation', icon: Users, format: 'HTML/Print', requiresCandidate: true },
  { id: 'interview-analysis', name: 'Interview Analysis Report', description: 'Detailed analysis of interview responses with 9Vectors mapping and red flag identification', icon: BarChart3, format: 'HTML/Print', requiresCandidate: false },
  { id: 'pipeline-health', name: 'Pipeline Health Report', description: 'Overview of hiring pipeline metrics, conversion rates, and bottleneck analysis', icon: TrendingUp, format: 'HTML/Print', requiresCandidate: false },
  { id: 'hiring-decision', name: 'Hiring Decision Package', description: 'Board-ready hiring recommendation with cross-vector analysis and risk assessment', icon: FileText, format: 'HTML/Print', requiresCandidate: true },
];

function ReportViewer({ report, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const renderCandidateSummary = (data) => (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">{data.candidateName || 'Candidate'} - Summary Report</h2>
        <p className="text-sm text-slate-500 mt-1">Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {data.overview && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Overview</h3>
          <p className="text-sm text-slate-700">{data.overview}</p>
        </div>
      )}

      {data.scores && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Assessment Scores</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.scores).map(([key, val]) => (
              <div key={key} className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500 capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-lg font-bold text-slate-900">{typeof val === 'number' ? `${val}/5` : val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.strengths && data.strengths.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Strengths</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.strengths.map((s, i) => <li key={i} className="text-sm text-slate-700">{s}</li>)}
          </ul>
        </div>
      )}

      {data.concerns && data.concerns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Areas of Concern</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.concerns.map((c, i) => <li key={i} className="text-sm text-slate-700">{c}</li>)}
          </ul>
        </div>
      )}

      {data.recommendation && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-teal-900 mb-1">Recommendation</h3>
          <p className="text-sm text-teal-800">{data.recommendation}</p>
        </div>
      )}
    </div>
  );

  const renderPipelineHealth = (data) => (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Pipeline Health Report</h2>
        <p className="text-sm text-slate-500 mt-1">Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {data.summary && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Executive Summary</h3>
          <p className="text-sm text-slate-700">{data.summary}</p>
        </div>
      )}

      {data.metrics && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Metrics</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(data.metrics).map(([key, val]) => (
              <div key={key} className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-slate-500 capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-xl font-bold text-slate-900">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.funnel && data.funnel.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Hiring Funnel</h3>
          <div className="space-y-2">
            {data.funnel.map((stage, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-slate-900">{stage.count}</span>
                  {stage.conversionRate && <span className="text-xs text-slate-500">{stage.conversionRate}% conversion</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.bottlenecks && data.bottlenecks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bottlenecks Identified</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.bottlenecks.map((b, i) => <li key={i} className="text-sm text-slate-700">{b}</li>)}
          </ul>
        </div>
      )}

      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.recommendations.map((r, i) => <li key={i} className="text-sm text-blue-800">{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );

  const renderInterviewAnalysis = (data) => (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Interview Analysis Report</h2>
        <p className="text-sm text-slate-500 mt-1">Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {data.summary && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Summary</h3>
          <p className="text-sm text-slate-700">{data.summary}</p>
        </div>
      )}

      {data.questionEffectiveness && data.questionEffectiveness.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Question Effectiveness</h3>
          <div className="space-y-2">
            {data.questionEffectiveness.map((q, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{q.category || q.question}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    q.rating === 'high' ? 'bg-green-100 text-green-700' :
                    q.rating === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>{q.rating}</span>
                </div>
                {q.insight && <p className="text-xs text-slate-500 mt-1">{q.insight}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.scoringPatterns && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Scoring Patterns</h3>
          <p className="text-sm text-slate-700">{data.scoringPatterns}</p>
        </div>
      )}

      {data.calibrationNotes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-amber-900 mb-1">Calibration Notes</h3>
          <p className="text-sm text-amber-800">{data.calibrationNotes}</p>
        </div>
      )}
    </div>
  );

  const renderHiringDecision = (data) => (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">{data.candidateName || 'Candidate'} - Hiring Decision Package</h2>
        <p className="text-sm text-slate-500 mt-1">Board-Ready Assessment | Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {data.executiveSummary && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Executive Summary</h3>
          <p className="text-sm text-slate-700">{data.executiveSummary}</p>
        </div>
      )}

      {data.decision && (
        <div className={`rounded-lg p-4 border ${
          data.decision === 'proceed' ? 'bg-green-50 border-green-200' :
          data.decision === 'hold' ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        }`}>
          <h3 className={`text-lg font-bold ${
            data.decision === 'proceed' ? 'text-green-900' :
            data.decision === 'hold' ? 'text-amber-900' :
            'text-red-900'
          }`}>
            Recommendation: {data.decision === 'proceed' ? 'PROCEED TO HIRE' : data.decision === 'hold' ? 'HOLD / FURTHER REVIEW' : 'DECLINE'}
          </h3>
          {data.confidence && <p className="text-sm mt-1 opacity-80">Confidence: {Math.round(data.confidence * 100)}%</p>}
        </div>
      )}

      {data.vectorAlignment && Object.keys(data.vectorAlignment).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">9Vectors Alignment</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(data.vectorAlignment).map(([vector, assessment]) => (
              <div key={vector} className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500">{vector}</p>
                <p className="text-sm font-medium text-slate-900">{assessment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.riskFactors && data.riskFactors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Risk Factors</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.riskFactors.map((r, i) => <li key={i} className="text-sm text-slate-700">{r}</li>)}
          </ul>
        </div>
      )}

      {data.nextSteps && data.nextSteps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Recommended Next Steps</h3>
          <ol className="list-decimal list-inside space-y-1">
            {data.nextSteps.map((s, i) => <li key={i} className="text-sm text-slate-700">{s}</li>)}
          </ol>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (!report || !report.data) return <p className="text-slate-500">No report data available.</p>;
    const d = report.data;
    switch (report.type) {
      case 'candidate-summary': return renderCandidateSummary(d);
      case 'pipeline-health': return renderPipelineHealth(d);
      case 'interview-analysis': return renderInterviewAnalysis(d);
      case 'hiring-decision': return renderHiringDecision(d);
      default: return <pre className="text-sm text-slate-700 whitespace-pre-wrap">{JSON.stringify(d, null, 2)}</pre>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{REPORT_TYPES.find((r) => r.id === report.type)?.name || 'Report'}</h3>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrint} className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors">
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto print:overflow-visible">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const { candidates, interviews } = useStore();
  const [generating, setGenerating] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [viewingReport, setViewingReport] = useState(null);
  const [generatedReports, setGeneratedReports] = useState([]);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleGenerate = async (reportType) => {
    const report = REPORT_TYPES.find((r) => r.id === reportType);
    if (report.requiresCandidate && !selectedCandidate) {
      toast.error('Please select a candidate first');
      return;
    }

    setGenerating(reportType);
    try {
      let url = '';
      switch (reportType) {
        case 'candidate-summary':
          url = `${apiBase}/api/v1/reports/candidate/${selectedCandidate}`;
          break;
        case 'pipeline-health':
          url = `${apiBase}/api/v1/reports/pipeline`;
          break;
        case 'interview-analysis':
          url = `${apiBase}/api/v1/reports/analysis`;
          break;
        case 'hiring-decision':
          url = `${apiBase}/api/v1/reports/decision/${selectedCandidate}`;
          break;
        default:
          throw new Error('Unknown report type');
      }

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Failed to generate report');
      }

      const result = await res.json();
      const newReport = {
        id: `RPT-${Date.now()}`,
        type: reportType,
        data: result.data,
        candidateId: selectedCandidate || null,
        candidateName: candidates.find((c) => c.id === selectedCandidate)?.name || '',
        generatedAt: new Date().toISOString(),
      };

      setGeneratedReports((prev) => [newReport, ...prev]);
      setViewingReport(newReport);
      toast.success('Report generated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 mt-1">Generate interview assessments and hiring decision packages</p>
      </div>

      {/* Candidate Selector */}
      {candidates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Candidate (required for candidate-specific reports)</label>
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Choose a candidate...</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name} - {c.role}</option>
            ))}
          </select>
        </div>
      )}

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          return (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{report.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{report.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-400">Format: {report.format}</span>
                    <button
                      onClick={() => handleGenerate(report.id)}
                      disabled={isGenerating}
                      className="flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1.5" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generated Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Generated Reports</h3>
        {generatedReports.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No reports generated yet. Select a report type above to get started.</p>
        ) : (
          <div className="space-y-3">
            {generatedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {report.candidateName ? `${report.candidateName} - ` : ''}
                      {REPORT_TYPES.find((r) => r.id === report.type)?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(report.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingReport(report)}
                  className="px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors text-sm font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Viewer Modal */}
      {viewingReport && (
        <ReportViewer report={viewingReport} onClose={() => setViewingReport(null)} />
      )}
    </div>
  );
}
