import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import ThemeSwitcher from './components/ThemeSwitcher'
import SessionMenu from './components/SessionMenu'
import { useChat } from './hooks/useChat'
import { THEMES } from './utils/themes'

const DEFAULT_SETTINGS = {
  persona: 'Ruthless VC',
  vibe: 'Savage',
  language: 'English',
  intensity: 7,
  responseLength: 'Full Roast',
  portfolioType: 'Stocks',
  riskAppetite: 'Moderate',
  experienceLevel: 'Noob',
  showRealTalk: true,
}

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [themeId, setThemeId] = useState('brutalist')
  const theme = THEMES[themeId]
  const {
    sessions, activeSession, setActiveSessionId,
    send, loading, newSession, renameSession, deleteSession
  } = useChat()

  return (
    <div className={`relative flex flex-col h-screen ${theme.bg} ${theme.font} overflow-hidden`}>

      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-3 border-b ${theme.header} glass shrink-0 z-[100]`}>
        <span key={themeId} className={`gradient-title-${themeId}`}>
          Roast My Portfolio
        </span>

        {/* Session name -- slightly left of center like Claude */}
        <div className="absolute left-[23%] -translate-x-1/2">
          <SessionMenu
            session={activeSession}
            theme={theme}
            onRename={renameSession}
            onDelete={deleteSession}
          />
        </div>

        <ThemeSwitcher current={themeId} onChange={setThemeId} />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-72 border-r ${theme.sidebar} flex flex-col shrink-0 z-10`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div
            className="flex-1 overflow-y-auto p-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <Sidebar
              settings={settings}
              onChange={setSettings}
              theme={theme}
              sessions={sessions}
              activeSession={activeSession}
              onSelectSession={setActiveSessionId}
              onNewSession={newSession}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ChatWindow
            session={activeSession}
            onSend={(payload) => send({ ...payload, settings })}
            loading={loading}
            theme={theme}
            themeId={themeId}
          />
        </div>
      </div>
    </div>
  )
}