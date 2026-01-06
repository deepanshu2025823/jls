"use client";

import { useState, useEffect } from "react";

const services = [
  {
    id: 1,
    title: "City-to-city rides",
    description: "Your stress-free solution for long-distance rides with professional chauffeurs across the globe.",
    image: "/images/services/city-to-city.svg",
  },
  {
    id: 2,
    title: "Chauffeur hailing",
    description: "Enjoy the quality of a traditional chauffeur, with the convenience of riding within minutes of booking.",
    image: "/images/services/chauffeur.svg",
  },
  {
    id: 3,
    title: "Airport transfers",
    description: "With additional wait time and flight tracking in case of delays, our service is optimized to make every airport transfer.",
    image: "/images/services/airport.svg",
  },
  {
    id: 4,
    title: "Hourly and full day hire",
    description: "For by-the-hour bookings or daily hire, choose one of our tailored services for total flexibility and comfort.",
    image: "/images/services/hourly.svg",
  },
  {
    id: 5,
    title: "City-to-city rides",
    description: "Your stress-free solution for long-distance rides with professional chauffeurs across the globe.",
    image: "/images/services/city-to-city.svg",
  },
  {
    id: 6,
    title: "Chauffeur hailing",
    description: "Enjoy the quality of a traditional chauffeur, with the convenience of riding within minutes of booking.",
    image: "/images/services/chauffeur.svg",
  },
  {
    id: 7,
    title: "Airport transfers",
    description: "With additional wait time and flight tracking in case of delays, our service is optimized to make every airport transfer.",
    image: "/images/services/airport.svg",
  },
  {
    id: 8,
    title: "Hourly and full day hire",
    description: "For by-the-hour bookings or daily hire, choose one of our tailored services for total flexibility and comfort.",
    image: "/images/services/hourly.svg",
  },
];

export default function ServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4); // Default to desktop
  const [mounted, setMounted] = useState(false);

  // ✅ Handle resize in useEffect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    const getItemsPerSlide = () => {
      if (window.innerWidth < 640) return 1; 
      if (window.innerWidth < 1024) return 2;
      return 4; 
    };

    // Set initial value
    setItemsPerSlide(getItemsPerSlide());

    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, services.length - itemsPerSlide);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // ✅ Prevent hydration mismatch by rendering consistent content first
  if (!mounted) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Services</h2>
          </div>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Services</h2>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            
            <button className="hidden sm:flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
              <span className="font-medium text-sm lg:text-base">View All</span>
              <svg
                className="w-4 h-4 lg:w-5 lg:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden pb-10">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerSlide}%)`,
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-2 sm:px-3"
                style={{ minWidth: `${100 / itemsPerSlide}%` }}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full">
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden bg-gray-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <button className="flex items-center gap-2 text-black font-medium hover:gap-3 transition-all text-sm sm:text-base">
                      <span>Read More</span>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="sm:hidden mt-6">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
            <span className="font-medium">View All Services</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}