"use client";
import { useState, useEffect } from "react";

interface Chauffeur {
  id: number;
  name: string;
  mobileNumber: string;
  vehicleModel: string;
  vehicleType: string;
  plate: string;
  status: string;
}

const initialChauffeurData: Chauffeur[] = [
  {
    id: 1,
    name: "Felicia Lewis",
    mobileNumber: "(619) 721-4835",
    vehicleModel: "Executive Sedan VIPR8",
    vehicleType: "Sedan",
    plate: "VIPR8",
    status: "Done"
  },
  {
    id: 2,
    name: "John Appleseed",
    mobileNumber: "(619) 721-4835",
    vehicleModel: "VIP Sedan VIPR4",
    vehicleType: "Sedan",
    plate: "VIPR8",
    status: "Done"
  }
];

export default function ChauffeurPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatusId, setActiveStatusId] = useState<number | null>(null);

  const filteredData = initialChauffeurData.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.status-dropdown')) {
        setActiveStatusId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F1F1F1] overflow-hidden font-sans">
      
      <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-black tracking-tight">Chauffeurs</h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-[280px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white border-none rounded-md pl-10 pr-4 py-2 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95 whitespace-nowrap">
            Add Chauffeur
          </button>
        </div>
      </div>

      <div className="flex-1 mx-8 mb-8 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#EFEFEF] border-b border-gray-100">
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Mobile Number</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Vehicle Model</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Vehicle Type</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Plate</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((chauffeur) => (
                <tr key={chauffeur.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[14px] font-semibold text-zinc-900">{chauffeur.name}</td>
                  <td className="px-6 py-5 text-[14px] text-zinc-600">{chauffeur.mobileNumber}</td>
                  <td className="px-6 py-5 text-[14px] text-zinc-600">{chauffeur.vehicleModel}</td>
                  <td className="px-6 py-5 text-[14px] text-zinc-600">{chauffeur.vehicleType}</td>
                  <td className="px-6 py-5 text-[14px] text-zinc-600">{chauffeur.plate}</td>
                  
                  <td className="px-6 py-5 relative status-dropdown">
                    <span 
                      className="bg-[#D1FADF] text-[#027A48] text-[12px] px-3 py-1 rounded-md font-medium cursor-default"
                    >
                      {chauffeur.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <button className="border border-zinc-900 text-zinc-900 px-5 py-1.5 rounded-full text-[13px] font-medium hover:bg-zinc-900 hover:text-white transition-all active:scale-95">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}