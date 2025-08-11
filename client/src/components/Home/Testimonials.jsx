import React, { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Child Component: TestimonialCard (No changes needed) ---
const TestimonialCard = React.forwardRef(({ testimonial }, ref) => {
    const cardRef = useRef(null);
    const spotlightRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const spotlight = spotlightRef.current;
        if (!card || !spotlight) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            gsap.to(spotlight, { x: e.clientX - rect.left, y: e.clientY - rect.top, duration: 0.4, ease: 'power3.out' });
        };
        const handleMouseEnter = () => gsap.to(spotlight, { scale: 1, opacity: 1, duration: 0.3 });
        const handleMouseLeave = () => gsap.to(spotlight, { scale: 0, opacity: 0, duration: 0.3 });

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={ref} className="testimonial-card-container w-[90vw] md:w-[480px] flex-shrink-0 p-4 h-full">
            <div ref={cardRef} className="relative h-full bg-slate-800/60 backdrop-blur-lg rounded-2xl p-8 flex flex-col border border-slate-700 overflow-hidden">
                <div ref={spotlightRef} className="absolute top-0 left-0 w-32 h-32 bg-[var(--theme-accent)]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl scale-0 opacity-0" />
                <Quote className="h-10 w-10 text-[var(--theme-primary)] mb-6 z-10" />
                <p className="text-slate-300 text-lg italic mb-6 leading-relaxed flex-grow z-10 font-[var(--secondary-font)]">
                    "{testimonial.quote}"
                </p>
                <div className="flex items-center mt-auto pt-6 border-t border-slate-700 z-10">
                    <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-16 h-16 rounded-full object-cover mr-5 border-2 border-[var(--theme-primary)]"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/CCCCCC/000000?text=User'; }}
                    />
                    <div>
                        <p className="font-bold text-[var(--text-on-dark)] text-lg font-[var(--primary-font)]">{testimonial.author}</p>
                        <p className="text-sm text-slate-400 font-[var(--secondary-font)]">{testimonial.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

// --- Main Testimonials Component ---
const Testimonials = () => {
    const sectionRef = useRef(null);
    const pinContainerRef = useRef(null); 
    const headingBlockRef = useRef(null); // Ref for the entire heading block
    const cardsWrapperRef = useRef(null);
    const cardsRef = useRef([]);

    // ENHANCEMENT: Restored full list of 6 testimonials
    const testimonialsData = [
      { id: 1, quote: "Implementing UniConsult's LMS has revolutionized our campus operations. The centralized system has significantly boosted our administrative efficiency and student engagement.", author: "Dr. Evelyn Reed", role: "Vice Chancellor, City University", avatar: "https://placehold.co/80x80/305090/FFFFFF?text=ER" },
      { id: 2, quote: "The seamless integration of the LMS modules has transformed how our faculty delivers content and manages classes. It's truly a game-changer for modern education.", author: "Prof. David Kim", role: "Dean of Academics, State Institute of Technology", avatar: "https://placehold.co/80x80/49C6E5/FFFFFF?text=DK" },
      { id: 3, quote: "We were looking for a robust and secure solution for student data, and UniConsult delivered. Their LMS provides real-time insights, which is invaluable.", author: "Mr. Sanjay Gupta", role: "Registrar, National College of Arts & Sciences", avatar: "https://placehold.co/80x80/305090/FFFFFF?text=SG" },
      { id: 4, quote: "The comprehensive training and ongoing support from UniConsult made the transition to the new LMS incredibly smooth. Our staff adopted it quickly and efficiently.", author: "Ms. Maria Rodriguez", role: "Director of IT, Global University Network", avatar: "https://placehold.co/80x80/49C6E5/FFFFFF?text=MR" },
      { id: 5, quote: "The analytics features of this LMS have provided us with unprecedented insights into student performance and course effectiveness. It's a powerful tool for strategic planning.", author: "Dr. Chen Li", role: "Head of Research, Elite Business School", avatar: "https://placehold.co/80x80/305090/FFFFFF?text=CL" },
      { id: 6, quote: "Our students love the intuitive interface and centralized access to all their learning resources. UniConsult's LMS has significantly improved their overall learning experience.", author: "Prof. Aisha Khan", role: "Head of Student Affairs, Progressive University", avatar: "https://placehold.co/80x80/49C6E5/FFFFFF?text=AK" },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const pinContainer = pinContainerRef.current;
            const cardsWrapper = cardsWrapperRef.current;
            
            const scrollWidth = cardsWrapper.scrollWidth - document.documentElement.clientWidth;
            
            gsap.to(headingBlockRef.current, { // Animate the entire heading block
                y: -100,
                autoAlpha: 0,
                ease: 'power1.in',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=150',
                    scrub: true
                }
            });

            gsap.to(cardsWrapper, {
                x: -scrollWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: pinContainer,
                    pin: true,
                    scrub: 1,
                    start: 'center center',
                    end: () => `+=${scrollWidth}`,
                }
            });

            cardsRef.current.forEach(card => {
                gsap.from(card, {
                    scale: 0.9,
                    autoAlpha: 0,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: gsap.getTweensOf(cardsWrapper)[0],
                        start: 'left 85%',
                    }
                });
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-[#1B283D] text-[var(--text-on-dark)] relative overflow-hidden py-24 md:py-32 min-h-[200vh]">
            <div className="absolute inset-0 z-0 bg-grid-themed" />

            <div ref={headingBlockRef} className="container mx-auto px-4 text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold font-[var(--primary-font)] mb-6">
                    What Our <span className="text-[var(--theme-accent)]">Partner Universities</span> Say
                </h2>
                {/* FIX: Subheading has been restored */}
                <p className="text-lg text-[var(--text-on-dark)]/70 max-w-3xl mx-auto font-[var(--secondary-font)]">
                    Discover why leading educational institutions trust UniConsult for their Learning Management System needs.
                </p>
            </div>
            
            <div ref={pinContainerRef} className="h-[60vh] flex items-center">
                <div ref={cardsWrapperRef} className="flex items-center h-full w-max pl-[calc((100vw-480px)/2)]">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard 
                            key={testimonial.id}
                            ref={el => cardsRef.current[index] = el}
                            testimonial={testimonial} 
                        />
                    ))}
                </div>
            </div>
            <GlobalStyles />
        </section>
    );
};

// --- Corrected GlobalStyles Component ---
const GlobalStyles = () => (
    // --- FIX IS HERE: Removed the non-standard 'jsx' and 'global' props ---
    <style>{`
        .bg-grid-themed {
            background-image: linear-gradient(rgba(var(--theme-primary-rgb), 0.1) 1px, transparent 1px), 
                              linear-gradient(to right, rgba(var(--theme-primary-rgb), 0.1) 1px, transparent 1px);
            background-size: 4rem 4rem;
        }
    `}</style>
);

export default Testimonials;