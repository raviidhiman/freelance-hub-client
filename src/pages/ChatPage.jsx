import React, { useState, useEffect } from 'react';
import ChatList from '../components/ChatList';
import Chat from './Chat';
import ClientSideNav from '../components/ClientSideNav';

const ChatPage = ({ userId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  const isClient = currentUser?.role === 'client';

  return (
    <div className="flex h-screen bg-gray-50">
      {isClient && <ClientSideNav />}
      <div className={`${isClient ? 'flex-1' : 'w-full'} flex`}>
        <div className={`${isClient ? 'w-80' : 'w-1/4'} border-r border-gray-200`}>
          <ChatList userId={userId || currentUser?._id} onSelectUser={setSelectedUser} />
        </div>
        <div className="flex-1">
          {selectedUser ? (
            <Chat userId={userId || currentUser?._id} otherUserId={selectedUser} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a contact</h3>
                <p className="text-gray-500">Choose someone from your contacts to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
