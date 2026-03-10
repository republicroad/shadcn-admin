export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}
