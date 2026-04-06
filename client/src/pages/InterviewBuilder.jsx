import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Clock, Save, Shuffle, GripVertical, ChevronDown } from 'lucide-react';
import { QUESTIONS, CATEGORIES, ROLE_LEVELS, VECTORS } from '../data/questions';
import useStore from '../services/store';

export default function InterviewBuilder() {
  const { interviewPlans, addInterviewPlan } = useStore();
  const [planName, setPlanName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const availableQuestions = QUESTIONS.filter((q) => {
    const matchesRole = !selectedRole || q.roleRelevance.includes('all') || q.roleRelevance.includes(selectedRole);
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    const notSelected = !selectedQuestions.includes(q.id);
    return matchesRole && matchesCategory && notSelected;
  });

  const addQuestion = (qId) => {
    setSelectedQuestions([...selectedQuestions, qId]);
  };

  const removeQuestion = (qId) => {
    setSelectedQuestions(selectedQuestions.filter((id) => id !== qId));
  };

  const autoGenerate = () => {
    if (!selectedRole) return;
    const roleQuestions = QUESTIONS.filter(
      (q) => q.roleRelevance.includes('all') || q.roleRelevance.includes(selectedRole)
    );
    // Pick a balanced set: 2 traditional, 2 achievement, 1 holistic, 1 stability, 1 likability, 2 role-specific, 2 pressure cooker, 1 final
    const categories = ['traditional', 'achievement', 'holistic', 'stability', 'likability', 'pressure', 'final'];
    const picked = [];
    categories.forEach((cat) => {
      const catQuestions = roleQuestions.filter((q) => q.category === cat);
      const count = cat === 'achievement' || cat === 'pressure' ? 2 : 1;
      const shuffled = catQuestions.sort(() => Math.random() - 0.5);
      picked.push(...shuffled.slice(0, count).map((q) => q.id));
    });
    // Add role-specific questions
    const roleSpecific = roleQuestions.filter(
      (q) => !['traditional', 'achievement', 'holistic', 'stability', 'likability', 'pressure', 'final'].includes(q.category)
    );
    picked.push(...roleSpecific.sort(() => Math.random() - 0.5).slice(0, 2).map((q) => q.id));
    setSelectedQuestions(picked);
  };

  const savePlan = () => {
    if (!planName || selectedQuestions.length === 0) return;
    addInterviewPlan({
      name: planName,
      roleLevel: selectedRole,
      questions: selectedQuestions,
      stages: [...new Set(selectedQuestions.map((qId) => QUESTIONS.find((q) => q.id === qId)?.category).filter(Boolean))],
      estimatedDuration: selectedQuestions.length * 7,
    });
    toast.success('Interview plan saved successfully');
    setPlanName('');
    setSelectedRole('');
    setSelectedQuestions([]);
  };

  const estimatedMinutes = selectedQuestions.length * 7;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Interview Builder</h1>
        <p className="text-slate-500 mt-1">Build structured interview plans with Falcone methodology and 9Vectors alignment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Details */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Plan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., Senior Engineering Interview"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role Level</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select role level...</option>
                  {ROLE_LEVELS.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={autoGenerate}
                disabled={!selectedRole}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Auto-Generate Plan
              </button>
              <button
                onClick={() => setShowQuestionPicker(!showQuestionPicker)}
                className="flex items-center px-4 py-2 border border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Questions Manually
              </button>
            </div>
          </div>

          {/* Question Picker */}
          {showQuestionPicker && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Add Questions</h3>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {availableQuestions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-1 mr-4">
                      <p className="text-sm text-slate-900">{q.text}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-400">{q.id}</span>
                        <span className="text-xs text-teal-600">{CATEGORIES.find((c) => c.id === q.category)?.name}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addQuestion(q.id)}
                      className="p-1.5 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Questions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Interview Questions ({selectedQuestions.length})
              </h3>
              <div className="flex items-center text-sm text-slate-500">
                <Clock className="h-4 w-4 mr-1" />
                ~{estimatedMinutes} minutes
              </div>
            </div>
            {selectedQuestions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No questions selected yet.</p>
                <p className="text-sm mt-1">Use Auto-Generate or add questions manually.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedQuestions.map((qId, index) => {
                  const question = QUESTIONS.find((q) => q.id === qId);
                  if (!question) return null;
                  const category = CATEGORIES.find((c) => c.id === question.category);
                  return (
                    <div key={qId} className="flex items-center p-3 bg-slate-50 rounded-lg group">
                      <GripVertical className="h-4 w-4 text-slate-300 mr-3 cursor-grab" />
                      <span className="text-xs font-mono text-slate-400 mr-3 w-6">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">{question.text}</p>
                        <span className="text-xs text-teal-600">{category?.name}</span>
                      </div>
                      <button
                        onClick={() => removeQuestion(qId)}
                        className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Save Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <button
              onClick={savePlan}
              disabled={!planName || selectedQuestions.length === 0}
              className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Interview Plan
            </button>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>Questions: {selectedQuestions.length}</p>
              <p>Est. Duration: ~{estimatedMinutes} min</p>
              <p>Vectors Covered: {[...new Set(selectedQuestions.flatMap((qId) => QUESTIONS.find((q) => q.id === qId)?.vectorMapping.map((vm) => vm.vector) || []))].length}/9</p>
            </div>
          </div>

          {/* Saved Plans */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Saved Plans</h3>
            <div className="space-y-3">
              {interviewPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    setPlanName(plan.name);
                    setSelectedRole(plan.roleLevel);
                    setSelectedQuestions([...plan.questions]);
                  }}
                  className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-900">{plan.name}</p>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500">
                    <span>{plan.questions.length} questions</span>
                    <span>~{plan.estimatedDuration} min</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Methodology Tip */}
          <div className="border-l-4 border-brand-orange pl-4 bg-orange-50 p-4 rounded-r-lg">
            <p className="text-sm font-semibold text-orange-800">Falcone Best Practice</p>
            <p className="text-sm text-orange-700 mt-1">
              Balance your interview across categories: Traditional → Achievement → Role-Specific → Pressure Cooker → Final Round.
              This progression builds rapport before challenging the candidate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
