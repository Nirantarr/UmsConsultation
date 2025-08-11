import React from 'react';

const Footer = () => {
  return (
    <footer className="py-10 bg-[var(--text-primary)] text-[var(--text-on-dark)] font-[var(--secondary-font)]">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4">
          UniConsult: Empowering Education Through Innovation.
        </p>
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} UniConsult. All rights reserved.
        </p>
        <div className="mt-4 text-sm">
          <a href="/privacy-policy" className="hover:underline mx-2">Privacy Policy</a>
          <span className="mx-1">|</span>
          <a href="/terms-of-service" className="hover:underline mx-2">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
