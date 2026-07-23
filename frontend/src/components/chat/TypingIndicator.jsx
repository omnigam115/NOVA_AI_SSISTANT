/**
 * TypingIndicator Component.
 * Animated three-dot indicator shown while NOVA is "thinking".
 */
function TypingIndicator() {
  return (
    <div className="flex items-end space-x-3 px-4 py-2">
      {/* NOVA avatar */}
      <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow shadow-indigo-500/20">
        N
      </div>

      <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-800/80 border border-slate-700/50">
        <span className="text-xs text-slate-400 mr-1">NOVA is thinking</span>
        <span className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              style={{
                animation: 'bounce 1.2s infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </span>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}

export default TypingIndicator
