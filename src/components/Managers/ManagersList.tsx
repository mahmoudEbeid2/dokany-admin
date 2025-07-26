import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { deleteManager } from '../../store/slices/managersSlice';
import ManagerForm from './ManagerForm';
import { Trash2, Plus, Shield, Mail } from 'lucide-react';

const ManagersList: React.FC = () => {
  const managers = useSelector((state: RootState) => state.managers.managers);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    if (managers.length <= 1) {
      alert('Cannot delete the last admin user. At least one admin must remain.');
      return;
    }
    
    const manager = managers.find(m => m.id === id);
    if (window.confirm(`Are you sure you want to delete ${manager?.name}? This action cannot be undone.`)) {
      dispatch(deleteManager(id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Management</h1>
          <p className="text-gray-600 mt-2">Manage admin users and permissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="hidden sm:flex bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Manager</span>
        </button>
      </div>
      {/* زر عائم للموبايل */}
      <button
        onClick={() => setShowForm(true)}
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Add Manager"
      >
        <Plus className="h-7 w-7" />
      </button>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {managers.map((manager) => {
          const m = manager as any;
          // صورة عشوائية افتراضية
          const img = m.imageUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}`;
          return (
            <div key={manager.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col items-center text-center space-y-2 max-w-[280px] "
>
              <img src={img} alt="Manager" className="w-30 h-30 rounded-full object-cover mb-1 border-2" />
              <div className="text-lg font-bold text-gray-900">{manager.name}</div>
              <div className="text-sm text-gray-500">{manager.email}</div>
              <div className="text-sm text-gray-500">{m.phone || '---'}</div>
              <div className="flex justify-center space-x-2 pt-2">
                <button
                  onClick={() => handleDelete(manager.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-1"
                  disabled={managers.length <= 1}
                  title={managers.length <= 1 ? 'Cannot delete the last admin' : 'Delete manager'}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <ManagerForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default ManagersList;