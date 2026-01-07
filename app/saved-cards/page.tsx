"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

interface SavedCard {
  id: string;
  cardLastFour: string;
  cardBrand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

export default function SavedCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jls_token');
    console.log('Token from localStorage:', token ? 'exists' : 'missing');
    
    if (!token) {
      router.push('/login?redirect=/saved-cards');
      return;
    }

    fetchCards();
  }, [router]);

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('jls_token');
      console.log('Fetching cards with token:', token?.substring(0, 20) + '...');

      const response = await fetch('/api/user/cards', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        console.error('Unauthorized - redirecting to login');
        localStorage.removeItem('jls_token');
        localStorage.removeItem('jls_user');
        router.push('/login?redirect=/saved-cards');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch cards');
      }

      const data = await response.json();
      console.log('Fetched cards:', data);
      setCards(data);
      setError('');
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      const token = localStorage.getItem('jls_token');
      const response = await fetch(`/api/user/cards/${cardId}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default card');
      }

      fetchCards();
    } catch (error) {
      console.error('Error setting default card:', error);
      alert('Failed to set default card');
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    setDeleting(cardId);
    try {
      const token = localStorage.getItem('jls_token');
      const response = await fetch(`/api/user/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card');
    } finally {
      setDeleting(null);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('visa')) return '💳';
    if (brandLower.includes('mastercard')) return '💳';
    if (brandLower.includes('amex')) return '💳';
    return '💳';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="headerbgimg">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Saved Payment Methods</h1>
          <p className="text-gray-600 mt-2">Manage your saved credit and debit cards</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Saved Cards</h2>
            <p className="text-gray-600 mb-6">You haven't saved any payment methods yet</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
            >
              Make a Booking
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{getCardBrandIcon(card.cardBrand)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {card.cardBrand} •••• {card.cardLastFour}
                        </p>
                        {card.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetDefault(card.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(card.id)}
                      disabled={deleting === card.id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {deleting === card.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
              <p className="text-sm text-blue-800">Your payment information is encrypted and stored securely. We never store your full card number.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}