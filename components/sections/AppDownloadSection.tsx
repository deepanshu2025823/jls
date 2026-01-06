"use client";

import Image from "next/image";

export default function AppDownloadSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-100 relative overflow-hidden">
      {/* Decorative Elements - Blue diagonal stripes - Hidden on mobile */}
      <div className="hidden sm:block absolute top-0 right-0 w-[250px] md:w-[300px] h-[150px] md:h-[200px] bg-sky-400 transform rotate-45 translate-x-24 md:translate-x-32 -translate-y-16 md:-translate-y-20"></div>
      <div className="hidden sm:block absolute top-1/2 right-1/4 w-[200px] md:w-[250px] h-[120px] md:h-[150px] bg-sky-400 transform -rotate-12 translate-x-16 md:translate-x-20"></div>
      <div className="hidden sm:block absolute bottom-0 right-0 w-[350px] md:w-[400px] h-[200px] md:h-[250px] bg-sky-400 transform rotate-45 translate-x-40 md:translate-x-48 translate-y-24 md:translate-y-32"></div>
      <div className="hidden sm:block absolute bottom-1/3 left-0 w-[170px] md:w-[200px] h-[100px] md:h-[120px] bg-sky-400 transform -rotate-12 -translate-x-20 md:-translate-x-24"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
              Effortless travel at your fingertips
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              Book, track and manage your journey easily on our JLS app.
            </p>

            {/* QR Code */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                Scan the QR code to download
              </p>
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-lg p-2 sm:p-2.5 md:p-3 shadow-lg inline-flex items-center justify-center">
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                  {/* QR Code Pattern */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="white">
                    {/* Top Left Corner */}
                    <rect x="5" y="5" width="35" height="35" fill="none" stroke="white" strokeWidth="3"/>
                    <rect x="12" y="12" width="21" height="21"/>
                    
                    {/* Top Right Corner */}
                    <rect x="60" y="5" width="35" height="35" fill="none" stroke="white" strokeWidth="3"/>
                    <rect x="67" y="12" width="21" height="21"/>
                    
                    {/* Bottom Left Corner */}
                    <rect x="5" y="60" width="35" height="35" fill="none" stroke="white" strokeWidth="3"/>
                    <rect x="12" y="67" width="21" height="21"/>
                    
                    {/* Random QR pattern elements */}
                    <rect x="47" y="5" width="8" height="8"/>
                    <rect x="47" y="17" width="8" height="8"/>
                    <rect x="47" y="29" width="8" height="8"/>
                    <rect x="5" y="47" width="8" height="8"/>
                    <rect x="17" y="47" width="8" height="8"/>
                    <rect x="29" y="47" width="8" height="8"/>
                    <rect x="47" y="47" width="8" height="25"/>
                    <rect x="60" y="47" width="8" height="8"/>
                    <rect x="72" y="47" width="8" height="8"/>
                    <rect x="84" y="47" width="8" height="8"/>
                    <rect x="60" y="60" width="8" height="8"/>
                    <rect x="72" y="60" width="8" height="8"/>
                    <rect x="84" y="72" width="8" height="8"/>
                    <rect x="60" y="84" width="8" height="8"/>
                    <rect x="72" y="84" width="8" height="8"/>
                    <rect x="84" y="84" width="8" height="8"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a
                href="#"
                className="inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-5 sm:px-5 md:px-6 py-3 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all w-full sm:w-auto"
              >
                <svg className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] sm:text-xs">GET IT ON</div>
                  <div className="font-semibold text-sm sm:text-sm">Google Play</div>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-5 sm:px-5 md:px-6 py-3 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all w-full sm:w-auto"
              >
                <svg className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] sm:text-xs">Download on the</div>
                  <div className="font-semibold text-sm sm:text-sm">App Store</div>
                </div>
              </a>
            </div>

            {/* Privacy Note */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              iOS and Android devices only. By continuing you agree with our{" "}
              <a href="#" className="text-gray-900 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* Right - Phone Mockups */}
          <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[550px] order-1 lg:order-2 mx-auto w-full max-w-[400px] lg:max-w-none">
            {/* Phone 1 - Back Left */}
            <div className="absolute top-6 sm:top-12 md:top-16 left-0 sm:left-6 md:left-8 w-[160px] sm:w-48 md:w-56 lg:w-64 h-[240px] sm:h-[340px] md:h-[420px] lg:h-[480px] bg-black rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden transform rotate-3 border-[8px] sm:border-[10px] md:border-[12px] border-black">
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                {/* Empty black screen */}
              </div>
            </div>

            {/* Phone 2 - Front Right */}
            <div className="absolute top-0 right-0 sm:right-4 md:right-8 lg:right-0 w-[180px] sm:w-56 md:w-64 lg:w-72 h-[260px] sm:h-[360px] md:h-[450px] lg:h-[520px] bg-black rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden transform -rotate-2 border-[8px] sm:border-[10px] md:border-[12px] border-black">
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                {/* Empty black screen */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}