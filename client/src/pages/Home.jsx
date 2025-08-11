import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import individual Home page sections
import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import CoreLMSModules from '../components/CoreLMSModules'; // This replaces FeaturedConsultants
import HowItWorks from '../components/Home/HowItWorks';
import Testimonials from '../components/Home/Testimonials';
import CallToAction from '../components/Home/CallToAction';
import Footer from '../components/Home/Footer';
import UnifiedChat from '../components/chat/UnifiedChat';
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const mainRef = useRef(null); // This ref is for the overall main content area
  const fabRef = useRef(null);

  // GSAP animation for the Floating Action Button
  useEffect(() => {
    if (fabRef.current) {
      gsap.fromTo(
        fabRef.current,
        { scale: 0, opacity: 0, x: 50, y: 50 }, // Start from scaled down, transparent, slightly off-center
        {
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.7)", // Elastic bounce for a playful feel
          delay: 2 // Appear after hero animations
        }
      );

      // Subtle floating/pulsing animation
      gsap.to(fabRef.current, {
        y: -10,
        repeat: -1, // Repeat indefinitely
        yoyo: true, // Go back and forth
        ease: "sine.inOut",
        duration: 2
      });
    }
  }, []); // Run once on mount


  return (
    <div ref={mainRef} className="min-h-screen flex flex-col"> {/* Attach mainRef here */}
      <Navbar />
     <UnifiedChat/>
      <main className="flex-grow">
        <Hero />
        <Features />
        {/* Pass mainRef to CoreLMSModules for horizontal scroll calculation */}
        <CoreLMSModules mainRef={mainRef} /> 
        <HowItWorks />
        <Testimonials />
        {/* <PricingPreview /> */} {/* User requested to remove this section */}
        <CallToAction id="call-to-action-section" /> {/* Added ID for FAB scroll */}
      </main>
      <Footer />

    </div>
  );
};

export default Home;
