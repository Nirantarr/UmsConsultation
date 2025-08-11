import React, { useState, useEffect, useRef } from 'react';
import { Mail, Plus, Minus, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Child Component: The refined FAQ Card ---
const FaqItem = ({ faq, isOpen, onClick }) => {
    const answerRef = useRef(null);

    useEffect(() => {
        gsap.to(answerRef.current, {
            height: isOpen ? 'auto' : 0,
            paddingTop: isOpen ? '1rem' : 0,
            paddingBottom: isOpen ? '1rem' : 0,
            opacity: isOpen ? 1 : 0,
            duration: 0.4,
            ease: 'power2.inOut',
        });
    }, [isOpen]);

    return (
        <div className="faq-card bg-white rounded-xl shadow-lg border border-[var(--border-color)]">
            <div 
                className="flex justify-between items-center cursor-pointer p-6" 
                onClick={onClick}
            >
                <h3 className="text-xl font-bold text-[var(--theme-primary)] font-[var(--primary-font)] pr-4">
                    {faq.question}
                </h3>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[var(--theme-primary)]">
                    <div className="relative w-6 h-6">
                        <Plus className={`absolute transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                        <Minus className={`absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                    </div>
                </div>
            </div>
            <div ref={answerRef} className="h-0 overflow-hidden px-6">
                <p className="text-[var(--text-secondary)] font-[var(--secondary-font)] leading-relaxed">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};

// --- Child Component: The Final CTA Card (FIXED) ---
const FinalCard = () => (
    <div className="faq-card bg-white rounded-xl shadow-xl p-8 border border-[var(--border-color)] text-center flex flex-col items-center mt-8">
        <Mail className="h-10 w-10 text-[var(--theme-primary)] mb-4" strokeWidth={1.5} />
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 font-[var(--primary-font)]">Have More Questions?</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed font-[var(--secondary-font)] mb-6 max-w-md mx-auto">
            Our experts are here to help. Reach out for a detailed discussion about your institution's specific needs.
        </p>
        
        {/* --- THIS IS THE FIX: The missing button is now present --- */}
        <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-8 py-3 font-bold text-lg text-white rounded-lg 
                       bg-[var(--theme-primary)] 
                       transition-transform duration-300 ease-in-out 
                       hover:scale-105 hover:shadow-xl hover:shadow-[var(--shadow-hover)]"
        >
            Request a Demo
            <ArrowRight className="h-5 w-5 ml-2" />
        </a>
    </div>
);


const ServiceFAQ = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(0);

    const faqData = [
      { id: 'q1', question: 'How does the LMS ensure data security and compliance?', answer: 'Our LMS employs robust, industry-standard security protocols, including end-to-end encryption. We are fully compliant with GDPR and relevant local data protection laws, ensuring all sensitive student and faculty information is securely stored and managed.' },
      { id: 'q2', question: 'Can the LMS integrate with existing university systems?', answer: 'Yes, our LMS is designed with a flexible architecture that supports seamless integration with various existing university systems, such as Student Information Systems (SIS) and Enterprise Resource Planning (ERP) tools.' },
      { id: 'q3', question: 'What kind of support and training is available for staff?', answer: 'We offer comprehensive support packages, including initial setup, detailed training for administrators and faculty, ongoing technical support, and regular updates to ensure smooth operation and maximum utilization of the platform.' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(gsap.utils.toArray('.faq-card'), {
                autoAlpha: 0,
                y: 50,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-[var(--theme-primary)] py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-[var(--primary-font)]">
                        Ready to Transform Your University's Learning
                    </h2>
                </div>

                <div ref={gridRef} className="max-w-4xl mx-auto flex flex-col gap-6">
                    {faqData.map((faq, index) => (
                        <FaqItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                    <FinalCard />
                </div>
            </div>
        </section>
    );
};

export default ServiceFAQ;