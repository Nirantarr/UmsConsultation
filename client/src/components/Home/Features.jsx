import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutDashboard, Users, ShieldCheck, BarChart, MessageSquare, Cloud } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Child Component: FeatureNode (No changes needed) ---
const FeatureNode = ({ feature, position, customClassName = '' }) => (
    <div
        className={`feature-node absolute flex items-center justify-center ${customClassName}`}
        style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
        data-id={feature.id}
    >
        <div className="node-icon w-20 h-20 rounded-full bg-slate-800/50 border-2 border-[var(--theme-primary)]/50 flex items-center justify-center transition-all duration-300 ease-in-out">
            <feature.icon className="h-10 w-10 text-[var(--theme-secondary)]" strokeWidth={1.5} />
        </div>
        <div className="node-text absolute left-full ml-10 w-72 p-6 rounded-lg bg-[var(--white-color)] border border-[var(--border-color)] shadow-2xl opacity-0 pointer-events-none">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-[var(--primary-font)]">{feature.title}</h3>
            <p className="text-base text-[var(--text-secondary)] font-[var(--secondary-font)] leading-relaxed">{feature.description}</p>
        </div>
    </div>
);

// --- Child Component: CornerBracket (No changes needed) ---
const CornerBracket = ({ className }) => (
    <div className={`corner-bracket absolute w-12 h-12 text-[var(--theme-accent)]/40 ${className}`}>
        <svg viewBox="0 0 40 40" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M 38 2 L 2 2 L 2 38" />
        </svg>
    </div>
);


// --- Main Features Component (Updated) ---
const Features = () => {
    const sectionRef = useRef(null);
    const backgroundGridRef = useRef(null);

    const featuresData = [
      { id: 'f1', icon: LayoutDashboard, title: 'Centralized Learning Hub', description: 'Consolidate all lectures, assignments, quizzes, and study materials into one accessible and organized platform.', position: { top: '50%', left: '20%', } },
      { id: 'f2', icon: Users, title: 'Improved Teaching Efficiency', description: 'Empower faculty to manage classes, attendance, content, and grading seamlessly from a single, intuitive dashboard.', position: { top: '65%', left: '40%' } },
      { id: 'f3', icon: BarChart, title: 'Real-Time Progress Tracking', description: 'Enable administrators and faculty to monitor student attendance, grades, assignment status, and activity instantly.', position: { top: '85%', left: '25%' } },
      { id: 'f4', icon: ShieldCheck, title: 'Robust Data Security', description: 'Ensure sensitive student data is securely stored, adhering to strict privacy laws and regulations.', position: { top: '40%', left: '80%' } },
      { id: 'f5', icon: MessageSquare, title: 'Enhanced Communication', description: 'Facilitate seamless interaction between students, faculty, and administration through integrated messaging and forums.', position: { top: '60%', left: '65%' } },
      { id: 'f6', icon: Cloud, title: 'Scalable Infrastructure', description: 'Benefit from a robust cloud-based system that grows with your university and ensures consistent uptime.', position: { top: '90%', left: '75%' } },
    ];

    const connections = [ { from: 'f1', to: 'f2' }, { from: 'f1', to: 'f3' }, { from: 'f2', to: 'f3' }, { from: 'f2', to: 'f5' }, { from: 'f4', to: 'f5' }, { from: 'f5', to: 'f6' } ];

    // --- UPDATED useEffect Hook ---
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(backgroundGridRef.current, { x: '+=4rem', y: '+=4rem', duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' });

            gsap.matchMedia().add("(min-width: 768px)", () => {
                gsap.from('.corner-bracket', { scale: 0.5, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });

                const lines = gsap.utils.toArray('.connection-line');
                lines.forEach(line => {
                    const length = line.getTotalLength();
                    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
                    gsap.to(line, {
                        strokeDashoffset: 0, duration: 2, ease: 'power1.inOut',
                        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 40%', scrub: 1 }
                    });
                });

                const nodes = gsap.utils.toArray('.feature-node');
                nodes.forEach(node => {
                    const textPanel = node.querySelector('.node-text');
                    const icon = node.querySelector('.node-icon');
                    const nodeId = node.dataset.id;
                    const opensLeft = node.classList.contains('opens-left');

                    const handleMouseEnter = () => {
                        // --- FIX: Bring the hovered node to the front ---
                        gsap.set(node, { zIndex: 50 }); 
                        
                        gsap.to(nodes.filter(n => n !== node), { opacity: 0.3, scale: 0.95, duration: 0.3 });
                        gsap.to(node, { opacity: 1, scale: 1, duration: 0.3 });

                        gsap.to(textPanel, { autoAlpha: 1, x: opensLeft ? -24 : 24, duration: 0.4, ease: 'power3.out' });
                        gsap.to(icon, { background: 'var(--theme-accent)', boxShadow: '0 0 40px 10px rgba(var(--theme-accent-rgb), 0.5)', duration: 0.3 });
                        gsap.to(`.line-from-${nodeId}, .line-to-${nodeId}`, { stroke: 'var(--theme-accent)', strokeOpacity: 1, strokeWidth: 2.5, duration: 0.3 });
                    };

                    const handleMouseLeave = () => {
                        // --- FIX: Reset the z-index ---
                        gsap.set(node, { zIndex: 10 }); 

                        gsap.to(nodes, { opacity: 1, scale: 1, duration: 0.3 });
                        gsap.to(textPanel, { autoAlpha: 0, x: 0, duration: 0.3, ease: 'power3.in' });
                        gsap.to(icon, { background: 'rgba(30, 41, 59, 0.5)', boxShadow: 'none', duration: 0.3 });
                        gsap.to('.connection-line', { stroke: 'var(--theme-primary)', strokeOpacity: 0.1, strokeWidth: 1, duration: 0.3 });
                    };

                    node.addEventListener('mouseenter', handleMouseEnter);
                    node.addEventListener('mouseleave', handleMouseLeave);
                });

                return () => {
                    // Cleanup can be handled by ctx.revert()
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);


    return (
        <section ref={sectionRef} className="features-section py-24 md:py-32 bg-[#1B283D] relative h-[100vh] min-h-[900px] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div ref={backgroundGridRef} className="w-full h-full bg-grid-themed" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B283D] via-transparent to-[#1B283D] [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-[var(--theme-primary)] rounded-full blur-3xl opacity-20" />
            </div>

            <CornerBracket className="top-8 left-8" />
            <CornerBracket className="top-8 right-8 rotate-90" />
            <CornerBracket className="bottom-8 left-8 -rotate-90" />
            <CornerBracket className="bottom-8 right-8 rotate-180" />

            <div className="container mx-auto px-4 h-full relative z-10">
                <div className="text-center md:absolute md:top-16 md:left-1/2 md:-translate-x-1/2 w-full px-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-on-dark)] mb-4 md:mb-6 font-[var(--primary-font)]">
                        An Ecosystem of Features
                    </h2>
                    <p className="mobile-subtitle text-lg text-[white]/80 max-w-3xl mx-auto font-[var(--secondary-font)]">
                        Explore how each module contributes to our powerful, unified system.
                    </p>
                </div>

                <svg className="connection-svg absolute top-0 left-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
                    {connections.map((conn, index) => {
                        const fromNode = featuresData.find(f => f.id === conn.from);
                        const toNode = featuresData.find(f => f.id === conn.to);
                        return <line key={index} x1={fromNode.position.left} y1={fromNode.position.top} x2={toNode.position.left} y2={toNode.position.top} stroke="var(--theme-primary)" strokeWidth="1" strokeOpacity="0.2" className={`connection-line line-from-${conn.from} line-to-${conn.to}`} />
                    })}
                </svg>

                <div className="features-wrapper h-full z-10">
                    {featuresData.map((feature) => (
                        <FeatureNode
                            key={feature.id}
                            feature={feature}
                            position={feature.position}
                            customClassName={feature.id === 'f4' || feature.id === 'f6' ? 'opens-left' : ''}
                        />
                    ))}
                </div>
            </div>
            <GlobalStyles />
        </section>
    );
};

// --- GlobalStyles and CSS (Updated) ---
const GlobalStyles = () => (
    <style jsx global>{`
        .bg-grid-themed {
            background-image: linear-gradient(rgba(var(--theme-primary-rgb), 0.1) 1px, transparent 0px),
                              linear-gradient(to right, rgba(var(--theme-primary-rgb), 0.1) 1px, transparent 0px);
            background-size: 4rem 4rem;
        }

        /* --- FIX: Added z-index to the feature node --- */
        .feature-node {
            z-index: 10;
        }
        
        .feature-node.opens-left .node-text {
            left: auto;
            right: 100%;
            margin-left: 0;
            margin-right: 2.5rem;
        }

        @media (max-width: 767px) {
            .features-section { height: auto !important; min-height: 100vh !important; padding-top: 6rem; padding-bottom: 6rem; }
            .mobile-subtitle { max-width: 90%; }
            .connection-svg, .corner-bracket { display: none !important; }
            .features-wrapper { margin-top: 3rem; display: flex; flex-direction: column; gap: 1.5rem; height: auto !important; }
            .feature-node { position: relative !important; top: auto !important; left: auto !important; transform: none !important; display: flex; flex-direction: row; align-items: flex-start; gap: 1rem; padding: 1.5rem; background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(var(--theme-primary-rgb), 0.2); border-radius: 0.75rem; width: 100%; }
            .node-icon { position: static; flex-shrink: 0; width: 4rem; height: 4rem; border-width: 1px; }
            .node-icon > svg { width: 2rem; height: 2rem; }
            .node-text { display: block !important; opacity: 1 !important; position: static !important; pointer-events: auto !important; transform: none !important; background: transparent; border: none; box-shadow: none; padding: 0; margin-left: 0; width: 100%; }
            .node-text h3 { color: var(--text-on-dark); margin-bottom: 0.5rem; }
            .node-text p { color: var(--text-on-dark-faded, #a7b6cf); }
        }
    `}</style>
);

export default Features;