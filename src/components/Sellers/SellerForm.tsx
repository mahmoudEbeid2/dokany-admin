import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSeller, updateSeller, Seller } from '../../store/slices/sellersSlice';
import { RootState } from '../../store/store';
import { X } from 'lucide-react';

interface SellerFormProps {
  seller?: Seller | null;
  onClose: () => void;
}

const SellerForm: React.FC<SellerFormProps> = ({ seller, onClose }) => {
  const themes = useSelector((state: RootState) => state.themes.themes);
  const [formData, setFormData] = useState({
    user_name: '',
    f_name: '',
    l_name: '',
    email: '',
    phone: '',
    city: '',
    governorate: '',
    country: '',
    subdomain: '',
    payout_method: '',
    password: '',
    theme_id: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller) {
      setFormData({
        user_name: (seller as any).user_name || '',
        f_name: (seller as any).f_name || '',
        l_name: (seller as any).l_name || '',
        email: seller.email || '',
        phone: (seller as any).phone || '',
        city: (seller as any).city || '',
        governorate: (seller as any).governorate || '',
        country: (seller as any).country || '',
        subdomain: (seller as any).subdomain || '',
        payout_method: (seller as any).payout_method || '',
        password: '', // لا تملأ الباسورد عند التعديل
        theme_id: (seller as any).theme_id || '',
      });
    }
  }, [seller]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // تحقق من الإيميل والباسورد
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!formData.password && !seller) {
      alert('Password is required');
      return;
    }
    try {
      if (seller) {
        dispatch(updateSeller({
          ...seller,
          fullName: formData.f_name + ' ' + formData.l_name,
          email: formData.email,
          paypalEmail: formData.payout_method,
          isPaid: false,
        }));
      } else {
        dispatch(addSeller({
          fullName: formData.f_name + ' ' + formData.l_name,
          email: formData.email,
          paypalEmail: formData.payout_method,
          isPaid: false,
        }));
      }
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {seller ? 'Edit Seller' : 'Add New Seller'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <input type="text" id="user_name" name="user_name" value={formData.user_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="f_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" id="f_name" name="f_name" value={formData.f_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="l_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" id="l_name" name="l_name" value={formData.l_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">Governorate</label>
              <input type="text" id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
              <input type="text" id="subdomain" name="subdomain" value={formData.subdomain} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="payout_method" className="block text-sm font-medium text-gray-700 mb-1">Payout Method (PayPal Email)</label>
              <input type="text" id="payout_method" name="payout_method" value={formData.payout_method} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required={!seller} />
            </div>
            <div>
              <label htmlFor="theme_id" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select id="theme_id" name="theme_id" value={formData.theme_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Select a theme</option>
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {seller ? 'Update' : 'Add'} Seller
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerForm;