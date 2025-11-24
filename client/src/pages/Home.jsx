import { useState } from 'react'
import Sidebar from '../comonents/Sidebar'
import ChatContainer from '../comonents/ChatContainer'
import RightSidebar from '../comonents/RightSidebar'  

function Home() {
    const [selectedUser, setSelectedUser] = useState(false)
    return (
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div 
                className={
                 `backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative
                 ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols[1fr_1.5fr_1fr]' : 'grid-cols-2' }`
                }
            >
                <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </div>
        </div>
    )
}

export default Home