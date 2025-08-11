import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb, Settings, CheckCircle, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Timeline Item (Updated with responsive classes) ---
const TimelineItem = React.forwardRef(({ title, description, icon: Icon, isOdd }, ref) => (
    <div ref={ref} className="timeline-item group relative flex items-center w-full">
      {/* The Connector SVG Line - HIDDEN ON MOBILE */}
      <div className={`connector-container hidden md:block absolute top-1/2 w-[calc(50%-2.5rem)] h-12 
                       ${isOdd ? 'right-1/2 mr-10' : 'left-1/2 ml-10'}`}>
        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path 
                className="connector-path"
                d={isOdd ? "M 200 50 H 50 Q 0 50 0 0" : "M 0 50 H 150 Q 200 50 200 100"}
                fill="none" 
                stroke="var(--theme-primary)"
                strokeWidth="2"
                strokeOpacity="0.4"
            />
        </svg>
      </div>

      <div
        className={`timeline-content bg-[var(--white-color)]/80 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full md:w-[calc(50%-2.5rem)] border border-[var(--border-color)] transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl
          ${isOdd ? 'md:ml-auto' : 'md:mr-auto'}
        `}
      >
        <h3 className="text-xl font-bold text-[var(--heading-color)] mb-2 font-[var(--primary-font)]">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)] leading-relaxed font-[var(--secondary-font)]">
          {description}
        </p>
      </div>

      {/* The Icon Container - HIDDEN ON MOBILE */}
      <div
        className="timeline-icon-container hidden md:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-16 h-16 items-center justify-center"
      >
         <div className="icon-ripple absolute w-full h-full bg-[var(--theme-primary)] rounded-full"></div>
         <div className="icon-wrapper relative w-12 h-12 bg-[var(--theme-primary)] text-[var(--text-on-dark)] rounded-full flex items-center justify-center shadow-md transition-transform duration-300 ease-in-out group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
));


// --- Main HowItWorks Component (with robust JS) ---
const HowItWorksTimeline = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const subheadingRef = useRef(null);
    const timelineRef = useRef(null);
    const itemRefs = useRef([]);

    const stepsData = [
      { title: 'Initial Consultation', description: "We start by deeply understanding your university's unique goals and challenges.", icon: Lightbulb },
      { title: 'Tailored Customization', description: 'We customize modules, branding, and workflows to fit your existing systems.', icon: Settings },
      { title: 'Seamless Deployment', description: 'A smooth, efficient rollout across campus with full data migration support.', icon: CheckCircle },
      { title: 'Training & Ongoing Support', description: 'Comprehensive training for all users, coupled with continuous support.', icon: Rocket },
    ];
  
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set([headingRef.current, subheadingRef.current], { autoAlpha: 0, y: 50 });

            gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" }})
              .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
              .to(subheadingRef.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "<0.2");

            const timelineSpineContainer = timelineRef.current.querySelector('.timeline-spine-container');
            if (timelineSpineContainer) {
              gsap.to(timelineSpineContainer.querySelector('.timeline-spine'), {
                  height: '100%',
                  ease: 'none',
                  scrollTrigger: { trigger: timelineRef.current, start: "top 60%", end: "bottom 80%", scrub: true }
              });
            }
            
            itemRefs.current.forEach((item) => {
              if (!item) return;
              const content = item.querySelector('.timeline-content');
              const iconContainer = item.querySelector('.timeline-icon-container');
              const iconRipple = item.querySelector('.icon-ripple');
              const connectorPath = item.querySelector('.connector-path');
              
              const isDesktop = window.innerWidth >= 768;

              // Set initial positions based on screen size
              if(isDesktop) {
                gsap.set(content, { autoAlpha: 0, x: item.dataset.isOdd === 'true' ? 50 : -50 });
              } else {
                gsap.set(content, { autoAlpha: 0, y: 30 }); // Mobile fades up
              }

              const itemTl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" } });
              
              // Only run desktop animations if the elements exist
              if (isDesktop && iconContainer && iconRipple && connectorPath) {
                  const length = connectorPath.getTotalLength();
                  gsap.set(connectorPath, { strokeDasharray: length, strokeDashoffset: length, autoAlpha: 1 });
                  gsap.set(iconContainer, { scale: 0 });
                  gsap.set(iconRipple, { scale: 0, autoAlpha: 0.5 });
                  
                  itemTl
                    .to(iconContainer, { scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
                    .to(iconRipple, { scale: 2.5, autoAlpha: 0, duration: 0.8, ease: 'power2.out' }, "<")
                    .to(connectorPath, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' }, "-=0.6");
              }
              
              // Animate content card into view
              itemTl.to(content, { 
                autoAlpha: 1, 
                x: 0, 
                y: 0,
                duration: 0.7, 
                ease: 'power3.out' 
              }, isDesktop ? "-=0.7" : "+=0"); // Adjust timing based on screen
            });
      
        }, sectionRef);
        return () => ctx.revert();
    }, []);
    

    return (
      <section ref={sectionRef} className="py-20 md:py-28 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full stroke-gray-900/10">
                <defs><pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M.5 71.5V.5H71.5" fill="none"/></pattern></defs>
                <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)"/>
            </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 ref={headingRef} className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-4 font-sans">
            Our Partnership & Implementation Process
          </h2>
          <p ref={subheadingRef} className="text-lg text-center text-gray-600 opacity-90 mb-16 md:mb-20 max-w-3xl mx-auto font-sans">
            We guide your university through a clear, collaborative process for successful LMS adoption.
          </p>
  
          <div ref={timelineRef} className="relative w-full max-w-4xl mx-auto">
            {/* The Timeline Spine - HIDDEN ON MOBILE */}
            <div className="timeline-spine-container absolute left-1/2 top-0 w-1 bg-gray-200 h-full hidden md:block">
              <div className="timeline-spine absolute top-0 left-0 w-full bg-emerald-500 h-0"></div>
            </div>
            
            {/* Items container - smaller gap on mobile */}
            <div className="relative flex flex-col items-center gap-8 md:gap-16">
              {stepsData.map((step, index) => {
                const isOdd = index % 2 !== 0;
                return (
                  <TimelineItem
                    key={index}
                    ref={el => itemRefs.current[index] = el}
                    data-is-odd={isOdd}
                    {...step}
                    isOdd={isOdd}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default HowItWorksTimeline;