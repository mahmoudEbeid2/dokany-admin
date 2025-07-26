import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchThemes, deleteThemeAsync } from '../../store/slices/themesSlice';
import ThemeForm from './ThemeForm';
import { Trash2, Plus, Palette, Edit, Sparkles, Eye, Loader } from 'lucide-react';
import LoaderSpinner from '../ui/Loader';

const ThemesList: React.FC = () => {
  const themes = useSelector((state: RootState) => state.themes.themes);
  const loading = useSelector((state: RootState) => state.themes.loading);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editTheme, setEditTheme] = useState(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchThemes() as any);
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const theme = themes.find(t => t.id === id);
    if (window.confirm(`Are you sure you want to delete the theme "${theme?.name}"? This action cannot be undone.`)) {
      setDeletingId(id);
      try {
        await dispatch(deleteThemeAsync(id) as any);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (theme: any) => {
    setEditTheme(theme);
    setShowForm(true);
  };

  // Generate gradient colors for theme cards
  const getThemeGradient = (index: number) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500',
      'from-pink-500 to-rose-500',
      'from-yellow-500 to-orange-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Palette className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Theme Management
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  Create and customize stunning themes for your platform
                </p>
              </div>
            </div>
            
            <button
              onClick={() => { setShowForm(true); setEditTheme(null); }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Theme</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <LoaderSpinner 
            size="lg" 
            color="purple" 
            text="Loading themes..." 
            className="h-64"
          />
        )}

        {/* Enhanced Themes Grid */}
        {!loading && themes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {themes.map((theme, index) => {
              const isDeleting = deletingId === theme.id;
              const gradient = getThemeGradient(index);
              
              return (
                <div 
                  key={theme.id} 
                  className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden ${
                    isDeleting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {/* Theme Preview Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={theme.preview_image}
                      alt={theme.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                        <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Theme Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`h-12 w-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Palette className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                          {theme.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          Beautiful theme design
                        </p>
                      </div>
                    </div>

                    {/* Theme Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <div className="text-sm font-medium text-gray-900">Active</div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Type</div>
                        <div className="text-sm font-medium text-gray-900">Custom</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(theme)}
                        disabled={isDeleting}
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        title="Edit Theme"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(theme.id)}
                        disabled={isDeleting}
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        title="Delete Theme"
                      >
                        {isDeleting ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && themes.length === 0 && (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No themes yet</h3>
            <p className="text-gray-600 text-lg mb-6">Get started by creating your first beautiful theme.</p>
            <button
              onClick={() => { setShowForm(true); setEditTheme(null); }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create First Theme</span>
            </button>
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => { setShowForm(true); setEditTheme(null); }}
          className="sm:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          aria-label="Add Theme"
        >
          <Plus className="h-7 w-7" />
        </button>

        {showForm && (
          <ThemeForm onClose={() => setShowForm(false)} editTheme={editTheme} />
        )}
      </div>
    </div>
  );
};

export default ThemesList;