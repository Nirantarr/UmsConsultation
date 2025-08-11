import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CoreLMSModules = () => {
    const sectionRef = useRef(null);
    const triggerRefs = useRef([]);
    const displayRefs = useRef([]);
    const highlighterRef = useRef(null);

    const [activeModule, setActiveModule] = useState(0);
    // This state now correctly separates desktop from tablet/mobile
    const [isDesktopView, setIsDesktopView] = useState(false);

    const modulesData = [
      { title: 'Unified Dashboard', description: 'A centralized hub for all academic and administrative activities, accessible to all stakeholders. The command center for your entire institution. Our Unified Dashboard provides a personalized, at-a-glance overview of everything that matters, driving efficiency and engagement from the moment users log in.', image: './assets/1.jpg', link: '/services/unified-dashboard' },
      { title: 'Content & Course Management', description: 'Effortlessly organize, deliver, and manage course materials, assignments, and learning resources. Build and manage world-class digital learning experiences. Our intuitive tools empower educators to create, organize, and deliver rich, engaging course content with unparalleled ease and flexibility.', image: './assets/2.jpg', link: '/services/course-management' },
      { title: 'Online Class & Lecture Hosting', description: 'Seamlessly conduct live online classes and host recorded lectures with integrated virtual tools. Deliver a classroom experience that transcends physical boundaries. Our integrated platform provides robust, high-definition video conferencing and lecture hosting designed for education.', image: './assets/3.jpg', link: '/services/online-classes' },
      { title: 'Exams & Assessment Tools', description: 'Create, administer, and grade online exams, quizzes, and assignments with advanced evaluation features. Uphold academic integrity while delivering flexible and insightful evaluations. Our secure assessment suite offers powerful tools for creating, administering, and grading a wide variety of tests and quizzes.', image: './assets/4.jpg', link: '/services/exams-assessments' },
      { title: 'Integrated Communication', description: 'Foster real-time collaboration and discussions with built-in messaging, forums, and announcement boards. Foster a vibrant and connected learning community. Our suite of communication tools is woven directly into the LMS, making collaboration and information sharing seamless and intuitive.', image: './assets/5.jpg', link: '/services/communication' },
      { title: 'Performance Analytics', description: 'Gain deep insights into student performance, course engagement, and platform usage with comprehensive analytics. Transform raw data into actionable insights. Our powerful analytics engine provides a 360-degree view of student engagement, course effectiveness, and institutional performance.', image: './assets/6.jpg', link: '/services/analytics' },
    ];

    // Effect to check screen size and set the view mode
    useEffect(() => {
        const checkScreenSize = () => {
            // UPDATED: Breakpoint is now 1024px (lg) to keep tablets in mobile view
            setIsDesktopView(window.innerWidth >= 1024);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Effect for animations, handles both view modes
    useEffect(() => {
        const activeTrigger = triggerRefs.current[activeModule];
        if (activeTrigger) {
            gsap.to(highlighterRef.current, {
                top: activeTrigger.offsetTop,
                height: activeTrigger.offsetHeight,
                duration: 0.4,
                ease: 'power3.inOut'
            });
        }
        
        if (isDesktopView) {
            // Original animation logic for desktop
            const tl = gsap.timeline();
            displayRefs.current.forEach((panel, index) => {
                if (panel) {
                    if (index === activeModule) {
                        tl.fromTo(panel, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
                    } else {
                        tl.to(panel, { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power3.in' }, 0);
                    }
                }
            });
        } else {
            // Simple fade-in for the mobile/tablet view
            const activePanel = displayRefs.current[activeModule];
            if(activePanel) {
                gsap.fromTo(activePanel, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
            }
        }
    }, [activeModule, isDesktopView]);

    const activeModuleData = modulesData[activeModule];

    return (
        <section ref={sectionRef} className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-800 mb-6 font-sans">
                        A Truly Unified System
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto font-sans">
                        From administration to analytics, every module is designed to work together seamlessly, creating a single source of truth for your institution.
                    </p>
                </div>

                {/* UPDATED: Uses 'lg:' prefix for desktop layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className="lg:col-span-4 relative">
                        <div ref={highlighterRef} className="absolute left-0 w-full bg-white rounded-lg shadow-md z-0" />
                        <div className="relative z-10 flex flex-col">
                            {modulesData.map((module, index) => (
                                <button
                                    key={module.title}
                                    ref={el => triggerRefs.current[index] = el}
                                    onMouseEnter={() => setActiveModule(index)}
                                    onClick={() => setActiveModule(index)}
                                    className={`text-left p-6 rounded-lg transition-colors duration-300 ${activeModule === index ? 'text-[var(--theme-primary)]' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    <h3 className="text-xl font-bold font-sans">{module.title}</h3>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* UPDATED: This container uses 'lg:' for its desktop state */}
                    <div className="lg:col-span-8 relative lg:h-[500px]">
                        {!isDesktopView ? (
                            // --- MOBILE & TABLET VIEW (Screens < 1024px) ---
                            <div
                                key={activeModule}
                                ref={el => displayRefs.current[activeModule] = el}
                                className="flex flex-col justify-between p-8 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                            >
                                <div>
                                    <p className="text-lg text-slate-700 mb-6 leading-relaxed font-sans">{activeModuleData.description}</p>
                                    <a href={activeModuleData.link} className="inline-flex items-center font-bold text-[var(--theme-primary)] hover:underline">
                                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                                    </a>
                                </div>
                                <img 
                                    src={activeModuleData.image}
                                    alt={activeModuleData.title}
                                    className="w-full h-auto object-contain rounded-lg mt-8"
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x300/CCCCCC/333333?text=Module+Feature'; }} 
                                />
                            </div>
                        ) : (
                            // --- DESKTOP VIEW (Screens >= 1024px) ---
                            modulesData.map((module, index) => (
                                <div
                                    key={module.title}
                                    ref={el => displayRefs.current[index] = el}
                                    className="absolute inset-0 flex flex-col justify-between p-8 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                                    style={{ visibility: index === activeModule ? 'visible' : 'hidden' }}
                                >
                                    <div>
                                        <p className="text-lg text-slate-700 mb-6 leading-relaxed font-sans">{module.description}</p>
                                        <a href={module.link} className="inline-flex items-center font-bold text-[var(--theme-primary)] hover:underline">
                                            Learn More <ArrowRight className="h-4 w-4 ml-2" />
                                        </a>
                                    </div>
                                    <img 
                                        src={module.image}
                                        alt={module.title}
                                        className="w-full h-48 object-cover rounded-lg mt-8"
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x300/CCCCCC/333333?text=Module+Feature'; }} 
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoreLMSModules;