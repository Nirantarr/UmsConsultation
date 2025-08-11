import React, { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Child Component: The refined Contact Card ---
const ContactCard = ({ icon: Icon, title, description, link, linkText }) => (
    <div className="contact-card relative p-1 rounded-2xl group">
        {/* The shimmering aurora border that appears on hover */}
        <div className="aurora absolute inset-[-1px] rounded-[inherit] transition-opacity duration-500 opacity-0 group-hover:opacity-100">
            <div className="aurora-inner" />
        </div>
        
        <div className="relative h-full bg-[var(--white-color)] rounded-[14px] p-8 text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] rounded-2xl mb-6">
                <Icon className="h-10 w-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 font-[var(--primary-font)]">
                {title}
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed font-[var(--secondary-font)] mb-4 flex-grow">
                {description}
            </p>
            <a href={link} className="font-bold text-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition duration-200 font-[var(--secondary-font)] mt-auto">
                {linkText}
            </a>
        </div>
    </div>
);


const ContactDetails = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    const contactData = [
      { icon: Mail, title: 'Email Us', description: 'For general inquiries and support, send us an email.', link: 'mailto:info@uniconsult.com', linkText: 'info@uniconsult.com' },
      { icon: Phone, title: 'Call Us', description: 'Speak directly with our team during business hours.', link: 'tel:+1234567890', linkText: '+1 (234) 567-890' },
      { icon: MapPin, title: 'Visit Our Office', description: 'Find us at our main office location.', link: 'https://maps.google.com/?q=University+Campus,+City,+Country', linkText: 'University Campus, City, Country' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(gsap.utils.toArray('.contact-card'), {
                autoAlpha: 0,
                y: 50,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-28 bg-[var(--light-bg-color)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 font-[var(--primary-font)]">
                        Reach Out to Our Team
                    </h2>
                </div>
                
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto group">
                    {contactData.map((item, index) => (
                        <ContactCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            link={item.link}
                            linkText={item.linkText}
                        />
                    ))}
                </div>
            </div>
            <GlobalStyles />
        </section>
    );
};

// --- Global Styles for the Aurora Border effect ---
const GlobalStyles = () => (
    <style jsx global>{`
        @property --aurora-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
        }

        @keyframes aurora-spin {
            to {
                --aurora-angle: 360deg;
            }
        }
        
        .aurora {
            position: absolute;
            inset: -2px; /* Controls the thickness of the border glow */
            border-radius: inherit;
            overflow: hidden;
            filter: blur(8px); /* Softens the gradient */
        }

        .aurora-inner {
            width: 200%;
            height: 200%;
            background: conic-gradient(
                from var(--aurora-angle),
                var(--theme-accent),
                var(--theme-primary),
                var(--theme-accent)
            );
            animation: aurora-spin 6s linear infinite;
        }

        .contact-card {
            transition: transform 0.3s ease;
        }
        .contact-card:hover {
            transform: scale(1.03);
        }
    `}</style>
);


export default ContactDetails;