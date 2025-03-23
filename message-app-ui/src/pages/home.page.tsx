
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import ChatSidebar from '../components/user-chatbox/sidebar.component'
import ChatRoom from '../components/user-chatbox/chat-room.component'
import { Login as LoginComponent } from '../components'
import chatservice from '../apiInterface/chat'

interface Chat {
  _id: string
  participants: string[]
  last_message: string
}

const Home: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [allRooms, setAllRooms] = useState<Chat[]>([])
  const authStatus = useSelector((state: RootState) => state.auth.status)
  const authtoken = useSelector((state: RootState) => state.auth.authtoken)

  useEffect(() => {
    if (authStatus && !activeChatId) {
      fetchAllRooms()
    }
  }, [authStatus, activeChatId])

  const fetchAllRooms = async () => {
    const res = await chatservice.getAllChats(authtoken || '')
    setAllRooms(res)
  }

  return (
    <div className="w-full h-screen flex overflow-hidden">
        {!authStatus ? (
            <LoginComponent />
        ) : (
            <>
            <ChatSidebar onSelectChat={(id) => setActiveChatId(id)} />
            <div className="flex-1 flex flex-col">
            {activeChatId ? (
                <ChatRoom chatId={activeChatId} onClose={() => setActiveChatId(null)} />
            ) : (
                <div className="flex-1 overflow-y-auto bg-gray-100 px-6 py-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">💬 Your Chat Rooms</h2>

                {allRooms.length > 0 ? (
                    <div className="grid gap-4">
                    {allRooms.map((chat) => (
                        <div
                        key={chat._id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg hover:border-blue-500 transition cursor-pointer"
                        onClick={() => setActiveChatId(chat._id)}
                        >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-700">
                            Chat With
                            <span className="ml-2 text-blue-600 text-lg font-mono">
                                {chat.receiver_name}
                            </span>
                            </h3>
                            <span className="text-sm text-gray-400">Click to open</span>
                        </div>

                        <p className="text-gray-500 text-sm mt-2">
                            Last Message:{' '}
                            {chat.last_message ? (
                            <span className="text-gray-700 font-medium">"{chat.last_message}"</span>
                            ) : (
                            'No messages yet'
                            )}
                        </p>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">No chat rooms available.</p>
                )}
                </div>
            )}
            </div>
            </>
        )}
    </div>
  )
}

export default Home
