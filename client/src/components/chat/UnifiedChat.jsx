import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { gsap } from 'gsap';
import io from 'socket.io-client';

import useLocalStorage from '../../hooks/useLocalStorage';
import ChatInterface from './ChatInterface'; 

const UnifiedChat = () => {
    // ★★★ THE FIX IS HERE: New state to control mounting/unmounting ★★★
    const [isRendered, setIsRendered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('faq');
    const launcherRef = useRef(null);
    const chatWindowRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [user] = useLocalStorage('user', null);
    const [chatSession, setChatSession] = useLocalStorage('chatSession', null);
    const API_URL = process.env.REACT_APP_API_URL;


    // GSAP animation for the launcher button (no change needed)
    useEffect(() => { gsap.fromTo(launcherRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 1 }); }, []);
    
    // Socket connection logic (no change needed)
    useEffect(() => {
        if (user && !socket) {
            const newSocket = io(`${API_URL}`);
            setSocket(newSocket);
            
            // ★★★ FIX: Listen for the sessionStarted event from the server ★★★
            newSocket.on('sessionStarted', (serverSession) => {
                setChatSession(serverSession); // This will save it to localStorage
            });
            
            // Emit the full user object, not just the ID
            if (user) {
                newSocket.emit('startChat', { userId: user._id, user: user });
            }

            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        } // ... rest of the effect
    }, [user]);    
    // ★★★ THE FIX IS HERE: The new animation handler ★★★
    const handleToggleChat = () => {
        if (!isRendered) {
            // If it's not rendered, first render it, then trigger the open animation
            setIsRendered(true);
            setIsOpen(true);
        } else {
            // If it's already rendered, just trigger the close animation
            setIsOpen(false);
        }
    };

    // This effect listens to the `isOpen` state and animates the window in or out.
    useEffect(() => {
        if (isRendered) {
            gsap.to(chatWindowRef.current, {
                opacity: isOpen ? 1 : 0,
                y: isOpen ? 0 : 50,
                scale: isOpen ? 1 : 0.9,
                duration: 0.4,
                ease: 'power3.out',
                // When the close animation completes, unmount the component
                onComplete: () => {
                    if (!isOpen) {
                        setIsRendered(false);
                    }
                }
            });
        }
    }, [isOpen, isRendered]);


    const handleTerminate = () => { if (socket && chatSession?._id) socket.emit('terminateSession', chatSession._id); setChatSession(null); };

    return (
        <>
            {/* The component is now controlled by `isRendered` */}
            {isRendered && (
                <div 
                    ref={chatWindowRef} 
                    style={{ opacity: 0 }} // Start with opacity 0 so GSAP can fade it in
                    className="fixed bottom-20 right-4 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[40rem]  
                               sm:bottom-24 sm:right-8 sm:h-[32rem] sm:max-h-none
                               flex flex-col z-50"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-2 rounded-t-2xl flex justify-between items-center shadow-lg flex-shrink-0">
                        <div className="flex-1 flex justify-center items-center space-x-1 bg-black/10 p-1 rounded-lg">
                            <button onClick={() => setActiveTab('faq')} className={`w-1/2 px-2 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'faq' ? 'bg-white text-indigo-700 shadow' : 'bg-transparent text-white/80'}`}>FAQ Chatbot</button>
                            <button onClick={() => setActiveTab('live')} className={`w-1/2 px-2 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'live' ? 'bg-white text-indigo-700 shadow' : 'bg-transparent text-white/80'}`}>Live Chat Support</button>
                        </div>
                        <button onClick={handleToggleChat} className="hover:opacity-75 transition-opacity p-2 ml-2 rounded-full hover:bg-white/20"><XMarkIcon className="h-6 w-6" /></button>
                    </div>
                    
                    <div className="flex-grow rounded-b-2xl shadow-2xl overflow-hidden bg-white/60 backdrop-blur-xl border border-t-0 border-white/30">
                        <ChatInterface
                            key={activeTab}
                            mode={activeTab}
                            user={user}
                            session={chatSession}
                            socket={socket}
                            onTerminate={handleTerminate}
                        />
                    </div>
                </div>
            )}
            
            <button 
                ref={launcherRef} 
                onClick={handleToggleChat} // Use the new handler
                className="fixed bottom-4 right-4 w-14 h-14 
                           sm:bottom-8 sm:right-8 sm:w-16 sm:h-16
                           bg-white/60 backdrop-blur-xl border border-white/30 text-indigo-700 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 z-50"
            >
                {/* The icon now toggles based on `isOpen` state */}
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <ChatBubbleOvalLeftEllipsisIcon className={`absolute transition-all duration-300 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
                    <XMarkIcon className={`absolute transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                </div>
            </button>
        </>
    );
};

export default UnifiedChat;
