    import React from 'react';
    import Navbar from '../components/Home/Navbar'; // Adjust path if needed
    import Footer from '../components/Home/Footer'; // Adjust path if needed
    import ContactHero from '../components/ContactHero';
    import ContactDetails from '../components/ContactDetails'; // Keep import
    import ContactForm from '../components/ContactForm';     // Keep import
    import ContactFAQ from '../components/ContactFAQ'; // NEW: Import ContactFAQ
    import UnifiedChat from '../components/chat/UnifiedChat';
    const Contact = () => {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <UnifiedChat/>
          <main className="flex-grow">
            <ContactHero />
            <ContactDetails />
            <ContactFAQ /> {/* NEW: Add ContactFAQ here, above ContactForm */}
            <ContactForm />
            {/* <ContactMap /> */}
          </main>
          <Footer />
        </div>
      );
    };

    export default Contact;
