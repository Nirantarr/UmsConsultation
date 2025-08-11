import React,{ useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Home/Navbar';
import About from '../components/About';
import UnifiedChat from '../components/chat/UnifiedChat';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// --- SVG Icons (reusable components) ---
const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--theme-primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--theme-primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653-.125-1.274-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--theme-primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

// --- Particle Background Component ---
const ParticleBackground = ({ count = 50 }) => {
    const particlesRef = useRef(null);

    useEffect(() => {
        const particles = particlesRef.current.children;
        gsap.set(particles, {
            x: () => gsap.utils.random(0, window.innerWidth),
            y: () => gsap.utils.random(0, window.innerHeight),
            scale: () => gsap.utils.random(0.5, 1.5),
        });

        gsap.to(particles, {
            x: "+=random(-100, 100)",
            y: "+=random(-100, 100)",
            opacity: () => gsap.utils.random(0.1, 0.5),
            duration: () => gsap.utils.random(20, 40),
            ease: 'none',
            repeat: -1,
            yoyo: true,
        });
    }, [count]);

    return (
        <div ref={particlesRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="particle absolute rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
            ))}
        </div>
    );
};

// Interactive 3D Team Card Component
const TeamCard = ({ name, role, imgSrc, description }) => {
    const cardRef = useRef(null);
    useEffect(() => {
        const card = cardRef.current;
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, { rotationY: x * 0.05, rotationX: -y * 0.05, transformPerspective: 1000, ease: 'power1.out', duration: 0.8 });
        };
        const handleMouseLeave = () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, ease: 'elastic.out(1, 0.5)', duration: 1.2 });
        };
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);
    return (
        <div 
            ref={cardRef} 
            className="team-card bg-white p-8 rounded-lg shadow-lg border-2 border-solid transition-shadow duration-300"
            style={{ borderColor: 'var(--theme-accent)' }}
        >
            <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" src={imgSrc} alt={name} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{name}</h3>
            <p className="font-semibold" style={{ color: 'var(--theme-primary)' }}>{role}</p>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>
    );
};


// --- Main AboutPage Component ---
const AboutUs = () => {
    const componentRef = useRef(null);

    const theme = {
        '--theme-primary': '#305090',
        '--theme-accent': '#49C6E5',
        '--theme-gradient': 'linear-gradient(135deg, var(--theme-accent) 0%, var(--theme-primary) 100%)',
        '--text-primary': '#282828',
        '--text-secondary': '#6c757d',
        '--light-bg-color': '#f4f7f9',
        '--white-color': '#ffffff',
        '--shadow-color': 'rgba(48, 80, 144, 0.1)',
        '--shadow-hover': 'rgba(48, 80, 144, 0.2)',
        '--card-shadow-color': 'rgba(0, 0, 0, 0.06)',
        '--border-color': '#e0e6ed',
        '--primary-font': "'Playfair Display', serif",
        '--secondary-font': "'Poppins', sans-serif",
        '--theme-secondary': '#305090',
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // GSAP MatchMedia for responsive animations
            gsap.matchMedia()
            .add("(min-width: 1025px)", () => {
                // DESKTOP ANIMATIONS
                gsap.fromTo(".hero-image-container", { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.out', delay: 0.4 });
                gsap.fromTo(".hero-image", { scale: 1.2 }, { scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.4 });
                gsap.fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 });
                gsap.fromTo(".hero-subtitle", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.0 });

                // CARD STACK ANIMATION
                gsap.to(".hero-section .card-stack-container", { '--card-2-y': -15, '--card-2-z': -20, '--card-2-rot': -4, duration: 1.2, ease: 'power3.out', delay: 1.2 });
                gsap.to(".hero-section .card-stack-container", { '--card-3-y': -30, '--card-3-z': -40, '--card-3-rot': -8, duration: 1.2, ease: 'power3.out', delay: 1.3 });
            })
            .add("(max-width: 1024px)", () => {
                // MOBILE & TABLET ANIMATIONS
                gsap.fromTo(".hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 });
                gsap.fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.7 });
                gsap.fromTo(".hero-section .card-stack-container", { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 1.0 });
            });


            // DECORATIVE SHAPE & ICON ANIMATIONS
            gsap.to(".hero-shape", { y: "random(-20, 20)", x: "random(-15, 15)", rotation: "random(-45, 45)", duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });
            gsap.utils.toArray(".floating-icon").forEach(icon => {
                gsap.to(icon, { y: "random(-40, 40)", x: "random(-30, 30)", rotation: "random(-60, 60)", duration: "random(8, 15)", ease: 'none', repeat: -1, yoyo: true });
            });

            // PAGE-WIDE DECORATIVE SHAPE ANIMATIONS
            gsap.utils.toArray(".mission-bg-shape").forEach(shape => {
                gsap.to(shape, {
                    y: "random(-200, 200)", x: "random(-200, 200)", scale: "random(0.8, 1.5)",
                    ease: "none", scrollTrigger: { trigger: ".mission-section", start: "top bottom", end: "bottom top", scrub: 2 }
                });
            });
            
            // TEAM FRAME ANIMATION
            gsap.fromTo(".team-frame", { scale: 0.5, opacity: 0, rotation: -45 }, { scale: 1, opacity: 1, rotation: 0, scrollTrigger: { trigger: ".team-section", start: "top 80%", end: "bottom 60%", scrub: 1 } });
            
            gsap.to(".timeline-path-deco", { yPercent: -100, xPercent: gsap.utils.wrap([-10, 10, -5, 5]), ease: "none", scrollTrigger: { trigger: ".timeline-section", start: "top bottom", end: "bottom top", scrub: 1 } });
            gsap.to(".cta-pulse", { scale: 1.5, opacity: 0, ease: "none", scrollTrigger: { trigger: ".cta-section", start: "top 80%", end: "bottom top", scrub: 1 } });
            
            // CONTENT ANIMATIONS
            gsap.fromTo(".mission-header", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: ".mission-section", start: "top 80%" }});
            gsap.fromTo(".mission-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: ".mission-section", start: "top 70%" }});
            
            gsap.to(".mission-section .card-stack-container", { '--card-2-y': -15, '--card-2-z': -20, '--card-2-rot': 4, scrollTrigger: { trigger: ".mission-section .card-stack-container", start: "top 85%", end: "top 40%", scrub: 1 }});
            gsap.to(".mission-section .card-stack-container", { '--card-3-y': -30, '--card-3-z': -40, '--card-3-rot': 8, scrollTrigger: { trigger: ".mission-section .card-stack-container", start: "top 85%", end: "top 40%", scrub: 1 }});

            gsap.fromTo(".timeline-header", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: ".timeline-section", start: "top 80%" }});
            gsap.fromTo(".timeline-line-progress", { scaleY: 0 }, { scaleY: 1, scrollTrigger: { trigger: ".timeline-wrap", start: "top 50%", end: "bottom 50%", scrub: true } });
            
            const timelineItems = document.querySelectorAll('.timeline-item');
            const timelineDots = document.querySelectorAll('.timeline-dot');
            timelineItems.forEach((item, index) => {
                gsap.fromTo(item, { opacity: 0, x: item.classList.contains('right-timeline') ? 50 : -50 }, {
                    opacity: 1, x: 0, duration: 0.8,
                    scrollTrigger: {
                        trigger: item, start: "top 85%",
                        onEnter: () => timelineDots[index].classList.add('active'),
                        onLeaveBack: () => timelineDots[index].classList.remove('active'),
                    }
                });
            });

        }, componentRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={componentRef} style={{ ...theme, backgroundColor: 'var(--light-bg-color)' }}>
            <style>
                {`
                body { font-family: var(--secondary-font); }
                h1, h2, h3, h4, h5, h6 { font-family: var(--primary-font); }
                
                .hero-title-shimmer {
                    background: linear-gradient(90deg, var(--text-primary), var(--text-primary), var(--theme-accent), var(--text-primary), var(--text-primary));
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 5s infinite linear;
                }
                @keyframes shimmer { 0% { background-position: 150% 0; } 100% { background-position: -150% 0; } }
                
                .card-stack-container {
                    position: relative; perspective: 1000px; transform-style: preserve-3d;
                    --card-2-y: 0; --card-2-z: 0; --card-2-rot: 0;
                    --card-3-y: 0; --card-3-z: 0; --card-3-rot: 0;
                }
                .card-stack-container::before, .card-stack-container::after {
                    content: ''; position: absolute; left: 0; top: 0;
                    width: 100%; height: 100%; border-radius: 0.5rem; z-index: -1;
                }
                .card-stack-container::before {
                    background-color: #e0e0e0;
                    transform: translateY(var(--card-2-y, 0px)) translateZ(var(--card-2-z, 0px)) rotateZ(var(--card-2-rot, 0deg));
                }
                .card-stack-container::after {
                    background-color: #424242;
                    transform: translateY(var(--card-3-y, 0px)) translateZ(var(--card-3-z, 0px)) rotateZ(var(--card-3-rot, 0deg));
                }
                
                .hero-grid-overlay {
                    position: absolute; inset: 0; width: 100%; height: 100%;
                    background-image: 
                        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px; z-index: -1;
                    animation: panGrid 30s linear infinite;
                }
                @keyframes panGrid { 0% { background-position: 0 0; } 100% { background-position: 50px 50px; } }

                .particle { width: 3px; height: 3px; opacity: 0; }
                .timeline-dot.active { background-color: var(--theme-accent) !important; transform: scale(1.5); }

                /* --- Tablet & Mobile View Adjustments --- */
                @media (max-width: 1024px) {
                .hero-section {
                        padding-top: 8rem; /* Increased padding-top to avoid overlap */
                        padding-bottom: 5rem;
                    }
                    .hero-section .grid {
                        grid-template-columns: 1fr;
                        gap: 4rem;
                    }
                    .hero-section .text-center {
                        text-align: center;
                    }
                    .hero-section .max-w-xl {
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                
                @media (max-width: 768px) {
                    /* Hero (Book) Section Mobile Styles */
                    .hero-section {
                        padding-top: 8rem; /* Increased padding-top to avoid overlap */
                        padding-bottom: 5rem;
                    }
                    .hero-section .card-stack-container {
                        max-height: 280px; /* Reduced height of the card stack */
                        overflow: hidden;
                        border-radius: 0.5rem; /* Ensure rounded corners are visible */
                    }
                    .hero-image {
                        height: 100%;
                        object-position: center 30%;
                    }
                    .hero-title {
                        font-size: 2.5rem; 
                        line-height: 1.2;
                    }
                    .hero-subtitle {
                        font-size: 1.1rem;
                    }
                    
                    .hero-shape:nth-of-type(2), .hero-shape:nth-of-type(5) {
                        display: none;
                    }
                     
                    .floating-icon.book-icon {
                        top: auto;
                        bottom: -2rem;
                        right: 1rem;
                        font-size: 3rem;
                    }

                    /* Timeline Section Mobile Styles */
                    .timeline-wrap { padding: 2.5rem 0.5rem; }
                    .timeline-line, .timeline-line-progress { left: 20px !important; }
                    .timeline-item { 
                        flex-direction: row !important; 
                        justify-content: flex-start !important;
                        align-items: flex-start !important;
                        margin-bottom: 2rem;
                        padding-left: 40px;
                        width: 100%;
                    }
                    
                    .timeline-item.right-timeline, .timeline-item.left-timeline {
                       flex-direction: row !important;
                       justify-content: flex-start !important;
                    }
                    .timeline-item .order-1.w-5\/12:first-child { display: none; } 
                    .timeline-dot { 
                        position: absolute !important; 
                        left: 20px !important; 
                        transform: translateX(-50%); 
                        margin-left: 0 !important;
                        top: 0;
                    }
                    .timeline-content-card {
                        width: 100% !important;
                        margin-left: 0; 
                        transform: none !important;
                    }
                }
                `}
            </style>
            <Navbar />
            <UnifiedChat/>
            <div className="w-full">
                <section className="hero-section relative py-20 lg:py-32 overflow-hidden" style={{ backgroundColor: 'var(--light-bg-color)' }}>
                    {/* ALL DECORATIVES ARE NOW HERE */}
                    <ParticleBackground count={75} />
                    <div className="hero-grid-overlay"></div>
                    
                    <div className="hero-shape absolute top-[10%] left-[5%] w-32 h-32 md:w-40 md:h-40 rounded-full opacity-50 pointer-events-none" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
                    <div className="hero-shape absolute bottom-[15%] left-[25%] w-24 h-24 md:w-28 md:h-28 opacity-40 pointer-events-none" style={{ backgroundColor: 'var(--theme-primary)', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
                    <div className="hero-shape absolute top-[20%] right-[10%] w-40 h-40 md:w-48 md:h-48 opacity-30 pointer-events-none" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
                    <div className="hero-shape absolute bottom-[5%] right-[5%] w-32 h-32 opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--theme-accent)', borderRadius: '83% 17% 23% 77% / 26% 83% 17% 74%' }}></div>
                    <div className="hero-shape absolute top-[5%] right-[40%] w-20 h-20 opacity-30 pointer-events-none" style={{ backgroundColor: 'var(--theme-secondary)', borderRadius: '50%' }}></div>

                    <div className="floating-icon absolute top-[15%] right-[25%] text-5xl text-black/10 pointer-events-none"><i className="fa-solid fa-graduation-cap"></i></div>
                    <div className="floating-icon absolute bottom-[10%] left-[10%] text-6xl text-black/10 pointer-events-none"><i className="fa-solid fa-lightbulb"></i></div>
                    <div className="floating-icon book-icon absolute top-[50%] right-[15%] text-4xl text-black/10 pointer-events-none"><i className="fa-solid fa-book"></i></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-left">
                                <h1 className="hero-title text-4xl lg:text-6xl font-bold tracking-tight">
                                    <span className="hero-title-shimmer">Empowering Learning Through Technology</span>
                                </h1>
                                <p className="hero-subtitle mt-4 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0" style={{ color: 'var(--text-secondary)' }}>We are a passionate team of educators and technologists dedicated to transforming corporate and academic learning with innovative LMS solutions.</p>
                            </div>
                            <div className="card-stack-container">
                                <div className="hero-image-container rounded-lg shadow-2xl relative z-10">
                                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1332" alt="Team collaborating on a project" className="hero-image rounded-lg w-full h-auto object-cover"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

               <About />
                
                <section className="mission-section relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: 'var(--text-primary)' }}>
                    <div className="mission-bg-shape absolute top-[10%] left-[10%] w-48 h-48 rounded-full opacity-50 filter blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
                    <div className="mission-bg-shape absolute top-[20%] right-[15%] w-64 h-64 opacity-40 filter blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--theme-accent)', borderRadius: '60% 40% 30% 70%' }}></div>
                    <div className="mission-bg-shape absolute bottom-[15%] left-[20%] w-40 h-40 rounded-full opacity-60 filter blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
                    <div className="mission-bg-shape absolute bottom-[5%] right-[10%] w-56 h-56 opacity-40 filter blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--theme-primary)', borderRadius: '50%' }}></div>
                    <div className="container mx-auto px-6 text-center relative z-10 bg-black/20 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl py-16">
                        <div className="mission-header mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">Our Mission</h2>
                            <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-300">To create intuitive, engaging, and effective learning experiences that drive measurable results and foster a culture of continuous growth.</p>
                        </div>
                        <div className="mission-content grid lg:grid-cols-2 gap-12 items-center text-left">
                            <div className="card-stack-container">
                                <div className="mission-image relative z-10 rounded-lg shadow-xl overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1332" alt="LMS Consulting team in a meeting" className="rounded-lg w-full" />
                                </div>
                            </div>
                            <div className="mission-pillars-grid space-y-8">
                                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/10 transition-colors duration-300 transform hover:-translate-y-1">
                                    <div className="flex-shrink-0 pt-1"><LightbulbIcon /></div>
                                    <div><h3 className="text-xl font-semibold text-white">Innovative Solutions</h3><p className="mt-2 text-slate-300">We leverage cutting-edge technology and pedagogical expertise to build LMS platforms that are not just functional, but truly transformative.</p></div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/10 transition-colors duration-300 transform hover:-translate-y-1">
                                    <div className="flex-shrink-0 pt-1"><UsersIcon /></div>
                                    <div><h3 className="text-xl font-semibold text-white">Learner-Centric Design</h3><p className="mt-2 text-slate-300">Every decision is guided by the end-user. We create intuitive and engaging interfaces that learners love to use, boosting adoption and completion rates.</p></div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/10 transition-colors duration-300 transform hover:-translate-y-1">
                                    <div className="flex-shrink-0 pt-1"><RocketIcon /></div>
                                    <div><h3 className="text-xl font-semibold text-white">Partnership for Growth</h3><p className="mt-2 text-slate-300">We work as an extension of your team, providing ongoing support and strategic guidance to ensure your learning objectives are met and exceeded.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="team-section relative py-20 lg:py-28 overflow-hidden">
                    <div className="team-frame absolute top-0 left-0 w-32 h-32 border-l-8 border-t-8 opacity-20 pointer-events-none" style={{ borderColor: 'var(--theme-primary)' }}></div>
                    <div className="team-frame absolute bottom-0 right-0 w-32 h-32 border-r-8 border-b-8 opacity-20 pointer-events-none" style={{ borderColor: 'var(--theme-primary)' }}></div>
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="team-header mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Meet Our Leaders</h2>
                            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Our strength lies in our blend of academic insight and technical prowess.</p>
                        </div>
                        <div className="team-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TeamCard name="Jane Doe" role="Founder & CEO" imgSrc="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=387" description="With over 15 years in educational technology, Jane leads our vision." />
                            <TeamCard name="John Smith" role="Chief Technology Officer" imgSrc="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=387" description="John is the architect behind our robust and scalable LMS platforms." />
                            <TeamCard name="Emily White" role="Head of Learning Design" imgSrc="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=461" description="Emily ensures every solution is grounded in sound pedagogical principles." />
                        </div>
                    </div>
                </section>
                
                <section className="timeline-section relative py-20 lg:py-28 overflow-hidden">
                    <div className="timeline-path-deco absolute top-0 left-1/4 w-1 h-full bg-slate-200/50 rounded-full pointer-events-none"></div>
                    <div className="container mx-auto px-6 relative z-10 bg-white shadow-xl rounded-xl py-16">
                        <div className="timeline-header text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Journey</h2>
                            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>From a small startup to a trusted partner for leading organizations.</p>
                        </div>
                        <div className="relative wrap overflow-hidden p-10 h-full timeline-wrap">
                            <div className="timeline-line absolute border-opacity-20 h-full border-2" style={{ left: '50%', borderColor: 'var(--theme-primary)' }}></div>
                            <div className="timeline-line-progress absolute h-full border-2 origin-top" style={{ left: '50%', borderColor: 'var(--theme-secondary)' }}></div>
                            {[{year: '2021', title: 'The Idea', desc: 'Our founders sketch the first draft of a truly learner-centric LMS on a napkin.'}, {year: '2022', title: 'First Client', desc: 'We launch our MVP and partner with our first enterprise client, increasing completion rates by 40%.'}, {year: '2024', title: 'Growth', desc: 'We expand our team and launch our mobile-first learning platform to great acclaim.'}, {year: '2025', title: 'The Future', desc: 'We continue to innovate, integrating AI-driven personalization and analytics.'}].map((item, index) => (
                                <div key={index} className={`timeline-item mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'right-timeline' : 'flex-row-reverse left-timeline'}`}>
                                    <div className="order-1 w-5/12"></div>
                                    <div className="timeline-dot z-20 flex items-center order-1 shadow-xl w-8 h-8 rounded-full transition-all duration-300" style={{ backgroundColor: 'var(--theme-secondary)' }}><h1 className="mx-auto font-semibold text-lg text-white">{index + 1}</h1></div>
                                    <div className={`timeline-content-card order-1 rounded-lg shadow-xl w-5/12 px-6 py-4 bg-white border-2 border-solid hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300`} style={{ borderColor: 'var(--theme-accent)' }}><h3 className="mb-3 font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{item.year} - {item.title}</h3><p className="text-sm leading-snug tracking-wide" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="cta-section relative text-white text-center py-20 lg:py-28 overflow-hidden" style={{ background: 'var(--theme-gradient)' }}>
                    <div className="cta-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-30 pointer-events-none" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
                    <div className="cta-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 w-80 h-80 rounded-full opacity-30 pointer-events-none" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'var(--white-color)' }}>Ready to Transform Your Learning Programs?</h2>
                        <p className="mt-4 text-lg lg:text-xl max-w-3xl mx-auto text-white/80">Let's talk about how our innovative LMS solutions can help you achieve your organization's goals.</p>
                        <a href="/contact" className="cta-button mt-8 inline-block text-white font-semibold px-8 py-4 rounded-full text-lg transition-opacity duration-300 shadow-lg" style={{ background: 'var(--theme-primary)' }}>Contact Us</a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;