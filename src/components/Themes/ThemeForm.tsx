import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addThemeAsync, editThemeAsync } from '../../store/slices/themesSlice';
import { X } from 'lucide-react';

interface ThemeFormProps {
  onClose: () => void;
  editTheme?: any;
}

const ThemeForm: React.FC<ThemeFormProps> = ({ onClose, editTheme }) => {
  const [formData, setFormData] = useState<{ name: string; image: File | null }>({
    name: '',
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editTheme) {
      setFormData({ name: editTheme.name || '', image: null });
      setPreview(editTheme.image || null);
    } else {
      setFormData({ name: '', image: null });
      setPreview(null);
    }
  }, [editTheme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.image) {
      data.append('image', formData.image);
    } else if (editTheme && editTheme.image) {
      data.append('image', editTheme.image); // لإبقاء الصورة القديمة إذا لم يتم اختيار صورة جديدة
    }
    if (editTheme) {
      await dispatch(editThemeAsync({ id: editTheme.id, data }) as any);
    } else {
      await dispatch(addThemeAsync(data) as any);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{editTheme ? 'Edit Theme' : 'Add New Theme'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Theme Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Dark Mode, Ocean Blue"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Theme Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={!editTheme}
            />
          </div>
          {preview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="h-32 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={preview}
                  alt="Theme preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editTheme ? 'Save Changes' : 'Add Theme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemeForm;