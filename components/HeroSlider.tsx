"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    image: "/images/hero/01.svg",
    title: "Rent Your Ride, Anytime, Anywhere!",
    desc:
      "Discover the ease of car rentals designed to fit your lifestyle. Whether you're planning a quick city drive, a weekend getaway, or a long-term journey.",
  },
  {
    image: "/images/hero/01.svg",
    title: "Luxury Chauffeur\nServices",
    desc:
      "Premium chauffeur-driven experiences with comfort, reliability and style wherever you go.",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((index - 1 + slides.length) % slides.length);

  const next = () =>
    setIndex((index + 1) % slides.length);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
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

      {/* CONTENT WRAPPER — PURE BOTTOM */}
      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-4 sm:px-6
                      flex flex-col justify-end">

<div
  className="
    grid grid-cols-1 md:grid-cols-2 gap-2
    pb-[320px]
    sm:pb-40
  "
>

          {/* LEFT: HEADING */}
          <div>
            <h1
              className="
                text-white font-bold leading-tight whitespace-pre-line
                text-3xl
                sm:text-4xl
                md:text-3xl
                lg:text-[38px]
                xl:text-[42px]
                max-w-2xl
              "
            >
              {slides[index].title}
            </h1>
          </div>

          {/* RIGHT: PARAGRAPH + ARROWS */}
          <div>
            <p
              className="
                text-white/90 font-medium leading-relaxed
                text-sm
                sm:text-base
                md:text-sm
                lg:text-base
                xl:text-lg
                max-w-xl
              "
            >
              {slides[index].desc}
            </p>

            {/* SLIDER ARROWS — BELOW PARAGRAPH */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full
                           bg-white/20 hover:bg-white/40
                           text-white flex items-center justify-center
                           transition"
              >
                ‹
              </button>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full
                           bg-white/20 hover:bg-white/40
                           text-white flex items-center justify-center
                           transition"
              >
                ›
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
