import { useState, useCallback } from 'react'
import { sendMessage } from '../utils/api'

const createSession = () => ({
  id: Date.now(),
  title: 'New Session',
  messages: [],
  createdAt: new Date().toISOString()
})

export const useChat = () => {
  const [sessions, setSessions] = useState(() => {
    const initial = createSession()
    return [initial]
  })
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [loading, setLoading] = useState(false)

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0]

  const send = useCallback(async ({ text, image, settings }) => {
    const sessionId = activeSession.id
    const userMsg = {
      role: 'user',
      content: text || 'Roast my portfolio.',
      image: image ? URL.createObjectURL(image) : null
    }

    const currentMessages = [...activeSession.messages]
    const updatedMessages = [...currentMessages, userMsg]
    const isFirst = currentMessages.length === 0
    const newTitle = isFirst ? (text?.slice(0, 30) || 'Portfolio Roast') : activeSession.title

    const promptMessageId = crypto.randomUUID()

    if (typeof window !== 'undefined' && window.pendo && window.pendo.trackAgent) {
      window.pendo.trackAgent("prompt", {
        agentId: "AYCCRxZXlAWi_CgC8yGBEMCmYW8",
        conversationId: String(sessionId),
        messageId: promptMessageId,
        content: userMsg.content,
        suggestedPrompt: false,
        fileUploaded: !!image
      })
    }

    setSessions(prev => prev.map(s => s.id === sessionId
      ? { ...s, title: newTitle, messages: updatedMessages }
      : s
    ))

    // Track prompt in Novus
    if (window.pendo && window.pendo.trackAgent) {
      window.pendo.trackAgent('prompt', {
        conversationId: sessionId.toString(),
        prompt: text || 'portfolio screenshot',
      })
    }

    setLoading(true)
    try {
      const data = await sendMessage({ messages: updatedMessages, image, settings })
      const assistantMsg = { role: 'assistant', content: data.response }

      if (typeof window !== 'undefined' && window.pendo && window.pendo.trackAgent) {
        window.pendo.trackAgent("agent_response", {
          agentId: "AYCCRxZXlAWi_CgC8yGBEMCmYW8",
          conversationId: String(sessionId),
          messageId: `agent_response_${Date.now()}`,
          content: data.response
        })
      }

      setSessions(prev => prev.map(s => s.id === sessionId
        ? { ...s, messages: [...s.messages, assistantMsg] }
        : s
      ))

      // Track response in Novus
      if (window.pendo && window.pendo.trackAgent) {
        window.pendo.trackAgent('agent_response', {
          conversationId: sessionId.toString(),
          response: data.response,
        })
      }

    } catch (err) {
      console.error(err)
      setSessions(prev => prev.map(s => s.id === sessionId
        ? { ...s, messages: [...s.messages, { role: 'assistant', content: 'Something went wrong. Try again.' }] }
        : s
      ))
    } finally {
      setLoading(false)
    }
  }, [activeSession])

  const newSession = useCallback(() => {
    const s = createSession()
    setSessions(prev => [s, ...prev])
    setActiveSessionId(s.id)
  }, [])

  const setActiveSessionIdSafe = useCallback((id) => {
    setActiveSessionId(id)
  }, [])

  const renameSession = useCallback((id, title) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title } : s))
  }, [])

  const deleteSession = useCallback((id) => {
    setSessions(prev => {
      const remaining = prev.filter(s => s.id !== id)
      if (remaining.length === 0) {
        const fresh = createSession()
        setActiveSessionId(fresh.id)
        return [fresh]
      }
      setActiveSessionId(remaining[0].id)
      return remaining
    })
  }, [])

  return {
    sessions,
    activeSession,
    setActiveSessionId: setActiveSessionIdSafe,
    send,
    loading,
    newSession,
    renameSession,
    deleteSession,
  }
}