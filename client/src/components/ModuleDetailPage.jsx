import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for better navigation
import { ArrowDown, Home } from 'lucide-react';
import Navbar from './Home/Navbar';
const ModuleDetailPage = ({ title, description, image, features, inActionImage }) => {
  return (
    <div className="bg-white font-sans text-slate-800">
      <Navbar />
      {/* 1. Innovative Hero Section with Parallax Effect */}
      <div 
        className="relative h-[80vh] min-h-[500px] bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col items-center justify-center text-center">
          <div className="text-white p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-2xl">{title}</h1>
            <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto drop-shadow-lg">{description}</p>
          </div>
          {/* Animated Scroll Down Indicator */}
          <div className="absolute bottom-10 animate-bounce">
            <ArrowDown className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </div>

      {/* 2. Introduction Section */}
      <div className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Transforming the Educational Experience</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Discover the key features that make the <span className="font-semibold text-[var(--theme-primary)]">{title}</span> module an indispensable tool for modern institutions.
          </p>
        </div>
      </div>
      
      {/* 3. Innovative Features Grid with Icons */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out"
            >
              <div className="mb-4 inline-block p-3 bg-[var(--theme-primary)] text-white rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. "In Action" Visual Section */}
      <div className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">See It In Action</h2>
          <img 
            src={inActionImage || image} 
            alt={`${title} in action`} 
            className="rounded-xl shadow-2xl mx-auto"
          />
        </div>
      </div>

      {/* 5. "Go Back Home" Call-to-Action Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <Home className="w-12 h-12 text-[var(--theme-primary)] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Explore Our Platform</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                You've seen one part of our powerful system. Return to the homepage to discover more or get in touch with our team.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-[var(--theme-primary)] text-white font-bold text-lg px-10 py-4 rounded-lg hover:bg-[var(--theme-secondary)] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;