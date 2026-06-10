import { useState } from 'react'
import { Menu, X } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = THEMES[themeId]
  const {
    sessions, activeSession, setActiveSessionId,
    send, loading, newSession, renameSession, deleteSession
  } = useChat()

  return (
    <div className={`flex flex-col h-screen ${theme.bg} ${theme.font} overflow-hidden`}>

      {/* Header */}
      <div className={`relative flex items-center justify-between px-4 md:px-6 py-3 border-b ${theme.header} glass shrink-0 z-[100]`}>
        <div className="flex items-center gap-3">
          <button
            className={`md:hidden p-1 rounded-lg ${theme.muted} hover:bg-white/5 transition`}
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span key={themeId} className={`gradient-title-${themeId}`}>
            Roast My Portfolio
          </span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
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
      <div className="flex flex-1 overflow-hidden relative">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[90] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed md:relative top-0 left-0 h-full z-[95]
            w-72 border-r ${theme.sidebar} flex flex-col shrink-0
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingTop: sidebarOpen ? '60px' : '0' }}
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
              onSelectSession={(id) => { setActiveSessionId(id); setSidebarOpen(false) }}
              onNewSession={() => { newSession(); setSidebarOpen(false) }}
            />
          </div>
        </div>

        {/* Chat */}
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