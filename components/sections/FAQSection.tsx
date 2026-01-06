"use client";

import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "Do you go chicago to drop off?",
    answer: "Yes, we provide limousine services to Chicago and offer drop-off services. You can book our city-to-city rides for a comfortable journey.",
  },
  {
    id: 2,
    question: "How far you go to pickup and drop off?",
    answer: "We offer pickup and drop-off services across major cities and their surrounding areas. The exact coverage depends on your location, but we typically serve a 50-mile radius from major metropolitan areas.",
  },
  {
    id: 3,
    question: "Do you offer discount?",
    answer: "Yes, we offer various discounts including corporate rates, frequent traveler programs, and seasonal promotions. VIP members also receive exclusive discounts on all bookings.",
  },
  {
    id: 4,
    question: "How far we need to book?",
    answer: "We recommend booking at least 24 hours in advance for guaranteed availability. However, we also accept same-day bookings based on vehicle availability.",
  },
  {
    id: 5,
    question: "Do you have flat rates?",
    answer: "Yes, we offer flat rates for airport transfers and popular city-to-city routes. For hourly bookings, we have competitive per-hour rates. Contact us for specific route pricing.",
  },
  {
    id: 6,
    question: "What are the hours of operation for Airport Limousine LLC?",
    answer: "We operate 24/7 to accommodate all your travel needs, including early morning flights and late-night arrivals. Our customer service team is available around the clock.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently asked Questions
          </h2>
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-black transition-all font-medium">
            <span>View All FAQs</span>
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

        {/* FAQ List */}
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`${
                index !== faqs.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between py-6 text-left group transition-all hover:bg-gray-50 px-4 rounded-lg"
              >
                <span className="text-base md:text-lg font-medium text-gray-900 pr-8 flex-1 group-hover:text-black transition-colors">
                  {faq.question}
                </span>
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openId === faq.id
                      ? "rotate-45 bg-black border-black"
                      : "bg-white border-gray-900 group-hover:border-black"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      openId === faq.id ? "text-white" : "text-gray-900"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </button>

              {/* Answer - Smooth Accordion */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 pb-6">
                  <p className="text-gray-600 leading-relaxed pr-14">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}