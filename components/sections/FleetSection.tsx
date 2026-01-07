"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

const fleetTypes = [
  {
    id: 1,
    name: "SUV",
    description: "Acura MDX, Lexus RX, BMW X5",
    image: "/images/fleet/01.svg",
  },
  {
    id: 2,
    name: "Premium SUV",
    description: "Mercedes E-Class, Lexus ES, Cadillac CT6, or similar.",
    image: "/images/fleet/02.svg",
  },
  {
    id: 3,
    name: "Luxury Sedan",
    description: "Cadillac Escalade, Range Rover, or similar.",
    image: "/images/fleet/03.svg",
  },
];

export default function FleetSection() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
            Browse by fleet types
          </h2>
          <button
            onClick={() => router.push("/fleet")}
            className="w-14 h-14 flex items-center justify-center border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300"
            aria-label="View more fleet types"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </button>
        </div>

        {/* Fleet Cards - Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth lg:grid lg:grid-cols-3 lg:overflow-visible"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ userSelect: isDragging ? 'none' : 'auto' }}
        >
          {fleetTypes.map((fleet) => (
            <div
              key={fleet.id}
              className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-200 flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-auto"
              onClick={(e) => {
                if (!isDragging) {
                  router.push(`/fleet/${fleet.id}`);
                }
              }}
            >
              {/* Image Container */}
              <div className="relative h-80 bg-gray-50 overflow-hidden flex items-center justify-center p-8">
                <Image
                  src={fleet.image}
                  alt={fleet.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Arrow Button */}
                <button 
                  className="absolute bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg z-10"
                  aria-label={`View ${fleet.name} details`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDragging) {
                      router.push(`/fleet/${fleet.id}`);
                    }
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {fleet.name}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {fleet.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}