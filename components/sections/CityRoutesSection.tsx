"use client";

import { useState } from "react";

const topCities = [
  {
    id: 1,
    name: "New York",
    routes: "21 routes to/from this city",
    image: "/images/cities/newyork.svg",
  },
  {
    id: 2,
    name: "Los Angeles",
    routes: "16 routes to/from this city",
    image: "/images/cities/losangeles.svg",
  },
  {
    id: 3,
    name: "Chicago",
    routes: "32 routes to/from this city",
    image: "/images/cities/chicago.svg",
  },
  {
    id: 4,
    name: "Houston",
    routes: "28 routes to/from this city",
    image: "/images/cities/houston.svg",
  },
];

const topRoutes = [
  {
    id: 1,
    from: "New York",
    to: "Philadelphia",
    duration: "1h 50m",
    distance: "20 Miles",
  },
  {
    id: 2,
    from: "London",
    to: "Oxford",
    duration: "1h 50m",
    distance: "20 Miles",
  },
  {
    id: 3,
    from: "Paris",
    to: "Reims",
    duration: "1h 50m",
    distance: "20 Miles",
  },
  {
    id: 4,
    from: "Manchester",
    to: "Liverpool",
    duration: "1h 50m",
    distance: "20 Miles",
  },
];

export default function CityRoutesSection() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);

  const handleCityPrev = () => {
    setCurrentCityIndex((prev) => (prev === 0 ? topCities.length - 1 : prev - 1));
  };

  const handleCityNext = () => {
    setCurrentCityIndex((prev) => (prev === topCities.length - 1 ? 0 : prev + 1));
  };

  const handleRoutePrev = () => {
    setCurrentRouteIndex((prev) => (prev === 0 ? topRoutes.length - 1 : prev - 1));
  };

  const handleRouteNext = () => {
    setCurrentRouteIndex((prev) => (prev === topRoutes.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            City to city routes
          </h2>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={handleCityPrev}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <svg
                className="w-5 h-5 text-gray-700"
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
              onClick={handleCityNext}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <svg
                className="w-5 h-5 text-gray-700"
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
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
              <span className="font-medium">View All</span>
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Top Cities */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Top cities
              </h3>
              
              {/* Mobile Navigation for Cities */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  onClick={handleCityPrev}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Previous city"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
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
                  onClick={handleCityNext}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Next city"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
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
              </div>
            </div>

            {/* Cities List - Desktop */}
            <div className="hidden lg:block space-y-4">
              {topCities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                      {city.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">{city.routes}</p>
                    <button className="flex items-center gap-2 text-black font-medium mt-2 hover:gap-3 transition-all text-xs sm:text-sm">
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
              ))}
            </div>

            {/* Cities Carousel - Mobile */}
            <div className="lg:hidden">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentCityIndex * 100}%)` }}
                >
                  {topCities.map((city) => (
                    <div
                      key={city.id}
                      className="w-full flex-shrink-0"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 p-4 bg-white rounded-2xl shadow-md">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={city.image}
                            alt={city.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            {city.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">{city.routes}</p>
                          <button className="flex items-center gap-2 text-black font-medium hover:gap-3 transition-all text-xs sm:text-sm">
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
              <div className="flex justify-center items-center gap-2 mt-4">
                {topCities.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCityIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentCityIndex === idx ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Go to city ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Top Routes */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Top routes
              </h3>
              
              {/* Mobile Navigation for Routes */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  onClick={handleRoutePrev}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Previous route"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
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
                  onClick={handleRouteNext}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Next route"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
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
              </div>
            </div>

            {/* Routes List - Desktop */}
            <div className="hidden lg:block space-y-4">
              {topRoutes.map((route) => (
                <div
                  key={route.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 bg-white rounded-2xl hover:shadow-lg transition-all cursor-pointer group border border-gray-200"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate">
                      {route.from} → {route.to}
                    </h4>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span>{route.duration}</span>
                      <span>•</span>
                      <span>{route.distance}</span>
                    </div>
                  </div>

                  <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2">
                    <span>Book Now</span>
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
              ))}
            </div>

            {/* Routes Carousel - Mobile */}
            <div className="lg:hidden">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentRouteIndex * 100}%)` }}
                >
                  {topRoutes.map((route) => (
                    <div
                      key={route.id}
                      className="w-full flex-shrink-0"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 p-4 bg-white rounded-2xl shadow-md border border-gray-200">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                            {route.from} → {route.to}
                          </h4>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                            <span>{route.duration}</span>
                            <span>•</span>
                            <span>{route.distance}</span>
                          </div>
                          <button className="w-full px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2">
                            <span>Book Now</span>
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
              <div className="flex justify-center items-center gap-2 mt-4">
                {topRoutes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentRouteIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentRouteIndex === idx ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Go to route ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="lg:hidden mt-8">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
            <span className="font-medium">View All Routes</span>
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