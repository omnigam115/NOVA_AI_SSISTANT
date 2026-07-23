import { useState, useCallback } from 'react'
import ChatWindow from '../components/chat/ChatWindow'
import ChatInput from '../components/chat/ChatInput'
import EmptyState from '../components/chat/EmptyState'

let messageIdCounter = 0

function createMessage(role, content) {
  messageIdCounter += 1
  return {
    id: messageIdCounter,
    role,
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

const DUMMY_REPLY = "I'm a placeholder response. AI integration will be added in Sprint 4."

/**
 * Chat Page.
 * Full chat interface with message history, input, and empty state.
 * Uses only local React state — no backend or AI calls.
 */
function Chat() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback(
    (text) => {
      const trimmed = (text || inputValue).trim()
      if (!trimmed || isTyping) return

      setMessages((prev) => [...prev, createMessage('user', trimmed)])
      setInputValue('')
      setIsTyping(true)

      // Simulate assistant thinking delay
      setTimeout(() => {
        setMessages((prev) => [...prev, createMessage('assistant', DUMMY_REPLY)])
        setIsTyping(false)
      }, 1000)
    },
    [inputValue, isTyping],
  )

  const handleSuggestionClick = (text) => {
    setInputValue(text)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {hasMessages ? (
        <ChatWindow messages={messages} isTyping={isTyping} />
      ) : (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      )}

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={() => sendMessage()}
        disabled={isTyping}
      />
    </div>
  )
}

export default Chat
