import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setLoading, setError, setManagers, deleteManager } from '../../store/slices/managersSlice';
import { adminService } from '../../services/adminService';
import ManagerForm from './ManagerForm';
import ManagerDetails from './ManagerDetails';
import { Trash2, Plus, Shield, Mail, Edit, User, Search, X, Phone, MapPin, Loader, UserCheck } from 'lucide-react';
import { Manager } from '../../store/slices/managersSlice';
import LoaderSpinner from '../ui/Loader';

const ManagersList: React.FC = () => {
  const { managers, loading, error } = useSelector((state: RootState) => state.managers);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const admins = await adminService.getAdmins();
      
      console.log('📋 FETCH RESULTS:', admins); // Debug log
      console.log('📋 First admin profile_imge:', admins[0]?.profile_imge); // Debug log
      
      // Ensure all managers have the required fields
      const processedAdmins = admins.map(admin => {
        console.log('🔍 Processing admin:', {
          id: admin.id,
          name: `${admin.f_name} ${admin.l_name}`,
          profile_imge: admin.profile_imge,
          profile_imge_type: typeof admin.profile_imge,
          profile_imge_keys: admin.profile_imge && typeof admin.profile_imge === 'object' ? Object.keys(admin.profile_imge) : null
        });
        
        return {
          ...admin,
          profile_imge: (() => {
            // Handle different data types from different APIs
            if (typeof admin.profile_imge === 'string') {
              return admin.profile_imge;
            } else if (admin.profile_imge && typeof admin.profile_imge === 'object') {
              // If it's an object, try to extract the URL
              console.log('🔧 Converting object profile_imge:', admin.profile_imge);
              // Try different possible properties
              const profileObj = admin.profile_imge as any;
              
              // Try multiple possible properties
              const possibleUrls = [
                profileObj.url,
                profileObj.src,
                profileObj.path,
                profileObj.profile_imge,
                profileObj.image,
                profileObj.photo,
                profileObj.avatar,
                profileObj.picture
              ];
              
              const extractedUrl = possibleUrls.find(url => url && typeof url === 'string');
              console.log('🔧 Extracted URL:', extractedUrl);
              return extractedUrl || null;
            } else {
              return null;
            }
          })(),
          f_name: admin.f_name || '',
          l_name: admin.l_name || '',
          user_name: admin.user_name || '',
          email: admin.email || '',
          phone: admin.phone || '',
          city: admin.city || '',
          country: admin.country || '',
          governorate: admin.governorate || '',
          role: admin.role || 'admin',
          subdomain: admin.subdomain || null,
          payout_method: admin.payout_method || null,
          password: admin.password || '',
          resetToken: admin.resetToken || null,
          resetTokenExpiresAt: admin.resetTokenExpiresAt || null,
          logo: admin.logo || null,
          theme_id: admin.theme_id || null,
          image_public_id: admin.image_public_id || null,
          logo_public_id: admin.logo_public_id || null,
        };
      });
      
      console.log('📋 PROCESSED FETCH:', processedAdmins); // Debug log
      console.log('📋 First processed admin profile_imge:', processedAdmins[0]?.profile_imge); // Debug log
      
      dispatch(setManagers(processedAdmins));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch admins'));
      console.error('Error fetching admins:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Search admins
  const searchAdmins = async (query: string) => {
    if (!query.trim()) {
      fetchAdmins();
      return;
    }

    try {
      setIsSearching(true);
      dispatch(setError(null)); // Clear any previous errors
      const admins = await adminService.searchAdmins(query);
      
      console.log('🔍 SEARCH RESULTS:', admins); // Debug log
      console.log('🔍 First admin profile_imge:', admins[0]?.profile_imge); // Debug log
      
      // Handle empty results - this is normal, not an error
      if (!admins || admins.length === 0) {
        console.log('🔍 No search results found - this is normal');
        dispatch(setManagers([]));
        return;
      }
      
      // Ensure all managers have the required fields
      const processedAdmins = admins.map(admin => {
        console.log('🔍 Processing admin:', {
          id: admin.id,
          name: `${admin.f_name} ${admin.l_name}`,
          profile_imge: admin.profile_imge,
          profile_imge_type: typeof admin.profile_imge,
          profile_imge_keys: admin.profile_imge && typeof admin.profile_imge === 'object' ? Object.keys(admin.profile_imge) : null
        });
        
        return {
          ...admin,
          profile_imge: (() => {
            // Handle different data types from different APIs
            if (typeof admin.profile_imge === 'string') {
              return admin.profile_imge;
            } else if (admin.profile_imge && typeof admin.profile_imge === 'object') {
              // If it's an object, try to extract the URL
              console.log('🔧 Converting object profile_imge:', admin.profile_imge);
              // Try different possible properties
              const profileObj = admin.profile_imge as any;
              
              // Try multiple possible properties
              const possibleUrls = [
                profileObj.url,
                profileObj.src,
                profileObj.path,
                profileObj.profile_imge,
                profileObj.image,
                profileObj.photo,
                profileObj.avatar,
                profileObj.picture
              ];
              
              const extractedUrl = possibleUrls.find(url => url && typeof url === 'string');
              console.log('🔧 Extracted URL:', extractedUrl);
              return extractedUrl || null;
            } else {
              return null;
            }
          })(),
          f_name: admin.f_name || '',
          l_name: admin.l_name || '',
          user_name: admin.user_name || '',
          email: admin.email || '',
          phone: admin.phone || '',
          city: admin.city || '',
          country: admin.country || '',
          governorate: admin.governorate || '',
          role: admin.role || 'admin',
          subdomain: admin.subdomain || null,
          payout_method: admin.payout_method || null,
          password: admin.password || '',
          resetToken: admin.resetToken || null,
          resetTokenExpiresAt: admin.resetTokenExpiresAt || null,
          logo: admin.logo || null,
          theme_id: admin.theme_id || null,
          image_public_id: admin.image_public_id || null,
          logo_public_id: admin.logo_public_id || null,
        };
      });
      
      console.log('🔍 PROCESSED ADMINS:', processedAdmins); // Debug log
      console.log('🔍 First processed admin profile_imge:', processedAdmins[0]?.profile_imge); // Debug log
      
      dispatch(setManagers(processedAdmins));
    } catch (error) {
      console.error('🔍 Search error:', error);
      // Don't show error for search - just set empty results
      dispatch(setError(null)); // Clear any error
      dispatch(setManagers([]));
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchAdmins(searchQuery);
      } else {
        fetchAdmins();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (managers.length <= 1) {
      alert('Cannot delete the last admin user. At least one admin must remain.');
      return;
    }
    
    const manager = managers.find(m => m.id === id);
    if (!manager) {
      alert('Manager not found');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${manager.f_name} ${manager.l_name} (${manager.user_name})? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      setDeletingId(id);
      try {
        await adminService.deleteAdmin(id);
        dispatch(deleteManager(id));
        // Show success message
        alert('Manager deleted successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete admin';
        alert(`Error: ${errorMessage}`);
        console.error('Error deleting admin:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (manager: Manager) => {
    setEditingManager(manager);
    setShowForm(true);
  };

  const handleCardClick = (manager: Manager) => {
    setSelectedManager(manager);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingManager(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedManager(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    // Refresh the list after adding/editing
    if (searchQuery.trim()) {
      // If there's an active search, search again
      searchAdmins(searchQuery);
    } else {
      // Otherwise, fetch all admins
      fetchAdmins();
    }
  };

  const handleEditFromDetails = () => {
    if (selectedManager) {
      setEditingManager(selectedManager);
      setShowDetails(false);
      setShowForm(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    dispatch(setError(null)); // Clear any errors
    fetchAdmins(); // Reload all managers
  };

  if (loading && managers.length === 0) {
    return (
      <LoaderSpinner 
        size="lg" 
        color="blue" 
        text="Loading admins..." 
        fullScreen={true}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
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
          
          {/* Desktop Buttons */}
          <div className="hidden xl:block">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 font-medium sm:font-semibold text-sm sm:text-base lg:text-lg"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span>Add Manager</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Buttons */}
        <div className="xl:hidden flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Refresh button removed */}
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => setShowForm(true)}
          className="xl:hidden fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl sm:shadow-2xl w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl sm:hover:shadow-3xl"
          aria-label="Add Manager"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by username, first name, last name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            {isSearching ? (
              <span className="flex items-center">
                <Loader size={16} className="animate-spin mr-2" />
                Searching for "{searchQuery}"...
              </span>
            ) : (
              <span>
                Found {managers.length} manager(s) for "{searchQuery}"
              </span>
            )}
          </p>
        )}
      </div>

      {/* زر عائم للموبايل */}
      <button
        onClick={() => setShowForm(true)}
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Add Manager"
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error loading admins:</p>
          <p>{error}</p>
          <button
            onClick={fetchAdmins}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading overlay for refresh */}
      {(loading || isSearching) && managers.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader size={32} className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">{isSearching ? 'Searching...' : 'Refreshing...'}</p>
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && !isSearching && searchQuery && managers.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No managers found</h3>
          <p className="text-gray-600 mb-4">
            No managers found for "<span className="font-medium">{searchQuery}</span>". Try searching by:
          </p>
          <div className="text-sm text-gray-500 space-y-1 mb-6">
            <p>• <strong>Username:</strong> admin, user, etc.</p>
            <p>• <strong>First name or last name:</strong> mohamed, ahmed, etc.</p>
            <p>• <strong>Email address:</strong> admin@gmail.com, etc.</p>
            <p>• <strong>Phone number:</strong> +2010, etc.</p>
          </div>
          <div className="flex justify-center space-x-3">
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
            <button
              onClick={fetchAdmins}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Show All Managers
            </button>
          </div>
        </div>
      )}

      {/* Managers Grid */}
      {managers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {managers.map((manager) => {
            // Create fallback avatar with initials if no profile image
            const getInitials = (firstName: string, lastName: string) => {
              return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
            };
            
            // Generate consistent color based on name
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
            
            const initials = getInitials(manager.f_name, manager.l_name);
            const avatarColor = getAvatarColor(manager.f_name + manager.l_name);
            const isDeleting = deletingId === manager.id;
            
            return (
              <div 
                key={manager.id} 
                className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={() => handleCardClick(manager)}
              >
                {/* Card Header with Gradient */}
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-2xl p-4 sm:p-6 text-white">
                  {/* Status Dot */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  
                  {/* Profile Image/Initials */}
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {manager.profile_imge && manager.profile_imge.trim() !== '' ? (
                      <img 
                        src={manager.profile_imge} 
                        alt={`${manager.f_name} ${manager.l_name}`} 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/30 shadow-xl" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback Avatar */}
                    <div 
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${avatarColor} flex items-center justify-center border-4 border-white/30 shadow-xl ${
                        manager.profile_imge && manager.profile_imge.trim() !== '' ? 'hidden' : ''
                      }`}
                    >
                      <span className="text-white font-bold text-lg sm:text-2xl">{initials}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-6" onClick={() => handleCardClick(manager)}>
                  <div className="text-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors truncate">
                      {manager.f_name} {manager.l_name}
                    </h3>
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-3 sm:mb-4">
                      <Shield className="h-4 w-4 flex-shrink-0" />
                      <span>Admin</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 sm:mb-4 truncate px-2" title={manager.email}>
                      {manager.email}
                    </p>
                    
                    {/* Contact Information */}
                    <div className="space-y-2 sm:space-y-3 text-left">
                      {/* Phone */}
                      {manager.phone && (
                        <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-2 sm:p-3 border border-gray-100">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                          </div>
                          <span className="font-medium truncate text-xs sm:text-sm">{manager.phone}</span>
                        </div>
                      )}
                      
                      {/* Location */}
                      {(manager.city || manager.country) && (
                        <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-2 sm:p-3 border border-gray-100">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                          </div>
                          <span className="font-medium truncate text-xs sm:text-sm">
                            {manager.city && manager.country ? `${manager.city}, ${manager.country}` : manager.city || manager.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex justify-center space-x-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(manager)}
                    disabled={isDeleting}
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Edit manager"
                  >
                    <Edit size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(manager.id)}
                    disabled={managers.length <= 1 || isDeleting}
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    title={managers.length <= 1 ? 'Cannot delete the last admin' : 'Delete manager'}
                  >
                    {isDeleting ? (
                      <Loader size={18} className="animate-spin sm:w-5 sm:h-5" />
                    ) : (
                      <Trash2 size={18} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ManagerForm onClose={handleCloseForm} manager={editingManager || undefined} onSuccess={handleFormSuccess} />
      )}

      {showDetails && selectedManager && (
        <ManagerDetails 
          manager={selectedManager} 
          onClose={handleCloseDetails}
          onEdit={handleEditFromDetails}
        />
      )}
    </div>
  );
};

export default ManagersList;