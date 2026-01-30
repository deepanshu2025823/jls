"use client";

import HeroSlider from "../HeroSlider";
import HeroSearch from "../HeroSearch";

export default function Hero() {
  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      <HeroSlider />
      <HeroSearch />
    </section>
  );
}   
