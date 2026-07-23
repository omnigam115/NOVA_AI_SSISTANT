import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const TABS = ['Account', 'Appearance', 'Notifications', 'Security', 'AI Engine']

/**
 * Settings Page.
 * Multi-section settings interface with tab navigation.
 * All settings are UI-only; no backend wiring in this sprint.
 */
function Settings() {
  const [activeTab, setActiveTab] = useState('Account')
  const { user } = useAuth()

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account, preferences, and future AI configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab navigation — vertical on desktop, horizontal scroll on mobile */}
        <nav className="lg:w-44 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === tab
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Tab content panel */}
        <div className="flex-1 min-w-0">
          {activeTab === 'Account' && (
            <AccountTab user={user} />
          )}
          {activeTab === 'Appearance' && <AppearanceTab />}
          {activeTab === 'Notifications' && <NotificationsTab />}
          {activeTab === 'Security' && <SecurityTab />}
          {activeTab === 'AI Engine' && <AIEngineTab />}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-tab components ─────────────────────────────────────────── */

function SectionCard({ title, description, children }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 mb-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function SettingRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-800/50 last:border-0">
      <div className="mr-4">
        <p className="text-xs font-medium text-slate-300">{label}</p>
        {hint && <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function AccountTab({ user }) {
  return (
    <>
      <SectionCard title="Profile" description="Your personal account information.">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{user?.name ?? '—'}</p>
            <p className="text-xs text-slate-400">{user?.email ?? '—'}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Account created:{' '}
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
        <button className="text-xs px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700">
          Edit Profile
        </button>
      </SectionCard>

      <SectionCard title="Danger Zone" description="Irreversible account actions.">
        <SettingRow label="Delete Account" hint="Permanently remove all data.">
          <button className="text-xs px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/40 border border-red-900/40 transition-colors">
            Delete
          </button>
        </SettingRow>
      </SectionCard>
    </>
  )
}

function AppearanceTab() {
  return (
    <SectionCard title="Theme" description="Customize the visual appearance of NOVA AI.">
      <SettingRow label="Color Mode" hint="Interface color scheme.">
        <select className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500">
          <option>Dark (Default)</option>
          <option disabled>Light (Coming Soon)</option>
          <option disabled>System</option>
        </select>
      </SettingRow>
      <SettingRow label="Accent Color" hint="Primary highlight color.">
        <div className="flex items-center space-x-2">
          {['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500'].map((c) => (
            <button key={c} className={`w-5 h-5 rounded-full ${c} hover:ring-2 hover:ring-white/30 transition-all`} />
          ))}
        </div>
      </SettingRow>
      <SettingRow label="Font Size" hint="Interface text size.">
        <select className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500">
          <option>Medium (Default)</option>
          <option>Small</option>
          <option>Large</option>
        </select>
      </SettingRow>
    </SectionCard>
  )
}

function NotificationsTab() {
  return (
    <SectionCard title="Notifications" description="Control how NOVA communicates with you.">
      {[
        { label: 'Email Alerts', hint: 'Receive important account notifications via email.' },
        { label: 'Task Completion Alerts', hint: 'Get notified when AI agent tasks finish.' },
        { label: 'Security Alerts', hint: 'Alerts for unusual login activity.' },
        { label: 'Product Updates', hint: 'Announcements about new NOVA features.' },
      ].map((item) => (
        <SettingRow key={item.label} label={item.label} hint={item.hint}>
          <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-700 transition-colors">
            <span className="translate-x-1 inline-block h-3.5 w-3.5 transform rounded-full bg-slate-400 transition-transform" />
          </button>
        </SettingRow>
      ))}
    </SectionCard>
  )
}

function SecurityTab() {
  return (
    <>
      <SectionCard title="Change Password" description="Update your login credentials.">
        <div className="space-y-3">
          {['Current Password', 'New Password', 'Confirm New Password'].map((lbl) => (
            <div key={lbl}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                {lbl}
              </label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 text-xs placeholder-slate-600 cursor-not-allowed"
              />
            </div>
          ))}
          <button disabled className="mt-1 px-4 py-2 rounded-lg bg-slate-800 text-slate-500 text-xs cursor-not-allowed border border-slate-700">
            Save Password (Coming Soon)
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Active Sessions" description="Devices currently logged in to your account.">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-300">Current Browser</p>
            <p className="text-[11px] text-slate-500">Active now · This device</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold">
            Active
          </span>
        </div>
      </SectionCard>
    </>
  )
}

function AIEngineTab() {
  const providers = [
    { name: 'Gemini 1.5 Pro', provider: 'Google', status: 'Phase 3' },
    { name: 'GPT-4o', provider: 'OpenAI', status: 'Phase 3' },
    { name: 'Llama 3.1 70B', provider: 'Groq', status: 'Phase 3' },
    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'Phase 3' },
  ]

  return (
    <>
      <SectionCard title="AI Provider" description="Configure which AI models power NOVA's intelligence layer. Available in Phase 3.">
        <div className="space-y-2">
          {providers.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 opacity-60"
            >
              <div>
                <p className="text-xs font-semibold text-slate-300">{p.name}</p>
                <p className="text-[11px] text-slate-500">{p.provider}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 font-semibold">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="API Keys" description="Manage your personal AI provider credentials.">
        <SettingRow label="API Key Storage" hint="Keys are encrypted and never stored in plaintext.">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-semibold">
            Phase 3
          </span>
        </SettingRow>
      </SectionCard>
    </>
  )
}

export default Settings
