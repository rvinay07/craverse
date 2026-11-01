import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequestType } from '../../types';
import {
  X,
  Droplets,
  Utensils,
  Sparkles,
  UserCheck,
  Receipt,
  CheckCircle2,
  BellRing
} from 'lucide-react';

interface ServiceRequestModalProps {
  onClose: () => void;
}

const REQUEST_OPTIONS: {
  type: ServiceRequestType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    type: 'water',
    title: 'Water Refill',
    subtitle: 'Chilled or regular table water',
    icon: <Droplets className="w-5 h-5" />,
    color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50'
  },
  {
    type: 'cutlery',
    title: 'Extra Cutlery',
    subtitle: 'Forks, spoons, bowls, napkins',
    icon: <Utensils className="w-5 h-5" />,
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
  },
  {
    type: 'clean_table',
    title: 'Clean Table',
    subtitle: 'Clear used plates & wipe table',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50'
  },
  {
    type: 'call_waiter',
    title: 'Call Waiter',
    subtitle: 'In-person table assistance',
    icon: <UserCheck className="w-5 h-5" />,
    color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50'
  },
  {
    type: 'request_bill',
    title: 'Request Printed Bill',
    subtitle: 'Paper receipt to table',
    icon: <Receipt className="w-5 h-5" />,
    color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50'
  }
];

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ onClose }) => {
  const { currentTable, createServiceRequest } = useApp();
  const [customNote, setCustomNote] = useState('');
  const [successSubmitted, setSuccessSubmitted] = useState<string | null>(null);

  const handleSelect = (type: ServiceRequestType, title: string) => {
    createServiceRequest(type, customNote || undefined);
    setSuccessSubmitted(title);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Table Assistance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Table {currentTable?.tableNumber || '16'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successSubmitted ? (
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Request Sent to Waiter!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Our team has been notified for "{successSubmitted}". Someone will be at Table {currentTable?.tableNumber || '16'} shortly.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select what you need and our floor staff will attend to your table immediately:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {REQUEST_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => handleSelect(opt.type, opt.title)}
                  className={`flex items-start space-x-3 p-3 rounded-2xl border text-left transition-all ${opt.color}`}
                >
                  <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {opt.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom details */}
            <div className="pt-2">
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Any specific note for waiter? (optional)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
