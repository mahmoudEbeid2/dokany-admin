import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSeller,
  updateSeller,
  Seller,
  clearError,
} from "../../store/slices/sellersSlice";
import { fetchThemes } from "../../store/slices/themesSlice";
import { RootState, AppDispatch } from "../../store/store";
import { X, AlertCircle } from "lucide-react";

interface SellerFormProps {
  seller?: Seller | null;
  onClose: () => void;
}

const SellerForm: React.FC<SellerFormProps> = ({ seller, onClose }) => {
  const themes = useSelector((state: RootState) => state.themes.themes);
  const themesLoading = useSelector((state: RootState) => state.themes.loading);
  const { loading } = useSelector((state: RootState) => state.sellers);
  const dispatch = useDispatch<AppDispatch>();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_name: "",
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    city: "",
    governorate: "",
    country: "",
    password: "",
    subdomain: "",
    payout_method: "",
    theme_id: "",
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchThemes() as any);
  }, [dispatch]);

  useEffect(() => {
    if (seller) {
      setFormData({
        user_name: seller.user_name || "",
        f_name: seller.f_name || "",
        l_name: seller.l_name || "",
        email: seller.email || "",
        phone: seller.phone || "",
        city: seller.city || "",
        governorate: seller.governorate || "",
        country: seller.country || "",
        password: "",
        subdomain: seller.subdomain || "",
        payout_method: seller.payout_method || "",
        theme_id: seller.theme_id || "",
      });
    }
  }, [seller]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "profile_imge") {
        setProfileImageFile(files[0]);
      } else if (name === "logo") {
        setLogoFile(files[0]);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setFormLoading(true);
    
    // Clear any existing loading state from Redux
    dispatch(clearError());

    const apiFormData = new FormData();
    const sanitizedPhone = formData.phone.replace(/\D/g, "");

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "phone") {
        if (sanitizedPhone) apiFormData.append(key, sanitizedPhone);
      } else {
        if (value) apiFormData.append(key, value);
      }
    });

    if (profileImageFile) apiFormData.append("profile_imge", profileImageFile);
    if (logoFile && !seller) apiFormData.append("logo", logoFile);

    try {
      if (seller) {
        if (!formData.password) {
          apiFormData.delete("password");
        }
        await dispatch(
          updateSeller({ id: seller.id, sellerData: apiFormData })
        ).unwrap();
      } else {
        await dispatch(addSeller(apiFormData)).unwrap();
      }
      // Clear any loading state before closing
      dispatch(clearError());
      onClose();
    } catch (error) {
      const typedError = error as {
        errors?: { [key: string]: string };
        message?: string;
      };

      if (typedError?.errors) {
        setFormErrors(typedError.errors);
      } else {
        setFormErrors({
          form: typedError?.message || "An unexpected error occurred.",
        });
      }
    } finally {
      setFormLoading(false);
      // Clear any loading state from Redux
      dispatch(clearError());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {seller ? "Edit Seller" : "Add New Seller"}
          </h2>
          <button
            onClick={() => {
              dispatch(clearError());
              onClose();
            }}
            disabled={formLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {formErrors.form && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{formErrors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              {formErrors.user_name && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.user_name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="f_name"
                value={formData.f_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="l_name"
                value={formData.l_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Governorate
              </label>
              <input
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subdomain
              </label>
              <input
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {formErrors.subdomain && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.subdomain}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payout Method
              </label>
              <input
                name="payout_method"
                value={formData.payout_method}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {seller ? "(leave blank to keep current)" : ""}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required={!seller}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                name="theme_id"
                value={formData.theme_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={themesLoading}
              >
                <option value="">{themesLoading ? "Loading themes..." : "Select a theme"}</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="profile_imge"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profile_imge"
              name="profile_imge"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Logo
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={formLoading || themesLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? "Saving..." : seller ? "Update Seller" : "Add Seller"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={formLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
