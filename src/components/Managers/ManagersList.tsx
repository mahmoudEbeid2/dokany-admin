import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  fetchManagers,
  searchManagers,
  deleteManager,
  clearError,
  Manager,
} from "../../store/slices/managersSlice";
import ManagerForm from "./ManagerForm";
// Assuming you have a ManagerDetails component similar to SellerDetails
// import ManagerDetails from './ManagerDetails';
import { Trash2, Plus, Edit, Search, UserCheck, Loader, Mail, Phone, MapPin } from "lucide-react";

const ManagersList: React.FC = () => {
  const { managers, loading, error } = useSelector(
    (state: RootState) => state.managers
  );
  const dispatch = useDispatch<AppDispatch>();
  const [showForm, setShowForm] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(clearError());
      if (searchQuery.trim()) {
        dispatch(searchManagers(searchQuery));
      } else {
        dispatch(fetchManagers());
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, dispatch]);

  const handleDelete = (id: string) => {
    if (managers.length <= 1) {
      alert("Cannot delete the last admin.");
      return;
    }
    const manager = managers.find((m) => m.id === id);
    if (window.confirm(`Are you sure you want to delete ${manager?.name}?`)) {
      dispatch(deleteManager(id));
    }
  };

  const handleOpenForm = (manager: Manager | null) => {
    setEditingManager(manager);
    setShowForm(true);
  };

  const handleCloseForm = (refresh: boolean = false) => {
    setShowForm(false);
    setEditingManager(null);
    if (refresh) {
      dispatch(fetchManagers());
    }
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate consistent avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600', 
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-teal-500 to-teal-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading && managers.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Manager Management
                </h1>
                <p className="text-gray-600 mt-1 text-base sm:text-lg">
                  Manage admin users and permissions
                </p>
              </div>
            </div>
            
            {/* Desktop Add Button */}
            <div className="hidden xl:block">
              <button
                onClick={() => handleOpenForm(null)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 font-medium sm:font-semibold text-sm sm:text-base lg:text-lg"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                <span>Add Manager</span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto lg:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search managers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl w-full focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-lg hover:shadow-xl text-lg"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Enhanced Managers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {managers.map((manager) => {
            const initials = getInitials(manager.name || '');
            const avatarColor = getAvatarColor(manager.name || '');
            
            return (
              <div
                key={manager.id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-2xl p-4 sm:p-6 text-white">
                  {/* Status Dot */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  
                  {/* Profile Image/Initials */}
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {manager.profile_imge ? (
                      <img
                        src={manager.profile_imge}
                        alt={manager.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/30 shadow-xl"
                      />
                    ) : (
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${avatarColor} flex items-center justify-center border-4 border-white/30 shadow-xl`}>
                        <span className="text-white font-bold text-lg sm:text-2xl">{initials}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-6">
                  <div className="text-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors truncate">
                      {manager.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 sm:mb-4 truncate px-2" title={manager.email}>
                      {manager.email}
                    </p>
                    
                    {/* Contact Info */}
                    <div className="space-y-2 sm:space-y-3 text-left">
                      <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-2 sm:p-3 border border-gray-100">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                        <span className="font-medium truncate text-xs sm:text-sm">{manager.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div 
                  className="px-4 sm:px-6 pb-4 sm:pb-6 flex justify-center space-x-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleOpenForm(manager)}
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Edit Manager"
                  >
                    <Edit size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(manager.id)}
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Delete Manager"
                    disabled={managers.length <= 1}
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {showForm && (
          <ManagerForm onClose={handleCloseForm} manager={editingManager} />
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => handleOpenForm(null)}
          className="xl:hidden fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl sm:shadow-2xl w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl sm:hover:shadow-3xl"
          aria-label="Add Manager"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
        </button>
      </div>
    </div>
  );
};

export default ManagersList;
