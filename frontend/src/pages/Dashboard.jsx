import { useAuth } from '../context/AuthContext'

const features = [
  {
    id: 'chat',
    icon: '💬',
    title: 'AI Chat',
    description: 'General conversational intelligence and context-aware assistance across any domain.',
    color: 'from-indigo-600/20 to-violet-600/10',
    border: 'border-indigo-500/20',
    badge: 'Core',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
  },
  {
    id: 'code',
    icon: '💻',
    title: 'Code Assistant',
    description: 'Autonomous coding, debugging, refactoring, and multi-language code generation.',
    color: 'from-emerald-600/20 to-teal-600/10',
    border: 'border-emerald-500/20',
    badge: 'Agent',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'research',
    icon: '🔍',
    title: 'Research Agent',
    description: 'Live web search, deep technical synthesis, and structured knowledge reporting.',
    color: 'from-sky-600/20 to-blue-600/10',
    border: 'border-sky-500/20',
    badge: 'Agent',
    badgeColor: 'bg-sky-500/20 text-sky-300',
  },
  {
    id: 'files',
    icon: '📁',
    title: 'File Analysis',
    description: 'Intelligent document processing, PDF extraction, and artifact inspection.',
    color: 'from-amber-600/20 to-orange-600/10',
    border: 'border-amber-500/20',
    badge: 'Tools',
    badgeColor: 'bg-amber-500/20 text-amber-300',
  },
  {
    id: 'memory',
    icon: '🧠',
    title: 'Memory',
    description: 'Long-term semantic recall using vector embeddings and contextual awareness.',
    color: 'from-purple-600/20 to-pink-600/10',
    border: 'border-purple-500/20',
    badge: 'Phase 5',
    badgeColor: 'bg-purple-500/20 text-purple-300',
  },
  {
    id: 'automation',
    icon: '⚡',
    title: 'Automation',
    description: 'Background task scheduling, workflow chains, and multi-agent coordination.',
    color: 'from-rose-600/20 to-red-600/10',
    border: 'border-rose-500/20',
    badge: 'Phase 4',
    badgeColor: 'bg-rose-500/20 text-rose-300',
  },
]

/**
 * Dashboard Home Page.
 * Welcome hero and AI capability feature cards.
 */
function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Welcome hero */}
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>System Online</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-2">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {user?.name?.split(' ')[0] ?? 'there'}
          </span>{' '}
          👋
        </h1>
        <p className="text-slate-400 text-base lg:text-lg max-w-xl">
          NOVA AI Assistant — Your intelligent AI operating system.
        </p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Active Sessions', value: '1', icon: '🟢' },
          { label: 'AI Modules', value: '6', icon: '🧩' },
          { label: 'Memory Entries', value: '—', icon: '🧠' },
          { label: 'Tasks Run', value: '—', icon: '⚡' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col space-y-1"
          >
            <span className="text-lg">{stat.icon}</span>
            <span className="text-xl font-bold text-slate-100">{stat.value}</span>
            <span className="text-xs text-slate-400">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Feature capability cards */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          AI Capabilities
        </h2>
        <span className="text-xs text-slate-600">Click to explore</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat) => (
          <button
            key={feat.id}
            onClick={() => alert(`${feat.title} will be available in a future sprint.`)}
            className={`relative text-left p-5 rounded-2xl bg-gradient-to-br ${feat.color} border ${feat.border} hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-950/40 active:scale-[0.99] transition-all duration-200 group overflow-hidden`}
          >
            {/* Badge */}
            <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold ${feat.badgeColor}`}>
              {feat.badge}
            </span>

            <div className="text-2xl mb-3">{feat.icon}</div>
            <h3 className="text-sm font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">
              {feat.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
              {feat.description}
            </p>

            {/* Subtle arrow indicator */}
            <div className="mt-4 flex items-center text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
              <span>Coming soon</span>
              <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
