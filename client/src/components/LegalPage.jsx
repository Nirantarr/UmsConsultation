import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';

// Helper function to create URL-friendly slugs from headings
const createSlug = (text) => {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// A new component for the "Plain English" summary box
const SummaryBox = ({ points }) => (
  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-xl mb-12">
    <h3 className="font-bold text-xl mb-4 flex items-center">
      <ShieldCheck className="w-6 h-6 mr-3 text-blue-600" />
      In Plain English: The Key Takeaways
    </h3>
    <ul className="space-y-2 list-none pl-0">
      {points.map((point, index) => (
        <li key={index} className="flex items-start">
          <span className="text-blue-600 font-bold mr-2 mt-1">✓</span>
          <span className="flex-1">{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

const LegalPage = ({ title, effectiveDate, summaryPoints = [], children }) => {
  const [activeSlug, setActiveSlug] = useState('');
  const contentRef = useRef(null);
  const observer = useRef(null);

  // --- Group children into sections based on <h3> tags ---
  const sections = useMemo(() => {
    const sectionList = [];
    let currentSection = null;
    React.Children.forEach(children, child => {
      if (child.type === 'h3') {
        if (currentSection) sectionList.push(currentSection);
        const titleText = child.props.children;
        currentSection = {
          title: titleText,
          slug: createSlug(titleText),
          content: [],
        };
      } else if (currentSection) {
        currentSection.content.push(child);
      }
    });
    if (currentSection) sectionList.push(currentSection);
    return sectionList;
  }, [children]);

  // --- Scroll-spying logic to highlight active section in TOC ---
  useEffect(() => {
    const sectionElements = sections.map(s => document.getElementById(s.slug));
    
    observer.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveSlug(entry.target.id);
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sectionElements.forEach(el => {
        if (el) observer.current.observe(el);
    });

    return () => {
        sectionElements.forEach(el => {
            if (el) observer.current.unobserve(el);
        });
    };
  }, [sections]);

  return (
    <div className="bg-slate-50 font-sans">
      <div className="container mx-auto max-w-7xl py-16 px-4 md:py-24">
        
        <div className="bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white p-8 md:p-12 rounded-2xl shadow-2xl mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-md text-blue-100 mt-2">
                Last Updated: {effectiveDate}
            </p>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-3 mb-12 lg:mb-0">
            {/* --- ENHANCED SIDEBAR CONTAINER --- */}
            {/* The new styling is applied to this div */}
            <div className="lg:sticky lg:top-24 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-500" />
                On This Page
              </h3>
              <nav>
                <ul className="space-y-1">
                  {sections.map(section => (
                    <li key={section.slug}>
                      <a 
                        href={`#${section.slug}`}
                        className={`block p-2 rounded-md transition-all text-md font-medium ${
                          activeSlug === section.slug
                            ? 'bg-blue-100 text-[var(--theme-primary)]'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            {/* --- END OF ENHANCED SIDEBAR CONTAINER --- */}
          </aside>

          <main ref={contentRef} className="lg:col-span-9 space-y-8">
            {summaryPoints.length > 0 && <SummaryBox points={summaryPoints} />}
            
            {sections.map(section => (
                <div key={section.slug} id={section.slug} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 scroll-mt-24">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">{section.title}</h3>
                    <div className="prose prose-slate max-w-none lg:prose-lg 
                                    prose-p:leading-relaxed prose-li:my-1
                                    prose-a:text-[var(--theme-primary)] hover:prose-a:text-[var(--theme-secondary)]
                                    prose-li:marker:text-[var(--theme-primary)]">
                        {section.content}
                    </div>
                </div>
            ))}
          </main>
        </div>
        
        <div className="text-center mt-20 pt-16 border-t border-slate-200">
            <h2 className="text-3xl font-bold text-slate-800">Still have questions?</h2>
            <p className="text-slate-600 my-4 max-w-xl mx-auto">
                If you have any questions about our policies or how they apply to you, please don't hesitate to reach out to our team.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-[var(--theme-primary)] text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-[var(--theme-secondary)] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Support <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;