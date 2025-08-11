import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PaperAirplaneIcon,
    UserGroupIcon,
    ChevronRightIcon, // Import the chevron icon
} from '@heroicons/react/24/outline';

// --- Reusable Logic & Data ---
const knowledgeBase = { greetings: ['hello', 'hi', 'hey'], lms: ['lms', 'learning management system'], consulting: ['consulting', 'services'], features: ['features'], pricing: ['pricing', 'cost'], demo: ['demo'], contact: ['contact', 'human'], thanks: ['thanks', 'thank you'], };
const responses = { greetings: "Hello! How can I help you today?", lms: "Our LMS is built for scalability and engagement.", consulting: "We offer end-to-end LMS consulting. How can we help?", features: "Our platforms include analytics, gamification, and more.", pricing: "Pricing is tailored to your project. Please schedule a consultation.", demo: "We'd love to show you a demo! You can schedule one via our contact page.", contact: "To speak with a human, please ensure you are logged in and use the Live Chat tab.", thanks: "You're welcome!", default: "I can help with questions about LMS, services, and pricing."};
const getBotResponse = (userInput) => { const lowerCaseInput = userInput.toLowerCase(); for (const key in knowledgeBase) { if (knowledgeBase[key].some(keyword => lowerCaseInput.includes(keyword))) return responses[key]; } return responses.default; };

// ★★★ FIX: Define the predefined questions for the FAQ mode ★★★
const predefinedQuestions = [
    { text: "What services do you provide?", key: 'consulting' },
    { text: "What are the features of your LMS?", key: 'features' },
    { text: "How does pricing work?", key: 'pricing' },
    { text: "How can I contact a support agent?", key: 'contact' },
];


const ChatInterface = ({ mode, user, session, socket, onTerminate }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // No changes needed in these useEffect hooks
    useEffect(() => {
        if (mode !== 'live' || !socket) return;
        const handleNewMessage = (incomingMessage) => { setMessages(prev => [...prev, incomingMessage]); };
        socket.on('newMessage', handleNewMessage);
        return () => { socket.off('newMessage', handleNewMessage); };
    }, [mode, socket]);

    useEffect(() => {
        if (mode === 'faq') {
            setMessages([{ id: 'initial', text: "Hello! I'm the UniConsult assistant. How can I help you?", sender: 'bot', timestamp: new Date() }]);
        } else if (mode === 'live' && session?._id) {
            const fetchHistory = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/chat/messages/${session._id}`);
                    if (res.ok) setMessages(await res.json());
                } catch (error) { console.error("History fetch failed:", error); }
            };
            fetchHistory();
        } else {
            setMessages([]);
        }
    }, [mode, session?._id]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // This handler for typed messages is unchanged
    const handleSendMessage = (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text) return;
        if (mode === 'faq') {
            setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user', timestamp: new Date() }]);
            setTimeout(() => { setMessages(prev => [...prev, { id: Date.now() + 1, text: getBotResponse(text), sender: 'bot', timestamp: new Date() }]); }, 1000);
        } else if (mode === 'live' && socket) {
            const messageData = { sessionId: session?._id, sender: 'user', senderName: user.name, text };
            const tempMessage = { ...messageData, _id: `temp_${Date.now()}`, timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, tempMessage]);
            socket.emit('sendMessage', messageData);
        }
        setInputValue('');
    };
    
    // ★★★ FIX: Create a new handler for clicking a predefined question ★★★
    const handleFaqClick = (question) => {
        // 1. Add the user's question to the chat history
        setMessages(prev => [...prev, { id: Date.now(), text: question.text, sender: 'user', timestamp: new Date() }]);

        // 2. Get the corresponding bot response using the question's key
        const botResponseText = responses[question.key] || responses.default;
        
        // 3. Add the bot's response after a short delay to feel more natural
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponseText, sender: 'bot', timestamp: new Date() }]);
        }, 600); // 600ms delay
    };

    if (mode === 'live' && !user) {
        return ( <div className="h-full flex flex-col items-center justify-center text-center p-8"><UserGroupIcon className="w-16 h-16 text-indigo-400 mb-4" /><h3 className="font-bold text-lg text-gray-800">Live Support Requires Login</h3><p className="text-gray-600 mt-2">Please log in to chat directly with our support team.</p><div className="mt-6 space-x-4"><button onClick={() => navigate('/login')} className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">Login</button><button onClick={() => navigate('/signup')} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition">Sign Up</button></div></div> );
    }

    return (
        <div className="h-full w-full bg-white flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={msg._id || msg.id || index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-[80%] shadow-sm ${msg.sender === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-white border text-gray-800'}`}>
                            <p className="text-sm break-words">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* ★★★ FIX: Render the list of questions only in FAQ mode ★★★ */}
            {mode === 'faq' && (
                <div className="flex-shrink-0 border-t border-gray-200 p-2 bg-white">
                    <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Or ask about...</p>
                    <div className="space-y-1">
                        {predefinedQuestions.map((q, index) => (
                            <button
                                key={index}
                                onClick={() => handleFaqClick(q)}
                                className="w-full flex justify-between items-center text-left p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-sm text-gray-700">{q.text}</span>
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-2 border-t bg-white flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <button type="submit" className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition-colors"><PaperAirplaneIcon className="h-4 w-4"/></button>
                </form>
                {mode === 'live' && session && <button onClick={onTerminate} className="text-xs text-center w-full mt-2 text-gray-500 hover:text-red-600">Terminate Session</button>}
            </div>
        </div>
    );
};

export default ChatInterface;

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//     PaperAirplaneIcon,
//     UserGroupIcon,
// } from '@heroicons/react/24/outline';

// // --- Reusable Logic & Data (No changes needed) ---
// const knowledgeBase = { greetings: ['hello', 'hi', 'hey'], lms: ['lms', 'learning management system'], consulting: ['consulting', 'services'], features: ['features'], pricing: ['pricing', 'cost'], demo: ['demo'], contact: ['contact', 'human'], thanks: ['thanks', 'thank you'], };
// const responses = { greetings: "Hello! How can I help you today?", lms: "Our LMS is built for scalability and engagement.", consulting: "We offer end-to-end LMS consulting. How can we help?", features: "Our platforms include analytics, gamification, and more.", pricing: "Pricing is tailored to your project. Please schedule a consultation.", demo: "We'd love to show you a demo! You can schedule one via our contact page.", contact: "To speak with a human, please ensure you are logged in and use the Live Chat tab.", thanks: "You're welcome!", default: "I can help with questions about LMS, services, and pricing."};
// const getBotResponse = (userInput) => { const lowerCaseInput = userInput.toLowerCase(); for (const key in knowledgeBase) { if (knowledgeBase[key].some(keyword => lowerCaseInput.includes(keyword))) return responses[key]; } return responses.default; };



// const ChatInterface = ({ mode, user, session, socket, onTerminate }) => {
//     const [messages, setMessages] = useState([]);
//     const [inputValue, setInputValue] = useState('');
//     const messagesEndRef = useRef(null);
//     const navigate = useNavigate();

//     // Effect for real-time messages (No change needed)
//     useEffect(() => {
//         if (mode !== 'live' || !socket) return;
//         const handleNewMessage = (incomingMessage) => {
//             setMessages(prevMessages => {
//                 if (incomingMessage.sender === 'user') {
//                     const tempMessageIndex = prevMessages.findIndex(msg => msg._id.startsWith('temp_') && msg.text === incomingMessage.text);
//                     if (tempMessageIndex !== -1) {
//                         const updatedMessages = [...prevMessages];
//                         updatedMessages[tempMessageIndex] = incomingMessage;
//                         return updatedMessages;
//                     }
//                 }
//                 return [...prevMessages, incomingMessage];
//             });
//         };
//         socket.on('newMessage', handleNewMessage);
//         return () => {
//             socket.off('newMessage', handleNewMessage);
//         };
//     }, [mode, socket]);

//     // Effect to initialize chat state (No change needed)
//     useEffect(() => {
//         if (mode === 'faq') {
//             setMessages([{ id: 'initial', text: "Hello! I'm the UniConsult assistant. How can I help you?", sender: 'bot', timestamp: new Date() }]);
//         } else if (mode === 'live' && session?._id) {
//             const fetchHistory = async () => {
//                 try {
//                     const res = await fetch(`http://localhost:5000/api/chat/messages/${session._id}`);
//                     if (res.ok) setMessages(await res.json());
//                 } catch (error) { console.error("History fetch failed:", error); }
//             };
//             fetchHistory();
//         } else {
//             setMessages([]);
//         }
//     }, [mode, session?._id]);

//     useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         const text = inputValue.trim();
//         if (!text) return;
//         if (mode === 'faq') {
//             setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user', timestamp: new Date() }]);
//             setTimeout(() => { setMessages(prev => [...prev, { id: Date.now() + 1, text: getBotResponse(text), sender: 'bot', timestamp: new Date() }]); }, 1000);
//         } 
//             else if (mode === 'live' && socket) { // Remove the session?._id check here
//                 // SessionId can be null for the first message. The backend will create it.
//                 const messageData = { sessionId: session?._id, sender: 'user', senderName: user.name, text };
                
//                 // Optimistic update remains the same
//                 const tempMessage = { ...messageData, _id: `temp_${Date.now()}`, timestamp: new Date().toISOString() };
//                 setMessages(prev => [...prev, tempMessage]);
               
//                 socket.emit('sendMessage', messageData);
//             }
//         setInputValue('');
//     };

    
//     if (mode === 'live' && !user) {
//         return ( <div className="h-full flex flex-col items-center justify-center text-center p-8"><UserGroupIcon className="w-16 h-16 text-indigo-400 mb-4" /><h3 className="font-bold text-lg text-gray-800">Live Support Requires Login</h3><p className="text-gray-600 mt-2">Please log in to chat directly with our support team.</p><div className="mt-6 space-x-4"><button onClick={() => navigate('/login')} className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">Login</button><button onClick={() => navigate('/signup')} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition">Sign Up</button></div></div> );
//     }

//     return (
//         <div className="h-full w-full bg-white flex flex-col">
//             {/* ★★★ THE FIX IS HERE: The header div has been completely removed. ★★★ */}
            
//             <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//                 {messages.map((msg, index) => (
//                     <div key={msg._id || msg.id || index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//                         <div className={`p-3 rounded-lg max-w-[80%] shadow-sm ${msg.sender === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-white border text-gray-800'}`}>
//                             <p className="text-sm break-words">{msg.text}</p>
//                             <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//                         </div>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>

//             <div className="p-2 border-t bg-white flex-shrink-0">
//                 <form onSubmit={handleSendMessage} className="flex items-center">
//                     <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//                     <button type="submit" className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition-colors"><PaperAirplaneIcon className="h-4 w-4"/></button>
//                 </form>
//                 {mode === 'live' && session && <button onClick={onTerminate} className="text-xs text-center w-full mt-2 text-gray-500 hover:text-red-600">Terminate Session</button>}
//             </div>
//         </div>
//     );
// };

// export default ChatInterface;


