import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [currentRoom, setCurrentRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to chat server');
        });

        newSocket.on('chat_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        newSocket.on('user_joined', (data) => {
            console.log('User joined:', data);
        });

        newSocket.on('user_left', (data) => {
            console.log('User left:', data);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const joinRoom = (e) => {
        e.preventDefault();
        if (roomId.trim() && socket) {
            if (currentRoom) {
                socket.emit('leave_room', currentRoom);
            }
            socket.emit('join_room', roomId);
            setCurrentRoom(roomId);
            setMessages([]);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && currentRoom && socket) {
            socket.emit('chat_message', {
                roomId: currentRoom,
                message: messageInput,
                sender: user?.name || 'Anonymous'
            });
            setMessageInput('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Chat</h1>

                {!currentRoom ? (
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4">Join a Chat Room</h2>
                        <p className="text-gray-600 mb-4">
                            Enter a room ID to start chatting. Use the same room ID as your session partner.
                        </p>
                        <form onSubmit={joinRoom} className="flex gap-2">
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter room ID (e.g., session-123)"
                                className="input flex-1"
                            />
                            <button type="submit" className="btn btn-primary">
                                Join Room
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b">
                            <div>
                                <h2 className="text-xl font-semibold">Room: {currentRoom}</h2>
                                <p className="text-sm text-gray-600">Connected as {user?.name}</p>
                            </div>
                            <button
                                onClick={() => {
                                    socket?.emit('leave_room', currentRoom);
                                    setCurrentRoom('');
                                    setMessages([]);
                                    setRoomId('');
                                }}
                                className="btn btn-secondary"
                            >
                                Leave Room
                            </button>
                        </div>

                        <div className="h-96 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                            ) : (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-3 ${msg.sender === user?.name ? 'text-right' : 'text-left'
                                            }`}
                                    >
                                        <div
                                            className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === user?.name
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white text-gray-900'
                                                }`}
                                        >
                                            <p className="text-xs opacity-75 mb-1">{msg.sender}</p>
                                            <p>{msg.message}</p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="input flex-1"
                            />
                            <button type="submit" className="btn btn-primary">
                                Send
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
