const SUGGESTIONS = [
  { id: 1, icon: '⚛️', text: 'Explain React Hooks' },
  { id: 2, icon: '🐍', text: 'Write a Python function' },
  { id: 3, icon: '🎯', text: 'Help me prepare for interviews' },
  { id: 4, icon: '📝', text: 'Summarize my notes' },
]

/**
 * EmptyState Component.
 * Shown when the chat has no messages yet.
 * Clicking a suggestion card populates the input field.
 */
function EmptyState({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center select-none">
      {/* Logo mark */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-3xl shadow-2xl shadow-indigo-500/30 mb-6">
        N
      </div>

      <h2 className="text-2xl font-bold text-slate-100 mb-2">NOVA AI Assistant</h2>
      <p className="text-slate-400 text-sm mb-10 max-w-xs">
        How can I help you today?
      </p>

      {/* Suggestion cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSuggestionClick(s.text)}
            className="group flex items-center space-x-3 text-left p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-xl shrink-0">{s.icon}</span>
            <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors font-medium">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default EmptyState
