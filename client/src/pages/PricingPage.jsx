import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// --- FIX IS HERE: Imported the correctly named icon ---
import { CheckCircleIcon, ChevronDownIcon, AcademicCapIcon, ShieldCheckIcon, UserGroupIcon, LifebuoyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Home/Navbar';
import UnifiedChat from '../components/chat/UnifiedChat';
gsap.registerPlugin(ScrollTrigger);

// --- Child Component: Themed Feature Card for "All Plans Include" ---
const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="feature-card relative p-8 bg-white/50 backdrop-blur-md rounded-2xl border border-white/50 h-full text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-[var(--theme-primary)] text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[var(--shadow-color)]">
            <Icon className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-[var(--text-primary)] font-[var(--primary-font)] mb-2">{title}</h4>
        <p className="text-[var(--text-secondary)] font-[var(--secondary-font)] text-sm flex-grow">{description}</p>
    </div>
);


const PricingPage = () => {
    const componentRef = useRef(null);
    const proFeaturesRef = useRef(null);
    const [sliderValue, setSliderValue] = useState(500);
    const [price, setPrice] = useState(0);
    const [activePlan, setActivePlan] = useState('Basic');
    const [openFaq, setOpenFaq] = useState(null);
    const priceRef = useRef({ value: 0 });

    const plans = [
        { name: 'Basic', userLimit: 1000, pricePerUser: 5, basePrice: 100 },
        { name: 'Pro', userLimit: 5000, pricePerUser: 4, basePrice: 500 },
        { name: 'Enterprise', userLimit: 10001, pricePerUser: 0, basePrice: 0 },
    ];

    useEffect(() => {
        let currentPlan = 'Basic';
        if (sliderValue > plans[0].userLimit) currentPlan = 'Pro';
        if (sliderValue >= plans[1].userLimit) currentPlan = 'Enterprise';
        setActivePlan(currentPlan);
        
        const plan = plans.find(p => p.name === currentPlan);
        if (plan && currentPlan !== 'Enterprise') {
            const newPrice = plan.basePrice + (sliderValue * plan.pricePerUser);
            gsap.to(priceRef.current, {
                value: newPrice,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: () => setPrice(Math.round(priceRef.current.value))
            });
        }
    }, [sliderValue]);
    
    useEffect(() => {
        const proFeatures = proFeaturesRef.current.children;
        gsap.to(proFeatures, {
            autoAlpha: (activePlan === 'Pro' || activePlan === 'Enterprise') ? 1 : 0,
            y: (activePlan === 'Pro' || activePlan === 'Enterprise') ? 0 : -10,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.out'
        });
    }, [activePlan]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-content *", { autoAlpha: 0, y: 40, stagger: 0.2, duration: 1, ease: 'power3.out' });
            gsap.from(".pricing-calculator", { autoAlpha: 0, scale: 0.95, duration: 1.2, ease: 'power3.out', delay: 0.3 });
            
            const featureCards = gsap.utils.toArray(".feature-card");
            gsap.from(featureCards, {
                autoAlpha: 0, y: 50, scale: 0.9, stagger: 0.1,
                scrollTrigger: { trigger: ".all-plans-grid", start: "top 80%" }
            });

            gsap.to('.feature-spotlight', {
                y: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.all-plans-grid',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            })
            
            gsap.from(".cta-section .container", {
                autoAlpha: 0, y: 50, duration: 1,
                scrollTrigger: { trigger: ".cta-section", start: "top 80%" }
            });
        }, componentRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={componentRef}>
             <style>{`
                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animated-gradient {
                    background: linear-gradient(-45deg, var(--theme-primary), var(--theme-accent), var(--theme-primary), var(--theme-accent));
                    background-size: 400% 400%;
                    animation: gradient-animation 15s ease infinite;
                }
                input[type=range]::-webkit-slider-thumb { background-color: var(--theme-primary); }
                input[type=range]::-moz-range-thumb { background-color: var(--theme-primary); }
            `}</style>
            <Navbar />
            <UnifiedChat />
            <main>
                <section className="hero-section text-center py-20 lg:py-28 relative overflow-hidden animated-gradient">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="container mx-auto px-6 hero-content relative z-10">
                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white font-[var(--primary-font)] py-10">
                            Clear Pricing, Powerful Results
                        </h1>
                        <p className="mt-4 text-lg lg:text-xl max-w-3xl mx-auto text-white/80 font-[var(--secondary-font)]">
                            Find the perfect plan for your institution. No hidden fees, no surprises. Just scalable solutions for your success.
                        </p>
                    </div>
                </section>
                
                <section className="pricing-calculator-section py-20 lg:py-24 relative bg-[var(--light-bg-color)]">
                    <div className="container mx-auto px-6">
                        <div className="pricing-calculator bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-[var(--shadow-color)] p-8 lg:p-12 border border-white/50">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <label htmlFor="user-slider" className="font-bold text-s font-[var(--secondary-font)] text-[var(--text-primary)]">Number of Learners</label>
                                        <span className="text-2xl font-bold text-[var(--theme-primary)] px-2 py-2 rounded-lg">{sliderValue.toLocaleString()}</span>
                                    </div>
                                    <input id="user-slider" type="range" min="100" max="10000" step="100" value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))}
                                        className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer" />
                                    <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2"><span>100</span><span>10,000+</span></div>

                                    <div className="mt-10 text-center lg:text-left bg-white/50 p-6 rounded-lg">
                                        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Plan Tier: <span className="font-bold text-[var(--theme-primary)]">{activePlan}</span></p>
                                        <div className="flex items-baseline justify-center lg:justify-start mt-2">
                                            <p className="text-5xl font-bold text-[var(--text-primary)]">
                                                {activePlan === 'Enterprise' ? 'Custom' : `$${price.toLocaleString()}`}
                                            </p>
                                            {activePlan !== 'Enterprise' && <p className="ml-2 text-lg text-[var(--text-secondary)]">/ month</p>}
                                        </div>
                                         <a href="/signup" className="mt-6 inline-flex items-center justify-center font-bold text-lg text-white rounded-lg bg-[var(--theme-primary)] transition-transform duration-300 hover:scale-105 shadow-lg shadow-[var(--shadow-hover)] px-8 py-3">
                                            Get Started <ArrowRightIcon className="w-5 h-5 ml-2" /> {/* --- FIX IS HERE --- */}
                                        </a>
                                    </div>
                                </div>

                                <div className="border-t lg:border-t-0 lg:border-l border-[var(--border-color)]/80 pt-8 lg:pt-0 lg:pl-12">
                                    <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)] font-[var(--primary-font)]">Key Features:</h3>
                                    <ul className="space-y-4 text-[var(--text-secondary)] font-[var(--secondary-font)]">
                                        <li className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-[var(--theme-accent)] mr-3 mt-1 flex-shrink-0" /><p><span className="font-semibold text-[var(--text-primary)]">Core LMS Platform:</span> Course creation, user management, and reporting.</p></li>
                                        <li className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-[var(--theme-accent)] mr-3 mt-1 flex-shrink-0" /><p><span className="font-semibold text-[var(--text-primary)]">Standard Support:</span> Access to knowledge base and email support.</p></li>
                                        <li className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-[var(--theme-accent)] mr-3 mt-1 flex-shrink-0" /><p><span className="font-semibold text-[var(--text-primary)]">Secure Cloud Hosting:</span> Reliable and secure hosting environment.</p></li>
                                    </ul>
                                    <div ref={proFeaturesRef} className="mt-4 space-y-4 font-[var(--secondary-font)]">
                                        <li className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-[var(--theme-primary)] mr-3 mt-1 flex-shrink-0" /><p><span className="font-semibold text-[var(--theme-primary)]">Advanced Analytics:</span> Deep insights into learner engagement.</p></li>
                                        <li className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-[var(--theme-primary)] mr-3 mt-1 flex-shrink-0" /><p><span className="font-semibold text-[var(--theme-primary)]">API Access & Integrations:</span> Connect your LMS with other essential tools.</p></li>
                                        <li className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-[var(--theme-primary)] mr-3 mt-1 flex-shrink-0" /><p><span className="font-semibold text-[var(--theme-primary)]">Dedicated Account Manager:</span> Priority support and strategic guidance.</p></li>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="all-plans-section py-20 lg:py-28 relative overflow-hidden bg-[var(--light-bg-color)]">
                    <div className="feature-spotlight absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-1/2 bg-gradient-to-t from-[var(--theme-primary)]/10 via-[var(--theme-primary)]/5 to-transparent -z-0" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 font-[var(--primary-font)]">All Plans Include</h2>
                            <p className="text-lg text-[var(--text-secondary)] font-[var(--secondary-font)]">Every partnership with UniConsult is built on a foundation of quality and support. The following features come standard with every plan.</p>
                        </div>
                        <div className="all-plans-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard icon={AcademicCapIcon} title="Expert Onboarding" description="We'll guide you through every step of the setup process." />
                            <FeatureCard icon={ShieldCheckIcon} title="Top-Tier Security" description="Data encryption and compliance standards come standard." />
                            <FeatureCard icon={UserGroupIcon} title="Unlimited Admins" description="Empower your entire team to manage your learning programs." />
                            <FeatureCard icon={LifebuoyIcon} title="Reliable Support" description="Our friendly support team is always here to help you succeed." />
                        </div>
                    </div>
                </section>
                
                {/* --- Your existing CTA section --- */}
            </main>
        </div>
    );
};

export default PricingPage;