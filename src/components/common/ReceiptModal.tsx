import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { X, Printer } from 'lucide-react';

interface ReceiptModalProps {
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ onClose }) => {
  const { currentTable, restaurant, orders } = useApp();

  // Find latest completed or active order for this table
  const tableOrders = orders.filter((o) => o.tableId === currentTable?.id);
  const latestOrder = tableOrders[0];

  const subtotal = latestOrder ? latestOrder.subtotal : 430;
  const discount = latestOrder ? latestOrder.discountAmount : 43;
  const cgst = latestOrder ? latestOrder.cgstAmount : 0;
  const sgst = latestOrder ? latestOrder.sgstAmount : 0;
  const serviceCharge = latestOrder ? latestOrder.serviceChargeAmount : 0;
  const total = latestOrder ? latestOrder.totalAmount : 387;

  const handlePrint = () => {
    window.print();
  };

  const hasAnyTaxes =
    restaurant.taxRates.cgstPercent > 0 ||
    restaurant.taxRates.sgstPercent > 0 ||
    restaurant.taxRates.serviceChargePercent > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm">Receipt / Bill Invoice</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Paper Receipt Content */}
        <div className="flex-1 overflow-y-auto p-4 my-2 border border-slate-200 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-800 leading-relaxed shadow-inner">
          <div className="text-center pb-2 border-b border-dashed border-slate-400">
            <img
              src="/craverse-logo.jpg"
              alt="Craverse"
              className="w-14 h-14 mx-auto rounded-xl object-cover mb-1 border border-slate-300 shadow-xs"
            />
            <div className="font-black text-sm uppercase tracking-wider">{restaurant.name}</div>
            <div className="text-[10px] text-orange-600 font-bold italic tracking-wide">
              "{restaurant.tagline || 'Your Universe of Flavours.'}"
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{restaurant.address}</div>
            <div className="text-[10px] text-slate-600">Ph: {restaurant.phone}</div>
            <div className="text-[10px] text-slate-600 font-bold">FSSAI Lic: {restaurant.fssaiNumber}</div>
            <div className="text-[10px] text-emerald-700 font-bold">100% PURE VEGETARIAN • ZERO GST</div>
          </div>

          <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
            <div className="flex justify-between">
              <span>Bill No: {latestOrder?.orderNumber || '#CRV-89412'}</span>
              <span>Table: {currentTable?.tableNumber || '16'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
              <span>Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Guest: {latestOrder?.customerName || 'Dine-in Customer'}</span>
              {latestOrder?.customerPhone && <span>Ph: {latestOrder.customerPhone}</span>}
            </div>
          </div>

          {/* Line items table */}
          <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
            <div className="flex justify-between font-bold text-[10px] border-b border-slate-300 pb-1 text-slate-600">
              <span>ITEM</span>
              <span>QTY</span>
              <span>AMT</span>
            </div>

            {latestOrder ? (
              latestOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate max-w-[150px]">{item.productName}</span>
                  <span>{item.quantity} x {item.unitPrice}</span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Classic Margherita Pizza</span>
                  <span>1 x 150</span>
                  <span>₹150.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Cheesy Garlic Breadsticks</span>
                  <span>1 x 90</span>
                  <span>₹90.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thick Cold Coffee w/ Ice Cream</span>
                  <span>2 x 95</span>
                  <span>₹190.00</span>
                </div>
              </>
            )}
          </div>

          {/* Totals */}
          <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({latestOrder?.couponCode || 'WELCOME10'}):</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            {hasAnyTaxes ? (
              <>
                {restaurant.taxRates.cgstPercent > 0 && (
                  <div className="flex justify-between">
                    <span>CGST ({restaurant.taxRates.cgstPercent}%):</span>
                    <span>{formatCurrency(cgst)}</span>
                  </div>
                )}
                {restaurant.taxRates.sgstPercent > 0 && (
                  <div className="flex justify-between">
                    <span>SGST ({restaurant.taxRates.sgstPercent}%):</span>
                    <span>{formatCurrency(sgst)}</span>
                  </div>
                )}
                {restaurant.taxRates.serviceChargePercent > 0 && (
                  <div className="flex justify-between">
                    <span>Service Charge ({restaurant.taxRates.serviceChargePercent}%):</span>
                    <span>{formatCurrency(serviceCharge)}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-between text-emerald-800 font-bold text-[10px] py-0.5">
                <span>GST & Taxes:</span>
                <span>₹0.00 (Zero GST Café)</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-300 text-slate-900">
              <span>NET PAYABLE:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-500 space-y-0.5">
            <p>Payment Mode: {latestOrder?.paymentMethod ? latestOrder.paymentMethod.toUpperCase() : 'UPI VERIFIED'}</p>
            <p>Auth Ref: TXN_{Date.now().toString().slice(-8)}</p>
            <p className="font-bold pt-1 text-slate-700">Thank you for dining with us!</p>
            <p>Powered by Craverse Dine-in Platform</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="pt-2 flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Slip</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
