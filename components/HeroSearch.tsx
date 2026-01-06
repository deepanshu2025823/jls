"use client";

import Image from "next/image";
import { useState } from "react";
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

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white rounded-[40px] shadow-hero px-4 py-4 z-30">
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-between md:gap-6">

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
        <div className="flex items-center gap-3">
          <Image src="/icons/service.svg" alt="" width={20} height={20} />
          <div className="w-full">
            <p className="text-xs text-gray-400">Service Type</p>
            <select
              className="w-full text-sm font-medium outline-none bg-transparent"
              value={service}
              onChange={(e) => setService(e.target.value)}
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
        <div className="flex items-center gap-3">
          <Image src="/icons/calendar.svg" alt="" width={20} height={20} />
          <div>
            <p className="text-xs text-gray-400">Date</p>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
              className="text-sm font-medium outline-none"
            />
          </div>
        </div>

        {/* TIME */}
        <div className="flex items-center gap-3">
          <Image src="/icons/clock.svg" alt="" width={20} height={20} />
          <div>
            <p className="text-xs text-gray-400">Pickup Time</p>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-sm font-medium outline-none"
            />
          </div>
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          className="col-span-2 md:col-span-1 bg-black text-white h-[52px] px-8 rounded-full flex items-center justify-center gap-2 hover:bg-black/90 transition"
        >
          <Image src="/icons/search.svg" alt="" width={18} height={18} />
          Search Car
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
    <div className="flex items-center gap-3">
      <Image src={icon} alt="" width={20} height={20} />
      <div className="w-full">
        <p className="text-xs text-gray-400">{label}</p>
        <input
          className="w-full text-sm font-medium outline-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}