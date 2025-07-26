import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import {
  deleteSeller,
  fetchSellers,
  searchSellers,
  Seller,
  clearError,
} from "../../store/slices/sellersSlice";
import SellerForm from "./SellerForm";
import { Edit, Trash2, Plus, Loader, AlertCircle, Search, Users, Mail, Phone, MapPin, Eye, X, Calendar, User } from "lucide-react";
import LoaderSpinner from "../ui/Loader";

const SellersList: React.FC = () => {
  const { sellers, loading, error } = useSelector(
    (state: RootState) => state.sellers
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Initial fetch when component mounts
    dispatch(fetchSellers());
  }, [dispatch]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        setIsSearching(true);
        dispatch(searchSellers(searchQuery))
          .then((result) => {
            setIsSearching(false);
            // If search fails, just show empty state with no results
            if (result.meta.requestStatus === 'rejected') {
              // Keep the current state but show no results
            }
          })
          .catch(() => {
            setIsSearching(false);
            // Keep the current state but show no results
          });
      } else {
        setIsSearching(false);
        dispatch(fetchSellers());
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, dispatch]);

  const handleOpenForm = (seller: Seller | null) => {
    dispatch(clearError());
    setEditingSeller(seller);
    setShowForm(true);
  };

  const handleCardClick = (seller: Seller) => {
    setSelectedSeller(seller);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id: string) => {
    const seller = sellers.find((s) => s.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete ${seller?.user_name}? This action cannot be undone.`
      )
    ) {
      setDeletingId(id);
      try {
        await dispatch(deleteSeller(id)).unwrap();
        // Refresh the list after successful deletion
        if (searchQuery.trim() !== "") {
          dispatch(searchSellers(searchQuery));
        } else {
          dispatch(fetchSellers());
        }
      } catch (error) {
        console.error('Failed to delete seller:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSeller(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedSeller(null);
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

  // Seller Details Modal
  const SellerDetailsModal = () => {
    if (!selectedSeller) return null;

    const profileImage = selectedSeller.profile_imge || `/public/CustomerImage.png`;
    const initials = getInitials(selectedSeller.user_name);
    const avatarColor = getAvatarColor(selectedSeller.user_name);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Seller Details</h2>
            <button
              onClick={handleCloseDetailsModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                {profileImage && profileImage !== '/public/CustomerImage.png' ? (
                  <img
                    src={profileImage}
                    alt={selectedSeller.user_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-xl"
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full ${avatarColor} flex items-center justify-center border-4 border-blue-200 shadow-xl`}>
                    <span className="text-white font-bold text-3xl">{initials}</span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                {selectedSeller.user_name}
              </h3>
              <p className="text-gray-600 text-lg">{selectedSeller.email}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 w-24">Name:</span>
                    <span className="text-gray-900">{selectedSeller.f_name} {selectedSeller.l_name}</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 w-24">Username:</span>
                    <span className="text-gray-900">{selectedSeller.user_name}</span>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 w-24">Email:</span>
                    <span className="text-gray-900">{selectedSeller.email}</span>
                  </div>

                  {selectedSeller.phone && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 w-24">Phone:</span>
                      <span className="text-gray-900">{selectedSeller.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Location Information
                </h4>
                
                <div className="space-y-3">
                  {selectedSeller.city && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 w-24">City:</span>
                      <span className="text-gray-900">{selectedSeller.city}</span>
                    </div>
                  )}

                  {selectedSeller.governorate && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 w-24">Governorate:</span>
                      <span className="text-gray-900">{selectedSeller.governorate}</span>
                    </div>
                  )}

                  {selectedSeller.country && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 w-24">Country:</span>
                      <span className="text-gray-900">{selectedSeller.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Additional Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSeller.subdomain && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 w-24">Subdomain:</span>
                    <span className="text-gray-900">{selectedSeller.subdomain}</span>
                  </div>
                )}

                {selectedSeller.payout_method && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 w-24">Payout Method:</span>
                    <span className="text-gray-900">{selectedSeller.payout_method}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={() => {
                handleCloseDetailsModal();
                handleOpenForm(selectedSeller);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Seller</span>
            </button>
            <button
              onClick={handleCloseDetailsModal}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Sellers Management
                </h1>
                <p className="text-gray-600 mt-1 text-base sm:text-lg">
                  Manage seller accounts and monitor performance
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
                <span>Add Seller</span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto lg:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sellers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl w-full focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-lg hover:shadow-xl text-lg"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <LoaderSpinner 
            size="lg" 
            color="blue" 
            text="Loading sellers..." 
            className="h-64"
          />
        )}

        {/* Search Loading State */}
        {isSearching && (
          <LoaderSpinner 
            size="md" 
            color="blue" 
            text="Searching..." 
            className="h-32"
          />
        )}

        {/* Error State - Only show for actual errors, not search results */}
        {error && !loading && !isSearching && !searchQuery && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center mb-6 shadow-lg">
            <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading sellers</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Enhanced Sellers Grid */}
        {!loading && !isSearching && sellers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sellers.map((seller) => {
              const initials = getInitials(seller.f_name + ' ' + seller.l_name);
              const avatarColor = getAvatarColor(seller.f_name + seller.l_name);
              const isDeleting = deletingId === seller.id;
              
              return (
                <div 
                  key={seller.id} 
                  className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden ${
                    isDeleting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={() => handleCardClick(seller)}
                >
                  {/* Card Header with Gradient */}
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-2xl p-4 sm:p-6 text-white">
                    {/* Status Dot */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    
                    {/* Profile Image/Initials */}
                    <div className="flex justify-center mb-3 sm:mb-4">
                      {seller.profile_imge ? (
                        <img 
                          src={seller.profile_imge} 
                          alt={seller.user_name}
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
                  <div className="p-4 sm:p-6" onClick={() => handleCardClick(seller)}>
                    <div className="text-center mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors truncate">
                        {seller.user_name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 sm:mb-4 truncate px-2" title={seller.email}>
                        {seller.email}
                      </p>
                      
                      {/* Contact Info */}
                      <div className="space-y-2 sm:space-y-3 text-left">
                        {seller.phone && (
                          <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-2 sm:p-3 border border-gray-100">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <span className="font-medium truncate text-xs sm:text-sm">{seller.phone}</span>
                          </div>
                        )}
                        {seller.city && (
                          <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-2 sm:p-3 border border-gray-100">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            </div>
                            <span className="font-medium truncate text-xs sm:text-sm">{seller.city}, {seller.country}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div 
                    className="px-4 sm:px-6 pb-4 sm:pb-6 flex justify-center space-x-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleOpenForm(seller)}
                      className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                      title="Edit Seller"
                      disabled={isDeleting}
                    >
                      <Edit size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(seller.id)}
                      className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                      title="Delete Seller"
                      disabled={isDeleting}
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

        {/* Empty State - Show when no sellers found or search returns no results */}
        {!loading && !isSearching && sellers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No results found
            </p>
          </div>
        )}

        {showForm && (
          <SellerForm seller={editingSeller} onClose={handleCloseForm} />
        )}

        {showDetailsModal && selectedSeller && (
          <SellerDetailsModal />
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => handleOpenForm(null)}
          className="xl:hidden fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl sm:shadow-2xl w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl sm:hover:shadow-3xl"
          aria-label="Add Seller"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
        </button>
      </div>
    </div>
  );
};

export default SellersList;
