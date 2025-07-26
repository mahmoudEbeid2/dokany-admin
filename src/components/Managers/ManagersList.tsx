import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setLoading, setError, setManagers, deleteManager } from '../../store/slices/managersSlice';
import { adminService } from '../../services/adminService';
import ManagerForm from './ManagerForm';
import ManagerDetails from './ManagerDetails';
import { Trash2, Plus, Shield, Mail, Edit, User, RefreshCw, Search, X } from 'lucide-react';
import { Manager } from '../../store/slices/managersSlice';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Management</h1>
          <p className="text-gray-600 mt-2">Manage admin users and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchAdmins}
            disabled={loading}
            className="hidden sm:flex bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="hidden sm:flex bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Manager</span>
          </button>
        </div>
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
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
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
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
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

      {/* Show managers grid only if there are results */}
      {managers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {managers.map((manager) => {
          // Create fallback avatar with initials if no profile image
          const getInitials = (firstName: string, lastName: string) => {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
          };
          
          // Generate consistent color based on name
          const getAvatarColor = (name: string) => {
            const colors = [
              'from-blue-500 to-purple-600',
              'from-green-500 to-teal-600',
              'from-orange-500 to-red-600',
              'from-purple-500 to-pink-600',
              'from-indigo-500 to-blue-600',
              'from-pink-500 to-rose-600',
              'from-yellow-500 to-orange-600',
              'from-teal-500 to-green-600'
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center space-y-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
              onClick={() => handleCardClick(manager)}
            >
              {/* Profile Image or Fallback Avatar */}
              {manager.profile_imge && manager.profile_imge.trim() !== '' ? (
                <img 
                  src={manager.profile_imge} 
                  alt={`${manager.f_name} ${manager.l_name}`} 
                  className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-200 shadow-sm" 
                  onError={(e) => {
                    // If image fails to load, hide it and show fallback
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              
              {/* Fallback Avatar - always render but hide if image exists */}
              <div 
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center mb-2 border-2 border-gray-200 shadow-sm ${
                  manager.profile_imge && manager.profile_imge.trim() !== '' ? 'hidden' : ''
                }`}
              >
                <span className="text-white font-bold text-xl">{initials}</span>
              </div>
              
              <div className="text-lg font-bold text-gray-900">{manager.f_name} {manager.l_name}</div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{manager.user_name}</span>
              </div>
              <div className="text-sm text-gray-500">{manager.email}</div>
              <div className="text-sm text-gray-500">{manager.phone || '---'}</div>
              <div className="text-xs text-gray-400">
                {manager.city}, {manager.country}
              </div>
              
              <div className="flex justify-center space-x-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleEdit(manager)}
                  disabled={isDeleting}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-1 disabled:opacity-50"
                  title="Edit manager"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(manager.id)}
                  disabled={managers.length <= 1 || isDeleting}
                  className="text-red-600 hover:text-red-800 transition-colors p-1 disabled:opacity-50"
                  title={managers.length <= 1 ? 'Cannot delete the last admin' : 'Delete manager'}
                >
                  {isDeleting ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
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