import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Table } from '../../../types';
import { generateTableQrDataUrl } from '../../../utils/qr';
import {
  QrCode,
  Plus,
  Trash2,
  Printer,
  Download,
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';

export const TablesQrTab: React.FC = () => {
  const {
    tables,
    floors,
    addTable,
    deleteTable,
    restaurant,
    setCurrentTableByNumber,
    setCurrentRole
  } = useApp();

  const [selectedFloorId, setSelectedFloorId] = useState<string>('all');
  const [previewTable, setPreviewTable] = useState<Table | null>(tables[0] || null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Table Form state
  const [tableNum, setTableNum] = useState('');
  const [tableCapacity, setTableCapacity] = useState<number>(4);
  const [tableFloorId, setTableFloorId] = useState(floors[0]?.id || '');

  useEffect(() => {
    if (previewTable) {
      generateTableQrDataUrl(previewTable.tableNumber, previewTable.qrCodeToken).then(setQrDataUrl);
    }
  }, [previewTable]);

  const filteredTables = tables.filter((t) => {
    if (selectedFloorId !== 'all' && t.floorId !== selectedFloorId) return false;
    return true;
  });

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNum.trim()) return;

    const floor = floors.find((f) => f.id === tableFloorId) || floors[0];
    const secureToken = `crv_tok_${tableNum.toLowerCase()}_${Math.random().toString(36).slice(2, 8)}`;

    addTable({
      restaurantId: restaurant.id,
      branchId: restaurant.branches[0].id,
      tableNumber: tableNum.trim(),
      qrCodeToken: secureToken,
      floorId: floor.id,
      floorName: floor.name,
      capacity: Number(tableCapacity),
      status: 'vacant'
    });

    setTableNum('');
    setShowAddModal(false);
  };

  const handlePrintTentCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Floor Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedFloorId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedFloorId === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All Tables ({tables.length})
          </button>
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFloorId(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedFloorId === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Table</span>
        </button>
      </div>

      {/* Grid: Left Tables List, Right QR Tent Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tables Matrix */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredTables.map((t) => {
            const isSelected = previewTable?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setPreviewTable(t)}
                className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {t.floorName}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                      t.status === 'occupied'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="text-center py-2">
                  <span className="text-2xl font-black text-slate-900">
                    Table {t.tableNumber}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {t.capacity} Seats
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                    {t.qrCodeToken}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove Table ${t.tableNumber}?`)) {
                        deleteTable(t.id);
                      }
                    }}
                    className="p-1 rounded text-slate-400 hover:text-red-500"
                    title="Delete Table"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* QR Tent Card Preview & Print */}
        <div className="lg:col-span-5">
          {previewTable ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Printable Table Tent Card
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-res QR for Table {previewTable.tableNumber}
                  </p>
                </div>
                <button
                  onClick={handlePrintTentCard}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5 text-orange-400" />
                  <span>Print Card</span>
                </button>
              </div>

              {/* Tent Card Display */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white text-center shadow-lg border border-slate-800 flex flex-col items-center space-y-3">
                <div className="text-[11px] uppercase font-black tracking-widest text-orange-400">
                  {restaurant.name}
                </div>

                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`Table ${previewTable.tableNumber} QR`}
                      className="w-44 h-44"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                      Generating...
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-2xl font-black tracking-tight text-white">
                    TABLE {previewTable.tableNumber}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Scan with any smartphone camera
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Browse menu • Customise • Place order • Request bill
                  </p>
                </div>
              </div>

              {/* Test Scan in Browser Button */}
              <button
                onClick={() => {
                  setCurrentTableByNumber(previewTable.tableNumber);
                  setCurrentRole('customer');
                }}
                className="w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center space-x-1.5 border border-orange-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Simulate Scanning this QR in Dine-in Mode</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              Select a table to view and print its QR tent card.
            </div>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleAddTable}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Table</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Table Identifier / Number
              </label>
              <input
                type="text"
                required
                value={tableNum}
                onChange={(e) => setTableNum(e.target.value)}
                placeholder="e.g. 21, T-B2, Rooftop-05"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Floor Section</label>
              <select
                value={tableFloorId}
                onChange={(e) => setTableFloorId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              >
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Seating Capacity</label>
              <input
                type="number"
                min={1}
                max={20}
                value={tableCapacity}
                onChange={(e) => setTableCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Create Table
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

