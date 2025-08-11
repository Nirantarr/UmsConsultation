import React, { useState, useEffect, useRef } from 'react'; // <--- THIS LINE IS NOW 100% CORRECT
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Check, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Child Component: Themed Input with Floating Label ---
const ThemedInput = ({ id, name, type = 'text', value, onChange, placeholder, required = false }) => {
    const isFilled = value && value.length > 0;
    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="themed-input peer w-full px-4 py-3 bg-white border-2 border-[var(--border-color)] rounded-lg outline-none transition-colors duration-300 placeholder-transparent"
                placeholder={placeholder}
            />
            <label 
                htmlFor={id} 
                className={`floating-label absolute left-4 transition-all duration-300 pointer-events-none font-[var(--secondary-font)]
                            ${isFilled 
                                ? '-top-2.5 text-xs bg-white px-1 text-[var(--theme-primary)]' 
                                : 'top-3.5 text-base text-[var(--text-secondary)]'
                            } 
                            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[var(--theme-primary)]`}
            >
                {placeholder}
            </label>
        </div>
    );
};

// --- Child Component: Themed Textarea with Floating Label ---
const ThemedTextarea = ({ id, name, value, onChange, placeholder, required = false }) => {
    const isFilled = value && value.length > 0;
    return (
        <div className="relative">
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                rows="5"
                required={required}
                className="themed-input peer w-full px-4 py-3 bg-white border-2 border-[var(--border-color)] rounded-lg outline-none transition-colors duration-300 resize-y placeholder-transparent font-[var(--secondary-font)]"
                placeholder={placeholder}
            ></textarea>
            <label 
                htmlFor={id} 
                className={`floating-label absolute left-4 transition-all duration-300 pointer-events-none font-[var(--secondary-font)]
                            ${isFilled 
                                ? '-top-2.5 text-xs bg-white px-1 text-[var(--theme-primary)]' 
                                : 'top-3.5 text-base text-[var(--text-secondary)]'
                            }
                            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[var(--theme-primary)]`}
            >
                {placeholder}
            </label>
        </div>
    );
};


const ContactForm = () => {
  const sectionRef = useRef(null);
  const formWrapperRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', university: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const success = Math.random() > 0.2;
      if (success) {
        setStatus('success');
        setFormData({ name: '', email: '', university: '', message: '' });
      } else {
        throw new Error('Failed to send message.');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.set(formWrapperRef.current, { y: '100%' });
        gsap.to(formWrapperRef.current, {
            y: '0%',
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        });

        gsap.from(gsap.utils.toArray('.form-field'), {
            autoAlpha: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: formWrapperRef.current, start: 'top 85%' }
        });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-[var(--light-bg-color)]" id="contact-form">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 font-[var(--primary-font)]">
                Send Us a Message
            </h2>
            <p className="text-lg text-[var(--text-secondary)] font-[var(--secondary-font)]">
                Fill out the form below, and our team will get back to you promptly.
            </p>
        </div>
        
        <div className="max-w-2xl mx-auto" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
            <div ref={formWrapperRef} className="bg-[var(--white-color)] rounded-2xl shadow-2xl shadow-[var(--shadow-color)] p-8 md:p-12 border border-[var(--border-color)] invisible">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="form-field"><ThemedInput id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required /></div>
                    <div className="form-field"><ThemedInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your University Email" required /></div>
                    <div className="form-field"><ThemedInput id="university" name="university" value={formData.university} onChange={handleChange} placeholder="University Name" required /></div>
                    <div className="form-field"><ThemedTextarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" required /></div>
                    
                    <div className="form-field pt-2">
                        <button
                          type="submit"
                          className="group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold text-lg text-[var(--text-on-dark)] rounded-lg 
                                     bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-primary)] 
                                     transition-transform duration-300 hover:scale-105 shadow-lg shadow-[var(--shadow-hover)] overflow-hidden"
                          disabled={status === 'submitting'}
                        >
                            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-45 transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                            
                            <span className={`relative z-10 transition-opacity duration-300 ${status === 'submitting' ? 'opacity-0' : 'opacity-100'}`}>
                                Submit Message
                            </span>
                            {status === 'submitting' && (
                                <div className="absolute z-10 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </div>

                    {status === 'success' && (
                        <div className="form-field flex items-center justify-center gap-2 text-green-600 font-bold font-[var(--secondary-font)]">
                            <Check size={20} /> Message sent successfully!
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="form-field flex items-center justify-center gap-2 text-red-600 font-bold font-[var(--secondary-font)]">
                            <AlertTriangle size={20} /> Failed to send message. Please try again.
                        </div>
                    )}
                </form>
            </div>
        </div>
      </div>
      <GlobalStyles />
    </section>
  );
};

const GlobalStyles = () => (
    <style jsx global>{`
        .themed-input:focus, .themed-input:focus-visible {
            border-color: var(--theme-primary);
        }
    `}</style>
);

export default ContactForm;