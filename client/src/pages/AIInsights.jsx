import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Users, Target, Zap, MessageSquare, Loader2 } from 'lucide-react';
import useStore from '../services/store';
import { VECTORS, MEASUREMENT13_ATTRIBUTES } from '../data/questions';

const severityStyles = {
  high: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, iconColor: 'text-red-500', label: 'High Priority', labelBg: 'bg-red-100 text-red-700' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500', label: 'Medium', labelBg: 'bg-amber-100 text-amber-700' },
  positive: { bg: 'bg-green-50', border: 'border-green-200', icon: TrendingUp, iconColor: 'text-green-500', label: 'Positive', labelBg: 'bg-green-100 text-green-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Sparkles, iconColor: 'text-blue-500', label: 'Insight', labelBg: 'bg-blue-100 text-blue-700' },
};

export default function AIInsights() {
  const { candidates } = useStore();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiBase}/api/v1/ai/insights`);
        if (res.ok) {
          const json = await res.json();
          setInsights(json.data || []);
        }
      } catch (err) {
        console.warn('Failed to fetch AI insights:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const types = [
    { id: 'all', label: 'All Insights' },
    { id: 'pattern', label: 'Pattern Detection' },
    { id: 'gap', label: 'Gap Analysis' },
    { id: 'recommendation', label: 'Recommendations' },
    { id: 'benchmark', label: 'Benchmarks' },
  ];

  const filtered = selectedType === 'all' ? insights : insights.filter((i) => i.type === selectedType);

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

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No AI Insights Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Complete candidate interviews and scoring to generate AI-powered insights, pattern detection, and gap analysis.
              </p>
            </div>
          ) : (
            filtered.map((insight) => {
              const style = severityStyles[insight.severity] || severityStyles.info;
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
                  {insight.vectors && insight.vectors.length > 0 && (
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
                  {insight.recommendation && (
                    <div className="border-l-4 border-teal-500 pl-3 bg-white/50 p-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-teal-700">Recommendation</p>
                      <p className="text-sm text-slate-700 mt-1">{insight.recommendation}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
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
              <li>- Pattern detection (rebel producer, validation gaps)</li>
              <li>- Cross-vector gap analysis</li>
              <li>- Measurement13 attribute scoring</li>
              <li>- Reference triangulation</li>
              <li>- Predictive hiring models</li>
              <li>- Interview question recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
