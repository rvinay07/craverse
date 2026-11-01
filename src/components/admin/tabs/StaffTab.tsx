import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Role } from '../../../types';
import {
  Users,
  Plus,
  Shield,
  Phone,
  Mail,
  UserCheck,
  X
} from 'lucide-react';

export const StaffTab: React.FC = () => {
  const { staff, floors, addStaffMember, updateStaffMember, restaurant } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // New staff form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('waiter');
  const [phone, setPhone] = useState('+91 ');
  const [floorId, setFloorId] = useState(floors[0]?.id || '');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addStaffMember({
      restaurantId: restaurant.id,
      name: name.trim(),
      email: email.trim(),
      role,
      phone: phone.trim(),
      isActive: true,
      assignedFloorId: role === 'waiter' ? floorId : undefined
    });

    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  const getRoleBadge = (r: Role) => {
    switch (r) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'kitchen':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cashier':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'waiter':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base">
            Staff & Role Permissions ({staff.length})
          </h2>
          <p className="text-xs text-slate-500">
            Define role boundaries for Kitchen KDS, Waiter Hub, and POS Cashiers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Staff Account</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${getRoleBadge(
                    member.role
                  )}`}
                >
                  {member.role.replace('_', ' ')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                <div className="space-y-1 text-xs text-slate-500 mt-2">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                  {member.assignedFloorId && (
                    <div className="text-[11px] text-orange-700 font-semibold pt-0.5">
                      Assigned Floor: {floors.find((f) => f.id === member.assignedFloorId)?.name || 'All Floors'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">PIN Access Enabled</span>
              <button
                onClick={() =>
                  updateStaffMember(member.id, { isActive: !member.isActive })
                }
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                {member.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleAddStaff}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">New Staff Account</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email / Username</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@craverse.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Permission</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              >
                <option value="waiter">Waiter (Floor Hub)</option>
                <option value="kitchen">Kitchen Staff (KDS)</option>
                <option value="cashier">Cashier (Billing POS)</option>
                <option value="manager">Restaurant Manager</option>
                <option value="owner">Admin / Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            {role === 'waiter' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Floor</label>
                <select
                  value={floorId}
                  onChange={(e) => setFloorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                >
                  {floors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

