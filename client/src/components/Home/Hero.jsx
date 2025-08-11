import React, { useRef, useEffect } from 'react';

// --- Particle Canvas (Updated with Accent Theme Colors) ---
const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null, radius: 100 };
        // --- THEME UPDATE: Use the vibrant ACCENT color for particles ---
        const themeAccentRGB = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent-rgb').trim() || '73, 198, 229';

        const setCanvasSize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        };
        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };
        const handleMouseLeave = () => { mouse.x = null; mouse.y = null; };
        window.addEventListener('resize', setCanvasSize);
        if (canvas.parentElement) {
            canvas.parentElement.addEventListener('mousemove', handleMouseMove);
            canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
        }
        class Particle {
            constructor(x, y, directionX, directionY, size) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                // --- THEME UPDATE: Use accent color and slightly higher opacity ---
                ctx.fillStyle = `rgba(${themeAccentRGB}, 0.4)`; 
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if(distance < mouse.radius + this.size){
                    if(mouse.x < this.x && this.x < canvas.width - this.size * 10){ this.x += 3; }
                    if(mouse.x > this.x && this.x > this.size * 10){ this.x -= 3; }
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }
        const init = () => {
            setCanvasSize();
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .5) - .25;
                let directionY = (Math.random() * .5) - .25;
                particles.push(new Particle(x, y, directionX, directionY, size));
            }
        };
        const connect = () => {
            let opacityValue = 1;
            for(let a=0; a < particles.length; a++){
                for(let b = a; b < particles.length; b++){
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if(distance < (canvas.width/7) * (canvas.height/7)){
                        opacityValue = 1 - (distance/20000);
                        // --- THEME UPDATE: Use accent color and slightly higher opacity for lines ---
                        ctx.strokeStyle = `rgba(${themeAccentRGB}, ${opacityValue * 0.3})`; 
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connect();
        };
        init();
        animate();
        return () => {
            window.removeEventListener('resize', setCanvasSize);
            if (canvas.parentElement) {
                canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
                canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

const PlusShape = ({ className }) => (
    <svg className={`absolute w-5 h-5 text-[var(--border-color)] ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

// --- Main Hero Component ---
const Hero = () => {
    // --- REMOVED: Modal state and handlers are no longer needed ---
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const handleOpenModal = () => setIsModalOpen(true);
    // const handleCloseModal = () => setIsModalOpen(false);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[var(--light-bg-color)]">
            
            <ParticleCanvas />
            
            <div className="absolute inset-0">
                <PlusShape className="top-[15%] left-[10%]" />
                <PlusShape className="top-[25%] right-[15%]" />
                <PlusShape className="bottom-[30%] left-[20%]" />
                <PlusShape className="bottom-[20%] right-[10%]" />
            </div>

            <div className="relative container mx-auto px-4 text-center">
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold leading-tight mb-4
                               text-[var(--text-primary)] font-[var(--primary-font)]">
                    Future-Proof Your University with a <span className="text-[var(--theme-primary)]">Unified LMS</span>
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto mb-10 
                             text-[var(--text-secondary)] font-[var(--secondary-font)]">
                    Revolutionize learning and administration with our intelligent platform, designed for unparalleled efficiency and student success.
                </p>

                <div>
                    {/* --- UPDATED: This is now an anchor tag that redirects to the AboutUs page --- */}
                    <a 
                        href="/contact"
                        className="inline-block text-lg px-12 py-4 font-bold rounded-lg 
                                   border-2 border-[var(--theme-primary)] text-[var(--theme-primary)]
                                   transform transition-all duration-300 ease-in-out
                                   hover:bg-[var(--theme-primary)] hover:text-white hover:scale-105">
                        Request a Free Demo
                    </a>
                </div>
            </div>
            
            {/* --- REMOVED: Modal JSX is no longer needed --- */}

        </section>
    );
};

export default Hero;

