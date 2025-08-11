import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';

// The function is defined here
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setMessage('');
        setError('');

        try {
            const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => navigate('/login'), 3000);
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
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Reset Your Password</h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <LockClosedIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="password" placeholder="Enter new password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="password" placeholder="Confirm new password" required
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl"
                        />
                    </div>
                    {message && <p className="text-center text-sm text-green-600">{message}</p>}
                    {error && <p className="text-center text-sm text-red-500">{error}</p>}
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 font-semibold rounded-xl hover:scale-105">
                        Update Password
                    </button>
                </form>
            </div>
        </main>
    );
};

// --- FIX IS HERE: Make sure this line exists ---
export default ResetPassword;