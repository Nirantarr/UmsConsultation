import React from 'react';
import { ArrowRight } from 'lucide-react';

const ServiceCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-blue-700 text-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
          Ready to Transform Your University's Learning Experience?
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90">
          Partner with UniConsult and implement a state-of-the-art Learning Management System designed for modern education.
        </p>
        <button className="bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-bold py-3 px-8 rounded-full text-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center mx-auto">
          Request a Demo
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </section>
  );
};

export default ServiceCTA;
