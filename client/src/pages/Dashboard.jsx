import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Users, ClipboardList, Star, TrendingUp, TrendingDown,
  Calendar, Brain, ArrowRight, BookOpen, RefreshCw, Plus,
  UserPlus, Lightbulb, Target,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import useStore from '../services/store';
import { VECTORS, MEASUREMENT13_ATTRIBUTES } from '../data/questions';
import VectorRadarChart from '../components/VectorRadarChart';
import VectorScoreGrid from '../components/VectorScoreGrid';

function KPICard({ label, value, trend, icon: Icon, iconBg }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBg}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ml-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% from last period
          </span>
        </div>
      )}
    </div>
  );
}

function GettingStartedStepCard({ number, title, description, link, icon: Icon }) {
  return (
    <Link to={link} className="flex flex-col items-start p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md hover:border-teal-300 transition-all group">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {number}
        </div>
        <h4 className="font-semibold text-slate-900 text-sm group-hover:text-teal-700">{title}</h4>
      </div>
      <p className="text-xs text-slate-500 ml-11">{description}</p>
    </Link>
  );
}

function GettingStartedCard({ roleName }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-teal-600/30 bg-teal-50/50 p-6 mb-8">
      <div className="flex items-start space-x-3 mb-4">
        <div className="p-2 bg-teal-100 rounded-lg">
          <Lightbulb className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Your {roleName || 'hiring'} process is ready! Here is what to do next:
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">Follow these steps to complete your structured interview pipeline.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GettingStartedStepCard
          number={1}
          title="Add Candidates"
          description="Add candidates manually or upload resumes for AI parsing"
          link="/app/candidates"
          icon={UserPlus}
        />
        <GettingStartedStepCard
          number={2}
          title="Build Interview Plan"
          description="Auto-generate structured interview questions from the Falcone library"
          link="/app/builder"
          icon={ClipboardList}
        />
        <GettingStartedStepCard
          number={3}
          title="Score & Evaluate"
          description="Use STAR framework scoring with M13 leadership attributes"
          link="/app/scoring"
          icon={Target}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
        <ClipboardList className="h-10 w-10 text-teal-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Interview9.ai</h1>
      <p className="text-slate-500 text-center max-w-md mb-8">
        Build structured, evidence-based hiring processes powered by the Falcone methodology and Measurement13 framework.
      </p>
      <Link
        to="/app/onboarding"
        className="flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
      >
        <ClipboardList className="h-5 w-5 mr-2" />
        Start Your First Hiring Process
        <ArrowRight className="h-5 w-5 ml-2" />
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { candidates, interviews, hiringProcesses } = useStore();
  const [vectorData, setVectorData] = useState(null);
  const [vectorLoading, setVectorLoading] = useState(false);

  useEffect(() => {
    const fetchVectorData = async () => {
      setVectorLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiBase}/api/vectors/current`);
        if (res.ok) {
          const json = await res.json();
          setVectorData(json.data);
        }
      } catch (err) {
        console.warn('Failed to fetch vector scores:', err.message);
      } finally {
        setVectorLoading(false);
      }
    };
    if (hiringProcesses.length > 0) {
      fetchVectorData();
    }
  }, [hiringProcesses]);

  if (hiringProcesses.length === 0) {
    return <EmptyState />;
  }

  const activeCandidates = candidates.filter((c) => c.status === 'interviewing' || c.status === 'screening');
  const offersExtended = candidates.filter((c) => c.status === 'offer');
  const completedInterviews = interviews.filter((i) => i.status === 'completed');

  const pipelineData = [
    { stage: 'Screening', count: candidates.filter((c) => c.status === 'screening').length, fill: '#a8d8e8' },
    { stage: 'Interviewing', count: candidates.filter((c) => c.status === 'interviewing').length, fill: '#3a9bc8' },
    { stage: 'Offer', count: candidates.filter((c) => c.status === 'offer').length, fill: '#1e6b8c' },
    { stage: 'Hired', count: 0, fill: '#10B981' },
    { stage: 'Rejected', count: candidates.filter((c) => c.status === 'rejected').length, fill: '#EF4444' },
  ];

  const roleDistribution = [
    { name: 'Senior', value: candidates.filter((c) => c.roleLevel === 'senior').length, color: '#1e6b8c' },
    { name: 'Mid-Level', value: candidates.filter((c) => c.roleLevel === 'mid').length, color: '#3a9bc8' },
    { name: 'Sales', value: candidates.filter((c) => c.roleLevel === 'sales').length, color: '#f5a623' },
    { name: 'Executive', value: candidates.filter((c) => c.roleLevel === 'executive').length, color: '#8B5CF6' },
    { name: 'Individual', value: candidates.filter((c) => c.roleLevel === 'individual').length, color: '#10B981' },
  ].filter((d) => d.value > 0);

  const avgScore = activeCandidates.length
    ? (activeCandidates.reduce((sum, c) => sum + c.scores.overall, 0) / activeCandidates.length).toFixed(1)
    : '0.0';

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Interview Intelligence Dashboard</h1>
          <p className="text-slate-500 mt-1">Structured behavioral interviewing powered by the 9Vectors framework</p>
        </div>
        <Link
          to="/app/candidates"
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard label="Active Candidates" value={activeCandidates.length} icon={Users} iconBg="bg-teal-600" />
        <KPICard label="Interviews Completed" value={completedInterviews.length} icon={ClipboardList} iconBg="bg-blue-500" />
        <KPICard label="Avg. Candidate Score" value={`${avgScore}/5`} icon={Star} iconBg="bg-brand-orange" />
        <KPICard label="Offers Extended" value={offersExtended.length} icon={TrendingUp} iconBg="bg-emerald-500" />
      </div>

      {/* Getting Started — shown when process exists but no candidates yet */}
      {candidates.length === 0 && hiringProcesses.length > 0 && (
        <GettingStartedCard roleName={hiringProcesses[0]?.roleName} />
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pipeline Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Candidate Pipeline</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {pipelineData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Role Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {roleDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {roleDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center text-xs">
                <div className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9Vectors Assessment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Radar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">9Vectors Alignment</h3>
              <p className="text-sm text-slate-500">
                {vectorData ? `Overall: ${vectorData.overallScore}%` : 'Active vectors'}
              </p>
            </div>
          </div>
          {vectorLoading ? (
            <div className="h-48 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
            </div>
          ) : vectorData ? (
            <VectorRadarChart vectors={vectorData.vectors} size="compact" />
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">
              No assessment data yet
            </div>
          )}
        </div>

        {/* Score Grid */}
        <div className="lg:col-span-2">
          <VectorScoreGrid vectors={vectorData?.vectors || []} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Interviews</h3>
            <Link to="/candidates" className="text-sm text-teal-600 hover:text-teal-700 flex items-center">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {candidates
              .filter((c) => c.nextInterview)
              .sort((a, b) => new Date(a.nextInterview) - new Date(b.nextInterview))
              .slice(0, 4)
              .map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-700 font-semibold text-sm">
                        {candidate.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{candidate.name}</p>
                      <p className="text-xs text-slate-500">{candidate.role} — {candidate.stage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-teal-600">
                      {new Date(candidate.nextInterview).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {candidate.interviewCount} completed
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/builder" className="flex items-center p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                <ClipboardList className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-sm font-medium text-teal-700">Build Interview</span>
              </Link>
              <Link to="/questions" className="flex items-center p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                <BookOpen className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-sm font-medium text-teal-700">Question Library</span>
              </Link>
              <Link to="/scoring" className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <Star className="h-5 w-5 text-brand-orange mr-2" />
                <span className="text-sm font-medium text-orange-700">Score Candidate</span>
              </Link>
              <Link to="/ai-insights" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Brain className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-700">AI Insights</span>
              </Link>
            </div>
          </div>

          {/* Alerts will be populated from AI Insights when candidates are scored */}
        </div>
      </div>
    </div>
  );
}
