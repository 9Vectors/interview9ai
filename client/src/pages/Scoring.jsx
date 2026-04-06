import { useState } from 'react';
import toast from 'react-hot-toast';
import { Star, Target, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import useStore from '../services/store';
import { QUESTIONS, STAR_FRAMEWORK, SCORING_SCALE, MEASUREMENT13_ATTRIBUTES } from '../data/questions';

export default function Scoring() {
  const { candidates, interviews } = useStore();
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [scores, setScores] = useState({ situation: 0, task: 0, action: 0, result: 0 });
  const [m13Scores, setM13Scores] = useState({});
  const [notes, setNotes] = useState('');

  const activeCandidates = candidates.filter((c) => c.status === 'interviewing' || c.status === 'screening');
  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);
  const candidateInterviews = interviews.filter((i) => i.candidateId === selectedCandidateId);

  const setScore = (key, value) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const setM13Score = (attrId, value) => {
    setM13Scores((prev) => ({ ...prev, [attrId]: value }));
  };

  const weightedScore =
    Object.entries(STAR_FRAMEWORK).reduce((sum, [key, config]) => sum + (scores[key] || 0) * config.weight, 0).toFixed(2);

  const radarData = MEASUREMENT13_ATTRIBUTES.slice(0, 8).map((attr) => ({
    attribute: attr.name.length > 12 ? attr.name.slice(0, 12) + '...' : attr.name,
    score: m13Scores[attr.id] || 0,
    fullMark: 5,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Candidate Scoring</h1>
        <p className="text-slate-500 mt-1">STAR framework evaluation with 9Vectors and Measurement13 alignment</p>
      </div>

      {/* Candidate Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Candidate</label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Choose a candidate to score...</option>
              {activeCandidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.role} ({c.stage})
                </option>
              ))}
            </select>
          </div>
          {selectedCandidate && (
            <div className="text-right">
              <p className="text-sm text-slate-500">{candidateInterviews.length} interviews completed</p>
              <p className="text-lg font-bold text-teal-600">{selectedCandidate.scores.overall}/5 current score</p>
            </div>
          )}
        </div>
      </div>

      {selectedCandidateId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* STAR Scoring */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-900">STAR Framework Scoring</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Weighted Score</p>
                  <p className="text-2xl font-bold text-teal-600">{weightedScore}</p>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(STAR_FRAMEWORK).map(([key, config]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{config.label}</h4>
                        <p className="text-xs text-slate-500">{config.description}</p>
                      </div>
                      <span className="text-xs text-slate-400">Weight: {(config.weight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {SCORING_SCALE.map((scale) => (
                        <button
                          key={scale.value}
                          onClick={() => setScore(key, scale.value)}
                          className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all border ${
                            scores[key] === scale.value
                              ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-center">
                            <span className="block text-lg">{scale.value}</span>
                            <span className="block mt-0.5">{scale.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurement13 Scoring */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Measurement13 Leadership Attributes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MEASUREMENT13_ATTRIBUTES.map((attr) => (
                  <div key={attr.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-medium text-purple-600">#{attr.id} {attr.category}</span>
                        <p className="text-sm font-medium text-slate-900">{attr.name}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{m13Scores[attr.id] || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => setM13Score(attr.id, val)}
                          className={`flex-1 py-1 text-xs rounded transition-colors ${
                            m13Scores[attr.id] === val
                              ? 'bg-purple-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-500 hover:bg-purple-50'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Interview Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record observations, red flags, and key takeaways..."
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
              <button
                onClick={() => toast.success('Scores saved successfully')}
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Save Scores
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidate Summary */}
            {selectedCandidate && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 font-bold">
                      {selectedCandidate.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{selectedCandidate.name}</p>
                    <p className="text-sm text-slate-500">{selectedCandidate.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Overall</span>
                    <span className="font-medium text-slate-900">{selectedCandidate.scores.overall}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Culture Fit</span>
                    <span className="font-medium text-slate-900">{selectedCandidate.scores.culture}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Technical</span>
                    <span className="font-medium text-slate-900">{selectedCandidate.scores.technical}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Leadership</span>
                    <span className="font-medium text-slate-900">{selectedCandidate.scores.leadership}/5</span>
                  </div>
                </div>
              </div>
            )}

            {/* M13 Radar */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Leadership Profile</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 9, fill: '#64748B' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 9 }} />
                  <Radar name="Score" dataKey="score" stroke="#1e6b8c" fill="#1e6b8c" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Scoring Guide */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Scoring Guide</h3>
              <div className="space-y-2">
                {SCORING_SCALE.map((scale) => (
                  <div key={scale.value} className="flex items-start space-x-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: scale.color }}
                    >
                      {scale.value}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-slate-900">{scale.label}</p>
                      <p className="text-xs text-slate-500">{scale.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedCandidateId && (
        <div className="text-center py-16">
          <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Select a candidate above to begin scoring.</p>
        </div>
      )}
    </div>
  );
}
