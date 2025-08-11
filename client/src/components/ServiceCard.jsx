import React from 'react';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, link }) => {
  return (
    <a href={link} className="block"> {/* Make the entire card clickable */}
      <div className="bg-[var(--white-color)] rounded-xl shadow-lg p-7 text-center flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out border border-[var(--border-color)] h-full">
        <div className="flex justify-center mb-6">
          <Icon className="h-16 w-16 text-[var(--theme-primary)] group-hover:text-[var(--theme-secondary)] transition duration-300" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3 font-[var(--primary-font)]">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base mb-4 flex-grow font-[var(--secondary-font)]">
          {description}
        </p>
        <div className="text-[var(--theme-primary)] flex items-center justify-center font-semibold hover:underline mt-auto">
          Learn More <ArrowRight className="h-4 w-4 ml-2" />
        </div>
      </div>
    </a>
  );
};

export default ServiceCard;
