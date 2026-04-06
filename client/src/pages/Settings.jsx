import { useState } from 'react';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Shield, Bell, Palette, Users, Database, Link2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'integrations', name: 'Integrations', icon: Link2 },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Configure Interview9.ai for your organization</p>
      </div>

      <div className="flex space-x-6">
        {/* Tabs */}
        <div className="w-48 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                  <input type="text" defaultValue="TheGreyMatter.ai" className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Interview Duration (minutes)</label>
                  <input type="number" defaultValue={60} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Scoring Scale</label>
                  <select className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option>1-5 (Falcone Standard)</option>
                    <option>1-10 (Extended)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Pressure Cooker Weight Multiplier</p>
                    <p className="text-xs text-slate-500">Weight pressure-cooker question scores 1.5x for Measurement13 attributes #7, #8, #9</p>
                  </div>
                  <input type="number" defaultValue={1.5} step={0.1} className="w-20 border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <button
                onClick={() => toast.success('Changes saved successfully')}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >Save Changes</button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Platform Integrations</h3>
              <div className="space-y-4">
                {[
                  { name: 'TheGreyMatter.ai', desc: 'Central Intelligence Hub — task sync, dashboard roll-up', status: 'connected' },
                  { name: '9Vectors.ai', desc: 'People vector assessment data for candidate evaluation', status: 'connected' },
                  { name: 'Measurement13.ai', desc: 'Leadership attribute scoring from interview data', status: 'connected' },
                  { name: 'OrgDesign9.ai', desc: 'Role design validation and organizational fit', status: 'available' },
                  { name: 'Culture9.ai', desc: 'Cultural fit scoring and values alignment', status: 'available' },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{integration.name}</p>
                      <p className="text-xs text-slate-500">{integration.desc}</p>
                    </div>
                    {integration.status === 'connected' ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Connected</span>
                    ) : (
                      <button
                        onClick={() => toast.success('Connected successfully')}
                        className="text-xs border border-teal-600 text-teal-600 px-3 py-1 rounded-full font-medium hover:bg-teal-50"
                      >Connect</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { name: 'Interview Reminders', desc: 'Notify before scheduled interviews' },
                  { name: 'Scoring Reminders', desc: 'Remind to complete candidate scores post-interview' },
                  { name: 'Red Flag Alerts', desc: 'Alert when AI detects concerning patterns' },
                  { name: 'Reference Check Due', desc: 'Notify when references are pending' },
                  { name: 'Pipeline Updates', desc: 'Weekly hiring pipeline summary' },
                ].map((pref) => (
                  <div key={pref.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{pref.name}</p>
                      <p className="text-xs text-slate-500">{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-300 peer-checked:bg-teal-600 rounded-full peer-focus:ring-2 peer-focus:ring-teal-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Security & Compliance</h3>
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm font-medium text-teal-700">Authentication</p>
                  <p className="text-xs text-teal-600 mt-1">Federated via TheGreyMatter.ai SSO — JWT validation with RS256</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700">Legal Compliance Guardrails</p>
                  <p className="text-xs text-slate-500 mt-1">All recommended interview questions are validated against employment law compliance rules (Falcone Ch. 19). Protected class questions are blocked by the Compliance Agent.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700">Data Encryption</p>
                  <p className="text-xs text-slate-500 mt-1">All candidate data encrypted at rest (AES-256-GCM) and in transit (TLS 1.3). Keys managed via Azure Key Vault.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700">Audit Trail</p>
                  <p className="text-xs text-slate-500 mt-1">All interview actions, scoring changes, and access events are logged for SOC 2 Type II compliance.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
