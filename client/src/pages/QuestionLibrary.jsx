import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Search, Filter, BookOpen, ChevronDown, ChevronRight, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { QUESTIONS, CATEGORIES, VECTORS, ROLE_LEVELS, MEASUREMENT13_ATTRIBUTES, SCORING_SCALE } from '../data/questions';

function QuestionCard({ question, expanded, onToggle }) {
  const category = CATEGORIES.find((c) => c.id === question.category);
  const mappedVectors = question.vectorMapping.map((vm) => VECTORS.find((v) => v.id === vm.vector));
  const m13Attrs = question.measurement13.map((id) => MEASUREMENT13_ATTRIBUTES.find((a) => a.id === id));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono text-slate-400">{question.id}</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-teal-50 text-teal-700 rounded-full">
                {category?.name}
              </span>
              {question.difficulty === 'pressure' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                  Pressure Cooker
                </span>
              )}
              {question.difficulty === 'advanced' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                  Advanced
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-900">{question.text}</p>
            <div className="flex items-center space-x-3 mt-2">
              {mappedVectors.map((v) => (
                <span key={v.id} className="flex items-center text-xs">
                  <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: v.color }} />
                  <span className="text-slate-500">{v.name}</span>
                </span>
              ))}
            </div>
          </div>
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
          {/* STAR Guidance */}
          <div>
            <div className="flex items-center mb-2">
              <Target className="h-4 w-4 text-teal-600 mr-2" />
              <h4 className="text-sm font-semibold text-slate-900">Interviewer Guidance (STAR)</h4>
            </div>
            <p className="text-sm text-slate-600">{question.starPrompt}</p>
          </div>

          {/* Vector Mapping Detail */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">9Vectors Mapping</h4>
            <div className="space-y-1">
              {question.vectorMapping.map((vm, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-slate-700">{vm.vector} → {vm.subVector}</span>
                  <span className="text-slate-500"> → {vm.themes.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Measurement13 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Measurement13 Attributes</h4>
            <div className="flex flex-wrap gap-2">
              {m13Attrs.map((attr) => (
                <span
                  key={attr.id}
                  className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-full"
                >
                  #{attr.id} {attr.name} ({attr.category})
                </span>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          {question.redFlags.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <h4 className="text-sm font-semibold text-red-700">Red Flags</h4>
              </div>
              <ul className="space-y-1">
                {question.redFlags.map((flag, i) => (
                  <li key={i} className="text-sm text-red-600 flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up */}
          {question.probeFollowUp && (
            <div>
              <div className="flex items-center mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="text-sm font-semibold text-slate-900">Probe Follow-Up</h4>
              </div>
              <p className="text-sm text-slate-600 italic">"{question.probeFollowUp}"</p>
            </div>
          )}

          {/* Role Relevance */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Role Relevance</h4>
            <div className="flex flex-wrap gap-2">
              {question.roleRelevance.map((role) => {
                const roleInfo = ROLE_LEVELS.find((r) => r.id === role) || { name: 'All Levels' };
                return (
                  <span key={role} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                    {role === 'all' ? 'All Levels' : roleInfo.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestionLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVector, setSelectedVector] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.starPrompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesVector =
        selectedVector === 'all' || q.vectorMapping.some((vm) => vm.vector === selectedVector);
      const matchesRole =
        selectedRole === 'all' ||
        q.roleRelevance.includes('all') ||
        q.roleRelevance.includes(selectedRole);
      return matchesSearch && matchesCategory && matchesVector && matchesRole;
    });
  }, [searchQuery, selectedCategory, selectedVector, selectedRole]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Question Library</h1>
        <p className="text-slate-500 mt-1">
          96+ structured behavioral interview questions aligned to the 9Vectors framework
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                Ch. {cat.chapter}: {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedVector}
            onChange={(e) => setSelectedVector(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Vectors</option>
            {VECTORS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id}: {v.name}
              </option>
            ))}
          </select>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Role Levels</option>
            {ROLE_LEVELS.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <BookOpen className="h-4 w-4 inline mr-1" />
            {filteredQuestions.length} questions found
          </p>
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded-full mr-1" /> Standard</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-amber-500 rounded-full mr-1" /> Advanced</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-1" /> Pressure Cooker</span>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            expanded={expandedQuestion === question.id}
            onToggle={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
          />
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No questions match your filters.</p>
        </div>
      )}
    </div>
  );
}
