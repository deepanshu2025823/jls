"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const dispatchData = [
  {
    id: 1,
    confNo: "P2BG-OV",
    tripStatus: "Done",
    orderType: "Airport Drop Off",
    passenger: { name: "Felicia Lewis", phone: "(619) 230-1245" },
    driver: { name: "Susan Askew", phone: "(619) 721-4835" },
    company: "N/A",
    vehicle: "Executive Sedan VIPR8",
    vehicleCategory: "--",
    date: "1 Jan 2026",
    pickupTime: "9:30 AM PST",
    dropoffTime: "10:17 AM PST",
    duration: "47 W 13th St, New York,",
    dropoffAddress: "Petco Park, Park Boulevard, San Diego",
    paxCount: 2,
    tripClassification: "Standard",
    tripType: "Round",
    bookingContact: "Kayla Wyatt",
    totalAmount: "385",
    affiliate: "--",
    status: "Open"
  },
  {
    id: 2,
    confNo: "P2BG-OV",
    tripStatus: "Done",
    orderType: "Airport Drop Off",
    passenger: { name: "Felicia Lewis", phone: "(619) 230-1245" },
    driver: { name: "Susan Askew", phone: "(619) 721-4835" },
    company: "N/A",
    vehicle: "Executive Sedan VIPR8",
    vehicleCategory: "--",
    date: "1 Jan 2026",
    pickupTime: "9:30 AM PST",
    dropoffTime: "10:17 AM PST",
    duration: "1 E 2nd St, New York, NY",
    dropoffAddress: "12655 Rue Marabelle, San Diego",
    paxCount: 4,
    tripClassification: "Standard",
    tripType: "Single",
    bookingContact: "Terra Norina",
    totalAmount: "1016",
    affiliate: "--",
    status: "Open"
  }
];

export default function DispatchPage() {
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [activeStatusId, setActiveStatusId] = useState<number | null>(null);
  const [showDriverSearch, setShowDriverSearch] = useState<number | null>(null);

  const dateMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dateMenuRef.current && !dateMenuRef.current.contains(target)) {
        setShowDateMenu(false);
      }
      if (!target.closest('td')) {
        setActiveStatusId(null);
        setShowDriverSearch(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Dispatch</h1>
          <div className="flex items-center gap-2" ref={dateMenuRef}>
            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div 
              className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm relative active:bg-gray-50 transition-all"
              onClick={() => setShowDateMenu(!showDateMenu)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Wed, 21 Jan 2025</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              
              {showDateMenu && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-xl rounded-lg border py-1 z-[60] animate-in fade-in zoom-in duration-150">
                  {["Today", "Yesterday", "Tomorrow", "This Week", "Specific Date", "Custom Range"].map(item => (
                    <button key={item} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-[11px] text-gray-600 transition-colors">{item}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 min-w-[120px] outline-none cursor-pointer focus:ring-1 ring-blue-500">
            <option>Select</option>
          </select>
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 min-w-[120px] outline-none cursor-pointer focus:ring-1 ring-blue-500">
            <option>Driver</option>
          </select>
        </div>
      </div>

      <div className="flex-1 mx-4 mb-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto h-full">
          <table className="w-full border-collapse text-left min-w-[2000px]">
            <thead className="sticky top-0 z-40 bg-[#F1F3F5]">
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Conf. No</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Trip Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Order Type</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Passenger</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Driver</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Company</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Vehicle Category</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Date</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Pick-up Time</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Drop-off Time</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Duration</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Drop-off Address</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-center">PAX Count</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Trip Classification</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Trip Type</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Trip Notes</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Drivers Notes</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Alerts</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Booking Contact</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Total Amount</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Affiliate</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dispatchData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-4 py-4 text-xs font-semibold text-gray-800 tracking-tight">{row.confNo}</td>
                  
                  <td className="px-4 py-4 relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStatusId(activeStatusId === row.id ? null : row.id);
                        setShowDriverSearch(null);
                      }}
                      className="bg-[#D9F2E3] text-[#1E8E3E] text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold whitespace-nowrap hover:shadow-sm"
                    >
                      {row.tripStatus} <svg width="6" height="4" viewBox="0 0 8 6" fill="none"><path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="2"/></svg>
                    </button>
                    {activeStatusId === row.id && (
                      <div className="absolute left-4 top-10 w-40 bg-white border border-gray-100 shadow-2xl rounded-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        {["Pending", "Confirmed", "On the way", "On Location", "Passenger on Board", "Done", "Cancelled"].map((s, idx) => (
                          <div key={s} className="px-4 py-1.5 text-[11px] hover:bg-gray-50 cursor-pointer flex items-center gap-2 font-medium text-gray-700">
                            <span className={`w-1.5 h-1.5 rounded-full ${idx === 5 ? 'bg-green-500' : idx === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}></span> {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 text-xs font-semibold text-gray-700">{row.orderType}</td>
                  
                  <td className="px-4 py-4">
                    <div className="text-xs font-bold text-gray-900 leading-tight">{row.passenger.name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{row.passenger.phone}</div>
                  </td>

                  <td className="px-4 py-4 relative">
                    <div 
                      className="cursor-pointer group-hover:bg-gray-100 p-1 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDriverSearch(showDriverSearch === row.id ? null : row.id);
                        setActiveStatusId(null);
                      }}
                    >
                      <div className="text-xs font-bold text-gray-900 leading-tight">{row.driver.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{row.driver.phone}</div>
                    </div>
                    {showDriverSearch === row.id && (
                      <div className="absolute left-0 top-12 w-56 bg-white border border-gray-200 shadow-2xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex gap-2 mb-2">
                          <div className="flex-1 flex items-center border rounded-md px-2 bg-gray-50">
                            <input autoFocus placeholder="Search..." className="w-full bg-transparent text-xs py-1 outline-none" />
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {["Maher Yacoob", "Mahesh Singh", "Susan Askew"].map(name => (
                            <div key={name} className="p-2 hover:bg-blue-50 rounded cursor-pointer border-b border-gray-50 last:border-0 transition-colors">
                              <div className="text-[11px] font-bold text-gray-800">{name}</div>
                              <div className="text-[10px] text-gray-400">(619) 721-4835</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 text-xs text-gray-400 italic">{row.company}</td>
                  <td className="px-4 py-4 text-xs font-bold text-gray-800">{row.vehicle}</td>
                  <td className="px-4 py-4 text-xs text-gray-400">{row.vehicleCategory}</td>
                  <td className="px-4 py-4 text-xs text-gray-600 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-4 text-xs font-bold text-gray-900">{row.pickupTime}</td>
                  <td className="px-4 py-4 text-xs font-bold text-gray-700">{row.dropoffTime}</td>
                  <td className="px-4 py-4 text-xs text-gray-600 truncate max-w-[180px]" title={row.duration}>{row.duration}</td>
                  <td className="px-6 py-4 text-xs text-gray-600 truncate max-w-[200px]" title={row.dropoffAddress}>{row.dropoffAddress}</td>
                  <td className="px-4 py-4 text-xs font-bold text-center text-gray-800">{row.paxCount}</td>
                  <td className="px-4 py-4 text-xs text-gray-600 font-medium">{row.tripClassification}</td>
                  <td className="px-4 py-4 text-xs text-gray-600 font-medium">{row.tripType}</td>
                  
                  <td className="px-4 py-4"><div className="bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-[10px] text-gray-400 w-24 cursor-text hover:border-gray-300 transition-all">Enter notes</div></td>
                  <td className="px-4 py-4"><div className="bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-[10px] text-gray-400 w-24 cursor-text hover:border-gray-300 transition-all">Enter notes</div></td>
                  <td className="px-4 py-4"><div className="bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-[10px] text-gray-400 w-24 cursor-text hover:border-gray-300 transition-all">Enter alerts</div></td>
                  
                  <td className="px-4 py-4 text-xs font-bold text-gray-800">{row.bookingContact}</td>
                  <td className="px-4 py-4 text-xs font-extrabold text-gray-900">${row.totalAmount}</td>
                  <td className="px-4 py-4 text-xs text-gray-400">{row.affiliate}</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#E6F4EA] text-[#1E8E3E] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tight">
                      {row.status}
                    </span>
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