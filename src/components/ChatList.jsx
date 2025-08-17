import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { getMessages } from '../services/chatService';
import { UserIcon } from '@heroicons/react/24/outline';

const ChatList = ({ userId, onSelectUser }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchContacts();
  }, [userId]);

  const fetchContacts = async () => {
    try {
      // In a real app, this would fetch from an API endpoint
      // For now, we'll simulate fetching contacts
      setTimeout(() => {
        const mockContacts = [
          { _id: 'user2', name: 'John Doe', email: 'john@example.com', lastMessage: 'Hello there!' },
          { _id: 'user3', name: 'Jane Smith', email: 'jane@example.com', lastMessage: 'How are you?' },
          { _id: 'user4', name: 'Mike Johnson', email: 'mike@example.com', lastMessage: 'Thanks for the help!' }
        ];
        setContacts(mockContacts);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (message) => {
      // Update contacts or notify user
      // For simplicity, ignoring here
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket]);

  return (
    <div className="bg-white h-full border-r border-gray-200">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
      </div>
      
      {loading ? (
        <div className="p-4 text-center text-gray-500">
          Loading contacts...
        </div>
      ) : contacts.length === 0 ? (
        <div className="p-8 text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No contacts yet</p>
          <p className="text-sm text-gray-400 mt-1">Start a conversation to see contacts here</p>
        </div>
      ) : (
        <div className="overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
              onClick={() => onSelectUser(contact._id)}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    {contact.name || contact.email}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {contact.lastMessage || 'No messages yet'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
