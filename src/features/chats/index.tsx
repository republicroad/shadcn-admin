import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ConversationSidebar } from './components/conversation-sidebar'
import { MessageList } from './components/message-list'
import { ChatInput } from './components/chat-input'
import { mockConversations } from './data/mock-conversations'
import { type Conversation, type Message } from './data/chat-types'

export function Chats() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedId, setSelectedId] = useState<string | null>(
    mockConversations[0]?.id || null
  )

  const selectedConversation = conversations.find((c) => c.id === selectedId)

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setConversations([newConv, ...conversations])
    setSelectedId(newConv.id)
  }

  const handleSendMessage = (content: string) => {
    if (!selectedId) return

    const userMessage: Message = {
      id: `${selectedId}-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    const aiMessage: Message = {
      id: `${selectedId}-${Date.now() + 1}`,
      role: 'assistant',
      content: '这是一个模拟的 AI 回复。在实际应用中，这里会调用 AI API 来生成真实的回复。',
      timestamp: Date.now() + 1000,
    }

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedId) {
          const updatedMessages = [...conv.messages, userMessage, aiMessage]
          return {
            ...conv,
            messages: updatedMessages,
            title: conv.messages.length === 0 ? content.slice(0, 30) : conv.title,
            updatedAt: Date.now(),
          }
        }
        return conv
      })
    )
  }

  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id)
    setConversations(remaining)
    if (selectedId === id) {
      setSelectedId(remaining[0]?.id || null)
    }
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='flex h-full gap-4'>
          <ConversationSidebar
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNew={handleNewConversation}
            onDelete={handleDeleteConversation}
          />

          <div className='flex flex-1 flex-col overflow-hidden rounded-lg border bg-card'>
            {selectedConversation ? (
              <>
                <MessageList messages={selectedConversation.messages} />
                <ChatInput onSend={handleSendMessage} />
              </>
            ) : (
              <div className='flex h-full items-center justify-center'>
                <div className='text-center'>
                  <h2 className='text-2xl font-semibold'>Welcome to Chat</h2>
                  <p className='mt-2 text-muted-foreground'>
                    Select a conversation or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}
