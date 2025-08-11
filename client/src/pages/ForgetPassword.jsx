// client/src/pages/ForgotPassword.jsx

import React, { useState } from 'react';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Could not connect to the server. Please try again later.");
        }
    };

    return (
        <main className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Forgot Password</h2>
                <p className="text-center text-sm text-gray-500 mb-6">Enter your email and we'll send you a link to reset your password.</p>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <AtSymbolIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="email" placeholder="Your registered email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl"
                        />
                    </div>
                    {message && <p className="text-center text-sm text-green-600">{message}</p>}
                    {error && <p className="text-center text-sm text-red-500">{error}</p>}
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 font-semibold rounded-xl hover:scale-105">
                        Send Reset Link
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        Remembered your password?{" "}
                        <span onClick={() => navigate("/login")} className="text-blue-600 font-medium hover:underline cursor-pointer">
                            Back to Login
                        </span>
                    </p>
                </form>
            </div>
        </main>
    );
}