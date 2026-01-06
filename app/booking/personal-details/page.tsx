"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const countryCodes = [
  { code: '+1', flag: '🇺🇸', country: 'US' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+91', flag: '🇮🇳', country: 'IN' },
  { code: '+86', flag: '🇨🇳', country: 'CN' },
  { code: '+33', flag: '🇫🇷', country: 'FR' },
  { code: '+49', flag: '🇩🇪', country: 'DE' },
];

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [countryFlag, setCountryFlag] = useState('🇮🇳');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const country = countryCodes.find(c => c.code === selectedCode);
    setCountryCode(selectedCode);
    setCountryFlag(country?.flag || '🇮🇳');
  };

  const handleSubmit = () => {
    if (!firstName || !lastName || !mobileNumber) {
      alert('Please fill all fields');
      return;
    }
    
    // Here you would save to database
    alert('Profile completed! Redirecting to confirmation...');
    router.push('/booking/confirmation');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="headerbgimg hidden lg:block">
        <Header />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Add your personal details</h1>
          <p className="text-gray-600">
            Complete your profile to keep your account up to date and secure
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-10">
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-base placeholder:text-gray-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-base placeholder:text-gray-500"
              />
            </div>

            {/* Mobile Number with Country Code */}
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-base appearance-none cursor-pointer"
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Mobile Number"
                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-base placeholder:text-gray-500"
              />
            </div>

            {/* Helper Text */}
            <p className="text-sm text-gray-600">
              Add your mobile number for your chauffeurs notification
            </p>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition text-base mt-2"
            >
              Save and Continue
            </button>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            By adding your personal details, you agree to our{' '}
            <Link href="/privacy" className="text-gray-900 underline hover:text-black">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link href="/terms" className="text-gray-900 underline hover:text-black">
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}