import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { isFirebaseConfigured, getStoredFirebaseConfig } from '../../../services/firebase';
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  Database,
  CreditCard,
  Building,
  Key
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { restaurant, updateRestaurant } = useApp();

  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [address, setAddress] = useState(restaurant.address);
  const [phone, setPhone] = useState(restaurant.phone);
  const [email, setEmail] = useState(restaurant.email);
  const [fssai, setFssai] = useState(restaurant.fssaiNumber);
  const [cgst, setCgst] = useState(restaurant.taxRates.cgstPercent);
  const [sgst, setSgst] = useState(restaurant.taxRates.sgstPercent);
  const [serviceCharge, setServiceCharge] = useState(restaurant.taxRates.serviceChargePercent);
  const [upiVpa, setUpiVpa] = useState(restaurant.upiVpa);

  // Firebase Config State
  const storedFb = getStoredFirebaseConfig() || {};
  const [fbApiKey, setFbApiKey] = useState(storedFb.apiKey || '');
  const [fbProjectId, setFbProjectId] = useState(storedFb.projectId || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(storedFb.authDomain || '');
  const [fbStorageBucket, setFbStorageBucket] = useState(storedFb.storageBucket || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant({
      name,
      tagline,
      address,
      phone,
      email,
      fssaiNumber: fssai,
      upiVpa,
      taxRates: {
        cgstPercent: Number(cgst),
        sgstPercent: Number(sgst),
        serviceChargePercent: Number(serviceCharge)
      }
    });

    // Save custom Firebase config if entered
    if (fbApiKey && fbProjectId) {
      const fbConfig = {
        apiKey: fbApiKey,
        projectId: fbProjectId,
        authDomain: fbAuthDomain,
        storageBucket: fbStorageBucket
      };
      localStorage.setItem('craverse_firebase_config', JSON.stringify(fbConfig));
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const hasFirebase = isFirebaseConfigured();

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Restaurant profile and tax rates updated successfully!</span>
        </div>
      )}

      {/* Restaurant Profile Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Building className="w-5 h-5 text-orange-600" />
          <h3 className="font-extrabold text-slate-900 text-base">Restaurant Profile</h3>
        </div>

        {/* Brand Logo Preview */}
        <div className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <img
            src={restaurant.logo || '/craverse-logo.jpg'}
            alt="Craverse Logo"
            className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-300 bg-black"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-800">Brand Logo</h4>
            <p className="text-[11px] text-slate-500">Official Craverse universe of flavours logo active</p>
            <span className="text-[10px] font-mono text-orange-600 font-bold">/craverse-logo.jpg</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">FSSAI License No.</label>
            <input
              type="text"
              value={fssai}
              onChange={(e) => setFssai(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Taxes & Bill Surcharges Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-5 h-5 text-orange-600" />
          <h3 className="font-extrabold text-slate-900 text-base">
            Taxes & Payment Gateway Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">CGST Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={cgst}
              onChange={(e) => setCgst(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold"
            />
            <span className="text-[10px] text-slate-400">Standard restaurant CGST: 2.5%</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SGST Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={sgst}
              onChange={(e) => setSgst(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold"
            />
            <span className="text-[10px] text-slate-400">Standard restaurant SGST: 2.5%</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Service Charge (%)</label>
            <input
              type="number"
              step="0.5"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold"
            />
            <span className="text-[10px] text-slate-400">Configurable restaurant fee</span>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              UPI Merchant Virtual Payment Address (VPA)
            </label>
            <input
              type="text"
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value)}
              placeholder="merchant.restaurant@bank"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 font-bold"
            />
            <span className="text-[10px] text-slate-400">
              Used to generate dynamic payment QR codes for table checkout
            </span>
          </div>
        </div>
      </div>

      {/* Firebase Cloud Connection Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Firebase Cloud Sync</h3>
          </div>
          <span
            className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
              hasFirebase
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {hasFirebase ? 'Connected to Firebase' : 'Active in Reactive Local Storage Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Craverse runs seamlessly out-of-the-box with persistent reactive storage and live multi-screen synchronization. You can also connect your own Google Firebase project by providing credentials below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Firebase API Key</label>
            <input
              type="text"
              value={fbApiKey}
              onChange={(e) => setFbApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Project ID</label>
            <input
              type="text"
              value={fbProjectId}
              onChange={(e) => setFbProjectId(e.target.value)}
              placeholder="craverse-dining-app"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm flex items-center space-x-2 shadow-lg shadow-orange-600/30"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>
    </form>
  );
};

