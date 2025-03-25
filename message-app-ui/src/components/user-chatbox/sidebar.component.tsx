import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import chatservice from '../../apiInterface/chat'
import { RootState } from '../../store/store'

interface User {
  _id: string
  name: string
}

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat }) => {
  const [users, setUsers] = useState<User[]>([])
  const authtoken = useSelector((state: RootState) => state.auth.authtoken)
  const authUser = useSelector((state: RootState) => state.auth.userData)
  console.log("authUser",authUser)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await chatservice.getAllUsers(authtoken || '')
    setUsers(res)
  }

  const handleUserClick = async (user: User) => {
    console.log(user)
    const res = await chatservice.createNewChat({ token: authtoken || '', user: user._id, name: user.name })
    onSelectChat(res._id)
  }

  return (
    <div className="w-1/4 h-screen bg-gray-100 p-4 overflow-y-auto border-r shadow-sm">
      <h2 className="font-semibold text-sm text-gray-600 mb-2 uppercase">Logged In As</h2>
      <div className="mb-6">
        {/* <div className="text-lg font-bold text-gray-900">{authUser?.name}</div> */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-semibold text-blue-700">
            {authUser?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-lg font-bold text-gray-900">{authUser?.name}</div>
        </div>
        <div className="h-[2px] bg-blue-500 w-full mt-1 rounded"></div>
      </div>
      <h2 className="font-bold text-lg mb-4 text-gray-700">All Users</h2>
      <div className="space-y-3">
        {users.map(user => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className="flex items-center gap-3 p-3 bg-white rounded-md shadow hover:shadow-md hover:bg-blue-50 transition cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-semibold text-blue-700">
              {user.name[0]?.toUpperCase()}
            </div>
            <div className="text-sm font-medium text-gray-800">{user.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatSidebar
