import React, { useEffect, useRef } from 'react'; // <--- THIS LINE IS NOW FIXED
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

// --- INNOVATIVE CHILD COMPONENT: The Interactive Particle Field ---
const InteractiveParticleField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const primaryColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary-rgb').trim();
        const accentColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent-rgb').trim();

        let width, height, particles;
        const numParticles = 300;
        const connectRadius = 100;
        
        const mouse = { x: undefined, y: undefined, radius: 150 };

        const setCanvasSize = () => {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2 + 1;
                this.density = (Math.random() * 30) + 1;
                this.vx = Math.random() * 1 - 0.5;
                this.vy = Math.random() * 1 - 0.5;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const distToMouse = Math.sqrt((this.x - mouse.x)**2 + (this.y - mouse.y)**2);
                
                if (distToMouse < mouse.radius) {
                    ctx.fillStyle = `rgba(${accentColorRGB}, 0.8)`;
                } else {
                    ctx.fillStyle = `rgba(${primaryColorRGB}, 0.5)`;
                }
                ctx.fill();
            }
            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const forceDirX = dx / dist;
                const forceDirY = dy / dist;
                const maxDist = mouse.radius;
                const force = (maxDist - dist) / maxDist;
                
                if (dist < maxDist) {
                    this.x -= forceDirX * force * this.density * 0.5;
                    this.y -= forceDirY * force * this.density * 0.5;
                } else {
                    if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 20; }
                    if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 20; }
                    this.x += this.vx * 0.1;
                    this.y += this.vy * 0.1;
                }
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                this.draw();
            }
        }

        const init = () => {
            setCanvasSize();
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dist = Math.sqrt(
                        (particles[a].x - particles[b].x)**2 + (particles[b].y - particles[a].y)**2
                    );
                    if (dist < connectRadius) {
                        const distToMouseA = Math.sqrt((particles[a].x - mouse.x)**2 + (particles[a].y - mouse.y)**2);
                        const distToMouseB = Math.sqrt((particles[b].x - mouse.x)**2 + (particles[b].y - mouse.y)**2);
                        const opacity = 1 - (dist / connectRadius);
                        if (distToMouseA < mouse.radius || distToMouseB < mouse.radius) {
                            ctx.strokeStyle = `rgba(${accentColorRGB}, ${opacity * 0.8})`;
                            ctx.lineWidth = 1.5;
                        } else {
                            ctx.strokeStyle = `rgba(${primaryColorRGB}, ${opacity * 0.3})`;
                            ctx.lineWidth = 1;
                        }
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => p.update());
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const handleMouseLeave = () => { mouse.x = undefined; mouse.y = undefined; };
        
        window.addEventListener('resize', init);
        canvas.parentElement.addEventListener('mousemove', handleMouseMove);
        canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
        
        init();
        animate();

        return () => {
            window.removeEventListener('resize', init);
            if (canvas.parentElement) {
                canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
                canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />;
};

// --- Main Services Hero Component ---
const ServicesHero = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const subheadingRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: "play none none reverse" } })
                .from(headingRef.current.children, { yPercent: 100, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power3.out' }, 0.5)
                .from(subheadingRef.current, { y: 30, autoAlpha: 0, duration: 1, ease: 'power3.out' }, '-=0.7')
                .from(buttonRef.current, { scale: 0.8, autoAlpha: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.7');
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-[var(--dark-bg-color)] text-[var(--text-on-dark)] py-24 md:py-32 relative overflow-hidden h-screen flex items-center justify-center">
            
            <InteractiveParticleField />
            
            <div className="container mx-auto px-4 text-center relative z-10">
                <h1 ref={headingRef} className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 font-[var(--primary-font)]">
                    <div style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
                        <span className="block">Unlock Academic Excellence</span>
                    </div>
                    <div style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
                        <span className="block">with Our <span className="text-[var(--theme-accent)]">Unified LMS</span></span>
                    </div>
                </h1>
                <p ref={subheadingRef} className="text-lg md:text-2xl max-w-4xl mx-auto mb-10 text-[var(--text-on-dark)]/80 font-[var(--secondary-font)]">
                    A comprehensive Learning Management System designed to centralize, streamline, and elevate every aspect of university education and administration.
                </p>
                <div ref={buttonRef}>
                    <a href="/contact" className="inline-flex items-center justify-center px-10 py-4 font-bold text-lg text-[var(--theme-primary)] bg-[var(--white-color)] rounded-lg
                                                     transition-all duration-300 ease-in-out
                                                     hover:scale-105 hover:bg-opacity-90 hover:shadow-2xl hover:shadow-[var(--shadow-hover)]">
                        Request a Personalized Demo
                        <ArrowRight className="h-5 w-5 ml-3" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ServicesHero;