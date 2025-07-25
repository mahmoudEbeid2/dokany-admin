import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchThemes, deleteThemeAsync } from '../../store/slices/themesSlice';
import ThemeForm from './ThemeForm';
import { Trash2, Plus, Palette, Pencil, Edit } from 'lucide-react';

const ThemesList: React.FC = () => {
  const themes = useSelector((state: RootState) => state.themes.themes);
  const loading = useSelector((state: RootState) => state.themes.loading);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editTheme, setEditTheme] = useState(null);

  useEffect(() => {
    dispatch(fetchThemes() as any);
  }, [dispatch]);

  const handleDelete = (id: string) => {
    const theme = themes.find(t => t.id === id);
    if (window.confirm(`Are you sure you want to delete the theme "${theme?.name}"? This action cannot be undone.`)) {
      dispatch(deleteThemeAsync(id) as any);
    }
  };

  const handleEdit = (theme: any) => {
    setEditTheme(theme);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theme Management</h1>
          <p className="text-gray-600 mt-2">Manage platform themes and customizations</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditTheme(null); }}
          className="hidden sm:flex bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Theme</span>
        </button>
      </div>
      {/* زر عائم للموبايل */}
      <button
        onClick={() => { setShowForm(true); setEditTheme(null); }}
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Add Theme"
      >
        <Plus className="h-7 w-7" />
      </button>

      {loading && <div className="text-center py-8">Loading...</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48">
              <img
                src={theme.preview_image}
                alt={theme.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{theme.name}</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active Theme
                </span>
              </div>
              <div className="flex justify-center space-x-2 pt-4">
                <button onClick={() => handleEdit(theme)} className="text-blue-600 hover:text-blue-900 transition-colors"><Edit className="h-5 w-5" /></button>
                <button onClick={() => handleDelete(theme.id)} className="text-red-600 hover:text-red-900 transition-colors"><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {themes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No themes yet</h3>
          <p className="text-gray-500 mt-2">Get started by adding your first theme.</p>
        </div>
      )}

      {showForm && (
        <ThemeForm onClose={() => setShowForm(false)} editTheme={editTheme} />
      )}
    </div>
  );
};

export default ThemesList;