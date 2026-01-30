"use client";
import { useState } from "react";
import Image from "next/image";

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState("New");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConf, setSelectedConf] = useState("");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const quotesData = [
    { id: 1, title: "COTO", name: "John Appleseed", date: "06/01/26", email: "john.appleseed@gmail.com", phone: "(669) 322-9791", amount: "$10.00", status: "Sent" },
    { id: 2, title: "COTO", name: "Paul Smith", date: "04/01/26", email: "paul.smith@gmail.com", phone: "(669) 322-9791", amount: "$10.00", status: "Sent" },
    { id: 3, title: "COTO", name: "Jane Doe", date: "02/01/26", email: "jane.doe@gmail.com", phone: "(669) 322-9791", amount: "$25.00", status: "Draft" },
    { id: 4, title: "COTO", name: "Bob Ross", date: "01/01/26", email: "bob.paint@gmail.com", phone: "(669) 322-9791", amount: "$50.00", status: "Archived" },
  ];

  const filteredQuotes = activeTab === "New" 
    ? quotesData 
    : quotesData.filter(q => q.status === activeTab);

  const openTripModal = (conf: string) => {
    setSelectedConf(conf);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden flex-col lg:flex-row">
      <aside className="w-full lg:w-[340px] bg-white border-r border-gray-200 flex flex-col shrink-0 max-h-[50vh] lg:max-h-full">
        <div className="px-5 py-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-black">Quotes</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black text-white px-5 py-1.5 rounded-full text-[13px] font-medium hover:opacity-80 transition-opacity"
          >
            Create
          </button>
        </div>

        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50 pb-4">
          {["New", "Sent", "Draft", "Archived"].map((tab) => (
            <Tab 
              key={tab} 
              label={tab} 
              active={activeTab === tab} 
              onClick={() => setActiveTab(tab)} 
            />
          ))}
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <Image src="/admin/arrow-left.svg" alt="Back" width={16} height={16} />
          </button>
          <div className="flex items-center gap-2 text-[13px] font-medium text-black">
            <Image src="/admin/calendar.svg" alt="Calendar" width={14} height={14} />
            <span>All</span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <Image src="/admin/arrow-right.svg" alt="Next" width={16} height={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredQuotes.map((quote, idx) => (
            <QuoteItem key={quote.id} {...quote} active={idx === 0} />
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-black tracking-tight">COTO</h1>
            <span className="bg-[#E8F0FE] text-[#4285F4] text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wide">
              {activeTab}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Image src="/admin/corporate-event.svg" alt="Event" width={16} height={16} />
              Corporate Event
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              <Image src="/admin/more.svg" alt="More" width={18} height={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] mb-6 border border-gray-100">
          <h3 className="text-[14px] font-bold text-black mb-6">Customer Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DetailField label="Name" value="John Appleseed" />
            <DetailField label="Email" value="john.appleseed@gmail.com" />
            <DetailField label="Contact Number" value="(669) 322-9791" />
            <DetailField label="Amount" value="$10.00" isAmount />
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100">
          <h3 className="text-[14px] font-bold text-black mb-6">2 Trips</h3>
          <div className="hidden lg:grid grid-cols-6 bg-[#F8F9FA] px-4 py-2.5 rounded-lg text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            <div>Date & Time</div>
            <div>Amount</div>
            <div>Conf No.</div>
            <div>Vehicle</div>
            <div>Trip Type</div>
            <div className="text-right pr-4">Action</div>
          </div>
          <TripRow 
            date="Wed, 01/21/26, 10:20PM" 
            amount="$10.00" 
            conf="COTO-FO" 
            vehicle="10 PAX Party Bus VIP 22" 
            type="Round Trip" 
            onAddPrice={() => openTripModal("COTO-FO")}
          />
          <TripRow 
            date="Wed, 01/21/26, 10:20PM" 
            amount="$10.00" 
            conf="COTO-71" 
            vehicle="10 PAX Party Bus VIP 22" 
            type="Round Trip" 
            isLast 
            onAddPrice={() => openTripModal("COTO-71")}
          />
        </div>
      </main>

      <TripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        conf={selectedConf}
      />

      <CreateQuoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[12px] font-bold shrink-0 transition-all ${
        active ? "bg-black text-white shadow-md" : "bg-[#F2F2F2] text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function QuoteItem({ title, name, date, email, phone, amount, status, active = false }: any) {
  const statusColors: any = {
    Sent: "bg-[#F5E8FF] text-[#A855F7]",
    Draft: "bg-gray-100 text-gray-500",
    Archived: "bg-red-50 text-red-400",
    New: "bg-[#DDE5F5] text-[#5879BC]"
  };

  return (
    <div className={`px-5 py-5 border-b border-gray-100 cursor-pointer transition-colors ${active ? "bg-[#F8F9FF]" : "hover:bg-gray-50"}`}>
      <div className="flex gap-6">
        <div className="flex flex-col min-w-[70px]">
          <span className="text-[17px] font-bold text-black mb-1">{title}</span>
          <span className="text-[13px] text-gray-500 mb-1">{date}</span>
          <span className="text-[15px] font-bold text-[#16A34A]">{amount}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="text-[16px] font-bold text-black mb-1">{name}</span>
            <span className={`${statusColors[status] || statusColors.New} text-[11px] font-bold px-2 py-0.5 rounded-md`}>
              {status}
            </span>
          </div>
          <div className="text-[13px] text-gray-500 leading-normal">
            {email} <br /> {phone}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, isAmount = false }: { label: string; value: string; isAmount?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">{label}</div>
      <div className={`text-[13px] font-bold ${isAmount ? "text-[#22C55E]" : "text-black"}`}>
        {value}
      </div>
    </div>
  );
}

function TripRow({ date, amount, conf, vehicle, type, isLast = false, onAddPrice }: any) {
  return (
    <div className={`flex flex-col lg:grid lg:grid-cols-6 gap-3 lg:gap-0 px-4 py-4 text-[13px] font-medium text-gray-800 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="text-black font-semibold">{date}</div>
      <div className="font-bold text-black">{amount}</div>
      <div className="text-gray-500">{conf}</div>
      <div className="text-black">{vehicle}</div>
      <div className="text-black">{type}</div>
      <div className="lg:text-right">
        <button 
          onClick={onAddPrice}
          className="w-full lg:w-auto px-5 py-1.5 border border-gray-200 rounded-full text-[12px] font-bold text-black hover:bg-gray-50 transition-colors shadow-sm"
        >
          Add Price
        </button>
      </div>
    </div>
  );
}

function TripModal({ isOpen, onClose, conf }: { isOpen: boolean; onClose: () => void; conf: string }) {
  const [modalTab, setModalTab] = useState("Trip Details");
  const [dropOffType, setDropOffType] = useState<"location" | "flight">("location");

  if (!isOpen) return null;

  const threadedComments = [
    { id: 1, name: "Paul Smith", text: "Still checking with people", initial: "PS", color: "bg-[#9333EA]" }, 
    { id: 2, name: "Matthew Earhart", text: "Calling back in sometime", initial: "ME", color: "bg-[#3B82F6]" }, 
    { id: 3, name: "Alexandra", text: "Calling back in sometime", initial: "A", color: "bg-[#F97316]" }, 
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[500px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-[18px] font-bold text-black">Quotes</h2>
          <div className="flex gap-4 items-center">
             <button className="text-gray-400 hover:text-black font-bold pb-2">•••</button>
             <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Conf. No.</p>
            <p className="text-[14px] font-bold text-black">{conf || "COTO-FO"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Duration</p>
            <p className="text-[14px] font-bold text-black">30:00 Min</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <span className="bg-[#EFCEFC] text-[#A855F7] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Sent</span>
          </div>
        </div>

        <div className="px-6 mt-4">
          <div className="flex bg-[#F2F2F2] p-1 rounded-xl">
            {["Trip Details", "Pricing", "Vehicle"].map((t) => (
              <button
                key={t}
                onClick={() => setModalTab(t)}
                className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${
                  modalTab === t ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {modalTab === "Trip Details" && (
            <>
              <div className="border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[12px] text-gray-500 mb-2">Drop-off</p>
                <div className="flex gap-3 mb-4">
                  <div className="bg-[#F3F4F6] rounded-lg p-1 flex items-center h-[42px]">
                     <button 
                       onClick={() => setDropOffType("location")}
                       className={`p-2 rounded-md transition-all ${dropOffType === "location" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                     >
                       <Image src="/admin/location.svg" alt="loc" width={16} height={16} className={dropOffType === "location" ? "opacity-100" : "opacity-40"} />
                     </button>
                     <button 
                       onClick={() => setDropOffType("flight")}
                       className={`p-2 rounded-md transition-all ${dropOffType === "flight" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                     >
                       <Image src="/admin/flight.svg" alt="flight" width={22} height={22} className={dropOffType === "flight" ? "opacity-100" : "opacity-40"} />
                     </button>
                  </div>
                  <div className="flex-1 bg-[#EEEEEE] rounded-lg flex items-center px-4 justify-between h-[42px]">
                    <span className="text-[13px] text-gray-500">Select Date & Time</span>
                    <Image src="/admin/calendar.svg" alt="cal" width={16} height={16} className="opacity-60" />
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[12px] text-gray-500 block mb-1">Address</span>
                    <p className="text-[13px] font-bold text-black max-w-[250px] leading-snug">
                      15947 sarah bagh ridge court, san diego, CA, USA
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[14px] font-bold text-black">Additional Info</h3>
                 <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] text-gray-500">Trip passenger count</span>
                       <span className="text-[13px] font-bold text-black">20</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] text-gray-500">Trip Notes</span>
                       <span className="text-[13px] font-bold text-black">--</span>
                    </div>
                 </div>
              </div>

              <div className="border border-gray-400 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <span className="text-[14px] font-bold text-black">Luggage</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-black">0 Total</span>
                  <Image src="/admin/arrow-right.svg" alt="arrow" width={12} height={12} className="rotate-90 opacity-60" />
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-[14px] font-bold text-black mb-4">Internal Comments</h3>
                <div className="space-y-4 mb-4">
                  {threadedComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full ${comment.color} flex items-center justify-center text-white text-[14px] font-medium shrink-0`}>
                        {comment.initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-black">{comment.name}</span>
                        <span className="text-[13px] text-gray-500">{comment.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 items-center mt-4">
                   <div className="w-10 h-10 rounded-full bg-[#5FBCCF] flex items-center justify-center text-white text-[14px] font-medium shrink-0">
                     AS
                   </div>
                   <input 
                     className="flex-1 bg-[#EEEEEE] rounded-xl px-4 py-2.5 text-[13px] outline-none text-black placeholder:text-gray-500" 
                     placeholder="Enter your comment" 
                   />
                </div>
              </div>
            </>
          )}

          {modalTab === "Pricing" && (
            <>
              <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/admin/clock.svg" alt="Clock" width={14} height={14} />
                  <span className="text-[12px] font-bold text-black">28 Minutes</span>
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="text-[12px] font-medium text-gray-500">Round Trip Return</span>
                </div>
                
                <div className="space-y-6 relative">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shrink-0" />
                      <div className="w-[1px] h-10 border-l border-dashed border-gray-300 my-1" />
                    </div>
                    <div className="pb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pick-Up</p>
                      <p className="text-[13px] font-bold text-black">RH Rooftop Restaurant at RH Polo Alto El USA</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#22C55E] shrink-0" />
                    <div className="-mt-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Drop-Up</p>
                      <p className="text-[13px] font-bold text-black">1100N Mathilda Ave</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Date & Time</p>
                    <p className="text-[11px] font-bold text-black">Wed, 01/21/26, 10:20PM</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Vehicle</p>
                    <p className="text-[11px] font-bold text-black">10 PAX Party Bus VIP 22</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Passengers</p>
                    <p className="text-[11px] font-bold text-black">15</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <h4 className="text-[14px] font-bold text-black">Pricing</h4>
                   <button className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <Image src="/admin/calendar.svg" alt="calc" width={12} height={12} />
                      BRA Calculator
                   </button>
                </div>
                
                <div className="bg-[#F8F9FA] rounded-2xl p-1 border border-gray-100 flex items-center">
                  <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 gap-1">
                    <button className="p-2 hover:bg-gray-50 rounded-lg">
                      <Image src="/admin/location.svg" alt="loc" width={16} height={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg">
                      <Image src="/admin/clock.svg" alt="time" width={16} height={16} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter amount" 
                    className="flex-1 bg-transparent px-4 text-[14px] font-semibold outline-none text-black" 
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {["Additional Price Item", "Add Promo Code", "Use Pricing Layout"].map((btn) => (
                    <button key={btn} className="px-4 py-2 border border-gray-200 rounded-full text-[11px] font-bold text-black hover:bg-gray-50 shadow-sm">
                      {btn}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[13px] font-bold text-gray-400">Total</span>
                  <span className="text-[16px] font-bold text-black">$0.00</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-[14px] font-bold text-black">Internal Comments</h4>
                <div className="flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-full bg-[#74B9CF] flex items-center justify-center text-white text-[12px] font-bold shrink-0">AS</div>
                   <input 
                    className="flex-1 bg-[#F2F2F2] rounded-2xl px-5 py-3 text-[13px] outline-none text-black font-medium" 
                    placeholder="Enter your comment" 
                   />
                </div>
              </div>
            </>
          )}

          {modalTab === "Vehicle" && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
               <p className="text-sm">Content for Vehicle</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 bg-white">
          <button onClick={onClose} className="flex-1 py-3.5 border border-gray-300 rounded-full font-bold text-[14px] text-black hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="flex-1 py-3.5 bg-black text-white rounded-full font-bold text-[14px] hover:opacity-90 shadow-lg">
            Send Quote
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateQuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tripType, setTripType] = useState("One Way");
  const [priceType, setPriceType] = useState<"$" | "%">("$");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[500px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-black">Create New Quote</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div>
            <h3 className="text-[14px] font-bold text-black mb-3">Order Details</h3>
            <div className="space-y-3">
              <div className="relative">
                <select className="w-full bg-[#EEEEEE] rounded-lg px-4 py-3 text-[13px] font-medium text-gray-600 appearance-none outline-none">
                  <option>Search for booking contact</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Image src="/admin/arrow-right.svg" alt="down" width={12} height={12} className="rotate-90 opacity-40"/>
                </div>
              </div>
              <div className="relative">
                <select className="w-full bg-[#EEEEEE] rounded-lg px-4 py-3 text-[13px] font-medium text-gray-600 appearance-none outline-none">
                  <option>Order type*</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Image src="/admin/arrow-right.svg" alt="down" width={12} height={12} className="rotate-90 opacity-40"/>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-black mb-3">Trip Type</h3>
            <div className="flex bg-[#EEEEEE] p-1 rounded-xl">
              {[
                 { name: "Hourly", icon: "/admin/clock.svg" }, 
                 { name: "One Way", icon: "/admin/one-way.svg" }, 
                 { name: "Round Trip", icon: "/admin/round-trip.svg" }
              ].map((type) => (
                <button
                  key={type.name}
                  onClick={() => setTripType(type.name)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-bold rounded-lg transition-all ${
                    tripType === type.name ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Image src={type.icon} alt={type.name} width={14} height={14} className={tripType !== type.name ? "opacity-50" : ""} />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-black mb-3">Trip Details</h3>
            <div className="border border-gray-200 rounded-xl p-4 flex justify-center items-center h-16">
              <span className="text-[13px] text-gray-400 font-medium">No passenger</span>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-black mb-3">Date & Time</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#EEEEEE] rounded-lg px-4 py-3">
                <span className="text-[13px] text-gray-500">Pick-up Date & Time</span>
                <Image src="/admin/calendar.svg" alt="cal" width={16} height={16} className="opacity-40" />
              </div>
              <div className="flex items-center justify-between bg-[#EEEEEE] rounded-lg px-4 py-3">
                <span className="text-[13px] text-gray-500">Pick-up Date & Time</span>
                <Image src="/admin/calendar.svg" alt="cal" width={16} height={16} className="opacity-40" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-[14px] font-bold text-black">Pick-up</h3>
               <button className="text-[11px] font-bold text-black flex items-center gap-1">
                 <span>+</span> Add Stop
               </button>
            </div>
            <div className="flex gap-3 mb-3">
               <div className="bg-[#F3F4F6] rounded-lg p-1 flex items-center h-[42px] shrink-0">
                   <button className="p-2 bg-white rounded-md shadow-sm">
                     <Image src="/admin/location.svg" alt="loc" width={16} height={16} />
                   </button>
                   <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                     <Image src="/admin/flight.svg" alt="flight" width={22} height={22} />
                   </button>
               </div>
               <div className="flex-1 bg-[#EEEEEE] rounded-lg flex items-center px-4 justify-between h-[42px]">
                  <span className="text-[13px] text-gray-500">Select Date & Time</span>
                  <Image src="/admin/calendar.svg" alt="cal" width={16} height={16} className="opacity-40" />
               </div>
            </div>
            <div className="bg-[#EEEEEE] rounded-lg px-4 py-3">
               <span className="text-[13px] text-gray-500">Address*</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-[14px] font-bold text-black">Drop-off</h3>
               <button className="text-[11px] font-bold text-black flex items-center gap-1">
                 <span>+</span> Add Stop
               </button>
            </div>
            <div className="flex gap-3 mb-3">
               <div className="bg-[#F3F4F6] rounded-lg p-1 flex items-center h-[42px] shrink-0">
                   <button className="p-2 bg-white rounded-md shadow-sm">
                     <Image src="/admin/location.svg" alt="loc" width={16} height={16} />
                   </button>
                   <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                     <Image src="/admin/flight.svg" alt="flight" width={22} height={22} className="opacity-40" />
                   </button>
               </div>
               <div className="flex-1 bg-[#EEEEEE] rounded-lg flex items-center px-4 justify-between h-[42px]">
                  <span className="text-[13px] text-gray-500">Select Date & Time</span>
                  <Image src="/admin/calendar.svg" alt="cal" width={16} height={16} className="opacity-40" />
               </div>
            </div>
            <div className="bg-[#EEEEEE] rounded-lg px-4 py-3">
               <span className="text-[13px] text-gray-500">Address*</span>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-black mb-3">Additional Info</h3>
            <div className="space-y-3">
              <div className="bg-[#EEEEEE] rounded-lg px-4 py-3">
                <span className="text-[13px] text-gray-500">Passenger count</span>
              </div>
              <div className="bg-[#EEEEEE] rounded-lg px-4 py-3">
                <span className="text-[13px] text-gray-500">Trip Note</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-400 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-[14px] font-bold text-black">Luggage</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-black">0 Total</span>
              <Image src="/admin/arrow-right.svg" alt="arrow" width={12} height={12} className="rotate-90 opacity-60" />
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-black mb-3">Vehicle</h3>
            <div className="border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center gap-3">
              <span className="text-[13px] font-medium text-gray-500">No Vehicle added yet!</span>
              <button className="px-5 py-2 border border-black rounded-full text-[12px] font-bold text-black hover:bg-gray-50">
                Add New Vehicle
              </button>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-[14px] font-bold text-black">Pricing</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500">Base Rate</span>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <Image src="/admin/calendar.svg" alt="calc" width={12} height={12} className="opacity-60"/>
                    <span className="text-[11px] text-gray-600">BRA Calculations</span>
                  </div>
                </div>
             </div>
             
             <div className="bg-[#EEEEEE] rounded-xl p-1 flex items-center mb-3">
                <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1 mr-2">
                   <div className="p-1.5"><Image src="/admin/location.svg" alt="loc" width={14} height={14} /></div>
                   <div className="p-1.5"><Image src="/admin/clock.svg" alt="time" width={14} height={14} /></div>
                </div>
                <input className="flex-1 bg-transparent text-[13px] outline-none text-black placeholder:text-gray-500" placeholder="Enter amount" />
             </div>

             <div className="flex gap-2 mb-6">
                <button className="px-4 py-2 border border-gray-400 rounded-full text-[11px] font-bold text-black hover:bg-gray-50">Additional Price Item</button>
                <button className="px-4 py-2 border border-gray-400 rounded-full text-[11px] font-bold text-black hover:bg-gray-50">Add Promo Code</button>
             </div>
             
             <h3 className="text-[14px] font-bold text-black mb-3">Other</h3>
             <div className="flex gap-2 mb-2">
                <div className="bg-[#EEEEEE] rounded-lg p-1 flex shrink-0">
                  <button 
                    onClick={() => setPriceType("$")}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${priceType === "$" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Image src="/admin/dollar.svg" alt="$" width={12} height={12} className={priceType === "$" ? "opacity-100" : "opacity-40"} />
                  </button>
                  <button 
                    onClick={() => setPriceType("%")}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${priceType === "%" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Image src="/admin/percentage.svg" alt="%" width={12} height={12} className={priceType === "%" ? "opacity-100" : "opacity-40"} />
                  </button>
                </div>
                <div className="flex-1 bg-[#EEEEEE] rounded-lg px-4 flex items-center">
                   <span className="text-[13px] text-gray-500">Service fee</span>
                </div>
                <div className="w-24 bg-[#EEEEEE] rounded-lg px-3 flex items-center font-bold text-[13px] text-black">
                   10%
                </div>
                <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-200 shrink-0">
                   <Image src="/admin/arrow-right.svg" alt="del" width={14} height={14} className="rotate-45 opacity-60" /> {/* Using arrow as placeholder for trash if trash icon missing, commonly done or use a trash svg if available */}
                </button>
             </div>

             <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-2 mb-6">
                <div className="flex justify-between text-[12px] text-gray-500">
                   <span>Service fee(10%)</span>
                   <span>$0.00</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold text-black pt-2 border-t border-gray-200">
                   <span>Total</span>
                   <span>$0.00</span>
                </div>
             </div>
          </div>

          <div>
             <h3 className="text-[14px] font-bold text-black mb-3">Internal Comments</h3>
             <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#5FBCCF] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                  AS
                </div>
                <input 
                  className="flex-1 bg-[#EEEEEE] rounded-lg px-4 py-2.5 text-[13px] outline-none text-black placeholder:text-gray-500" 
                  placeholder="Enter your comment" 
                />
             </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3 bg-white">
          <button onClick={onClose} className="flex-1 py-3.5 border border-black rounded-full font-bold text-[14px] text-black hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="flex-1 py-3.5 bg-black text-white rounded-full font-bold text-[14px] hover:opacity-90 shadow-lg">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}