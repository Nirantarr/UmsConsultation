import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Home, Clock, CheckCircle, Search, Menu, X } from 'lucide-react';

// --- Mock Data (No changes) ---
const initialComplaintsData = [
    { id: 1, university: 'Quantum State University', query: 'Link to "Advanced Quantum Mechanics" is broken.', date: '2025-07-28', completed: false },
    { id: 2, university: 'Metropolis City College', query: 'Unable to submit my assignment for "Journalism Ethics".', date: '2025-07-27', completed: false },
    { id: 3, university: 'Apex Technical Institute', query: 'The final exam schedule is not visible.', date: '2025-07-26', completed: false },
    { id: 4, university: 'Coastal University', query: 'Scholarship details are not reflecting correctly.', date: '2025-07-25', completed: true },
    { id: 5, university: 'Northern Arts Academy', query: 'Need an extension for my "Digital Sculpture" project.', date: '2025-07-24', completed: true },
    { id: 6, university: 'Quantum State University', query: 'The video lectures for "Astrophysics 101" are not loading.', date: '2025-07-23', completed: false },
];

const DashboardU = () => {
    const [complaints, setComplaints] = useState(initialComplaintsData);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [lastCompleted, setLastCompleted] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const mainContentRef = useRef(null);
    const sidebarRef = useRef(null);

    const pendingComplaints = complaints.filter(c => !c.completed);
    const completedComplaints = complaints.filter(c => c.completed);

    const [animatedPending, setAnimatedPending] = useState(pendingComplaints.length);
    const [animatedCompleted, setAnimatedCompleted] = useState(completedComplaints.length);

    // --- FIXED ANIMATION LOGIC ---
    useEffect(() => {
        // Use gsap.context for properly scoped animations and automatic cleanup
        const ctx = gsap.context(() => {
            gsap.fromTo(mainContentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
            gsap.from(".anim-card", { 
                opacity: 0, 
                y: 30, 
                stagger: 0.05, 
                duration: 0.5, 
                delay: 0.1 
            });
        }, mainContentRef); // Scope the context to the main content area

        return () => ctx.revert(); // Cleanup function
    }, [activeSection]);

    useEffect(() => {
        const pendingTween = gsap.to({ val: animatedPending }, { val: pendingComplaints.length, duration: 0.5, onUpdate: () => setAnimatedPending(Math.round(pendingTween.targets()[0].val)) });
        const completedTween = gsap.to({ val: animatedCompleted }, { val: completedComplaints.length, duration: 0.5, onUpdate: () => setAnimatedCompleted(Math.round(completedTween.targets()[0].val)) });
        return () => { pendingTween.kill(); completedTween.kill(); };
    }, [pendingComplaints.length, completedComplaints.length]);

    const handleMarkAsCompleted = (id) => {
        const itemToComplete = complaints.find(c => c.id === id);
        setLastCompleted(itemToComplete);
        const cardElement = document.getElementById(`complaint-${id}`);
        if (cardElement) {
            gsap.to(cardElement, {
                height: 0, opacity: 0, padding: 0, margin: 0, duration: 0.5, ease: 'power2.in',
                onComplete: () => setComplaints(prev => prev.map(c => c.id === id ? { ...c, completed: true } : c))
            });
        }
        setTimeout(() => setLastCompleted(null), 5000);
    };
    
    const handleUndo = () => {
        if (lastCompleted) {
            setComplaints(prev => prev.map(c => c.id === lastCompleted.id ? { ...c, completed: false } : c));
            setLastCompleted(null);
        }
    };

    const handleSetSection = (section) => {
        setActiveSection(section);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const NavItem = ({ section, icon, label, active }) => (
        <button onClick={() => handleSetSection(section)} className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${active ? 'bg-[var(--theme-primary)] text-white shadow-lg' : 'hover:bg-blue-500/10 text-gray-300 hover:text-white'}`}>
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderContent = () => {
        // ... (renderContent logic remains the same)
        switch (activeSection) {
            case 'pending':
                return (
                    <div className="space-y-4">
                        {pendingComplaints.length > 0 ? (
                            pendingComplaints.map(({ id, university, query, date }) => (
                                <div id={`complaint-${id}`} key={id} className="anim-card bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-semibold text-[var(--text-primary)]">{university}</h3>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">{new Date(date).toLocaleDateString()}</p>
                                        </div>
                                        <button onClick={() => handleMarkAsCompleted(id)} className="bg-[var(--theme-primary)] text-white font-semibold px-4 py-1.5 rounded-full text-xs hover:bg-[var(--theme-secondary)] transition-colors duration-300 flex-shrink-0">
                                            Resolve
                                        </button>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm mt-3">{query}</p>
                                </div>
                            ))
                        ) : (
                            <div className="anim-card text-center py-12 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20"><p className="text-[var(--text-secondary)]">All caught up! No pending queries.</p></div>
                        )}
                    </div>
                );
            case 'completed':
                return (
                     <div className="space-y-4">
                         {completedComplaints.length > 0 ? (
                            completedComplaints.map(({ id, university, query, date }) => (
                                <div key={id} className="anim-card bg-white/30 backdrop-blur-lg p-5 rounded-2xl border border-white/10 opacity-70">
                                    <h3 className="font-semibold text-gray-500 line-through">{university}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(date).toLocaleDateString()}</p>
                                    <p className="text-gray-500 text-sm mt-3 line-through">{query}</p>
                                </div>
                            ))
                         ) : (
                            <div className="anim-card text-center py-12 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20"><p className="text-[var(--text-secondary)]">No queries have been completed yet.</p></div>
                         )}
                    </div>
                );
            default:
                const total = complaints.length;
                const pendingPercent = total > 0 ? (pendingComplaints.length / total) * 100 : 0;
                return (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                             <div className="anim-card bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 flex items-center space-x-4 transform hover:-translate-y-1 transition-transform">
                                <div className="p-3 rounded-full bg-amber-100"><Clock className="h-8 w-8 text-amber-500" /></div>
                                <div>
                                    <div className="text-lg text-[var(--text-secondary)]">Pending</div>
                                    <div className="text-3xl font-bold text-amber-500">{animatedPending}</div>
                                </div>
                            </div>
                            <div className="anim-card bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 flex items-center space-x-4 transform hover:-translate-y-1 transition-transform">
                                <div className="p-3 rounded-full bg-cyan-100"><CheckCircle className="h-8 w-8 text-cyan-500" /></div>
                                <div>
                                    <div className="text-lg text-[var(--text-secondary)]">Completed</div>
                                    <div className="text-3xl font-bold text-cyan-500">{animatedCompleted}</div>
                                </div>
                            </div>
                            <div className="anim-card bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 flex flex-col justify-center items-center transform hover:-translate-y-1 transition-transform lg:col-span-1 md:col-span-2">
                                <div className="text-lg text-[var(--text-secondary)]">Pending Rate</div>
                                <div className="text-3xl font-bold text-[var(--theme-primary)]">{pendingPercent.toFixed(0)}%</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Pending Queries</h3>
                             {pendingComplaints.slice(0, 3).map(({ id, university, query, date }) => (
                                <div id={`complaint-${id}`} key={id} className="anim-card bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-white/20 overflow-hidden mb-3">
                                     <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-semibold text-[var(--text-primary)]">{university}</h3>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">{new Date(date).toLocaleDateString()}</p>
                                        </div>
                                         <button onClick={() => handleMarkAsCompleted(id)} className="bg-[var(--theme-primary)] text-white font-semibold px-4 py-1.5 rounded-full text-xs hover:bg-[var(--theme-secondary)] transition-colors duration-300 flex-shrink-0">
                                            Resolve
                                        </button>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm mt-3">{query}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    const getHeaderTitle = () => {
        if (activeSection === 'pending') return 'Pending Queries';
        if (activeSection === 'completed') return 'Completed Archive';
        return 'Dashboard Overview';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-[var(--text-primary)]">
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>}

            <aside ref={sidebarRef} className={`w-64 bg-gray-900 text-white p-6 flex-shrink-0 flex flex-col fixed h-full shadow-2xl z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <h1 className="text-3xl font-extrabold mb-12 text-center text-white tracking-tight">
                    QueryDesk
                </h1>
                <nav className="flex-grow space-y-3">
                    <NavItem section="dashboard" icon={<Home className="h-6 w-6" />} label="Dashboard" active={activeSection === 'dashboard'}/>
                    <NavItem section="pending" icon={<Clock className="h-6 w-6" />} label="Pending" active={activeSection === 'pending'}/>
                    <NavItem section="completed" icon={<CheckCircle className="h-6 w-6" />} label="Completed" active={activeSection === 'completed'}/>
                </nav>
            </aside>

            <div className="lg:ml-64 flex-1 flex flex-col h-screen">
                <header className="bg-white/50 backdrop-blur-lg p-4 px-6 md:px-10 border-b border-white/30 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-md hover:bg-gray-200 lg:hidden">
                            <Menu className="h-6 w-6 text-gray-700"/>
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">{getHeaderTitle()}</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden sm:block">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-40 md:w-64 rounded-full bg-gray-100/70 border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]" />
                        </div>
                        <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6" alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--theme-primary)] shadow-md" />
                    </div>
                </header>
                <main ref={mainContentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            {lastCompleted && (
                <div className="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded-lg shadow-2xl flex items-center justify-between animate-fade-in-up z-40">
                    <span>"{lastCompleted.university}" resolved.</span>
                    <button onClick={handleUndo} className="ml-4 font-bold text-[var(--theme-primary)] hover:underline">Undo</button>
                </div>
            )}
        </div>
    );
};

export default DashboardU;

// import React, { useState, useEffect } from 'react';
// import { 
//   PlusCircleIcon, 
//   ClockIcon, 
//   ChatBubbleBottomCenterTextIcon, 
//   CalendarDaysIcon, 
//   CurrencyDollarIcon,
//   ArrowRightOnRectangleIcon,
//   UserCircleIcon,
//   ChevronDownIcon,
//   HomeIcon
// } from '@heroicons/react/24/outline';

// // Mock Data (No changes here)
// const mockHistory = [
//   { id: 'TKT-001', service: 'Onboarding Assistance', date: '2023-10-25', status: 'Completed' },
//   { id: 'TKT-002', service: 'Integration with SIS', date: '2023-11-15', status: 'In Progress' },
//   { id: 'TKT-003', service: 'Feature Customization', date: '2023-12-01', status: 'Open' },
// ];
// const mockInvoices = [
//   { id: 'INV-2023-088', date: '2023-10-30', amount: '$500.00', status: 'Paid' },
//   { id: 'INV-2023-095', date: '2023-11-30', amount: '$1,200.00', status: 'Pending' },
// ];


// function ActionCard({ icon, title, subtitle, onClick, color }) {
//   // Updated color mapping to use the new theme
//   const colorClasses = {
//     blue: 'from-blue-600 to-cyan-500', // Primary theme color
//     red: 'from-red-500 to-orange-400', // Kept for alerts
//     green: 'from-green-500 to-emerald-400', // Kept for success actions
//   };

//   return (
//     <button
//       onClick={onClick}
//       className="w-full text-left p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 group"
//     >
//       <div className="flex items-start">
//         <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} text-white mr-4 shadow-lg`}>
//           {icon}
//         </div>
//         <div>
//           <h4 className="font-bold text-lg text-gray-800 group-hover:text-[var(--theme-primary)] transition-colors">{title}</h4>
//           <p className="text-sm text-gray-500">{subtitle}</p>
//         </div>
//       </div>
//     </button>
//   );
// }


// function Overview({ onNavigate }) {
//   const pendingInvoices = mockInvoices.filter(invoice => invoice.status === 'Pending');
//   const activeTickets = mockHistory.filter(ticket => ticket.status !== 'Completed');

//   return (
//     <div>
//       <h3 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
//         {pendingInvoices.length > 0 && (
//           <ActionCard
//             icon={<CurrencyDollarIcon className="w-7 h-7" />}
//             title={`${pendingInvoices.length} Pending Invoice(s)`}
//             subtitle="Awaiting payment for services"
//             color="red"
//             onClick={() => onNavigate('billing')}
//           />
//         )}

//         {activeTickets.length > 0 && (
//           <ActionCard
//             icon={<ClockIcon className="w-7 h-7" />}
//             title={`${activeTickets.length} Active Ticket(s)`}
//             subtitle="Currently in progress or open"
//             color="blue"
//             onClick={() => onNavigate('history')}
//           />
//         )}

//         <ActionCard
//           icon={<PlusCircleIcon className="w-7 h-7" />}
//           title="Create New Ticket"
//           subtitle="Request help or a new service"
//           color="green"
//           onClick={() => onNavigate('createTicket')}
//         />
//       </div>
//     </div>
//   );
// }


// // Main Dashboard Component
// function DashboardU() {
//   const [activeView, setActiveView] = useState('overview');
//   const [isAnimating, setIsAnimating] = useState(true);

//   // --- NEW: Define the color theme as CSS variables ---
//   const themeStyles = `
//     :root {
//       --theme-primary: #305090;
//       --theme-accent: #49C6E5;
//       --theme-gradient: linear-gradient(135deg, var(--theme-accent) 0%, var(--theme-primary) 100%);
//       --text-brand: #282828;
//     }
//   `;

//   const handleViewChange = (view) => {
//     setIsAnimating(false);
//     setTimeout(() => {
//       setActiveView(view);
//       setIsAnimating(true);
//     }, 50);
//   };

//   const renderView = () => {
//     switch (activeView) {
//       case 'overview': return <Overview onNavigate={handleViewChange} />;
//       case 'createTicket': return <CreateTicket />;
//       case 'history': return <ConsultationHistory />;
//       case 'chat': return <LiveChat />;
//       case 'schedule': return <ScheduleCall />;
//       case 'billing': return <Billing />;
//       default: return <Overview onNavigate={handleViewChange} />;
//     }
//   };

//   return (
//     <>
//       <style>{themeStyles}</style>
//       <div className="min-h-screen bg-gray-50 flex">
//         <aside className="w-64 bg-white shadow-md flex flex-col">
//           <div className="p-6 border-b">
//             <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-primary)' }}>Tajpe University</h1>
//             <p className="text-sm text-gray-500">University Portal</p>
//           </div>
//           <nav className="flex-1 px-4 py-6 space-y-2">
//             <NavItem icon={<HomeIcon />} label="Overview" active={activeView === 'overview'} onClick={() => handleViewChange('overview')} />
//             <NavItem icon={<PlusCircleIcon />} label="Create Ticket" active={activeView === 'createTicket'} onClick={() => handleViewChange('createTicket')} />
//             <NavItem icon={<ClockIcon />} label="View History" active={activeView === 'history'} onClick={() => handleViewChange('history')} />
//             <NavItem icon={<ChatBubbleBottomCenterTextIcon />} label="Live Chat" active={activeView === 'chat'} onClick={() => handleViewChange('chat')} />
//             <NavItem icon={<CalendarDaysIcon />} label="Schedule Call" active={activeView === 'schedule'} onClick={() => handleViewChange('schedule')} />
//             <NavItem icon={<CurrencyDollarIcon />} label="Billing & Invoices" active={activeView === 'billing'} onClick={() => handleViewChange('billing')} />
//           </nav>
//           <div className="p-4 border-t">
//             <NavItem icon={<ArrowRightOnRectangleIcon />} label="Logout" />
//           </div>
//         </aside>

//         <main className="flex-1 p-8">
//           <header className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-800" style={{ color: 'var(--text-brand)' }}>Dashboard</h2>
//             <div className="flex items-center space-x-4">
//               <p className="text-gray-700 font-medium">Cambridge University</p>
//               <UserCircleIcon className="w-10 h-10 text-gray-400" />
//             </div>
//           </header>
//           <div className={`bg-white p-8 rounded-2xl shadow-lg transition-opacity duration-300 ${isAnimating ? 'animate-fade-in-up' : 'opacity-0'}`}>
//             {renderView()}
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// // Helper components with theme updates
// function NavItem({ icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
//         active ? 'text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
//       }`}
//       style={{ background: active ? 'var(--theme-gradient)' : 'transparent' }}
//     >
//       <span className={`w-6 h-6 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-[var(--theme-primary)]'}`}>{icon}</span>
//       <span className="font-medium">{label}</span>
//     </button>
//   );
// }

// function CreateTicket() {
//   return (
//     <div>
//       <h3 className="text-2xl font-bold text-gray-800 mb-6">Create a New Support Ticket</h3>
//       <form className="space-y-6">
//         <div>
//           <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">Select Consultation Service</label>
//           <div className="relative">
//             <select
//               id="service"
//               className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] appearance-none"
//             >
//               <option>Onboarding Assistance</option>
//               <option>Staff Training Session</option>
//               <option>System Integration (SIS/LMS)</option>
//               <option>Custom Feature Request</option>
//               <option>Technical Support</option>
//               <option>Other</option>
//             </select>
//             <ChevronDownIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
//           </div>
//         </div>
//         <div>
//           <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">Describe your request</label>
//           <textarea
//             id="details"
//             rows="6"
//             placeholder="Please provide as much detail as possible..."
//             className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
//           ></textarea>
//         </div>
//         <button
//           type="submit"
//           className="w-full text-white py-3 font-semibold rounded-xl hover:scale-105 transform transition-transform hover:shadow-lg"
//           style={{ background: 'var(--theme-gradient)' }}
//         >
//           Submit Request
//         </button>
//       </form>
//     </div>
//   );
// }

// function ConsultationHistory() {
//   return (
//     <div>
//       <h3 className="text-2xl font-bold text-gray-800 mb-6">Consultation History</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {mockHistory.map((item) => (
//               <tr key={item.id} className="hover:bg-gray-50">
//                 <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
//                 <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{item.service}</td>
//                 <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
//                 <td className="py-4 px-6 whitespace-nowrap text-sm">
//                   <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     item.status === 'Completed' ? 'bg-green-100 text-green-800' :
//                     item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-blue-100 text-blue-800'
//                   }`}>
//                     {item.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function LiveChat() {
//   return (
//     <div>
//       <h3 className="text-2xl font-bold text-gray-800 mb-6">Live Chat / Support</h3>
//       <div className="border border-gray-200 rounded-lg h-96 flex flex-col">
//         <div className="flex-1 p-4 text-gray-500">Chat history would appear here...</div>
//         <div className="p-4 border-t bg-gray-50">
//           <input
//             type="text"
//             placeholder="Type your message and press Enter..."
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function ScheduleCall() {
//   return (
//     <div className="text-center">
//       <h3 className="text-2xl font-bold text-gray-800 mb-4">Need a more detailed discussion?</h3>
//       <p className="text-gray-600 mb-8">Schedule a live demo or a call with one of our specialists.</p>
//       <button className="text-white font-bold py-4 px-8 rounded-xl hover:scale-105 transform transition-transform hover:shadow-xl text-lg" style={{ background: 'var(--theme-gradient)' }}>
//         Schedule a Call or Demo
//       </button>
//     </div>
//   );
// }

// function Billing() {
//   return (
//     <div>
//       <h3 className="text-2xl font-bold text-gray-800 mb-6">Billing & Invoices</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {mockInvoices.map((invoice) => (
//               <tr key={invoice.id} className="hover:bg-gray-50">
//                 <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
//                 <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
//                 <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
//                 <td className="py-4 px-6 whitespace-nowrap text-sm">
//                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {invoice.status}
//                   </span>
//                 </td>
//                 <td className="py-4 px-6 whitespace-nowrap text-sm">
//                   <button className="font-medium" style={{ color: 'var(--theme-primary)', hover: { color: 'var(--theme-accent)' }}}>Download PDF</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default DashboardU;