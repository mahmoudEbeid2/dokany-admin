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
import { Edit, Trash2, Plus, Loader, AlertCircle, Search } from "lucide-react";

const SellersList: React.FC = () => {
  const { sellers, loading, error } = useSelector(
    (state: RootState) => state.sellers
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Initial fetch when component mounts
    dispatch(fetchSellers());
  }, [dispatch]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        dispatch(searchSellers(searchQuery));
      } else {
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

  const handleCardClick = (id: string) => {
    navigate(`/dashboard/sellers/${id}`);
  };

  const handleDelete = (id: string) => {
    const seller = sellers.find((s) => s.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete ${seller?.user_name}? This action cannot be undone.`
      )
    ) {
      dispatch(deleteSeller(id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSeller(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sellers Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage seller accounts and details
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
            />
          </div>
          <button
            onClick={() => handleOpenForm(null)}
            className="hidden sm:flex bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Seller</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-3" />
          <span>Error: {error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller: Seller) => {
            const profileImage =
              seller.profile_imge || `/public/CustomerImage.png`;
            return (
              <div
                key={seller.id}
                onClick={() => handleCardClick(seller.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center space-y-3 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer"
              >
                <img
                  src={profileImage}
                  alt={seller.user_name}
                  className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-200"
                />
                <div className="text-lg font-bold text-gray-900">
                  {seller.user_name}
                </div>
                <div className="text-sm text-gray-500">{seller.email}</div>
                <div className="text-sm text-gray-500">{seller.phone}</div>
                <div
                  className="flex justify-center space-x-3 pt-3 mt-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleOpenForm(seller)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Seller"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Seller"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <SellerForm seller={editingSeller} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default SellersList;
