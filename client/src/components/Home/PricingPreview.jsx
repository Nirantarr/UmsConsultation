import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const PricingPreview = () => {
  const pricingTiers = [
    {
      name: 'Student Basic',
      price: 'Free',
      duration: 'for current students',
      features: [
        'Access to standard advisors',
        'Up to 3 consultations/month',
        'Basic scheduling features',
        'Email support',
      ],
      unavailableFeatures: [
        'Premium advisor access',
        'Priority scheduling',
        'Advanced analytics',
        'Dedicated support',
      ],
      buttonText: 'Get Started (Free)',
      buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-700',
    },
    {
      name: 'Student Premium',
      price: '$9.99',
      duration: 'per month',
      features: [
        'Access to standard & premium advisors',
        'Unlimited consultations',
        'Advanced scheduling features',
        'Priority email & chat support',
        'Personalized consultation reports',
      ],
      unavailableFeatures: [],
      buttonText: 'Upgrade to Premium',
      buttonClass: 'bg-purple-600 text-white hover:bg-purple-700',
      isPopular: true,
    },
    {
      name: 'Faculty/Staff Access',
      price: 'Contact Us',
      duration: 'for institutional rates',
      features: [
        'Dedicated department advisors',
        'Bulk scheduling options',
        'Integration with university systems',
        'On-demand workshops',
      ],
      unavailableFeatures: [],
      buttonText: 'Request Demo',
      buttonClass: 'bg-gray-700 text-white hover:bg-gray-800',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-6">
          Flexible Plans for Every Need
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Choose the plan that best suits your consultation requirements and unlock a world of expert guidance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-8 flex flex-col border-2 ${
                tier.isPopular ? 'border-indigo-600' : 'border-gray-200'
              } transform hover:scale-105 transition duration-300 ease-in-out`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {tier.name}
              </h3>
              <p className="text-gray-600 mb-6">
                <span className="text-4xl font-extrabold text-indigo-700">
                  {tier.price}
                </span>
                {tier.duration && <span className="text-xl font-medium"> {tier.duration}</span>}
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.unavailableFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-400 line-through">
                    <XCircle className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-md font-semibold text-lg shadow-md transition duration-300 ${tier.buttonClass}`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-12">
          *Custom solutions available for university departments and large groups.
        </p>
      </div>
    </section>
  );
};

export default PricingPreview;
