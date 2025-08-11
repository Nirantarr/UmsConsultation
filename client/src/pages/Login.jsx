import React, { useState, useEffect, useRef } from "react";
import { AtSymbolIcon, LockClosedIcon, BuildingOffice2Icon, UserGroupIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { gsap } from 'gsap';

// --- LoginForm Component (UPDATED with a Forgot Password link) ---
function LoginForm({ title, onSubmit, error, onInputChange, isVisible, onForgotPasswordClick }) {
    const navigate = useNavigate();
    const formRef = useRef(null);

    useEffect(() => {
        gsap.to(formRef.current, {
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 10,
            duration: 0.3,
            ease: 'power2.out',
            onStart: () => { if (isVisible) formRef.current.style.display = 'block'; },
            onComplete: () => { if (!isVisible) formRef.current.style.display = 'none'; }
        });
    }, [isVisible]);
    
    return (
        <div ref={formRef} className="absolute w-full">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">{title} Login</h2>
            <form className="space-y-4" onSubmit={onSubmit}>
                <div className="relative">
                    <AtSymbolIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                    <input type="email" placeholder="Email" onChange={(e) => onInputChange('email', e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>
                <div className="relative">
                    <LockClosedIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                    <input type="password" placeholder="Password" onChange={(e) => onInputChange('password', e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>

                {/* --- NEW: Forgot Password Link --- */}
                <div className="text-right text-sm">
                    <span onClick={onForgotPasswordClick} className="font-medium text-blue-600 hover:underline cursor-pointer">
                        Forgot Password?
                    </span>
                </div>

                {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}

                <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 font-semibold rounded-xl hover:scale-105 transform transition-transform">Login</button>
                <p className="text-center text-sm text-gray-500 pt-2">
                    Don’t have an account?{" "}
                    <span onClick={() => navigate("/signup")} className="text-blue-600 font-medium hover:underline cursor-pointer">Sign Up</span>
                </p>
            </form>
        </div>
    );
}

// --- Main Login Component (UPDATED with full functionality) ---
export default function Login() {
    const [view, setView] = useState('login'); // NEW: 'login' or 'forgot'
    const [activeTab, setActiveTab] = useState("consultant");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // NEW: For success feedback
    const navigate = useNavigate();
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' });
        const handleMouseMove = (e) => {
            const rect = cardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(cardRef.current, { rotationY: x * 0.03, rotationX: -y * 0.03, transformPerspective: 1000, ease: 'power1.out' });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Clear messages when view changes
    useEffect(() => {
        setError('');
        setSuccessMessage('');
    }, [view]);

    const handleInputChange = (field, value) => {
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        setError('');
        setSuccessMessage('');
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        const endpoint = `http://localhost:5000/api/auth/login/${activeTab}`;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setError(data.message || "Invalid credentials.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        }
    };

    // --- NEW: Function to handle Forgot Password API call ---
    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message); // "If an account exists..."
            } else {
                setError(data.message || 'An error occurred.');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        }
    };

    return (
        <main className="bg-gradient-to-br from-purple-200 to-blue-100 min-h-screen flex items-center justify-center p-4">
            <div ref={cardRef} className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* --- Conditionally render based on the 'view' state --- */}
                {view === 'login' ? (
                    <>
                        <div className="text-center mb-8">
                            {activeTab === 'consultant' ? <BuildingOffice2Icon className="w-16 h-16 mx-auto text-blue-500" /> : <UserGroupIcon className="w-16 h-16 mx-auto text-green-500" />}
                            <h1 className="text-4xl font-extrabold text-gray-800 mt-2">Welcome Back</h1>
                            <p className="text-gray-500">Login to your account</p>
                        </div>
                        <div className="flex justify-center mb-8 space-x-2 relative">
                            <div className={`absolute bottom-0 h-1 bg-blue-600 transition-all duration-300 ease-out`} style={{ width: '110px', left: activeTab === 'consultant' ? 'calc(50% - 110px - 5px)' : 'calc(50% + 5px)' }}></div>
                            <button onClick={() => { setActiveTab("consultant"); setError(''); }} className={`px-6 py-2 font-semibold transition-colors ${activeTab === "consultant" ? "text-blue-600" : "text-gray-500 hover:text-blue-500"}`}>Consultant</button>
                            <button onClick={() => { setActiveTab("employee"); setError(''); }} className={`px-6 py-2 font-semibold transition-colors ${activeTab === "employee" ? "text-blue-600" : "text-gray-500 hover:text-blue-500"}`}>Employee</button>
                        </div>
                        <div className="relative h-80">
                            <LoginForm title="Consultant" onSubmit={handleLogin} error={activeTab === 'consultant' ? error : ''} onInputChange={handleInputChange} isVisible={activeTab === 'consultant'} onForgotPasswordClick={() => setView('forgot')} />
                            <LoginForm title="Employee" onSubmit={handleLogin} error={activeTab === 'employee' ? error : ''} onInputChange={handleInputChange} isVisible={activeTab === 'employee'} onForgotPasswordClick={() => setView('forgot')} />
                        </div>
                    </>
                ) : (
                    // --- NEW: Forgot Password Form UI ---
                    <div>
                        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Reset Your Password</h2>
                        <p className="text-center text-sm text-gray-500 mb-6">Enter your email to receive a password reset link.</p>
                        <form className="space-y-4" onSubmit={handleForgotPassword}>
                             <div className="relative">
                                <AtSymbolIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                                <input type="email" placeholder="Enter your registered email" onChange={(e) => handleInputChange('email', e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                            </div>
                            
                            {error && <p className="text-center text-sm text-red-500">{error}</p>}
                            {successMessage && <p className="text-center text-sm text-green-600">{successMessage}</p>}

                            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 font-semibold rounded-xl hover:scale-105 transform transition-transform">
                                Send Reset Link
                            </button>
                            <div className="text-center">
                                <span onClick={() => setView('login')} className="flex items-center justify-center gap-2 text-blue-600 font-medium hover:underline cursor-pointer text-sm">
                                    <ArrowLeftIcon className="w-4 h-4" />
                                    Back to Login
                                </span>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
