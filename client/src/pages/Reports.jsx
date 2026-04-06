import toast from 'react-hot-toast';
import { FileText, Download, Calendar, BarChart3, Users, TrendingUp } from 'lucide-react';
import useStore from '../services/store';

const REPORT_TYPES = [
  { id: 'candidate-summary', name: 'Candidate Summary Report', description: 'Complete candidate evaluation with STAR scores, Measurement13 profile, and reference validation', icon: Users, format: 'PDF' },
  { id: 'interview-analysis', name: 'Interview Analysis Report', description: 'Detailed analysis of interview responses with 9Vectors mapping and red flag identification', icon: BarChart3, format: 'PDF' },
  { id: 'pipeline-health', name: 'Pipeline Health Report', description: 'Overview of hiring pipeline metrics, conversion rates, and bottleneck analysis', icon: TrendingUp, format: 'Excel' },
  { id: 'hiring-decision', name: 'Hiring Decision Package', description: 'Board-ready hiring recommendation with cross-vector analysis and risk assessment', icon: FileText, format: 'PDF/PPT' },
];

export default function Reports() {
  const { candidates, interviews } = useStore();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 mt-1">Generate interview assessments and hiring decision packages</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
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
                      onClick={() => toast.success('Report generated successfully')}
                      className="flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors"
                    >
                      <Download className="h-3 w-3 mr-1.5" />
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'David Kim — CFO Hiring Decision Package', date: '2026-02-06', type: 'PDF', status: 'Ready' },
            { name: 'Sarah Chen — Interview Analysis Report', date: '2026-02-04', type: 'PDF', status: 'Ready' },
            { name: 'Q1 2026 Pipeline Health Report', date: '2026-02-01', type: 'Excel', status: 'Ready' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{report.name}</p>
                  <p className="text-xs text-slate-500">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400">{report.type}</span>
                <button
                  onClick={() => toast.success('Download started')}
                  className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
