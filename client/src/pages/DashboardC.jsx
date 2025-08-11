import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    PlusCircleIcon, ClockIcon, ChatBubbleBottomCenterTextIcon, CalendarDaysIcon,
    CurrencyDollarIcon, ArrowRightOnRectangleIcon, UserCircleIcon, ChevronDownIcon, HomeIcon, XMarkIcon, Bars3Icon
} from '@heroicons/react/24/outline';

// Mock Data (No changes)
const mockHistory = [
  { id: 'TKT-001', service: 'Onboarding Assistance', date: '2023-10-25', status: 'Completed' },
  { id: 'TKT-002', service: 'Integration with SIS', date: '2023-11-15', status: 'In Progress' },
  { id: 'TKT-003', service: 'Feature Customization', date: '2023-12-01', status: 'Open' },
];
const mockInvoices = [
  { id: 'INV-2023-088', date: '2023-10-30', amount: '$500.00', status: 'Paid' },
  { id: 'INV-2023-095', date: '2023-11-30', amount: '$1,200.00', status: 'Pending' },
];

function ActionCard({ icon, title, subtitle, onClick }) {
    return (
        <button onClick={onClick} className="w-full text-left p-6 bg-white/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 group">
            <div className="flex items-start">
                <div className="p-3 rounded-xl bg-[var(--theme-primary)] text-white mr-4 shadow-lg">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-lg text-[var(--text-primary)]">{title}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
                </div>
            </div>
        </button>
    );
}

function Overview({ onNavigate }) {
  const pendingInvoices = mockInvoices.filter(invoice => invoice.status === 'Pending');
  const activeTickets = mockHistory.filter(ticket => ticket.status !== 'Completed');

  return (
    <div>
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingInvoices.length > 0 && (
          <ActionCard
            icon={<CurrencyDollarIcon className="w-7 h-7" />}
            title={`${pendingInvoices.length} Pending Invoice(s)`}
            subtitle="Awaiting payment for services"
            onClick={() => onNavigate('billing')}
          />
        )}
        {activeTickets.length > 0 && (
          <ActionCard
            icon={<ClockIcon className="w-7 h-7" />}
            title={`${activeTickets.length} Active Ticket(s)`}
            subtitle="Currently in progress or open"
            onClick={() => onNavigate('history')}
          />
        )}
        <ActionCard
          icon={<PlusCircleIcon className="w-7 h-7" />}
          title="Create New Ticket"
          subtitle="Request help or a new service"
          onClick={() => onNavigate('createTicket')}
        />
      </div>
    </div>
  );
}

function DashboardU() {
    const [activeView, setActiveView] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const mainContentRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (mainContentRef.current) {
            gsap.fromTo(mainContentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        }
    }, [activeView]);

    const handleNavigate = (view) => {
        setActiveView(view);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const renderView = () => {
        switch (activeView) {
            case 'overview': return <Overview onNavigate={handleNavigate} />;
            case 'createTicket': return <CreateTicket />;
            case 'history': return <ConsultationHistory />;
            case 'chat': return <LiveChat />;
            case 'schedule': return <ScheduleCall />;
            case 'billing': return <Billing />;
            default: return <Overview onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-[var(--text-primary)]">
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>}

            <aside ref={sidebarRef} className={`w-72 bg-gray-900 text-white flex-shrink-0 flex flex-col p-6 fixed h-full shadow-2xl z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="text-center my-4">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Cambridge Uni</h1>
                    <p className="text-xs text-gray-400 mt-1">University Portal</p>
                </div>
                <nav className="flex-1 space-y-3 mt-10">
                    <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Overview" active={activeView === 'overview'} onClick={() => handleNavigate('overview')} />
                    <NavItem icon={<PlusCircleIcon className="w-6 h-6" />} label="Create Ticket" active={activeView === 'createTicket'} onClick={() => handleNavigate('createTicket')} />
                    <NavItem icon={<ClockIcon className="w-6 h-6" />} label="View History" active={activeView === 'history'} onClick={() => handleNavigate('history')} />
                    <NavItem icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6" />} label="Live Chat" active={activeView === 'chat'} onClick={() => handleNavigate('chat')} />
                    <NavItem icon={<CalendarDaysIcon className="w-6 h-6" />} label="Schedule Call" active={activeView === 'schedule'} onClick={() => handleNavigate('schedule')} />
                    <NavItem icon={<CurrencyDollarIcon className="w-6 h-6" />} label="Billing & Invoices" active={activeView === 'billing'} onClick={() => handleNavigate('billing')} />
                </nav>
                <div className="pt-4 border-t border-gray-700">
                    <NavItem icon={<ArrowRightOnRectangleIcon className="w-6 h-6" />} label="Logout" />
                </div>
            </aside>

            <div className="flex-1 lg:ml-72">
                <main className="p-6 md:p-10">
                    <header className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-md hover:bg-gray-200 lg:hidden">
                                 {isSidebarOpen ? <XMarkIcon className="w-7 h-7"/> : <Bars3Icon className="w-7 h-7"/>}
                             </button>
                            <div>
                                <h2 className="text-xl md:text-3xl font-bold">University Dashboard</h2>
                                <p className="text-[var(--text-secondary)]">Welcome to your university portal.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <p className="text-gray-700 font-semibold hidden md:block">Welcome, Cambridge!</p>
                            <UserCircleIcon className="w-12 h-12 text-[var(--theme-primary)]" />
                        </div>
                    </header>
                    <div ref={mainContentRef} className="bg-white/50 backdrop-blur-lg border border-white/20 p-6 md:p-8 rounded-2xl shadow-lg">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${active ? 'bg-[var(--theme-primary)] text-white shadow-lg' : 'hover:bg-blue-500/10 text-gray-300 hover:text-white'}`}>
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );
}

function CreateTicket() {
    return (
        <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Create a New Support Ticket</h3>
            <form className="space-y-6">
                <div>
                    <label htmlFor="service" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Select Consultation Service</label>
                    <div className="relative">
                        <select id="service" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] appearance-none bg-white/80">
                            <option>Onboarding Assistance</option> <option>Staff Training Session</option> <option>System Integration (SIS/LMS)</option>
                            <option>Custom Feature Request</option> <option>Technical Support</option> <option>Other</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Describe your request</label>
                    <textarea id="details" rows="6" placeholder="Please provide as much detail as possible..." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] bg-white/80"></textarea>
                </div>
                <button type="submit" className="w-full text-white py-3 font-semibold rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-secondary)] hover:scale-105 transform transition-all hover:shadow-lg">
                    Submit Request
                </button>
            </form>
        </div>
    );
}

function ConsultationHistory() {
    return (
        <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Consultation History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Ticket ID</th> <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Service</th>
                            <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Date</th> <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50">
                                <td className="p-4 whitespace-nowrap text-sm font-medium">{item.id}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{item.service}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{item.date}</td>
                                <td className="p-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>{item.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function LiveChat() {
    return (
        <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Live Chat / Support</h3>
            <div className="border border-gray-200 rounded-lg h-96 flex flex-col bg-white/80">
                <div className="flex-1 p-4 text-[var(--text-secondary)]">Chat history would appear here...</div>
                <div className="p-4 border-t bg-gray-50/50">
                    <input type="text" placeholder="Type your message and press Enter..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]" />
                </div>
            </div>
        </div>
    );
}

function ScheduleCall() {
    return (
        <div className="text-center p-8">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Need a more detailed discussion?</h3>
            <p className="text-[var(--text-secondary)] mb-8">Schedule a live demo or a call with one of our specialists.</p>
            <button className="text-white font-bold py-3 px-8 rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-secondary)] hover:scale-105 transform transition-transform hover:shadow-xl text-lg">
                Schedule a Call or Demo
            </button>
        </div>
    );
}

function Billing() {
    return (
        <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Billing & Invoices</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Invoice ID</th><th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Date</th>
                            <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Amount</th><th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                            <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockInvoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50/50">
                                <td className="p-4 whitespace-nowrap text-sm font-medium">{invoice.id}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{invoice.date}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{invoice.amount}</td>
                                <td className="p-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>{invoice.status}</span>
                                </td>
                                <td className="p-4 whitespace-nowrap text-sm">
                                    <button className="font-semibold text-[var(--theme-primary)] hover:text-[var(--theme-secondary)] hover:underline">Download PDF</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashboardU;