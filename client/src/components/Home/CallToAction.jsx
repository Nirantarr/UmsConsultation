import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- INNOVATIVE CHILD COMPONENT: The Aurora Button ---
const AuroraButton = ({ href, children }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        };

        button.addEventListener('mousemove', handleMouseMove);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <a ref={buttonRef} href={href} className="aurora-button group relative inline-flex items-center justify-center px-10 py-4 font-bold text-lg rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-[var(--theme-primary)]" />
            <div className="aurora-gradient absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center text-[var(--text-on-dark)]">
                {children}
            </span>
        </a>
    );
};

// --- NEW ENHANCED BACKGROUND COMPONENT ---
const AuroraBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Subtle geometric pattern */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
            <defs>
                <pattern id="pattern-circles" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                    <circle id="pattern-circle" cx="40" cy="40" r="25" fill="none" stroke="var(--border-color)" strokeWidth="0.5"></circle>
                </pattern>
            </defs>
            <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
        {/* The mouse-tracking aurora glow */}
        <div className="aurora-background-gradient absolute inset-0" />
    </div>
);


const CallToAction = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Content animations (no changes needed)
        gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" }})
            .from(headingRef.current.children, { yPercent: 100, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" })
            .from(subheadingRef.current, { y: 30, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
        gsap.from(buttonRef.current, { scale: 0.8, autoAlpha: 0, duration: 1, ease: 'back.out(1.7)', scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" }});

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // --- Mouse tracking for the main background aurora ---
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        section.style.setProperty('--mouse-x', `${x}px`);
        section.style.setProperty('--mouse-y', `${y}px`);
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
        section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[var(--light-bg-color)] text-[var(--text-primary)] text-center relative" id="call-to-action-section">
      
      <AuroraBackground />

      <div className="container mx-auto px-4 relative z-10">
        <h2 ref={headingRef} className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 font-[var(--primary-font)]">
          <div style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
              <span className="block">Ready to Modernize</span>
          </div>
          <div style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
              <span className="block text-[var(--theme-accent)]">Your University?</span>
          </div>
        </h2>
        
        <p ref={subheadingRef} className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-[var(--text-secondary)] font-[var(--secondary-font)]">
          Connect with our experts to explore how our Unified LMS can revolutionize your institution's learning and administrative landscape.
        </p>

        <div ref={buttonRef}>
            <AuroraButton href="/contact">
                Schedule a Free Consultation
                <ArrowRight className="h-5 w-5 ml-3" />
            </AuroraButton>
        </div>
      </div>
      <GlobalStyles />
    </section>
  );
};

// --- Global Styles for Aurora Effects (Corrected) ---
const GlobalStyles = () => (
    // --- FIX IS HERE: Removed the non-standard 'jsx' and 'global' props ---
    <style>{`
        /* For the Aurora Button */
        .aurora-button .aurora-gradient {
            background: radial-gradient(
                250px circle at var(--x, 0) var(--y, 0),
                var(--theme-accent) 0%,
                var(--theme-primary) 50%,
                transparent 100%
            );
        }
        /* For the Main Background Aurora */
        .aurora-background-gradient {
            background: radial-gradient(
                800px circle at var(--mouse-x, 0) var(--mouse-y, 0),
                rgba(var(--theme-primary-rgb), 0.15),
                transparent 80%
            );
            transition: background 0.2s ease-out;
        }
    `}</style>
);


export default CallToAction;