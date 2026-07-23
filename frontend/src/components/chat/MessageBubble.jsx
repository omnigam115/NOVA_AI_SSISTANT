/**
 * MessageBubble Component.
 * Renders a single chat message with role-appropriate styling and alignment.
 */
function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user'

  return (
    <div className={`flex items-end space-x-3 px-4 py-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow ${
          isUser
            ? 'bg-slate-700 text-slate-200 shadow-slate-900/20'
            : 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-indigo-500/20'
        }`}
      >
        {isUser ? 'U' : 'N'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-bl-sm'
        }`}
      >
        {content}
        {timestamp && (
          <p className={`text-[10px] mt-1.5 ${isUser ? 'text-indigo-200/60' : 'text-slate-500'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
