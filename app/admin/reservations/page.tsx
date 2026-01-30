'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Pencil,
  Calendar,
  ArrowLeft
} from 'lucide-react';

interface Reservation {
  id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  date: string;
  amount: string;
  status: string;
  type: string;
}

interface DetailItemProps {
  label: string;
  value: string;
  isAmount?: boolean;
}

const ReservationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Open');
  const [selectedId, setSelectedId] = useState<number>(1);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState<boolean>(false);

  const reservations: Reservation[] = [
    { 
      id: 1, 
      name: 'John Appleseed', 
      code: 'COTO', 
      email: 'john.appleseed@gmail.com', 
      phone: '(669) 322-9791', 
      date: '06/01/26', 
      amount: '$10.00', 
      status: 'Open',
      type: 'Corporate Event'
    },
    { 
      id: 2, 
      name: 'Jane Doe', 
      code: 'BETA', 
      email: 'jane.doe@gmail.com', 
      phone: '(555) 123-4567', 
      date: '07/01/26', 
      amount: '$45.00', 
      status: 'Closed',
      type: 'Private Dinner'
    },
    { 
      id: 3, 
      name: 'Mike Ross', 
      code: 'ZETA', 
      email: 'mike.r@gmail.com', 
      phone: '(123) 456-7890', 
      date: '08/01/26', 
      amount: '$100.00', 
      status: 'Not Paid',
      type: 'Wedding'
    },
  ];

  const filteredData = reservations.filter(res => res.status === activeFilter);
  const selectedReservation = reservations.find(res => res.id === selectedId) || reservations[0];
  const filters: string[] = ['Open', 'Closed', 'Not Paid', 'Unconf'];

  const handleSelectReservation = (id: number): void => {
    setSelectedId(id);
    setIsMobileDetailOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-[#FBFBFB] font-sans text-[#1A1A1A] overflow-hidden">
      <div className={`w-full lg:w-[380px] bg-white border-r border-gray-100 flex flex-col ${isMobileDetailOpen ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 lg:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl lg:text-[24px] font-bold">Reservation</h1>
            <button className="bg-black text-white px-5 lg:px-7 py-2 rounded-full text-[13px] font-bold hover:opacity-80 transition-opacity">
              Create
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 lg:px-5 py-2 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                  ? 'bg-[#E5E5E5] text-black border-black' 
                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between py-2">
            <ChevronLeft size={20} className="cursor-pointer text-gray-400 hover:text-black" />
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-[14px] lg:text-[15px] font-bold">Wed, 21 Jan 2026</span>
            </div>
            <ChevronRight size={20} className="cursor-pointer text-gray-400 hover:text-black" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-gray-100">
          {filteredData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleSelectReservation(item.id)}
              className={`px-6 py-5 border-b border-gray-50 cursor-pointer transition-colors ${selectedId === item.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
            >
              <div className="grid grid-cols-2 gap-y-1">
                <div className="font-bold text-[15px] lg:text-[16px]">{item.code}</div>
                <div className="font-bold text-[15px] lg:text-[16px] text-right">{item.name}</div>
                
                <div className="text-[12px] lg:text-[13px] text-gray-400">{item.date}</div>
                <div className="text-[12px] lg:text-[13px] text-gray-400 truncate text-right">{item.email}</div>
                
                <div className="text-[12px] lg:text-[13px] font-bold text-[#22C55E] mt-1">{item.amount}</div>
                <div className="text-[12px] lg:text-[13px] text-gray-400 mt-1 text-right">{item.phone}</div>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="p-10 text-center text-gray-400 text-sm">No {activeFilter} reservations</div>
          )}
        </div>
      </div>

      <div className={`flex-1 bg-[#F9FAFB] flex flex-col overflow-y-auto ${!isMobileDetailOpen ? 'hidden lg:flex' : 'flex'}`}>
        <div className="lg:hidden p-4 border-b bg-white flex items-center">
          <button onClick={() => setIsMobileDetailOpen(false)} className="flex items-center gap-2 text-sm font-bold">
            <ArrowLeft size={18} /> Back to List
          </button>
        </div>

        <div className="p-6 lg:p-10 max-w-5xl w-full mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-10 gap-4">
            <h2 className="text-2xl lg:text-[32px] font-bold">{selectedReservation.code}</h2>
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 lg:px-6 py-2 rounded-full text-[13px] lg:text-[14px] font-bold shadow-sm hover:bg-gray-50 transition-colors">
                <Pencil size={14} />
                {selectedReservation.type}
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50">
                <MoreHorizontal size={20} />
                <span className="hidden lg:inline text-[14px] font-bold">More</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[16px] lg:text-[17px] font-bold">Customer Details</h3>
            <div className="bg-white border border-gray-200 rounded-[16px] lg:rounded-[20px] p-6 lg:p-10 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <DetailItem label="Name" value={selectedReservation.name} />
                <DetailItem label="Email" value={selectedReservation.email} />
                <DetailItem label="Contact Number" value={selectedReservation.phone} />
                <DetailItem label="Amount" value={selectedReservation.amount} isAmount />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value, isAmount }) => (
  <div className="flex flex-col">
    <span className="text-[10px] lg:text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1 lg:mb-2">{label}</span>
    <span className={`text-[14px] lg:text-[15px] font-bold break-words ${isAmount ? 'text-[#22C55E]' : 'text-black'}`}>
      {value}
    </span>
  </div>
);

export default ReservationsPage;