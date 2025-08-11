import React from 'react';
import Navbar from '../components/Home/Navbar'; // Assuming Navbar is in components/Home
import Footer from '../components/Home/Footer'; // Assuming Footer is in components/Home
import ServicesHero from '../components/ServicesHero';
import ServiceCategories from '../components/ServiceCategories';
import ServiceBenefits from '../components/ServiceBenefits';
import ServiceFAQ from '../components/ServiceFAQ';
import UnifiedChat from '../components/chat/UnifiedChat';
const Services = () => {
  return (
    // By adding "overflow-x-hidden" here, we ensure that any child component
    // that accidentally overflows the horizontal width of the screen will be clipped,
    // solving the "gap on the right side" issue on mobile without media queries.
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <UnifiedChat />
      <main className="flex-grow">
        <ServicesHero />
        <ServiceCategories />
        <ServiceBenefits />
        <ServiceFAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Services;