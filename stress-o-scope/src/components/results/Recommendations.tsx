'use client';

import React from 'react';

interface RecommendationsProps {
  recommendationsList: string[];
}

// A simple star icon for recommendations
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 text-star-gold mr-3 flex-shrink-0"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.338.95 4.852 4.21-2.294 4.21 2.294.95-4.852-3.423-3.338-4.753-.39L10.868 2.884zM10 15.003a.997.997 0 00.868-.499l1.83-4.401c.1-.244.398-.401.686-.42l4.753-.39-3.423-3.338a.998.998 0 00-.286-.732l.95-4.852-4.21 2.294a1 1 0 00-.932 0l-4.21-2.294.95 4.852c.095.488-.078.99-.451 1.318L2.153 9.3l4.753.39c.288.019.586.176.686.42l1.83 4.401A.997.997 0 0010 15.003z"
      clipRule="evenodd"
    />
  </svg>
);


const Recommendations: React.FC<RecommendationsProps> = ({ recommendationsList }) => {
  if (!recommendationsList || recommendationsList.length === 0) {
    return (
      <div className="p-6 bg-deep-space/50 rounded-xl shadow-xl animate-fadeIn mt-8">
        <h3 className="text-2xl font-bold text-star-gold mb-4">Personalized Recommendations</h3>
        <p className="text-gray-300">No specific recommendations available at this time. Try to maintain a balanced routine.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-deep-space/50 rounded-xl shadow-xl animate-fadeIn mt-8">
      <h3 className="text-2xl font-bold text-star-gold mb-6">Personalized Recommendations</h3>
      <ul className="space-y-4">
        {recommendationsList.map((rec, index) => (
          <li key={index} className="flex items-start p-4 bg-cosmic-blue/30 rounded-lg shadow">
            <StarIcon />
            <span className="text-gray-200 text-sm sm:text-base leading-relaxed">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
