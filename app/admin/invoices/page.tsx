"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Invoice {
  id: string;
  invoiceNumber: string;
  billingContact: string;
  dueDate: string;
  createDate: string;
  totalAmount: string;
  status: "Paid" | "Outstanding" | "Pending";
  actionText: string;
}

const initialInvoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV256845", billingContact: "(619) 721-4835", dueDate: "26 Jan 2026", createDate: "20 Jan 2026", totalAmount: "$582", status: "Paid", actionText: "View Invoice" },
  { id: "2", invoiceNumber: "INV256848", billingContact: "(619) 721-4835", dueDate: "26 Jan 2026", createDate: "20 Jan 2026", totalAmount: "$458", status: "Paid", actionText: "View Details" }
];

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("Paid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredInvoices = initialInvoices.filter(invoice => 
    invoice.status === activeTab &&
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[#F1F1F1] font-sans relative overflow-hidden">
      <div className="px-4 md:px-8 py-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-black tracking-tight">Invoices</h1>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="bg-white p-1 rounded-full flex items-center shadow-sm border border-gray-100">
            {["Paid", "Outstanding", "Pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                  activeTab === tab ? "bg-[#F1F3F9] text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-grow sm:w-[240px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white border-none rounded-md pl-10 pr-4 py-2 text-sm shadow-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95"
          >
            Create Invoice
          </button>
        </div>
      </div>

      <div className="flex-1 mx-4 md:mx-8 mb-8 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden border border-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[900px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#EAEAEA] border-b border-gray-100">
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Invoice Number</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Billing Contact</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Due Date</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Create Date</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Total Amount</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-[13px] font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-5 text-[13px] font-bold text-zinc-800">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-5 text-[13px] text-zinc-600">{invoice.billingContact}</td>
                  <td className="px-6 py-5 text-[13px] text-zinc-600">{invoice.dueDate}</td>
                  <td className="px-6 py-5 text-[13px] text-zinc-600">{invoice.createDate}</td>
                  <td className="px-6 py-5 text-[13px] text-zinc-600">{invoice.totalAmount}</td>
                  <td className="px-6 py-5">
                    <span className="bg-[#D1FADF] text-[#027A48] text-[11px] px-2.5 py-1 rounded font-semibold uppercase">{invoice.status}</span>
                  </td>
                  <td className="px-6 py-5">
                    <button className="border border-zinc-300 text-zinc-800 px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-zinc-900 hover:text-white transition-all">
                      {invoice.actionText}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-zinc-900">Create Invoice</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-zinc-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
                <input type="text" placeholder="Search contact" className="w-full bg-[#F5F5F5] border-none rounded-full pl-11 pr-4 py-3 text-sm outline-none placeholder:text-zinc-500" />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 uppercase">Items</h3>
                <div className="bg-[#F9F9F9] rounded-lg border border-gray-100">
                  <div className="flex justify-between px-4 py-3 text-sm border-b border-gray-50">
                    <span>Amount Due</span>
                    <span className="font-bold">$0.00</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span>Total amount</span>
                    <span className="font-bold">$0.00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 uppercase">Memo</h3>
                <textarea placeholder="leave message to customer*" className="w-full h-32 bg-[#F5F5F5] border-none rounded-lg p-4 text-sm outline-none resize-none" />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 uppercase">Due Date</h3>
                <label className="text-[11px] font-medium text-zinc-400">Due Date</label>
                <div className="relative custom-datepicker">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select Date & Time"
                    className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm outline-none text-zinc-700 cursor-pointer"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setIsDrawerOpen(false)} className="flex-1 border border-zinc-300 py-3 rounded-full text-sm font-bold">Cancel</button>
              <button className="flex-1 bg-black text-white py-3 rounded-full text-sm font-bold">Compose</button>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        .custom-datepicker .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          border-radius: 12px;
          border: 1px solid #eee;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          font-family: inherit;
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: 1px solid #eee;
        }
        .react-datepicker__day--selected {
          background-color: black !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}