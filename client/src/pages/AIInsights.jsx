import { useState } from 'react';
import toast from 'react-hot-toast';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Users, Target, Zap, MessageSquare } from 'lucide-react';
import useStore from '../services/store';
import { VECTORS, MEASUREMENT13_ATTRIBUTES } from '../data/questions';

const AI_INSIGHTS = [
  {
    id: 1,
    type: 'pattern',
    title: 'Rebel Producer Pattern Detected',
    candidate: 'Marcus Johnson',
    severity: 'high',
    description: 'High V6 Performance (Sales) score of 5.0 coupled with low V2 Culture (Teamwork) score of 3.0. This pattern — termed a "rebel producer" — indicates strong individual revenue generation but potential cultural toxicity. Recommend additional cultural fit validation through likability/compatibility questions (Ch. 6) before extending offer.',
    vectors: ['V2', 'V6'],
    recommendation: 'Schedule dedicated Culture Agent assessment with focus on V2 → Culture → Negative Behaviors and Politics & Power themes.',
  },
  {
    id: 2,
    type: 'gap',
    title: 'Strategic Thinking Gap — VP Engineering Candidate',
    candidate: 'Sarah Chen',
    severity: 'medium',
    description: 'Strong V2 → Leadership and V5 → Operations scores, but limited V4 → Strategy evaluation data. Senior management candidates require cross-vector evaluation per Falcone Ch. 11. A strong people leader without corresponding strategic acumen may struggle at VP level.',
    vectors: ['V2', 'V4', 'V5'],
    recommendation: 'Add senior management questions (Q027, Q028, Q029) to assess Strategic Vision and Environmental Scanning capabilities.',
  },
  {
    id: 3,
    type: 'recommendation',
    title: 'CFO Candidate — Strong Hire Signal',
    candidate: 'David Kim',
    severity: 'positive',
    description: 'Cross-vector evaluation shows exceptional scores: V3 → Finance (4.8), V2 → Leadership (4.7), V7 → Board management confirmed via reference check. Measurement13 attributes #1 Vision, #2 Strategic Thinking, and #3 Decision Making all score 4+. Reference triangulation validated with 0 discrepancy gaps.',
    vectors: ['V2', 'V3', 'V7'],
    recommendation: 'Proceed with offer. Prepare 90-day onboarding plan aligned to V3 → Financial Model and V4 → General Strategy priorities.',
  },
  {
    id: 4,
    type: 'benchmark',
    title: 'Interview Quality Benchmark',
    candidate: null,
    severity: 'info',
    description: 'Your organization has completed 2 structured interviews this period. The average STAR score across all interviews is 4.0/5.0, which is above the platform benchmark of 3.5. Achievement-anchored questions (Ch. 2) are producing the highest-quality evaluation data.',
    vectors: [],
    recommendation: 'Continue emphasizing achievement-anchored questions. Consider adding pressure-cooker questions earlier in the process for senior roles.',
  },
];

const severityStyles = {
  high: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, iconColor: 'text-red-500', label: 'High Priority', labelBg: 'bg-red-100 text-red-700' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500', label: 'Medium', labelBg: 'bg-amber-100 text-amber-700' },
  positive: { bg: 'bg-green-50', border: 'border-green-200', icon: TrendingUp, iconColor: 'text-green-500', label: 'Positive', labelBg: 'bg-green-100 text-green-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Sparkles, iconColor: 'text-blue-500', label: 'Insight', labelBg: 'bg-blue-100 text-blue-700' },
};

export default function AIInsights() {
  const { candidates } = useStore();
  const [selectedType, setSelectedType] = useState('all');
  const [chatInput, setChatInput] = useState('');

  const types = [
    { id: 'all', label: 'All Insights' },
    { id: 'pattern', label: 'Pattern Detection' },
    { id: 'gap', label: 'Gap Analysis' },
    { id: 'recommendation', label: 'Recommendations' },
    { id: 'benchmark', label: 'Benchmarks' },
  ];

  const filtered = selectedType === 'all' ? AI_INSIGHTS : AI_INSIGHTS.filter((i) => i.type === selectedType);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">AI Insights</h1>
        <p className="text-slate-500 mt-1">Claude-powered interview intelligence with 9Vectors and Measurement13 analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type.id ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Insights */}
          {filtered.map((insight) => {
            const style = severityStyles[insight.severity];
            const Icon = style.icon;
            return (
              <div key={insight.id} className={`${style.bg} border ${style.border} rounded-lg p-6`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-5 w-5 ${style.iconColor} mt-0.5`} />
                    <div>
                      <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                      {insight.candidate && <p className="text-sm text-slate-500 mt-0.5">{insight.candidate}</p>}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style.labelBg}`}>{style.label}</span>
                </div>
                <p className="text-sm text-slate-700 mb-4">{insight.description}</p>
                {insight.vectors.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    {insight.vectors.map((vId) => {
                      const v = VECTORS.find((vec) => vec.id === vId);
                      return (
                        <span key={vId} className="flex items-center text-xs bg-white px-2 py-1 rounded-full border border-slate-200">
                          <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: v?.color }} />
                          {v?.name}
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="border-l-4 border-teal-500 pl-3 bg-white/50 p-3 rounded-r-lg">
                  <p className="text-xs font-semibold text-teal-700">Recommendation</p>
                  <p className="text-sm text-slate-700 mt-1">{insight.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Chat */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center mb-4">
              <Brain className="h-5 w-5 text-teal-600 mr-2" />
              <h3 className="text-sm font-semibold text-slate-900">Ask the Interview Agent</h3>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 mb-4 min-h-[200px]">
              <div className="flex items-start space-x-2 mb-3">
                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm text-slate-600">
                  I'm the Interview Intelligence Agent. Ask me about candidate evaluations, question recommendations, or 9Vectors analysis for any candidate in your pipeline.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about a candidate..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={() => { if (chatInput.trim()) { toast('Message sent'); setChatInput(''); } }}
                className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Platform Status */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Platform Integrations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">TheGreyMatter.ai</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Measurement13.ai</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">9Vectors.ai</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">OrgDesign9.ai</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Available</span>
              </div>
            </div>
          </div>

          {/* Agent Capabilities */}
          <div className="border-l-4 border-brand-orange pl-4 bg-orange-50 p-4 rounded-r-lg">
            <p className="text-sm font-semibold text-orange-800">Agent Capabilities</p>
            <ul className="mt-2 space-y-1 text-xs text-orange-700">
              <li>• Pattern detection (rebel producer, validation gaps)</li>
              <li>• Cross-vector gap analysis</li>
              <li>• Measurement13 attribute scoring</li>
              <li>• Reference triangulation</li>
              <li>• Predictive hiring models</li>
              <li>• Interview question recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
