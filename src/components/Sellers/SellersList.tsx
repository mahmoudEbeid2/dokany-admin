import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { deleteSeller, toggleSellerPayment, Seller } from '../../store/slices/sellersSlice';
import SellerForm from './SellerForm';
import { Edit, Trash2, Plus, Mail } from 'lucide-react';

const SellersList: React.FC = () => {
  const sellers = useSelector((state: RootState) => state.sellers.sellers);
  const themes = useSelector((state: RootState) => state.themes.themes);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

  const handleEdit = (seller: Seller) => {
    setEditingSeller(seller);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const seller = sellers.find(s => s.id === id);
    if (window.confirm(`Are you sure you want to delete ${seller?.fullName}? This action cannot be undone.`)) {
      dispatch(deleteSeller(id));
    }
  };

  const handleTogglePayment = (id: string) => {
    dispatch(toggleSellerPayment(id));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSeller(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sellers Management</h1>
          <p className="text-gray-600 mt-2">Manage seller accounts and payments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="hidden sm:flex bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Seller</span>
        </button>
      </div>
      {/* زر عائم للموبايل */}
      <button
        onClick={() => setShowForm(true)}
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Add Seller"
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Cards for all screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => {
          const s = seller as any;
          // جلب صورة الثيم إذا متوفر
          let themeImg = '';
          if (s.theme_id) {
            const theme = themes.find(t => t.id === s.theme_id);
            if (theme) themeImg = theme.image ;
          }
          // صورة عشوائية افتراضية
          if (!themeImg) themeImg = `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}`;
          return (
            <div key={seller.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col items-center text-center space-y-1 max-w-[280px] ">
              <img src={themeImg} alt="Seller" className="w-30 h-30 rounded-full object-cover mb-1 border-2" />
              <div className="text-lg font-bold text-gray-900">{s.user_name || seller.fullName || '---'}</div>
              <div className="text-sm text-gray-500">{s.email || seller.email || '---'}</div>
              <div className="text-sm text-gray-500">{s.phone || '---'}</div>
              <div className="flex justify-center space-x-2 pt-2">
                <button onClick={() => handleEdit(seller)} className="text-blue-600 hover:text-blue-900 transition-colors"><Edit className="h-5 w-5" /></button>
                <button onClick={() => handleDelete(seller.id)} className="text-red-600 hover:text-red-900 transition-colors"><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          );
        })}
      </div>
      {showForm && (
        <SellerForm
          seller={editingSeller}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default SellersList;