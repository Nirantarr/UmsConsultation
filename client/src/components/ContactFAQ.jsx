import React, { useState, useEffect, useRef } from 'react';
import { Mail, Plus, Minus } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Child Component: The refined FAQ Card ---
const FaqItem = ({ faq, isOpen, onClick }) => {
    const answerRef = useRef(null);

    // GSAP animation for smooth open/close
    useEffect(() => {
        gsap.to(answerRef.current, {
            height: isOpen ? 'auto' : 0,
            paddingTop: isOpen ? '0.5rem' : 0,
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
                <h3 className="text-xl font-bold text-[var(--text-primary)] font-[var(--secondary-font)] pr-4">
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

// --- Main ContactFAQ Component ---
const ContactFAQ = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(0); // Default first item to be open

    const faqData = [
        { id: 'c1', question: 'How can I request a demo of the LMS?', answer: 'You can request a demo by filling out our contact form, or by reaching out directly via email or phone. Please specify your university name and the key areas you are interested in.' },
        { id: 'c2', question: 'What information should I include in my message?', answer: 'To help us assist you best, please include your name, university affiliation, a brief description of your inquiry (e.g., demo request, partnership, support), and any specific questions you may have.' },
        { id: 'c3', question: 'What is your typical response time?', answer: 'We strive to respond to all inquiries within 1-2 business days. For urgent matters, we recommend contacting us via phone during our business hours, listed in the section above.' },
        { id: 'c4', question: 'Do you offer custom solutions for specific university needs?', answer: 'Yes, our LMS is highly flexible and can be customized to meet the unique requirements of your university. Please describe your specific needs in your message for a tailored response.' },
        { id: 'c5', question: 'Where can I find details about your pricing?', answer: 'Detailed pricing information is available on our dedicated Pricing page. For institutional rates or custom packages, please use the contact form to get in touch with our sales team.' },
    ];
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            // A simple, reliable entrance animation for the cards
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
        <section ref={sectionRef} className="py-20 md:py-28 bg-[var(--light-bg-color)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 font-[var(--primary-font)]">
                        Common Questions
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] font-[var(--secondary-font)]">
                        Find answers to frequently asked questions about contacting UniConsult and our services.
                    </p>
                </div>

                <div ref={gridRef} className="max-w-4xl mx-auto flex flex-col gap-6">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={item.id}
                            faq={item}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactFAQ;