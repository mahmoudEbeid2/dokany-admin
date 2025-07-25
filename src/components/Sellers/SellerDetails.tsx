import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchSellerById } from "../../store/slices/sellersSlice";
import { Loader, ArrowLeft, Mail, Phone, Globe, User } from "lucide-react";

const SellerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSeller, loading, error } = useSelector(
    (state: RootState) => state.sellers
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSellerById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (!selectedSeller) {
    return <div className="text-center text-gray-500">Seller not found.</div>;
  }

  const sellerDetails = [
    { icon: User, label: "Username", value: selectedSeller.user_name },
    { icon: Mail, label: "Email", value: selectedSeller.email },
    { icon: Phone, label: "Phone", value: selectedSeller.phone },
    {
      icon: Globe,
      label: "Subdomain",
      value: selectedSeller.subdomain || "N/A",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/dashboard/sellers"
          className="flex items-center text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sellers List
        </Link>
        <div className="flex items-center space-x-4">
          <img
            src={
              selectedSeller.profile_imge ||
              `https://i.pravatar.cc/150?u=${selectedSeller.id}`
            }
            alt={selectedSeller.user_name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedSeller.f_name} {selectedSeller.l_name}
            </h1>
            <p className="text-gray-600 mt-1">Seller Details</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sellerDetails.map((detail) => (
            <div key={detail.label} className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <detail.icon className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {detail.label}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {detail.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;
