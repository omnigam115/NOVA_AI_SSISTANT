import { useRef, useEffect } from 'react'

/**
 * ChatInput Component.
 * Auto-growing textarea with send, microphone, and attachment buttons.
 * Enter sends, Shift+Enter creates a new line.
 */
function ChatInput({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null)

  // Auto-grow textarea height
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) {
        onSend()
      }
    }
  }

  return (
    <div className="border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end space-x-2">
        {/* Attachment button (UI only) */}
        <button
          disabled={disabled}
          className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-40"
          title="Attach file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Textarea */}
        <div className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-2xl px-4 py-2.5 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Message NOVA AI..."
            rows={1}
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none outline-none leading-relaxed max-h-40"
          />
        </div>

        {/* Microphone button (UI only) */}
        <button
          disabled={disabled}
          className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-40"
          title="Voice input"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-14 0m7 7v4m-4-4h8m-4-12a3 3 0 00-3 3v4a3 3 0 006 0V8a3 3 0 00-3-3z" />
          </svg>
        </button>

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          title="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-600 mt-2">
        NOVA AI can make mistakes. Verify important information.
      </p>
    </div>
  )
}

export default ChatInput
