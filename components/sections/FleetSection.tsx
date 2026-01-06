"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const fleetTypes = [
  {
    id: 1,
    name: "Premium Sedan",
    description: "Acura MDX, Lexus RX, BMW X5",
    image: "/images/fleet/sedan.svg",
  },
  {
    id: 2,
    name: "SUVs",
    description: "Mercedes E-Class, Lexus ES, Cadillac CT6, or similar.",
    image: "/images/fleet/suv.svg",
  },
  {
    id: 3,
    name: "Premium Suv",
    description: "Cadillac Escalade",
    image: "/images/fleet/premium-suv.svg",
  },
];

export default function FleetSection() {
  const router = useRouter();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Browse by fleet types
          </h2>
          <button
            onClick={() => router.push("/fleet")}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <span className="font-medium">More Fleet</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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

        {/* Fleet Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {fleetTypes.map((fleet) => (
            <div
              key={fleet.id}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <Image
                  src={fleet.image}
                  alt={fleet.name}
                  fill
                  className="object-contain p-4 sm:p-6 md:p-8 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-4 sm:p-5 md:p-6 relative">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {fleet.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm pr-2 sm:pr-10">
                  {fleet.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}