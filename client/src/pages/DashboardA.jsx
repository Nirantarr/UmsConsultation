import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
    BarChart3, Users, Briefcase, Settings, Mail, University, UserCheck, Zap, 
    TrendingUp, UserPlus, Menu, MessageCircle, Send, CornerDownLeft, 
    Trash2, ChevronsLeft // Import the necessary icons
} from 'lucide-react';
import io from 'socket.io-client';

// --- MOCK DATA (No changes needed) ---
const kpiData = { totalUniversities: 132, totalConsultants: 48, pendingRequests: 12, revenueThisMonth: 52300 };
const revenueData = [ { month: 'Jan', revenue: 25000 }, { month: 'Feb', revenue: 28000 }, { month: 'Mar', revenue: 45000 }, { month: 'Apr', revenue: 41000 }, { month: 'May', revenue: 55000 }, { month: 'Jun', revenue: 72000 }, { month: 'Jul', revenue: 52300 } ];
const activityFeed = [ { type: 'signup', text: 'MIT signed up as a new University.', time: '2 mins ago', icon: <University className="text-blue-500" /> }, { type: 'assignment', text: 'Dr. Eva Garcia was assigned to "Faculty Training".', time: '15 mins ago', icon: <UserCheck className="text-green-500" /> }, { type: 'request', text: 'Stanford University requested a "LMS Integration".', time: '1 hr ago', icon: <Mail className="text-amber-500" /> }, { type: 'user', text: 'New consultant "Bob Williams" is pending approval.', time: '3 hrs ago', icon: <UserPlus className="text-purple-500" /> } ];
const usersData = [ { id: 1, name: 'Stanford University', email: 'contact@stanford.edu', role: 'University', joined: '2024-03-15', status: 'Active' }, { id: 2, name: 'Dr. Alice Johnson', email: 'alice.j@consult.com', role: 'Consultant', joined: '2024-02-20', status: 'Active' }, { id: 3, name: 'MIT', email: 'admissions@mit.edu', role: 'University', joined: '2024-05-10', status: 'Active' }, { id: 4, name: 'Bob Williams (Pending)', email: 'bob.w@gmail.com', role: 'Consultant', joined: '2025-07-28', status: 'Pending Approval' } ];
const serviceRequestsData = [ { id: 1, university: 'State University', service: 'LMS Integration & Setup', date: '2025-07-30', priority: 'High' }, { id: 2, university: 'Community College of Arts', service: 'Faculty Training Program', date: '2025-07-29', priority: 'Medium' } ];
const availableConsultants = [ { id: 101, name: 'Dr. Alice Johnson', specialty: 'LMS & Tech' }, { id: 102, name: 'Dr. Eva Garcia', specialty: 'Curriculum Design' } ];


// --- Admin Live Chat Component ---

const AdminLiveChat = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const adminUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");
        setSocket(newSocket);
        const adminData = JSON.parse(localStorage.getItem('user'));

        newSocket.on('connect', () => {
            if (adminData && (adminData.is_admin || adminData.isAdmin)) {
                newSocket.emit('adminOnline', { user: adminData });
            }
        });

        const fetchSessions = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch('/api/chat/sessions', { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.ok) setSessions(await res.json());
            } catch (error) { console.error("Failed to fetch sessions:", error); }
        };
        fetchSessions();

        newSocket.on('newSession', (newSession) => {
            setSessions(prev => [newSession, ...prev.filter(s => s._id !== newSession._id)]);
        });

        newSocket.on('sessionTerminated', ({ sessionId }) => {
            setSessions(prev => prev.filter(s => s._id !== sessionId));
            if (activeSession?._id === sessionId) {
                setActiveSession(null);
                setMessages([]);
            }
        });

        return () => newSocket.close();
    }, []);

    // ★★★ FIX: This is the new, robust listener that solves both the duplication and the reload issue. ★★★
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (incomingMessage) => {
            // Only process messages for the currently active chat window.
            if (activeSession && incomingMessage.sessionId === activeSession._id) {
                setMessages(prevMessages => {
                    // This is a confirmation of a message the admin just sent.
                    if (incomingMessage.sender === 'admin') {
                        // Find the temporary, optimistic message and replace it with the real one from the server.
                        const optimisticMessageIndex = prevMessages.findIndex(
                            msg => typeof msg._id === 'number' && msg.text === incomingMessage.text
                        );
                        if (optimisticMessageIndex > -1) {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[optimisticMessageIndex] = incomingMessage;
                            return updatedMessages;
                        }
                    }
                    // For messages from the user, or if the optimistic message wasn't found, just add it.
                    return [...prevMessages, incomingMessage];
                });
            }
        };

        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [socket, activeSession]); // This effect correctly depends on the activeSession.

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const selectSession = async (session) => {
        setActiveSession(session);
        setMessages([]);
        if (socket) socket.emit('joinRoom', session._id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/chat/messages/${session._id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) setMessages(await res.json());
        } catch (error) { console.error("Failed to fetch messages:", error); }
    };
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && activeSession && socket) {
            const senderName = adminUser?.name || 'Support Admin';
            const messageData = { sessionId: activeSession._id, sender: 'admin', senderName, text: newMessage };
            
            // ★★★ FIX: The optimistic message now uses a temporary numeric ID (Date.now()). ★★★
            const optimisticMessage = { ...messageData, _id: Date.now(), timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, optimisticMessage]);
            
            socket.emit('sendMessage', messageData);
            setNewMessage('');
        }
    };

    const handleTerminateSession = (e, sessionId) => {
        e.stopPropagation(); // Prevents the session from being selected when the button is clicked.
        if (window.confirm('Are you sure you want to close this chat session?')) {
            if(socket) socket.emit('terminateSession', sessionId);
        }
    };

    return (
        <div className="bg-white/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg flex flex-col lg:flex-row h-[75vh]">
            {/* Session List */}
            <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200"><h3 className="text-xl font-bold">Active Chats</h3></div>
                <ul className="overflow-y-auto flex-1">
                    {sessions.length > 0 ? sessions.map(session => (
                        <li key={session._id} onClick={() => selectSession(session)} className={`p-4 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${activeSession?._id === session._id ? 'bg-blue-100' : ''}`}>
                            <div>
                                <p className="font-semibold">
                                    {session.userId ? (session.userId.organizationName || session.userId.fullName) : 'Anonymous User'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">User Type: {session.userType}</p>
                            </div>
                            {/* ★★★ FIX: Added the Terminate Session button. ★★★ */}
                            <button onClick={(e) => handleTerminateSession(e, session._id)} className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </li>
                    )) : (<p className="p-4 text-gray-500">No active chats.</p>)}
                </ul>
            </div>
            
            {/* Chat Window */}
            <div className="w-full lg:w-2/3 flex flex-col">
                {activeSession ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-bold text-lg">
                                Chat with {activeSession.userId ? (activeSession.userId.organizationName || activeSession.userId.fullName) : 'Anonymous User'}
                            </h3>
                        </div>
                        {/* Message Display Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`mb-3 flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-[80%] shadow-sm ${msg.sender === 'admin' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'}`}>
                                        <p className="text-sm break-words">{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Message Input Form */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center space-x-3">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your reply..." className="flex-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]" onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey ? handleSendMessage(e) : null}/>
                                <button type="submit" className="p-3 rounded-lg bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-secondary)] disabled:bg-gray-400 transition-colors" disabled={!newMessage.trim()}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex justify-center items-center h-full">
                        <div className="text-center text-gray-500">
                            <CornerDownLeft size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold">Select a chat</h3>
                            <p>Choose a conversation from the list on the left to start replying.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---
const DashboardA = () => {
    const [activeView, setActiveView] = useState('overview');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedConsultant, setSelectedConsultant] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const mainContentRef = useRef(null);
    const sidebarRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
           if (window.matchMedia('(min-width: 1024px)').matches) {
               gsap.fromTo(sidebarRef.current, { x: -288 }, { x: 0, duration: 0.8, ease: 'power4.out' });
           }
           gsap.fromTo(mainContentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', delay: 0.2 });
       }, []);
   
       useEffect(() => {
           if (mainContentRef.current) {
               gsap.fromTo(mainContentRef.current.querySelectorAll('.kpi-card, .revenue-chart, .activity-feed, .quick-actions, .user-table-row, .request-item, .settings-card, .user-card'), 
               { opacity: 0, y: 20 }, 
               { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' });
           }
       }, [activeView]);
   
       useEffect(() => {
           if (selectedRequest) {
               gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
           }
       }, [selectedRequest]);

    const handleAssignClick = (request) => setSelectedRequest(request);
     const closeAndResetModal = () => {
            gsap.to(modalRef.current, { opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in', onComplete: () => {
                setSelectedRequest(null);
                setSelectedConsultant('');
            }});
        };
    const handleConfirmAssignment = () => {
            if (!selectedConsultant) return;
            closeAndResetModal();
        };
    const handleSetView = (view) => {
        setActiveView(view);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    const NavItem = ({ icon, label, view }) => (
        <button onClick={() => handleSetView(view)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeView === view ? 'bg-[var(--theme-primary)] text-white shadow-lg' : 'hover:bg-gray-700/50'} ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            {icon} {label && <span className="font-semibold">{label}</span>}
        </button>
    );
    
 const renderContent = () => {
        switch (activeView) {
            case 'users': return <UserManagement />;
            case 'requests': return <RequestAssignmentQueue onAssignClick={handleAssignClick} />;
            case 'settings': return <SettingsView />;
            case 'chats': return <AdminLiveChat />;
            case 'overview': default: return <OverviewPage />;
        }
    };
     const renderHeaderText = () => {
        switch (activeView) {
            case 'chats': return { title: 'Live Chat Support', subtitle: 'Respond to user queries in real-time.' };
            case 'users': return { title: 'User Management', subtitle: 'Manage all platform users and consultants.' };
            case 'requests': return { title: 'Assign Requests', subtitle: 'Assign service requests to available consultants.' };
            case 'settings': return { title: 'Platform Settings', subtitle: 'Configure global settings and integrations.' };
            case 'overview': default: return { title: 'Welcome Back, Admin!', subtitle: "Here's what's happening with your platform today." };
        }
    };

    const headerText = renderHeaderText();

    return (
        <div className="min-h-screen bg-gray-50 font-[var(--secondary-font)] text-[var(--text-primary)]">
            {isSidebarOpen && !isSidebarCollapsed && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>}

            <aside 
                ref={sidebarRef} 
                className={`bg-gray-900 text-white flex-shrink-0 flex flex-col p-4 fixed h-full shadow-2xl z-30 transform transition-all duration-300 ease-in-out
                           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                           ${isSidebarCollapsed ? 'w-20 items-stretch' : 'w-72'}`}
            >
                <div className={`flex items-center my-4 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isSidebarCollapsed && ( <button 
            onClick={() => handleSetView('overview')} 
            className="text-3xl font-extrabold text-white tracking-tight font-[var(--primary-font)] text-left"
        >
            UniConsult
        </button>)}
                    <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-700/50">
                        <ChevronsLeft className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                </div>
                {!isSidebarCollapsed && (<p className="text-xs text-gray-400 -mt-4 text-center">Admin Panel</p>)}
                <nav className="flex-1 space-y-3 mt-10">
                    <NavItem icon={<BarChart3 />} label={!isSidebarCollapsed && "Overview"} view="overview" />
                    <NavItem icon={<MessageCircle />} label={!isSidebarCollapsed && "Chats"} view="chats" />
                    <NavItem icon={<Users />} label={!isSidebarCollapsed && "User Management"} view="users" />
                    <NavItem icon={<Briefcase />} label={!isSidebarCollapsed && "Assign Requests"} view="requests" />
                    <NavItem icon={<Settings />} label={!isSidebarCollapsed && "Settings"} view="settings" />
                </nav>
            </aside>

            <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
                <main ref={mainContentRef} className="p-6 md:p-10">
                    <header className="content-header flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{headerText.title}</h1>
                            <p className="text-[var(--text-secondary)]">{headerText.subtitle}</p>
                        </div>
                        {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-200 lg:hidden"><Menu size={24} /></button>}
                    </header>
                    {renderContent()}
                </main>
            </div>

            {selectedRequest && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
                         <h2 className="text-2xl font-bold mb-2">Assign Service Request</h2>
                         <p className="text-[var(--text-secondary)] mb-6">Assign a consultant to handle the request from <span className="font-semibold text-[var(--theme-primary)]">{selectedRequest.university}</span>.</p>
                         <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                             <h4 className="font-semibold text-lg">{selectedRequest.service}</h4>
                             <p className="text-sm text-gray-600 mt-1">Priority: <span className="font-bold text-red-500">{selectedRequest.priority}</span></p>
                         </div>
                         <div className="mb-6">
                            <label htmlFor="consultant" className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Available Consultants</label>
                            <select id="consultant" value={selectedConsultant} onChange={(e) => setSelectedConsultant(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition">
                                <option value="" disabled>-- Select a Consultant --</option>
                                {availableConsultants.map(c => <option key={c.id} value={c.id}>{c.name} ({c.specialty})</option>)}
                            </select>
                         </div>
                         <div className="flex justify-end space-x-4">
                            <button onClick={closeAndResetModal} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition">Cancel</button>
                            <button onClick={handleConfirmAssignment} className="px-6 py-2 rounded-lg text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-secondary)] font-semibold transition shadow-md hover:shadow-lg">Confirm</button>
                         </div>
                    </div>
            </div>
        )}
        </div>
    );
};

const UserManagement = () => (
    <div className="bg-white/50 backdrop-blur-lg border border-white/20 p-4 md:p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">All Users</h3>
        <div className="space-y-4 lg:hidden">
            {usersData.map(user => (
                <div key={user.id} className="user-card bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.role}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{user.status}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <p className="text-xs text-gray-500">Joined: {user.joined}</p>
                        <button className="text-[var(--theme-primary)] hover:underline font-semibold text-sm">Manage</button>
                    </div>
                </div>
            ))}
        </div>
        <div className="overflow-x-auto hidden lg:block">
            <table className="w-full text-left">
                <thead><tr className="border-b border-gray-200"><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Joined</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                    {usersData.map(user => (
                        <tr key={user.id} className="user-table-row border-b border-gray-100 hover:bg-gray-50/50">
                            <td className="p-4">{user.name}</td><td className="p-4 text-gray-600">{user.role}</td><td className="p-4 text-gray-600">{user.joined}</td>
                            <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{user.status}</span></td>
                            <td className="p-4"><button className="text-[var(--theme-primary)] hover:underline font-semibold">Manage</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const RequestAssignmentQueue = ({ onAssignClick }) => ( <div className="bg-white/50 backdrop-blur-lg border border-white/20 p-4 md:p-6 rounded-2xl shadow-lg"> <h3 className="text-xl font-bold mb-4">Service Request Assignment Queue</h3> <div className="space-y-4"> {serviceRequestsData.map(req => ( <div key={req.id} className="request-item bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"> <div> <p className="font-bold">{req.service}</p> <p className="text-sm text-gray-600">From: <span className="font-semibold">{req.university}</span> | Priority: <span className="font-bold text-red-500">{req.priority}</span></p> </div> <button onClick={() => onAssignClick(req)} className="bg-[var(--theme-primary)] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[var(--theme-secondary)] transition-all transform hover:scale-105 w-full sm:w-auto flex-shrink-0">Assign</button> </div> ))} </div> </div> );
const OverviewPage = () => ( <div className="space-y-8"> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <KPICard icon={<University size={28} className="text-[var(--theme-primary)]"/>} title="Total Universities" value={kpiData.totalUniversities} /> <KPICard icon={<UserCheck size={28} className="text-green-500"/>} title="Active Consultants" value={kpiData.totalConsultants} /> <KPICard icon={<Mail size={28} className="text-amber-500"/>} title="Pending Requests" value={kpiData.pendingRequests} /> <KPICard icon={<TrendingUp size={28} className="text-purple-500"/>} title="Revenue (Month)" value={`$${kpiData.revenueThisMonth.toLocaleString()}`} /> </div> <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> <RevenueChart /> <div className="lg:col-span-1 space-y-8"> <ActivityFeed /> <QuickActions /> </div> </div> </div> );
const RevenueChart = () => { const chartRef = useRef(null); const maxRevenue = Math.max(...revenueData.map(d => d.revenue)); useEffect(() => { if(!chartRef.current) return; const bars = chartRef.current.querySelectorAll('.bar'); gsap.fromTo(bars, { height: 0 }, { height: (i) => `${(revenueData[i].revenue / maxRevenue) * 100}%`, duration: 1, ease: 'power3.inOut', stagger: 0.1, delay: 0.5 }); }, [maxRevenue]); return ( <div className="revenue-chart lg:col-span-2 bg-white/50 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg"> <h3 className="text-xl font-bold mb-4">Revenue Overview</h3> <div ref={chartRef} className="flex justify-between items-end h-64 space-x-2"> {revenueData.map((data, index) => ( <div key={index} className="flex-1 flex flex-col items-center"> <div className="w-full h-full flex items-end"> <div className="bar w-full bg-gradient-to-t from-[var(--theme-secondary)] to-[var(--theme-primary)] rounded-t-md hover:opacity-80 transition-opacity" title={`$${data.revenue.toLocaleString()}`}></div> </div> <span className="text-xs font-semibold text-[var(--text-secondary)] mt-2">{data.month}</span> </div> ))} </div> </div> ); };
const ActivityFeed = () => ( <div className="activity-feed bg-white/50 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg"> <h3 className="text-xl font-bold mb-4">Recent Activity</h3> <div className="space-y-4"> {activityFeed.map((item, index) => ( <div key={index} className="flex items-start space-x-4"> <div className="mt-1 bg-gray-100 p-2 rounded-full">{item.icon}</div> <div> <p className="text-sm font-medium">{item.text}</p> <p className="text-xs text-gray-500">{item.time}</p> </div> </div> ))} </div> </div> );
const QuickActions = () => ( <div className="quick-actions bg-white/50 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg"> <h3 className="text-xl font-bold mb-4">Quick Actions</h3> <div className="space-y-3"> <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-secondary)] transition-all transform hover:scale-105"> <UserPlus size={18}/><span>Add New Consultant</span> </button> <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"> <Zap size={18}/><span>Send Announcement</span> </button> </div> </div> );
const SettingsView = () => ( <div className="space-y-8"> <div> <h2 className="text-2xl font-bold">Platform Settings</h2> <p className="text-[var(--text-secondary)] mt-1">Manage global configurations for the UniConsult platform.</p> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> <div className="settings-card bg-white/50 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg"> <h3 className="font-bold text-lg mb-4">Financial</h3> <div className="space-y-4"> <div> <label className="block text-sm font-medium mb-1">Commission Rate (%)</label> <input type="number" defaultValue="15" className="w-full p-2 border rounded-md"/> </div> <div> <label className="block text-sm font-medium mb-1">Payout Provider</label> <select className="w-full p-2 border rounded-md"><option>Stripe Connect</option><option>PayPal</option></select> </div> </div> </div> <div className="settings-card bg-white/50 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg"> <h3 className="font-bold text-lg mb-4">Notifications</h3> <div className="space-y-4"> <div className="flex items-center justify-between"> <label>Email on new user signup</label> <input type="checkbox" className="h-5 w-5 rounded text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]" defaultChecked/> </div> <div className="flex items-center justify-between"> <label>Email on new service request</label> <input type="checkbox" className="h-5 w-5 rounded text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]" defaultChecked/> </div> <div className="flex items-center justify-between"> <label>Email on project completion</label> <input type="checkbox" className="h-5 w-5 rounded text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"/> </div> </div> </div> </div> </div> );
const KPICard = ({ icon, title, value }) => ( <div className="kpi-card bg-white/50 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out"> <div className="flex justify-between items-start mb-4"> <div className="bg-gray-100 p-3 rounded-full">{icon}</div> </div> <div> <p className="text-3xl font-bold">{value}</p> <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p> </div> </div> );


export default DashboardA;

