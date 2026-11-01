import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Restaurant } from '../../../types';
import {
  Building2,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export const TenantsTab: React.FC = () => {
  const {
    allRestaurants,
    restaurant,
    switchRestaurant,
    createNewRestaurant,
    setCurrentRole
  } = useApp();

  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newFssai, setNewFssai] = useState('11025000000000');

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const slug = newRestName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTenant: Restaurant = {
      id: `rest_${Date.now()}`,
      name: newRestName.trim(),
      slug,
      tagline: newTagline.trim() || 'Pure Veg Kitchen & Café',
      description: 'Delivering exceptional pure vegetarian dining and hospitality.',
      logo: '/craverse-logo.jpg',
      coverImage: '/craverse-logo.jpg',
      address: newAddress.trim() || 'MG Road, Bengaluru',
      phone: newPhone.trim() || '+91 80 5555 1234',
      email: `contact@${slug}.com`,
      fssaiNumber: newFssai.trim(),
      isOpen: true,
      currency: 'INR',
      currencySymbol: '₹',
      taxRates: {
        cgstPercent: 2.5,
        sgstPercent: 2.5,
        serviceChargePercent: 5.0
      },
      upiVpa: `${slug}@icici`,
      branches: [
        {
          id: `br_${Date.now()}`,
          restaurantId: `rest_${Date.now()}`,
          name: 'Main Flagship',
          address: newAddress.trim() || 'MG Road, Bengaluru',
          phone: newPhone.trim(),
          isMain: true
        }
      ]
    };

    createNewRestaurant(newTenant);
    setShowOnboardModal(false);
    setNewRestName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Multi-Tenant & Restaurant Franchises
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Super Admin Integrated
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage multiple restaurant branches and SaaS tenants from this unified console.
          </p>
        </div>

        <button
          onClick={() => setShowOnboardModal(true)}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Onboard New Restaurant / Branch</span>
        </button>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Total Restaurant Tenants</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {allRestaurants.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">Data isolated per tenant</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Total QR Tables Active</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {allRestaurants.length * 7}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Across all active branches</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Cumulative GMV Processed</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹8,45,200
          </div>
          <span className="text-[11px] text-purple-600 font-bold">Enterprise SaaS Tier</span>
        </div>
      </div>

      {/* Tenant Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRestaurants.map((res) => {
          const isCurrent = res.id === restaurant.id;
          return (
            <div
              key={res.id}
              className={`bg-white rounded-3xl p-5 border-2 shadow-xs flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    ID: {res.id}
                  </span>
                  {isCurrent ? (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Online
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={res.logo}
                    alt={res.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {res.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">
                      {res.tagline}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <div>📍 {res.address}</div>
                  <div>📞 {res.phone}</div>
                  <div>🛡️ FSSAI #{res.fssaiNumber}</div>
                  <div>💳 UPI: {res.upiVpa}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <button
                  onClick={() => switchRestaurant(res.id)}
                  disabled={isCurrent}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{isCurrent ? 'Currently Managing' : 'Switch To Tenant'}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    switchRestaurant(res.id);
                    setCurrentRole('customer');
                  }}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center space-x-1"
                >
                  <span>Open Menu</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboard New Tenant Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleCreateTenant}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Onboard New Restaurant / Branch</h3>
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                value={newRestName}
                onChange={(e) => setNewRestName(e.target.value)}
                placeholder="e.g. Craverse Express South"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
                placeholder="e.g. 100% Pure Veg Fast Dining"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="e.g. Koramangala 5th Block, Bengaluru"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">FSSAI Number</label>
              <input
                type="text"
                value={newFssai}
                onChange={(e) => setNewFssai(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono"
              />
            </div>

            <div className="flex space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Create Restaurant
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

