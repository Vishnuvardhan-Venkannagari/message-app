import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

interface Message {
  _id?: string
  sender_id: string
  sender_name: string
  message: string
  timestamp: string
}

interface ChatRoomProps {
  chatId: string
  onClose: () => void
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const user = useSelector((state: any) => state.auth.userData)
  const ws = useRef<WebSocket | null>(null)
  const messageEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages/${chatId}`, {
        headers: { authtoken: sessionStorage.getItem('dev_authtoken') || '' }
      })
      setMessages(res.data.reverse())
    }

    fetchMessages()

    ws.current = new WebSocket(`ws://localhost:9010/ws/${user.id}`)
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.room_id === chatId) {
        setMessages(prev => [...prev, msg])
      }
    }

    return () => ws.current?.close()
  }, [chatId, user.id])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (ws.current && input.trim()) {
        console.log(user)
      const msg = {
        room_id: chatId,
        sender_id: user.id,
        sender_name: user.name,
        message: input,
        timestamp: new Date().toISOString()
      }
      ws.current.send(JSON.stringify(msg))
      setInput('')
    }
  }

  return (
    <div className="w-3/4 h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center shrink-0">
        <h2 className="text-lg font-semibold text-gray-700">Chat Room</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 font-bold text-xl"
          title="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((msg, i) => (
                <div
                key={i}
                className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                    msg.sender_id === user.user_id
                    ? 'bg-blue-600 text-white self-end ml-auto'
                    : 'bg-gray-100 text-gray-800 self-start'
                }`}
                >
                <div className="mb-1">
                    <span className="text-xs font-semibold block">
                    {msg.sender_name}
                    </span>
                    <p className="text-sm">{msg.message}</p>
                </div>
                <p className="text-xs text-right opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
                </div>
            ))}
            <div ref={messageEndRef} />
        </div>

      {/* Footer Input */}
      <div className="p-4 border-t flex gap-2 items-center shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
