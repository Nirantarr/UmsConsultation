import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Zap, Shield, TrendingUp, Users, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Child Component: The refined Benefit Orb ---
const BenefitOrb = ({ icon: Icon, title, description, onOrbClick, isSelected }) => {
    const orbRef = useRef(null);

    useEffect(() => {
        gsap.to(orbRef.current, {
            scale: isSelected ? 1.1 : 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }, [isSelected]);


    return (
        <div
            ref={orbRef}
            className="benefit-orb-container relative flex items-center justify-center"
            onClick={() => onOrbClick({ title, description, Icon })}
        >
            <div className="orb w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-2 border-[var(--border-color)] flex items-center justify-center text-center p-4 cursor-pointer transition-all duration-300">
                <div className="relative z-10">
                    <Icon className="h-8 w-8 md:h-10 md:w-10 text-[var(--theme-primary)] mx-auto mb-2" />
                    <h4 className="text-sm md:text-base font-bold text-[var(--text-primary)] font-[var(--primary-font)]">
                        {title}
                    </h4>
                </div>
            </div>
        </div>
    );
};

// --- Child Component: The Modal for Descriptions ---
const BenefitModal = ({ benefit, onClose }) => {
    if (!benefit) return null;

    const { Icon, title, description } = benefit;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
                <div className="text-center">
                    <Icon className="h-12 w-12 text-[var(--theme-primary)] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] font-[var(--primary-font)] mb-4">
                        {title}
                    </h3>
                    <p className="text-base text-[var(--text-secondary)] font-[var(--secondary-font)] leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};


const ServiceBenefits = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const [selectedBenefit, setSelectedBenefit] = useState(null);

    const benefitsData = [
      { id: 'b1', icon: CheckCircle, title: 'Seamless Centralization', description: 'Consolidate all academic resources, communications, and administrative tasks into one intuitive platform for unparalleled clarity and control.' },
      { id: 'b2', icon: Zap, title: 'Boosted Efficiency', description: 'Automate routine processes like attendance and grading, freeing up valuable time for faculty and staff to focus on education.' },
      { id: 'b3', icon: TrendingUp, title: 'Enhanced Engagement', description: 'Foster a more interactive, accessible, and data-driven learning environment, leading to improved student outcomes and satisfaction.' },
      { id: 'b4', icon: Shield, title: 'Uncompromised Security', description: 'Ensure all sensitive student and university data is protected with industry-leading security protocols and full compliance with data privacy laws.' },
      { id: 'b5', icon: Users, title: 'Empowered Collaboration', description: 'Facilitate richer interactions and seamless knowledge sharing among students, faculty, and administrators with integrated communication tools.' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(gsap.utils.toArray('.benefit-orb-container'), {
                autoAlpha: 0,
                y: 50,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: gridRef.current, start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleOrbClick = (benefit) => {
        setSelectedBenefit(benefit);
    };

    const handleCloseModal = () => {
        setSelectedBenefit(null);
    };

    return (
        <section ref={sectionRef} className="py-20 md:py-28 bg-[var(--light-bg-color)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 font-[var(--primary-font)]">
                        The UniConsult Advantage
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] font-[var(--secondary-font)]">
                        Our Unified LMS is a strategic asset designed to bring tangible benefits to your entire university ecosystem. Tap any benefit to learn more.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {benefitsData.map((benefit) => (
                        <BenefitOrb
                            key={benefit.id}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            onOrbClick={handleOrbClick}
                            isSelected={selectedBenefit?.id === benefit.id}
                        />
                    ))}
                </div>
            </div>
            <BenefitModal benefit={selectedBenefit} onClose={handleCloseModal} />
        </section>
    );
};

export default ServiceBenefits;