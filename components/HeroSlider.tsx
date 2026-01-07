"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    image: "/images/hero/01.svg",
    title: "Rent Your Ride, Anytime, Anywhere!",
    desc: "Discover the ease of car rentals designed to fit your lifestyle. Whether you're planning a quick city drive, a weekend getaway, or a long-term journey.",
  },
  {
    image: "/images/hero/01.svg",
    title: "Luxury Chauffeur Services",
    desc: "Premium chauffeur-driven experiences with comfort, reliability and style wherever you go.",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + slides.length) % slides.length);
  const next = () => setIndex((index + 1) % slides.length);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <Image
        src={slides[index].image}
        alt="Hero"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col">
        
        {/* Spacer to push content below header */}
        <div className="h-24 sm:h-28 md:h-32 flex-shrink-0" />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-end pb-4">
          
          {/* Content Grid - Above Search Card */}
          <div className="mb-[500px] sm:mb-[450px] md:mb-[200px] lg:mb-[180px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* LEFT: HEADING */}
              <div>
                <h1 className="text-white font-bold leading-tight text-[28px] sm:text-3xl md:text-4xl lg:text-[42px] max-w-2xl">
                  {slides[index].title}
                </h1>
              </div>

              {/* RIGHT: PARAGRAPH + ARROWS */}
              <div>
                <p className="text-white/90 font-medium leading-relaxed text-sm sm:text-base lg:text-lg max-w-xl mb-4">
                  {slides[index].desc}
                </p>

                {/* SLIDER ARROWS */}
                <div className="flex gap-3">
                  <button
                    onClick={prev}
                    aria-label="Previous slide"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 text-white flex items-center justify-center transition text-2xl font-light touch-manipulation"
                  >
                    ‹
                  </button>

                  <button
                    onClick={next}
                    aria-label="Next slide"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 text-white flex items-center justify-center transition text-2xl font-light touch-manipulation"
                  >
                    ›
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}