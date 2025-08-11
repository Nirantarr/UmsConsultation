import React from 'react';
import { Star, Briefcase, GraduationCap, MessageSquare } from 'lucide-react';

const FeaturedConsultants = () => {
  // Sample data for featured consultants
  const consultantsData = [
    {
      id: 1,
      name: 'Dr. Alice Chen',
      title: 'Professor of Computer Science',
      expertise: 'AI & Machine Learning, Data Structures',
      rating: 4.9,
      reviews: 128,
      imageUrl: 'https://placehold.co/150x150/A78BFA/FFFFFF?text=AC', // Placeholder image
      bio: 'Dr. Chen specializes in advanced AI algorithms and their applications in real-world problems. She is passionate about guiding students in cutting-edge research.',
    },
    {
      id: 2,
      name: 'Prof. Mark Davis',
      title: 'Head of Business Department',
      expertise: 'Strategic Management, Entrepreneurship',
      rating: 4.8,
      reviews: 95,
      imageUrl: 'https://placehold.co/150x150/6366F1/FFFFFF?text=MD', // Placeholder image
      bio: 'With over 20 years of experience, Prof. Davis offers invaluable insights into business strategy and launching successful ventures.',
    },
    {
      id: 3,
      name: 'Ms. Sarah Lee',
      title: 'Career Counselor',
      expertise: 'Career Development, Interview Prep',
      rating: 4.7,
      reviews: 210,
      imageUrl: 'https://placehold.co/150x150/8B5CF6/FFFFFF?text=SL', // Placeholder image
      bio: 'Sarah helps students navigate their career paths, from resume building to mock interviews and industry networking.',
    },
    {
      id: 4,
      name: 'Dr. Ben Carter',
      title: 'Research Fellow in Biology',
      expertise: 'Genetics, Biotechnology, Lab Techniques',
      rating: 4.9,
      reviews: 72,
      imageUrl: 'https://placehold.co/150x150/4F46E5/FFFFFF?text=BC', // Placeholder image
      bio: 'Dr. Carter provides comprehensive support for research projects, experimental design, and scientific writing.',
    },
     {
      id: 5,
      name: 'Ms. Emily White',
      title: 'Academic Writing Specialist',
      expertise: 'Essay Writing, Thesis Structure, Citation',
      rating: 4.8,
      reviews: 155,
      imageUrl: 'https://placehold.co/150x150/7C3AED/FFFFFF?text=EW', // Placeholder image
      bio: 'Emily helps students refine their academic writing skills, ensuring clarity, coherence, and adherence to academic standards.',
    },
    {
      id: 6,
      name: 'Prof. David Green',
      title: 'Professor of Economics',
      expertise: 'Microeconomics, Econometrics, Policy Analysis',
      rating: 4.7,
      reviews: 88,
      imageUrl: 'https://placehold.co/150x150/5B21B6/FFFFFF?text=DG', // Placeholder image
      bio: 'Prof. Green offers deep insights into economic theories and their practical applications, ideal for advanced students.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-12">
          Meet Our Featured Consultants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {consultantsData.map((consultant) => (
            <div
              key={consultant.id}
              className="bg-gray-50 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition duration-300 ease-in-out border border-gray-100"
            >
              {/* Consultant Image */}
              <img
                src={consultant.imageUrl}
                alt={consultant.name}
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-indigo-200 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/CCCCCC/000000?text=User'; }} // Fallback image
              />

              {/* Name and Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {consultant.name}
              </h3>
              <p className="text-indigo-600 font-medium mb-3">
                {consultant.title}
              </p>

              {/* Expertise */}
              <div className="flex items-center text-gray-700 text-sm mb-2">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <span>{consultant.expertise}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center text-gray-700 text-sm mb-4">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span>{consultant.rating} ({consultant.reviews} reviews)</span>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {consultant.bio}
              </p>

              {/* Call to Action Button */}
              <button className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full text-sm shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Book Session
              </button>
            </div>
          ))}
        </div>

        {/* Optional: View All Consultants Button */}
        <div className="text-center mt-16">
          <button className="bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-8 rounded-full text-lg transition duration-300">
            View All Consultants
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedConsultants;
