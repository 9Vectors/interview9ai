import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ClipboardList, ArrowRight, ArrowLeft, Check,
  Briefcase, Users, Target, Calendar, PhoneCall, CheckCircle2,
  Building2, BarChart3,
} from 'lucide-react';
import useStore from '../services/store';
import { MEASUREMENT13_ATTRIBUTES } from '../data/questions';

const COMPETENCY_OPTIONS = [
  { id: 'leadership', label: 'Leadership' },
  { id: 'strategic-thinking', label: 'Strategic Thinking' },
  { id: 'culture-fit', label: 'Culture Fit' },
  { id: 'technical-skills', label: 'Technical Skills' },
  { id: 'communication', label: 'Communication' },
  { id: 'adaptability', label: 'Adaptability' },
  { id: 'integrity', label: 'Integrity' },
  { id: 'team-building', label: 'Team Building' },
  { id: 'results-orientation', label: 'Results Orientation' },
  { id: 'innovation', label: 'Innovation' },
];

const ROLE_LEVELS = [
  { id: 'entry', label: 'Entry Level' },
  { id: 'mid', label: 'Mid Level' },
  { id: 'senior', label: 'Senior' },
  { id: 'executive', label: 'Executive' },
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Sales', 'Marketing', 'Finance',
  'Operations', 'Human Resources', 'Legal', 'Executive', 'Other',
];

const INTERVIEW_TYPES = [
  { id: 'phone', label: 'Phone Screen' },
  { id: 'video', label: 'Video Interview' },
  { id: 'panel', label: 'Panel Interview' },
  { id: 'case', label: 'Case Study' },
];

const REFERENCE_TYPES = [
  { id: 'manager', label: 'Direct Manager' },
  { id: 'peer', label: 'Peer / Colleague' },
  { id: 'report', label: 'Direct Report' },
];

function StepIndicator({ steps, currentStep, labels }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                index < currentStep
                  ? 'bg-teal-600 text-white'
                  : index === currentStep
                  ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <span className={`text-xs mt-1.5 ${index === currentStep ? 'text-teal-700 font-medium' : 'text-slate-400'}`}>
              {labels[index]}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 mb-5 ${index < currentStep ? 'bg-teal-600' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Quick Path ──────────────────────────────────────────────────────────────────

function QuickStep1({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Role Basics</h2>
        <p className="text-sm text-slate-500">Tell us about the role you are hiring for.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
        <input
          type="text"
          value={data.roleName}
          onChange={(e) => onChange({ roleName: e.target.value })}
          placeholder="e.g. VP of Engineering"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Role Level</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ROLE_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onChange({ roleLevel: level.id })}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                data.roleLevel === level.id
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <select
          value={data.department}
          onChange={(e) => onChange({ department: e.target.value })}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function QuickStep2({ data, onChange }) {
  const toggle = (id) => {
    const current = data.competencies || [];
    if (current.includes(id)) {
      onChange({ competencies: current.filter((c) => c !== id) });
    } else if (current.length < 3) {
      onChange({ competencies: [...current, id] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Key Competencies</h2>
        <p className="text-sm text-slate-500">Select the top 3 competencies to assess for this role.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COMPETENCY_OPTIONS.map((comp) => {
          const selected = (data.competencies || []).includes(comp.id);
          return (
            <button
              key={comp.id}
              onClick={() => toggle(comp.id)}
              className={`p-3 rounded-lg border text-sm font-medium text-left transition-colors flex items-center justify-between ${
                selected
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{comp.label}</span>
              {selected && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center">
        {(data.competencies || []).length}/3 selected
      </p>
    </div>
  );
}

function QuickReview({ data }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Review & Create</h2>
        <p className="text-sm text-slate-500">An interview plan will be auto-generated from the Falcone methodology.</p>
      </div>

      <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
        <div className="p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</p>
          <p className="text-sm font-semibold text-slate-900 mt-1">{data.roleName || '--'}</p>
        </div>
        <div className="p-4 flex gap-8">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Level</p>
            <p className="text-sm font-semibold text-slate-900 mt-1 capitalize">{data.roleLevel || '--'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Department</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{data.department || '--'}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Top Competencies</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {(data.competencies || []).map((id) => {
              const comp = COMPETENCY_OPTIONS.find((c) => c.id === id);
              return (
                <span key={id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                  {comp?.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Auto-generated plan:</strong> Interview9 will create a structured interview plan using the Falcone 96 Great Interview Questions methodology, mapped to your selected competencies and role level.
        </p>
      </div>
    </div>
  );
}

// ── Full Path ───────────────────────────────────────────────────────────────────

function FullStep1({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Role Profile</h2>
        <p className="text-sm text-slate-500">Detailed role specification for precision interview planning.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Role Title</label>
          <input
            type="text"
            value={data.roleName}
            onChange={(e) => onChange({ roleName: e.target.value })}
            placeholder="e.g. VP of Engineering"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Role Level</label>
          <select
            value={data.roleLevel}
            onChange={(e) => onChange({ roleLevel: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Select level</option>
            {ROLE_LEVELS.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select
            value={data.department}
            onChange={(e) => onChange({ department: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reports To</label>
          <input
            type="text"
            value={data.reportsTo || ''}
            onChange={(e) => onChange({ reportsTo: e.target.value })}
            placeholder="e.g. CTO"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Team Size</label>
          <input
            type="number"
            value={data.teamSize || ''}
            onChange={(e) => onChange({ teamSize: e.target.value })}
            placeholder="e.g. 12"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
          <input
            type="text"
            value={data.salaryRange || ''}
            onChange={(e) => onChange({ salaryRange: e.target.value })}
            placeholder="e.g. $180k - $220k"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

const CULTURE_ATTRIBUTE_OPTIONS = [
  'Data-driven', 'Transparent', 'Collaborative', 'Deadline-oriented',
  'Innovation-focused', 'Risk-averse', 'Customer-centric', 'Process-oriented',
  'Agile', 'Results-driven', 'Hierarchical', 'Flat/egalitarian',
  'Entrepreneurial', 'Mission-driven', 'People-first', 'Performance-focused',
  'Quality-obsessed', 'Speed-oriented', 'Learning-oriented', 'Inclusive',
];

function FullStep2({ data, onChange }) {
  const selectedCulture = data.cultureAttributes || [];

  const toggleCulture = (attr) => {
    const current = Array.isArray(selectedCulture) ? selectedCulture : [];
    if (current.includes(attr)) {
      onChange({ cultureAttributes: current.filter((a) => a !== attr) });
    } else {
      onChange({ cultureAttributes: [...current, attr] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Department Context</h2>
        <p className="text-sm text-slate-500">Help Interview9 tailor questions to your team's reality.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Team Dynamics</label>
        <textarea
          value={data.teamDynamics || ''}
          onChange={(e) => onChange({ teamDynamics: e.target.value })}
          rows={3}
          placeholder="Describe the team structure, collaboration style, and current composition..."
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Current Challenges</label>
        <textarea
          value={data.currentChallenges || ''}
          onChange={(e) => onChange({ currentChallenges: e.target.value })}
          rows={3}
          placeholder="What are the biggest challenges this hire needs to address?"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Growth Plans</label>
        <textarea
          value={data.growthPlans || ''}
          onChange={(e) => onChange({ growthPlans: e.target.value })}
          rows={3}
          placeholder="What does the next 12-18 months look like for this team?"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Culture Attributes</label>
        <p className="text-xs text-slate-400 mb-3">Select the cultural traits that matter for this team. Choose as many as apply.</p>
        <div className="flex flex-wrap gap-2">
          {CULTURE_ATTRIBUTE_OPTIONS.map((attr) => {
            const selected = Array.isArray(selectedCulture) && selectedCulture.includes(attr);
            return (
              <button
                key={attr}
                type="button"
                onClick={() => toggleCulture(attr)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selected
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {attr}
              </button>
            );
          })}
        </div>
        {Array.isArray(selectedCulture) && selectedCulture.length > 0 && (
          <p className="text-xs text-teal-600 mt-2 font-medium">{selectedCulture.length} selected</p>
        )}
      </div>
    </div>
  );
}

const ROLE_LEVEL_PRESETS = {
  entry: { 4: 3, 7: 3, 5: 3, 10: 3, 9: 3 },
  mid: { 4: 4, 2: 3, 3: 3, 5: 4, 10: 4, 7: 3, 6: 4 },
  senior: { 2: 5, 3: 5, 4: 4, 6: 5, 10: 5, 5: 4, 1: 3, 11: 4, 13: 3 },
  executive: { 1: 5, 2: 5, 3: 5, 4: 5, 6: 5, 10: 5, 5: 4, 11: 5, 9: 5, 8: 4, 13: 4, 12: 3 },
};

function FullStep3({ data, onChange }) {
  const weights = data.competencyWeights || {};

  const toggleAttr = (id) => {
    const updated = { ...weights };
    if (updated[id] !== undefined) {
      delete updated[id];
    } else {
      updated[id] = 3;
    }
    onChange({ competencyWeights: updated });
  };

  const setWeight = (id, val) => {
    onChange({ competencyWeights: { ...weights, [id]: Number(val) } });
  };

  const applyPreset = () => {
    const preset = ROLE_LEVEL_PRESETS[data.roleLevel];
    if (preset) {
      onChange({ competencyWeights: { ...preset } });
    }
  };

  const roleLevelLabel = ROLE_LEVELS.find((l) => l.id === data.roleLevel)?.label || data.roleLevel || 'Role Level';

  const grouped = {
    Competence: MEASUREMENT13_ATTRIBUTES.filter((a) => a.category === 'Competence'),
    Chemistry: MEASUREMENT13_ATTRIBUTES.filter((a) => a.category === 'Chemistry'),
    Character: MEASUREMENT13_ATTRIBUTES.filter((a) => a.category === 'Character'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Competency Framework</h2>
        <p className="text-sm text-slate-500">Select and weight Measurement13 leadership dimensions for this role.</p>
      </div>

      {data.roleLevel && ROLE_LEVEL_PRESETS[data.roleLevel] && (
        <button
          type="button"
          onClick={applyPreset}
          className="w-full flex items-center justify-center px-4 py-2.5 bg-teal-50 border-2 border-dashed border-teal-300 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 hover:border-teal-400 transition-colors"
        >
          <Zap className="h-4 w-4 mr-2" />
          Auto-select for {roleLevelLabel}
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      )}

      {Object.entries(grouped).map(([category, attrs]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">{category}</h3>
          <div className="space-y-2">
            {attrs.map((attr) => {
              const selected = weights[attr.id] !== undefined;
              return (
                <div key={attr.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${selected ? 'border-teal-300 bg-teal-50' : 'border-slate-200'}`}>
                  <button
                    onClick={() => toggleAttr(attr.id)}
                    className="flex items-center text-sm font-medium text-slate-700"
                  >
                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${selected ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    {attr.name}
                  </button>
                  {selected && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Weight:</span>
                      <select
                        value={weights[attr.id]}
                        onChange={(e) => setWeight(attr.id, e.target.value)}
                        className="px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {[1, 2, 3, 4, 5].map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function FullStep4({ data, onChange }) {
  const rounds = data.interviewRounds || 3;
  const types = data.interviewTypes || [];
  const timePerRound = data.timePerRound || 60;
  const interviewers = data.interviewers || '';

  const toggleType = (id) => {
    if (types.includes(id)) {
      onChange({ interviewTypes: types.filter((t) => t !== id) });
    } else {
      onChange({ interviewTypes: [...types, id] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Interview Structure</h2>
        <p className="text-sm text-slate-500">Define the interview process for this hiring pipeline.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Number of Rounds</label>
        <div className="flex items-center space-x-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ interviewRounds: n })}
              className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-colors ${
                rounds === n ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Interview Types</label>
        <div className="grid grid-cols-2 gap-3">
          {INTERVIEW_TYPES.map((t) => {
            const selected = types.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleType(t.id)}
                className={`p-3 rounded-lg border text-sm font-medium text-left transition-colors flex items-center justify-between ${
                  selected ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{t.label}</span>
                {selected && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Time Per Round (minutes)</label>
        <select
          value={timePerRound}
          onChange={(e) => onChange({ timePerRound: Number(e.target.value) })}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          {[30, 45, 60, 75, 90, 120].map((m) => (
            <option key={m} value={m}>{m} minutes</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Interviewers</label>
        <textarea
          value={interviewers}
          onChange={(e) => onChange({ interviewers: e.target.value })}
          rows={2}
          placeholder="Names / roles of interviewers, one per line"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}

function FullStep5({ data, onChange }) {
  const refCount = data.referencesRequired || 3;
  const refTypes = data.referenceTypes || [];
  const refQuestions = data.referenceQuestionPriorities || '';

  const toggleRefType = (id) => {
    if (refTypes.includes(id)) {
      onChange({ referenceTypes: refTypes.filter((t) => t !== id) });
    } else {
      onChange({ referenceTypes: [...refTypes, id] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Reference Strategy</h2>
        <p className="text-sm text-slate-500">Configure how references will be checked for this role.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">References Required</label>
        <div className="flex items-center space-x-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ referencesRequired: n })}
              className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-colors ${
                refCount === n ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Reference Types</label>
        <div className="grid grid-cols-3 gap-3">
          {REFERENCE_TYPES.map((t) => {
            const selected = refTypes.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleRefType(t.id)}
                className={`p-3 rounded-lg border text-sm font-medium text-center transition-colors ${
                  selected ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Priority Questions for References</label>
        <textarea
          value={refQuestions}
          onChange={(e) => onChange({ referenceQuestionPriorities: e.target.value })}
          rows={4}
          placeholder="What specific questions or areas should references be asked about? One per line."
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}

function FullReview({ data }) {
  const selectedAttrs = Object.entries(data.competencyWeights || {}).map(([id, weight]) => {
    const attr = MEASUREMENT13_ATTRIBUTES.find((a) => a.id === Number(id));
    return { name: attr?.name || id, weight };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Review & Create</h2>
        <p className="text-sm text-slate-500">Review all details before creating this hiring process.</p>
      </div>

      <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
        {/* Role */}
        <div className="p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Role Profile</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-slate-500">Title:</span> <span className="font-medium text-slate-900">{data.roleName || '--'}</span></div>
            <div><span className="text-slate-500">Level:</span> <span className="font-medium text-slate-900 capitalize">{data.roleLevel || '--'}</span></div>
            <div><span className="text-slate-500">Department:</span> <span className="font-medium text-slate-900">{data.department || '--'}</span></div>
            {data.reportsTo && <div><span className="text-slate-500">Reports To:</span> <span className="font-medium text-slate-900">{data.reportsTo}</span></div>}
            {data.teamSize && <div><span className="text-slate-500">Team Size:</span> <span className="font-medium text-slate-900">{data.teamSize}</span></div>}
            {data.salaryRange && <div><span className="text-slate-500">Salary:</span> <span className="font-medium text-slate-900">{data.salaryRange}</span></div>}
          </div>
        </div>

        {/* Context */}
        {(data.teamDynamics || data.currentChallenges) && (
          <div className="p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Department Context</p>
            {data.teamDynamics && <p className="text-sm text-slate-700 mb-1"><strong>Dynamics:</strong> {data.teamDynamics}</p>}
            {data.currentChallenges && <p className="text-sm text-slate-700 mb-1"><strong>Challenges:</strong> {data.currentChallenges}</p>}
            {data.growthPlans && <p className="text-sm text-slate-700 mb-1"><strong>Growth:</strong> {data.growthPlans}</p>}
            {Array.isArray(data.cultureAttributes) && data.cultureAttributes.length > 0 && (
              <div className="text-sm text-slate-700">
                <strong>Culture:</strong>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {data.cultureAttributes.map((attr) => (
                    <span key={attr} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">{attr}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Competencies */}
        {selectedAttrs.length > 0 && (
          <div className="p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Competency Framework</p>
            <div className="flex flex-wrap gap-2">
              {selectedAttrs.map((a) => (
                <span key={a.name} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                  {a.name} (w{a.weight})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interview Structure */}
        {data.interviewRounds && (
          <div className="p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Interview Structure</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-slate-500">Rounds:</span> <span className="font-medium text-slate-900">{data.interviewRounds}</span></div>
              <div><span className="text-slate-500">Time/Round:</span> <span className="font-medium text-slate-900">{data.timePerRound || 60}min</span></div>
              {(data.interviewTypes || []).length > 0 && (
                <div><span className="text-slate-500">Types:</span> <span className="font-medium text-slate-900">{data.interviewTypes.join(', ')}</span></div>
              )}
            </div>
          </div>
        )}

        {/* References */}
        {data.referencesRequired && (
          <div className="p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Reference Strategy</p>
            <div className="text-sm">
              <span className="text-slate-500">Required:</span> <span className="font-medium text-slate-900">{data.referencesRequired}</span>
              {(data.referenceTypes || []).length > 0 && (
                <span className="text-slate-700 ml-3">({data.referenceTypes.join(', ')})</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Onboarding Page ────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { addHiringProcess } = useStore();
  const [path, setPath] = useState(null); // null = selector, 'quick', 'full'
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    roleName: '',
    roleLevel: '',
    department: '',
    competencies: [],
    reportsTo: '',
    teamSize: '',
    salaryRange: '',
    teamDynamics: '',
    currentChallenges: '',
    growthPlans: '',
    cultureAttributes: [],
    competencyWeights: {},
    interviewRounds: 3,
    interviewTypes: [],
    timePerRound: 60,
    interviewers: '',
    referencesRequired: 3,
    referenceTypes: [],
    referenceQuestionPriorities: '',
  });

  const onChange = (partial) => setData((prev) => ({ ...prev, ...partial }));

  const quickSteps = ['role', 'competencies', 'review'];
  const quickLabels = ['Role', 'Competencies', 'Review'];
  const fullSteps = ['role', 'context', 'framework', 'structure', 'references', 'review'];
  const fullLabels = ['Role', 'Context', 'Framework', 'Structure', 'References', 'Review'];

  const steps = path === 'quick' ? quickSteps : fullSteps;
  const labels = path === 'quick' ? quickLabels : fullLabels;
  const totalSteps = steps.length;

  const canNext = () => {
    if (path === 'quick') {
      if (step === 0) return data.roleName && data.roleLevel && data.department;
      if (step === 1) return (data.competencies || []).length >= 1;
      return true;
    }
    if (path === 'full') {
      if (step === 0) return data.roleName && data.roleLevel && data.department;
      return true;
    }
    return false;
  };

  const handleCreate = () => {
    const process = {
      ...data,
      setupPath: path,
      status: 'draft',
    };
    addHiringProcess(process);
    navigate('/app/dashboard');
  };

  // Path selector
  if (!path) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-7 w-7 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create a Hiring Process</h1>
          <p className="text-slate-500 mt-2">Choose how you want to set up your structured interview pipeline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Quick Start */}
          <button
            onClick={() => setPath('quick')}
            className="text-left bg-white rounded-xl border-2 border-slate-200 hover:border-teal-500 p-6 transition-all group"
          >
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
              <Zap className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Quick Start</h2>
            <p className="text-sm text-slate-500 mb-3">
              3 steps, about 60 seconds. Great for getting started fast.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>1. Role name + level</p>
              <p>2. Key competencies</p>
              <p>3. Review & create</p>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700">
              Get started <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </button>

          {/* Full Setup */}
          <button
            onClick={() => setPath('full')}
            className="text-left bg-white rounded-xl border-2 border-slate-200 hover:border-teal-500 p-6 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
              <ClipboardList className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Full Setup</h2>
            <p className="text-sm text-slate-500 mb-3">
              6 steps, comprehensive configuration for precision hiring.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>1. Role profile</p>
              <p>2. Department context</p>
              <p>3. Competency framework</p>
              <p>4. Interview structure</p>
              <p>5. Reference strategy</p>
              <p>6. Review & create</p>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
              Full configuration <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Step content
  const renderStep = () => {
    if (path === 'quick') {
      if (step === 0) return <QuickStep1 data={data} onChange={onChange} />;
      if (step === 1) return <QuickStep2 data={data} onChange={onChange} />;
      if (step === 2) return <QuickReview data={data} />;
    }
    if (path === 'full') {
      if (step === 0) return <FullStep1 data={data} onChange={onChange} />;
      if (step === 1) return <FullStep2 data={data} onChange={onChange} />;
      if (step === 2) return <FullStep3 data={data} onChange={onChange} />;
      if (step === 3) return <FullStep4 data={data} onChange={onChange} />;
      if (step === 4) return <FullStep5 data={data} onChange={onChange} />;
      if (step === 5) return <FullReview data={data} />;
    }
    return null;
  };

  const isLastStep = step === totalSteps - 1;

  return (
    <div className="max-w-2xl mx-auto mt-4">
      {/* Back to path selector */}
      <button
        onClick={() => { setPath(null); setStep(0); }}
        className="flex items-center text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Change setup path
      </button>

      <StepIndicator steps={steps} currentStep={step} labels={labels} />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </button>

          {isLastStep ? (
            <button
              onClick={handleCreate}
              disabled={!canNext()}
              className="flex items-center px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Create Hiring Process
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
              disabled={!canNext()}
              className="flex items-center px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="h-4 w-4 ml-1.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
