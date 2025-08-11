import React, { useState, useEffect, useRef } from "react";
import { AtSymbolIcon, LockClosedIcon, UserIcon, BuildingOfficeIcon, PhoneIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { gsap } from 'gsap';

// --- Animated Avatar Component (No changes needed) ---
const AnimatedAvatar = ({ type = 'consultant' }) => {
    const avatarRef = useRef(null);
    useEffect(() => {
        const card = document.querySelector('.interactive-card');
        const hand = avatarRef.current.querySelector('.waving-hand');
        if (!card || !hand) return;
        gsap.fromTo(hand, { rotation: 15 }, { rotation: -25, duration: 0.7, ease: 'power1.inOut', repeat: 3, yoyo: true, delay: 0.5, transformOrigin: '80% 90%' });
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(avatarRef.current, { rotationY: x * 0.05, rotationX: -y * 0.05, transformPerspective: 1000, ease: 'power1.out' });
            gsap.to(avatarRef.current.querySelector('.avatar-base'), { x: x * 0.02, y: y * 0.02 });
            gsap.to(avatarRef.current.querySelector('.avatar-features'), { x: x * 0.04, y: y * 0.04 });
            const pupils = avatarRef.current.querySelectorAll('.eye-pupil');
            const clampX = gsap.utils.clamp(-3, 3);
            const clampY = gsap.utils.clamp(-3, 3);
            pupils.forEach(pupil => gsap.to(pupil, { x: clampX(x * 0.1), y: clampY(y * 0.1), duration: 0.8, ease: 'power3.out' }));
        };
        card.addEventListener('mousemove', handleMouseMove);
        return () => card.removeEventListener('mousemove', handleMouseMove);
    }, []);
    const EmployeeAvatar = () => ( <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><defs><linearGradient id="employee-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4A90E2" /><stop offset="100%" stopColor="#50E3C2" /></linearGradient></defs><g className="avatar-base"><circle cx="60" cy="60" r="50" fill="url(#employee-gradient)" /><circle cx="60" cy="65" r="50" fill="rgba(0,0,0,0.15)" /></g><g className="avatar-features"><g className="eye-group"><circle cx="42" cy="55" r="9" fill="white" /><circle cx="42" cy="55" r="4.5" fill="#282828" className="eye-pupil" /></g><g className="eye-group"><circle cx="78" cy="55" r="9" fill="white" /><circle cx="78" cy="55" r="4.5" fill="#282828" className="eye-pupil" /></g><path d="M45 78 Q 60 88 75 78" stroke="white" strokeWidth="4" strokeLinecap="round" /><path d="M40 90 L 50 100 L 70 100 L 80 90 Z" fill="white" /><path d="M50 100 L 60 90 L 70 100 Z" fill="#eee" /><path d="M55 90 L 65 90" stroke="#4A90E2" strokeWidth="2.5" strokeLinecap="round" /><path className="waving-hand" d="M85,60 Q95,50 105,60 Q115,70 110,80 L100,95 Q90,105 80,90 Z" fill="url(#employee-gradient)" stroke="#4A90E2" strokeWidth="2" /></g></svg>);
    const ConsultantAvatar = () => ( <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><defs><linearGradient id="consultant-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#49C6E5" /><stop offset="100%" stopColor="#305090" /></linearGradient></defs><g className="avatar-base"><circle cx="60" cy="60" r="50" fill="url(#consultant-gradient)" /><circle cx="60" cy="65" r="50" fill="rgba(0,0,0,0.15)" /></g><g className="avatar-features"><path d="M30 60 Q 60 20 90 60 Q 90 70 80 80 L 40 80 Q 30 70 30 60 Z" fill="#282828" /><g className="eye-group"><circle cx="42" cy="60" r="8" fill="white" /><circle cx="42" cy="60" r="4" fill="#282828" className="eye-pupil" /></g><g className="eye-group"><circle cx="78" cy="60" r="8" fill="white" /><circle cx="78" cy="60" r="4" fill="#282828" className="eye-pupil" /></g><path d="M40 90 L 50 100 L 70 100 L 80 90 Z" fill="white" /><path d="M50 100 L 60 90 L 70 100 Z" fill="#eee" /><path className="waving-hand" d="M85,65 Q95,55 105,65 Q115,75 110,85 L100,100 Q90,110 80,95 Z" fill="url(#consultant-gradient)" stroke="#305090" strokeWidth="2" /></g></svg>);
    return ( <div ref={avatarRef} className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">{type === 'employee' ? <EmployeeAvatar /> : <ConsultantAvatar />}</div> );
};

// --- NEW: OTP Form Component ---
const OtpForm = ({ email, onVerify, error }) => {
    const [otp, setOtp] = useState('');
    const formRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }, []);

    const handleOtpSubmit = (event) => {
        event.preventDefault();
        onVerify(otp); // Pass the otp state up to the parent
    };

    return (
        <div ref={formRef}>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Verify Your Email</h2>
            <p className="text-center text-sm text-gray-500 mb-6">Enter the 6-digit code sent to <br/><strong>{email}</strong></p>
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <div className="relative">
                    <ShieldCheckIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text" placeholder="_ _ _ _ _ _" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-center tracking-[1em] font-mono text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                {error && <p className="text-center text-sm text-red-500">{error}</p>}
                <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 font-semibold rounded-xl hover:scale-105 transform transition-transform hover:shadow-lg">
                    Verify Account
                </button>
                <p className="text-center text-sm text-gray-500">
                    Didn't get a code?{" "}
                    <span onClick={() => window.location.reload()} className="text-blue-600 font-medium hover:underline cursor-pointer">
                        Start Over
                    </span>
                </p>
            </form>
        </div>
    );
};


// --- MODIFIED: Signup Form Component ---
function SignupForm({ title, isVisible, onSubmit, error }) {
  const formRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');

  useEffect(() => {
    if(isVisible) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }
  }, [isVisible]);

  // This function now calls the onSubmit prop from the parent
  const handleLocalSubmit = (event) => {
    event.preventDefault();
    const role = title.toLowerCase();
    let payload = {};
    if (role === 'consultant') {
      payload = { email, phone, organizationName, organizationType, password };
    } else {
      payload = { fullName, email, phone, password };
    }
    onSubmit(payload, role); // Pass the constructed payload and role up to the parent
  };

  return (
    <div ref={formRef} style={{ display: isVisible ? 'block' : 'none' }}>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">{title} Sign Up</h2>
      <form className="space-y-4" onSubmit={handleLocalSubmit}>
        {title === 'Consultant' && (
          <>
            <div className="relative"><BuildingOfficeIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Organization Name" required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"/></div>
            <div className="relative"><BuildingOfficeIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Organization Type" required value={organizationType} onChange={(e) => setOrganizationType(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"/></div>
          </>
        )}
        {title === 'Employee' && (
          <div className="relative"><UserIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"/></div>
        )}
        <div className="relative"><AtSymbolIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"/></div>
        <div className="relative"><PhoneIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><input type="tel" placeholder="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"/></div>
        <div className="relative"><LockClosedIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"/></div>
        
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 font-semibold rounded-xl hover:scale-105 transform transition-transform hover:shadow-lg">Create Account</button>
      </form>
    </div>
  );
}

// --- MODIFIED: Main Signup Component ---
export default function Signup() {
  const [activeTab, setActiveTab] = useState("consultant");
  const [step, setStep] = useState('signup'); // NEW: Controls the view ('signup' or 'otp')
  const [userEmail, setUserEmail] = useState(''); // NEW: Stores email for OTP verification
  const [error, setError] = useState(''); // NEW: Unified error handling
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' });
  }, []);

  // NEW: Handles the initial signup API call
  const handleSignupSubmit = async (payload, role) => {
    setError('');
    const endpoint = `http://localhost:5000/api/auth/signup/${role}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message); // "Registration successful! Please check your email..."
        setUserEmail(payload.email); // Save email for the next step
        setStep('otp'); // Switch to the OTP view
      } else {
        setError(data.message || "An unknown error occurred.");
      }
    } catch (err) {
      console.error("Signup network error:", err);
      setError("Could not connect to the server. Please try again later.");
    }
  };

  // NEW: Handles the OTP verification API call
  const handleOtpVerify = async (otp) => {
    setError('');
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      const data = await response.json();
      alert(data.message); // "Email verified successfully! You can now log in."

      if (response.ok) {
        navigate("/login"); // On success, navigate to the login page
      } else {
        setError(data.message || "Verification failed.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Verification failed. Please try again.");
    }
  };

  return (
    <main className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen flex items-center justify-center p-4">
      <div ref={cardRef} className="interactive-card bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8">
        
        {/* Render content based on the current step */}
        {step === 'signup' ? (
          <>
            <AnimatedAvatar type={activeTab} />
            <div className="flex justify-center mb-8 space-x-2 relative">
              <div className={`absolute bottom-0 h-1 bg-blue-600 transition-all duration-300 ease-out`} style={{ width: '110px', left: activeTab === 'consultant' ? 'calc(50% - 110px - 5px)' : 'calc(50% + 5px)' }}></div>
              <button onClick={() => setActiveTab("consultant")} className={`px-6 py-2 font-semibold transition-colors duration-300 ${activeTab === "consultant" ? "text-blue-600" : "text-gray-500 hover:text-blue-500"}`}>Consultant</button>
              <button onClick={() => setActiveTab("employee")} className={`px-6 py-2 font-semibold transition-colors duration-300 ${activeTab === "employee" ? "text-blue-600" : "text-gray-500 hover:text-blue-500"}`}>Employee</button>
            </div>
            
            <div className="relative">
              <SignupForm title="Consultant" isVisible={activeTab === 'consultant'} onSubmit={handleSignupSubmit} error={error} />
              <SignupForm title="Employee" isVisible={activeTab === 'employee'} onSubmit={handleSignupSubmit} error={error} />
            </div>

            <p className="text-center text-sm text-gray-500 pt-6">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")} className="text-blue-600 font-medium hover:underline cursor-pointer">
                    Log In
                </span>
            </p>
          </>
        ) : (
          <OtpForm email={userEmail} onVerify={handleOtpVerify} error={error} />
        )}
        
      </div>
    </main>
  );
}

