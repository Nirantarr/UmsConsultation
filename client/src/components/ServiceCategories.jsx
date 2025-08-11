import React, { useEffect, useRef, useState } from 'react';
import { University, CalendarCheck, Video, BookOpen, UserCheck, ClipboardCheck, Wallet, BarChart, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Data remains the same
const servicesData = [
  { icon: University, title: 'Institutional Setup & Branding', description: ['Deploy a unique digital campus that reflects your institution\'s identity and values.', 'Our seamless onboarding integrates your logos, color schemes, and branding across the platform.', 'Create a tailored and cohesive experience for all students and faculty from day one.'], imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop' },
  { icon: CalendarCheck, title: 'Intelligent Course Management', description: ['Effortlessly orchestrate your entire academic calendar with unparalleled precision.', 'Manage live online classes and track student engagement with robust, real-time analytics.', 'Foster interactive and collaborative learning environments using powerful integrated tools.'], imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop' },
  { icon: Video, title: 'Rich Media & Content Delivery', description: ['Build a future-proof digital library of dynamic learning materials.', 'Support on-demand video lectures, interactive SCORM modules, and downloadable resources.', 'Ensure all content is organized intuitively and accessible 24/7 from any device.'], imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop' },
  { icon: BookOpen, title: 'Unified Library System', description: ['Bridge the gap between your institution\'s physical and digital collections.', 'Provide a single, powerful interface to manage your entire catalog of books and journals.', 'Enable features like digital checkouts and seamless access to research papers.'], imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop' },
  { icon: UserCheck, title: 'Centralized Student Records', description: ['Create a single, secure source of truth for every learner at your institution.', 'Unify all academic and personal information, including grades, attendance, and communications.', 'Provide administrators with actionable insights and students a clear view of their progress.'], imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop' },
  { icon: ClipboardCheck, title: 'Automated Assessment Engine', description: ['Modernize your examination process with a state-of-the-art assessment engine.', 'Confidently create, schedule, deploy, and grade a wide variety of exams and quizzes.', 'Utilize a secure, proctored environment with insightful analytics to measure learning outcomes.'], imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop' },
  { icon: Wallet, title: 'Streamlined Financials', description: ['Simplify and automate the complexities of tuition and fee management.', 'Handle automated invoicing, recurring payments, and diverse international payment gateways.', 'Generate transparent financial reports and significantly reduce administrative overhead.'], imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto/format&fit=crop' },
  { icon: BarChart, title: 'Actionable Analytics', description: ['Unlock the power of your data and transform it into a strategic institutional asset.', 'Utilize advanced, customizable dashboards to track key performance indicators.', 'Enable data-driven decision-making for student performance, engagement, and more.'], imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto/format&fit=crop' }
];

const CubeFace = ({ service, faceRef }) => (
    <div ref={faceRef} className="cube-face absolute w-full h-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black">
        <img src={service.imageUrl} alt={service.title} className="cube-face-img absolute w-full h-full object-cover " />
        <div className="absolute inset-0 flex items-center justify-center">
            <service.icon className="h-16 w-16 text-white/80" strokeWidth={1.2} />
        </div>
    </div>
);

const ServiceCategories = () => {
    const sectionRef = useRef(null);
    const stickyRef = useRef(null);
    const cubeRef = useRef(null);
    const faceRefs = useRef([]);
    faceRefs.current = [];
    const [activeIndex, setActiveIndex] = useState(0);

    const addToFaceRefs = (el) => {
        if (el && !faceRefs.current.includes(el)) {
            faceRefs.current.push(el);
        }
    };
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.matchMedia({
                "(min-width: 1024px)": function() {
                    const numFaces = servicesData.length;
                    const angle = 360 / numFaces;
                    const faceWidth = 340; 
                    
                    // --- THIS IS THE LINE TO CONTROL THE GAP ---
                    const radius = ((faceWidth / 2) / Math.tan(Math.PI / numFaces)) * 1.05; // Use multiplier to create space

                    faceRefs.current.forEach((face, index) => {
                        gsap.set(face, {
                            rotationY: angle * index,
                            transformOrigin: `50% 50% -${radius}px`,
                        });
                        gsap.to(face.querySelector('.cube-face-img'), {
                            z: 50,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: stickyRef.current,
                                scrub: true,
                                start: 'top top',
                                end: 'bottom bottom',
                            }
                        });
                    });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: stickyRef.current,
                            pin: true,
                            scrub: 1.5,
                            start: "top top",
                            end: `+=${numFaces * 500}`,
                            snap: {
                                snapTo: "labels",
                                duration: { min: 0.2, max: 1 },
                                ease: "power2.inOut",
                            },
                             onUpdate: (self) => {
                                const rotation = gsap.getProperty(cubeRef.current, "rotationY");
                                const newIndex = Math.round(-rotation / angle) % numFaces;
                                setActiveIndex(newIndex);
                            },
                        }
                    });

                    for (let i = 0; i < numFaces; i++) {
                        tl.addLabel(`face${i}`, i / numFaces);
                    }

                    tl.to(cubeRef.current, {
                        rotationY: -360,
                        transformOrigin: `50% 50% -${radius}px`,
                        ease: 'none',
                    }, 0);

                    tl.to(cubeRef.current, {
                        keyframes: {
                            "0%":   { boxShadow: "40px 15px 50px 10px rgba(0,0,0,0.15)" },
                            "25%":  { boxShadow: "-40px 15px 50px 10px rgba(0,0,0,0.15)" },
                            "50%":  { boxShadow: "40px 15px 50px 10px rgba(0,0,0,0.15)" },
                            "75%":  { boxShadow: "-40px 15px 50px 10px rgba(0,0,0,0.15)" },
                            "100%": { boxShadow: "40px 15px 50px 10px rgba(0,0,0,0.15)" },
                        },
                        ease: 'none',
                    }, 0);
                },
                "(max-width: 1023px)": function() {
                     gsap.utils.toArray('.mobile-card').forEach(card => {
                        gsap.from(card, {
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse',
                            },
                            autoAlpha: 0,
                            y: 80,
                            duration: 0.8,
                            ease: 'power2.out'
                        });
                    });
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const activeService = servicesData[activeIndex];

    return (
        <section ref={sectionRef} className="py-20 md:py-28 bg-[var(--light-bg-color)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 font-[var(--primary-font)]">
                        An Ecosystem of Innovation
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] font-[var(--secondary-font)]">
                        Explore the modules that form our unified platform, each designed for a distinct facet of modern education.
                    </p>
                </div>
            </div>

            <div ref={stickyRef} className="hidden lg:flex w-full h-[calc(100vh-96px)] top-24 items-center justify-center overflow-hidden">
                <div className="container mx-auto px-4 grid grid-cols-12 gap-16 items-center">
                    <div className="col-span-5">
                       <div key={activeIndex} className="animate-fade-in-up mr-10" >
                            <div className="flex items-center gap-4 mb-6">
                               <div className="p-3 bg-[var(--theme-primary)]/10 rounded-lg">
                                 <activeService.icon className="h-8 w-8 text-[var(--theme-primary)]" strokeWidth={1.5}/>
                               </div>
                               <h3 className="text-3xl font-bold text-[var(--text-primary)] font-[var(--primary-font)]">
                                   {activeService.title}
                               </h3>
                           </div>
                           <ul className="space-y-4">
                                {activeService.description.map((point, index) => (
                                     <li key={index} className="flex items-start text-lg text-[var(--text-secondary)] font-[var(--secondary-font)] leading-relaxed">
                                         <CheckCircle2 className="h-6 w-6 text-[var(--theme-primary)] mr-3 mt-1 flex-shrink-0" strokeWidth={1.5}/>
                                         <span>{point}</span>
                                     </li>
                                ))}
                           </ul>
                       </div>
                    </div>

                    <div className="col-span-7 h-[500px] w-full flex items-center justify-center" style={{ perspective: '3000px' }}>
                        <div ref={cubeRef} className="relative w-[350px] h-[440px]" style={{ transformStyle: 'preserve-3d' }}>
                           {servicesData.map((service, index) => (
                               <CubeFace key={index} service={service} faceRef={addToFaceRefs} />
                           ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden container mx-auto px-4 space-y-12">
                {servicesData.map((service, index) => (
                     <div key={index} className="mobile-card bg-[var(--white-color)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-lg">
                        <div className="h-64 w-full overflow-hidden">
                            <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover"/>
                        </div>
                        <div className="p-8">
                            <service.icon className="h-10 w-10 text-[var(--theme-primary)] mb-5" strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 font-[var(--primary-font)]">{service.title}</h3>
                            <ul className="space-y-3">
                               {service.description.map((point, i) => (
                                   <li key={i} className="flex items-start text-[var(--text-secondary)] leading-relaxed">
                                       <CheckCircle2 className="h-5 w-5 text-[var(--theme-primary)] mr-3 mt-1 flex-shrink-0" />
                                       <span>{point}</span>
                                   </li>
                               ))}
                            </ul>
                        </div>
                     </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out;
                }
            `}</style>
        </section>
    );
};

export default ServiceCategories;