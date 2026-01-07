"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

const SERVICE_TYPES = [
  "City-To-City Rides",
  "Chauffeur Hailing",
  "Airport Transfers",
  "Hourly Hire",
  "Chauffeur Services",
  "Limousine Services",
];

export default function HeroSearch() {
  const router = useRouter();
  const timeInputRef = useRef<HTMLInputElement>(null);

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState("10:00");

  const handleSearch = () => {
    if (!pickup || !drop || !service || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    const formattedDate = date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }); 

    const params = new URLSearchParams({
      pickup: pickup,
      drop: drop,
      service: service,
      date: formattedDate,
      time: time
    });

    router.push(`/booking?${params.toString()}`);
  };

  const handleTimeClick = () => {
    timeInputRef.current?.showPicker();
  };

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95%] sm:w-[92%] max-w-7xl bg-white rounded-2xl sm:rounded-[32px] shadow-2xl p-4 sm:p-6 z-30 will-change-transform">
      
      {/* Mobile: Stack vertically */}
      <div className="flex flex-col gap-4 md:hidden" key="mobile-form">
        
        {/* Row 1: Pickup */}
        <InputItem
          icon="/icons/location.svg"
          label="Pickup Location"
          value={pickup}
          placeholder="Enter pickup location"
          onChange={setPickup}
        />

        {/* Row 2: Drop */}
        <InputItem
          icon="/icons/location.svg"
          label="Drop Location"
          value={drop}
          placeholder="Enter drop location"
          onChange={setDrop}
        />

        {/* Row 3: Service Type */}
        <div className="flex items-center gap-3 min-w-0 py-2 border-b border-gray-100">
          <Image src="/icons/service.svg" alt="" width={20} height={20} className="flex-shrink-0" />
          <div className="w-full min-w-0">
            <p className="text-xs text-gray-400 mb-1">Service Type</p>
            <select
              className="w-full text-sm font-medium outline-none bg-transparent appearance-none"
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{ WebkitAppearance: 'none' }}
            >
              <option value="">Select Service</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Date */}
        <div className="flex items-center gap-3 min-w-0 py-2 border-b border-gray-100">
          <Image src="/icons/calendar.svg" alt="" width={20} height={20} className="flex-shrink-0" />
          <div className="min-w-0 w-full">
            <p className="text-xs text-gray-400 mb-1">Date</p>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
              className="text-sm font-medium outline-none w-full cursor-pointer"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        {/* Row 5: Time - Clickable wrapper */}
        <div 
          className="flex items-center gap-3 min-w-0 py-2 border-b border-gray-100 cursor-pointer"
          onClick={handleTimeClick}
        >
          <Image src="/icons/clock.svg" alt="" width={20} height={20} className="flex-shrink-0 pointer-events-none" />
          <div className="min-w-0 w-full pointer-events-none">
            <p className="text-xs text-gray-400 mb-1">Pickup Time</p>
            <input
              ref={timeInputRef}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-sm font-medium outline-none w-full pointer-events-auto cursor-pointer"
              style={{ WebkitAppearance: 'none' }}
            />
          </div>
        </div>

        {/* Row 6: Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-black text-white h-12 sm:h-14 rounded-full flex items-center justify-center gap-2 hover:bg-black/90 active:bg-black/80 transition font-medium touch-manipulation"
        >
          <Image src="/icons/search.svg" alt="" width={18} height={18} />
          <span>Search Car</span>
        </button>
      </div>

      {/* Desktop & Tablet: Horizontal layout */}
      <div className="hidden md:flex md:items-center md:justify-between md:gap-4 lg:gap-6" key="desktop-form">

        {/* PICKUP */}
        <InputItem
          icon="/icons/location.svg"
          label="Pickup Location"
          value={pickup}
          placeholder="Enter pickup location"
          onChange={setPickup}
        />

        {/* DROP */}
        <InputItem
          icon="/icons/location.svg"
          label="Drop Location"
          value={drop}
          placeholder="Enter drop location"
          onChange={setDrop}
        />

        {/* SERVICE TYPE */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Image src="/icons/service.svg" alt="" width={20} height={20} className="flex-shrink-0" />
          <div className="w-full min-w-0">
            <p className="text-xs text-gray-400">Service Type</p>
            <select
              className="w-full text-sm font-medium outline-none bg-transparent appearance-none cursor-pointer"
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{ WebkitAppearance: 'none' }}
            >
              <option value="">Select Service</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Image src="/icons/calendar.svg" alt="" width={20} height={20} className="flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Date</p>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
              className="text-sm font-medium outline-none w-full cursor-pointer"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        {/* TIME - Clickable wrapper */}
        <div 
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          onClick={handleTimeClick}
        >
          <Image src="/icons/clock.svg" alt="" width={20} height={20} className="flex-shrink-0 pointer-events-none" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 pointer-events-none">Pickup Time</p>
            <input
              ref={timeInputRef}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-sm font-medium outline-none cursor-pointer pointer-events-auto"
              style={{ WebkitAppearance: 'none' }}
            />
          </div>
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          className="bg-black text-white h-12 lg:h-14 px-6 lg:px-8 rounded-full flex items-center justify-center gap-2 hover:bg-black/90 transition flex-shrink-0 font-medium"
        >
          <Image src="/icons/search.svg" alt="" width={18} height={18} />
          <span className="whitespace-nowrap">Search Car</span>
        </button>
      </div>
    </div>
  );
}

function InputItem({
  icon,
  label,
  value,
  placeholder,
  onChange,
}: {
  icon: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0 flex-1 py-2 md:py-0 border-b md:border-0 border-gray-100">
      <Image src={icon} alt="" width={20} height={20} className="flex-shrink-0" />
      <div className="w-full min-w-0">
        <p className="text-xs text-gray-400 mb-1 md:mb-0">{label}</p>
        <input
          className="w-full text-sm font-medium outline-none bg-transparent"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}