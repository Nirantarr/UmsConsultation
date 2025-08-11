import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Theme (Unchanged) ---
const theme = {
    '--theme-primary': '#9B72AA',
    '--theme-secondary': '#D685B6',
    '--theme-accent': '#F2B8D4',
    '--theme-support-1': '#A6B1D9',
    '--theme-support-2': '#B8D7E3',
    '--theme-light-bg': '#F9F7FB',
    '--theme-dark-text': '#4A4A6A', // This dark color is now used for text on the back
    '--theme-light-text': '#7B84A7',
};

// --- MODIFIED: Updated bookData for better text styling ---
const bookData = [
    { 
        imageUrl: 'https://picsum.photos/seed/page1/800/600', 
        back: (
            <div className="space-y-3 p-4">
                <h3 className="text-2xl font-serif" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.25)' }}>Our Core Goal</h3>
                <p className="max-w-md mx-auto font-sans" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.15)' }}>To empower educational journeys by connecting students with the perfect universities and consultants worldwide.</p>
            </div>
        ), 
        color: 'bg-[#9B72AA]' 
    },
    { 
        imageUrl: 'https://picsum.photos/seed/page2/800/600', 
        back: (
            <div className="space-y-3 p-4">
                <h3 className="text-2xl font-serif" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.25)' }}>Looking Ahead</h3>
                <p className="max-w-md mx-auto font-sans" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.15)' }}>To become the most trusted and comprehensive platform for educational guidance, shaping millions of futures.</p>
            </div>
        ), 
        color: 'bg-[#D685B6]' 
    },
    { 
        imageUrl: 'https://picsum.photos/seed/page3/800/600', 
        back: (
            <div className="space-y-3 p-4">
                <h3 className="text-2xl font-serif" style={{ color: 'white', textShadow: '0px 1px 3px rgba(0,0,0,0.2)' }}>How It Works</h3>
                <p className="max-w-md mx-auto font-sans" style={{ color: 'white', textShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>We use smart matching algorithms and expert insights to create a personalized roadmap for every student.</p>
            </div>
        ), 
        color: 'bg-[#F2B8D4]' 
    },
    { 
        imageUrl: 'https://picsum.photos/seed/page4/800/600', 
        back: (
            <div className="space-y-3 p-4">
                <h3 className="text-2xl font-serif" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.25)' }}>Your Benefits</h3>
                <p className="max-w-md mx-auto font-sans" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.15)' }}>Discover institutions, connect with experts, and find all the resources you need for your academic journey.</p>
            </div>
        ), 
        color: 'bg-[#A6B1D9]' 
    },
    { 
        imageUrl: 'https://picsum.photos/seed/page5/800/600', 
        back: (
            <div className="space-y-3 p-4">
                <h3 className="text-2xl font-serif" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.25)' }}>Our Partnership</h3>
                <p className="max-w-md mx-auto font-sans" style={{ color: theme['--theme-dark-text'], textShadow: '0px 1px 2px rgba(255,255,255,0.15)' }}>Join our network to reach a global audience of aspiring students and showcase your unique offerings.</p>
            </div>
        ), 
        color: 'bg-[#B8D7E3]' 
    },
    // The rest of the items follow the same pattern...
];


const About = () => {
    const component = useRef(null);
    const bookContainerRef = useRef(null);
    const totalPages = bookData.length;
    const pageFlipDuration = 0.6;

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const pages = gsap.utils.toArray(".book-page");
            if (pages.length === 0) return;

            ScrollTrigger.create({
                trigger: component.current,
                pin: bookContainerRef.current,
                start: "top top",
                end: `+=${totalPages * 300}`,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: component.current,
                    start: "top top",
                    end: `+=${totalPages * 300}`,
                    scrub: 1,
                }
            });
            
            tl.to({}, { duration: 0.1 });

            pages.forEach((page, index) => {
                gsap.set(page, { zIndex: totalPages - index });

                tl.to(page, {
                    rotationY: -180,
                    duration: pageFlipDuration,
                    ease: "power1.inOut",
                    onStart: () => gsap.set(page, { zIndex: totalPages + 1 }),
                    onComplete: () => gsap.set(page, { zIndex: index + 1 }),
                    onReverseComplete: () => gsap.set(page, { zIndex: totalPages - index }),
                }, `-=${pageFlipDuration * 0.5}`);
            });

        }, component);
        return () => ctx.revert();
    }, [totalPages, pageFlipDuration]);

    return (
        <>
            {/* --- MODIFIED: New Google Fonts imported --- */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Lora:wght@700&display=swap');
                    .font-serif { font-family: 'Lora', serif; }
                    .font-sans { font-family: 'Inter', sans-serif; }
                `}
            </style>
            
            <section ref={component} className="about-panel relative w-full" style={{ backgroundColor: theme['--theme-light-bg'], height: `${totalPages * 300 + window.innerHeight}px` }}>
                
                <div ref={bookContainerRef} className="book-container w-screen h-screen">
                    
                    <div className="w-full h-full flex items-center justify-center pt-[80px] pb-8 px-8 box-border [perspective:3000px]">
                        
                        <div className="book-wrapper relative w-full h-full max-w-7xl" style={{aspectRatio: '10/6'}}>
                            
                            <div className="book-cover-left absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-8 text-center rounded-l-2xl shadow-2xl" style={{ backgroundColor: theme['--theme-dark-text'], zIndex: 0 }}>
                                <div className="max-w-sm">
                                    <h2 className="text-4xl font-serif text-white">Welcome to Our Story</h2>
                                    <div className="w-24 h-0.5 mx-auto my-6" style={{ backgroundColor: theme['--theme-primary'] }}></div>
                                    <p className="font-sans text-slate-300">
                                        This book tells the story of our mission, our vision, and our commitment to education.
                                    </p>
                                    <p className="font-sans text-slate-400 mt-8 text-sm animate-pulse">
                                        Scroll down to turn the page.
                                    </p>
                                </div>
                            </div>

                            <div className="pages-container absolute top-0 left-1/2 w-1/2 h-full [transform-style:preserve-3d]">
                                {bookData.map((page, index) => (
                                    <div key={index} className="book-page absolute top-0 left-0 w-full h-full [transform-style:preserve-3d]" style={{ transformOrigin: 'left center' }}>
                                        
                                        <div className="page-front absolute top-0 left-0 w-full h-full bg-slate-100 border-r border-slate-300 rounded-r-2xl [backface-visibility:hidden] p-2">
                                            <div className="absolute inset-0 w-full h-full" style={{background: 'linear-gradient(to left, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 10%)'}} />
                                            <img 
                                                src={page.imageUrl} 
                                                alt={`Story page ${index + 1}`} 
                                                className="w-full h-full object-cover rounded-r-xl"
                                            />
                                            <span className="absolute bottom-4 right-4 text-xs font-light text-white bg-black bg-opacity-40 px-2 py-1 rounded">Page {index * 2 + 1}</span>
                                        </div>

                                        {/* --- MODIFIED: text-white class removed for better contrast --- */}
                                        <div className={`page-back absolute top-0 left-0 w-full h-full ${page.color} [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-l-2xl`}>
                                            <div className="absolute inset-0 w-full h-full" style={{background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 20%)'}} />
                                            <div className="flex flex-col items-center justify-center h-full text-center px-4 relative">
                                                {page.back}
                                                <span className="absolute bottom-6 text-sm font-light opacity-70">Page {index * 2 + 2}</span>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;