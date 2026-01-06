"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import AdminHeader from '@/components/AdminHeader';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  capacity: number;
  pricePerHour: number;
  images: string;
  isAvailable: boolean;
}

interface Addon {
  id: string;
  name: string;
  type: string;
  price: number;
  icon?: string;
  isActive: boolean;
}

interface ExtraStop {
  location: string;
  notes: string;
}

export default function NewBooking() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  
  // Form State
  const [bookingType, setBookingType] = useState<'INDIVIDUAL' | 'AIRPORT_VIP' | 'VIP_TRANSFER' | 'WEDDING' | 'CORPORATE_EVENT'>('INDIVIDUAL');
  const [tripType, setTripType] = useState<'SINGLE_TRIP' | 'MULTI_STOP' | 'HOURLY_RENTAL' | 'TOUR_PACKAGE'>('SINGLE_TRIP');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [pickupSign, setPickupSign] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [paymentType, setPaymentType] = useState<'INSTANT_BILLING' | 'CORPORATE_BILLING'>('INSTANT_BILLING');
  const [selectedAddons, setSelectedAddons] = useState<{id: string, quantity: number}[]>([]);
  const [extraStops, setExtraStops] = useState<ExtraStop[]>([]);
  const [hourlyDuration, setHourlyDuration] = useState(4);

  // New Customer Modal
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('jls_token');
    const userData = localStorage.getItem('jls_user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadCustomers(token);
    loadVehicles(token);
    loadAddons(token);
  }, [router]);

  const loadCustomers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/users?role=CUSTOMER', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.users);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadVehicles = async (token: string) => {
    try {
      const response = await fetch('/api/admin/vehicles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles.filter((v: Vehicle) => v.isAvailable));
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const loadAddons = async (token: string) => {
    try {
      const response = await fetch('/api/admin/addons', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAddons(data.addons.filter((a: Addon) => a.isActive));
      }
    } catch (error) {
      console.error('Error loading addons:', error);
    }
  };

  const createNewCustomer = async () => {
    const token = localStorage.getItem('jls_token');
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCustomer,
          role: 'CUSTOMER'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Customer created successfully!');
        setShowNewCustomerModal(false);
        setNewCustomer({ firstName: '', lastName: '', phone: '', email: '', password: '' });
        loadCustomers(token!);
        setCustomerId(data.user.id);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer');
    }
  };

  const addExtraStop = () => {
    setExtraStops([...extraStops, { location: '', notes: '' }]);
  };

  const removeExtraStop = (index: number) => {
    setExtraStops(extraStops.filter((_, i) => i !== index));
  };

  const updateExtraStop = (index: number, field: 'location' | 'notes', value: string) => {
    const updated = [...extraStops];
    updated[index][field] = value;
    setExtraStops(updated);
  };

  const toggleAddon = (addonId: string) => {
    const exists = selectedAddons.find(a => a.id === addonId);
    if (exists) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, { id: addonId, quantity: 1 }]);
    }
  };

  const updateAddonQuantity = (addonId: string, quantity: number) => {
    setSelectedAddons(selectedAddons.map(a => 
      a.id === addonId ? { ...a, quantity: Math.max(1, quantity) } : a
    ));
  };

  const calculatePrice = () => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return { basePrice: 0, addonPrice: 0, totalPrice: 0 };

    let basePrice = 0;
    if (tripType === 'HOURLY_RENTAL') {
      basePrice = vehicle.pricePerHour * hourlyDuration;
    } else {
      basePrice = vehicle.pricePerHour * 3; // Default 3 hours for other trips
    }

    const addonPrice = selectedAddons.reduce((sum, selected) => {
      const addon = addons.find(a => a.id === selected.id);
      return sum + (addon ? addon.price * selected.quantity : 0);
    }, 0);

    return {
      basePrice,
      addonPrice,
      totalPrice: basePrice + addonPrice
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('jls_token');
    const { basePrice, addonPrice, totalPrice } = calculatePrice();

    const bookingData = {
      customerId,
      vehicleId,
      bookingType,
      tripType,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      flightNumber: flightNumber || undefined,
      pickupSign: pickupSign || undefined,
      specialNotes: specialNotes || undefined,
      referenceCode: referenceCode || undefined,
      paymentType,
      basePrice,
      addonPrice,
      totalPrice,
      addons: selectedAddons.map(selected => {
        const addon = addons.find(a => a.id === selected.id);
        return {
          addonId: selected.id,
          quantity: selected.quantity,
          price: addon ? addon.price * selected.quantity : 0
        };
      }),
      extraStops: extraStops.map((stop, index) => ({
        location: stop.location,
        stopOrder: index + 1,
        notes: stop.notes || undefined
      }))
    };

    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert('Booking created successfully!');
        router.push('/admin/bookings');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const prices = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="packages" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/admin/bookings">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                ← Back
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Booking</h1>
              <p className="text-gray-600 mt-1">Fill in the details to create a luxury limousine booking</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Type & Trip Type */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    >
                      <option value="INDIVIDUAL">👤 Individual</option>
                      <option value="AIRPORT_VIP">✈️ Airport VIP Pickup</option>
                      <option value="VIP_TRANSFER">⭐ VIP Transfer</option>
                      <option value="WEDDING">💒 Wedding</option>
                      <option value="CORPORATE_EVENT">🏢 Corporate Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={tripType}
                      onChange={(e) => setTripType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    >
                      <option value="SINGLE_TRIP">Single Trip</option>
                      <option value="MULTI_STOP">Multi Stop</option>
                      <option value="HOURLY_RENTAL">Hourly Rental</option>
                      <option value="TOUR_PACKAGE">Tour Package</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                  <button
                    type="button"
                    onClick={() => setShowNewCustomerModal(true)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    + New Customer
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  >
                    <option value="">Select a customer...</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Selection</h2>
                <div className="space-y-3">
                  {vehicles.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No available vehicles</p>
                  ) : (
                    vehicles.map(vehicle => (
                      <div
                        key={vehicle.id}
                        onClick={() => setVehicleId(vehicle.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          vehicleId === vehicle.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">{vehicle.name}</p>
                            <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              👥 {vehicle.capacity} passengers • {vehicle.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">₹{vehicle.pricePerHour}</p>
                            <p className="text-xs text-gray-500">per hour</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Enter pickup address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drop Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        placeholder="Enter drop address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {tripType === 'HOURLY_RENTAL' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (Hours) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={hourlyDuration}
                        onChange={(e) => setHourlyDuration(parseInt(e.target.value))}
                        min="1"
                        max="24"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  {bookingType === 'AIRPORT_VIP' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Flight Number
                        </label>
                        <input
                          type="text"
                          value={flightNumber}
                          onChange={(e) => setFlightNumber(e.target.value)}
                          placeholder="e.g., AI202"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pickup Sign Name
                        </label>
                        <input
                          type="text"
                          value={pickupSign}
                          onChange={(e) => setPickupSign(e.target.value)}
                          placeholder="Name for pickup sign"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Stops */}
              {tripType === 'MULTI_STOP' && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Extra Stops</h2>
                    <button
                      type="button"
                      onClick={addExtraStop}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
                    >
                      + Add Stop
                    </button>
                  </div>
                  <div className="space-y-3">
                    {extraStops.map((stop, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium text-gray-900">Stop {index + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeExtraStop(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={stop.location}
                            onChange={(e) => updateExtraStop(index, 'location', e.target.value)}
                            placeholder="Stop location"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            required
                          />
                          <input
                            type="text"
                            value={stop.notes}
                            onChange={(e) => updateExtraStop(index, 'notes', e.target.value)}
                            placeholder="Notes (optional)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Luxury Add-ons & Perks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addons.map(addon => {
                    const selected = selectedAddons.find(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        className={`p-4 border-2 rounded-lg transition ${
                          selected ? 'border-black bg-gray-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={!!selected}
                              onChange={() => toggleAddon(addon.id)}
                              className="w-4 h-4"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {addon.icon} {addon.name}
                              </p>
                              <p className="text-sm text-gray-600">₹{addon.price}</p>
                            </div>
                          </div>
                          {selected && (
                            <input
                              type="number"
                              value={selected.quantity}
                              onChange={(e) => updateAddonQuantity(addon.id, parseInt(e.target.value))}
                              min="1"
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Notes
                    </label>
                    <textarea
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="Any special requirements or instructions..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Code
                    </label>
                    <input
                      type="text"
                      value={referenceCode}
                      onChange={(e) => setReferenceCode(e.target.value)}
                      placeholder="Optional reference code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    >
                      <option value="INSTANT_BILLING">Instant Billing</option>
                      <option value="CORPORATE_BILLING">Corporate Billing</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Booking Type</span>
                      <span className="font-medium text-gray-900">{bookingType.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trip Type</span>
                      <span className="font-medium text-gray-900">{tripType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  {vehicleId && (
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Selected Vehicle</p>
                      <p className="font-medium text-gray-900">
                        {vehicles.find(v => v.id === vehicleId)?.name}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium text-gray-900">₹{prices.basePrice.toLocaleString()}</span>
                    </div>
                    {prices.addonPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Add-ons Price</span>
                        <span className="font-medium text-gray-900">₹{prices.addonPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Price</span>
                      <span className="text-2xl font-bold text-gray-900">₹{prices.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedAddons.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">Selected Add-ons</p>
                      <div className="space-y-1">
                        {selectedAddons.map(selected => {
                          const addon = addons.find(a => a.id === selected.id);
                          return addon ? (
                            <div key={selected.id} className="flex justify-between text-xs text-gray-600">
                              <span>{addon.icon} {addon.name} x{selected.quantity}</span>
                              <span>₹{(addon.price * selected.quantity).toLocaleString()}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {tripType === 'HOURLY_RENTAL' && hourlyDuration && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        ⏱️ Duration: {hourlyDuration} hour{hourlyDuration > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {extraStops.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800">
                        📍 Extra Stops: {extraStops.length}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !customerId || !vehicleId}
                  className={`w-full mt-6 py-3 rounded-lg font-medium transition ${
                    loading || !customerId || !vehicleId
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Creating Booking...' : 'Create Booking'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  All fields marked with <span className="text-red-500">*</span> are required
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
                <button
                  onClick={() => {
                    setShowNewCustomerModal(false);
                    setNewCustomer({ firstName: '', lastName: '', phone: '', email: '', password: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newCustomer.password}
                    onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewCustomerModal(false);
                  setNewCustomer({ firstName: '', lastName: '', phone: '', email: '', password: '' });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={createNewCustomer}
                disabled={!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email || !newCustomer.phone || !newCustomer.password}
                className={`px-6 py-2 rounded-lg transition ${
                  newCustomer.firstName && newCustomer.lastName && newCustomer.email && newCustomer.phone && newCustomer.password
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}