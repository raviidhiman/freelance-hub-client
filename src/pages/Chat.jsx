import React, { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { sendMessage, getMessages } from '../services/chatService';

const Chat = ({ userId, otherUserId }) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();
  
  // Get user info from localStorage for role checking
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isClient = user.role === 'client';

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', getRoomId(userId, otherUserId));

    socket.on('receiveMessage', (message) => {
      if (message.roomId === getRoomId(userId, otherUserId)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, userId, otherUserId]);

  useEffect(() => {
    fetchMessages();
  }, [userId, otherUserId]);

  const fetchMessages = async () => {
    try {
      const res = await getMessages(otherUserId);
      if (res.success) {
        setMessages(res.data);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const getRoomId = (a, b) => {
    return [a, b].sort().join('_');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const message = {
      sender: userId,
      receiver: otherUserId,
      content: input.trim(),
      timestamp: new Date(),
      roomId: getRoomId(userId, otherUserId),
    };

    try {
      await sendMessage(otherUserId, input.trim());
      setMessages((prev) => [...prev, message]);
      socket.emit('sendMessage', message);
      setInput('');
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {isClient && <ClientSideNav />}
      <div className={`${isClient ? 'flex-1' : 'w-full'} overflow-auto`}>
        <div className="flex flex-col h-full max-w-4xl border rounded shadow mx-auto">
          <div className="bg-white border-b px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg max-w-xs break-words ${
                    msg.sender === userId 
                      ? 'bg-blue-500 text-white self-end ml-auto' 
                      : 'bg-white text-gray-800 self-start mr-auto shadow-sm'
                  }`}
                >
                  {msg.content}
                  <div className={`text-xs mt-1 ${msg.sender === userId ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
