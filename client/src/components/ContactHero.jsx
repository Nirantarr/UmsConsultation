import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

// --- Child Component: The Interactive Beacon Background ---
const BeaconBackground = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Animate the concentric pulse rings
        const pulses = gsap.utils.toArray('.pulse-ring');
        const pulseTl = gsap.timeline({ repeat: -1 });
        pulses.forEach((pulse, i) => {
            pulseTl.fromTo(pulse, 
                { scale: 0.5, autoAlpha: 0.7 }, 
                { scale: 4, autoAlpha: 0, duration: 3, ease: 'power2.out' }, 
                i * 0.7 // Staggered start time
            );
        });

        // Handle mouse-tracking spotlight
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top } = section.getBoundingClientRect();
            gsap.to(section, {
                '--mouse-x': `${clientX - left}px`,
                '--mouse-y': `${clientY - top}px`,
                duration: 0.6,
                ease: 'power2.out',
            });
        };
        
        section.addEventListener('mousemove', handleMouseMove);

        return () => {
            section.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div ref={sectionRef} className="absolute inset-0 z-0 overflow-hidden bg-[var(--dark-bg-color)]">
            {/* Themed grid pattern */}
            <div className="absolute inset-0 bg-grid-themed" />
            {/* The mouse-tracking spotlight */}
            <div className="spotlight absolute inset-0" />

            {/* The central beacon and its pulse rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-48 rounded-full bg-[var(--theme-accent)]/10" />
                <div className="pulse-ring absolute inset-0 rounded-full border-2 border-[var(--theme-accent)]/50" />
                <div className="pulse-ring absolute inset-0 rounded-full border-2 border-[var(--theme-accent)]/50" />
                <div className="pulse-ring absolute inset-0 rounded-full border-2 border-[var(--theme-accent)]/50" />
            </div>
        </div>
    );
};


const ContactHero = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const subheadingRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }})
                .from(headingRef.current, { yPercent: 100, autoAlpha: 0, duration: 1, ease: 'power3.out' })
                .from(subheadingRef.current, { y: 30, autoAlpha: 0, duration: 1, ease: 'power3.out' }, '-=0.7')
                .from(buttonRef.current, { scale: 0.8, autoAlpha: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.7');
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-28 md:py-32 text-[var(--text-on-dark)] relative">
            <BeaconBackground />
            
            <div className="container mx-auto px-4 text-center relative z-10">
                <div ref={headingRef} className="overflow-hidden mb-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight font-[var(--primary-font)]">
                        Get In Touch With <span className="text-[var(--theme-accent)]">UniConsult</span>
                    </h1>
                </div>
                <p ref={subheadingRef} className="text-lg md:text-2xl max-w-4xl mx-auto mb-10 text-[var(--text-on-dark)]/80 font-[var(--secondary-font)]">
                    Have questions about our LMS, need a demo, or want to discuss a partnership? We're here to help!
                </p>
                <div ref={buttonRef}>
                    <a href="#contact-form" className="inline-flex items-center justify-center px-8 py-4 font-bold text-lg text-[var(--theme-primary)] bg-white rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90 hover:shadow-2xl">
                        Send Us a Message
                        <ArrowRight className="h-5 w-5 ml-3" />
                    </a>
                </div>
            </div>
            <GlobalStyles />
        </section>
    );
};

// --- Global Styles for the Background Effects ---
const GlobalStyles = () => (
    <style jsx global>{`
        .bg-grid-themed {
            background-image: linear-gradient(rgba(var(--theme-primary-rgb), 0.1) 1px, transparent 1px), 
                              linear-gradient(to right, rgba(var(--theme-primary-rgb), 0.1) 1px, transparent 1px);
            background-size: 4rem 4rem;
        }
        .spotlight {
            background: radial-gradient(
                400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(var(--theme-accent-rgb), 0.1),
                transparent 80%
            );
        }
    `}</style>
);


export default ContactHero;