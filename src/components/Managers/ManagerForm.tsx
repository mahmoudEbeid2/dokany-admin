import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { adminService } from "../../services/adminService";
import { addManagerToFront, updateManager } from "../../store/slices/managersSlice";
import { X, Upload, User, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Manager } from "../../store/slices/managersSlice";

interface ManagerFormProps {
  onClose: () => void;
  manager?: Manager; // Optional manager for editing
  onSuccess?: () => void; // Callback for successful operation
}

const ManagerForm: React.FC<ManagerFormProps> = ({ onClose, manager, onSuccess }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    password: "",
    city: "Cairo",
    governorate: "Cairo",
    country: "Egypt",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const isEditing = !!manager;

  // Initialize form data when editing
  useEffect(() => {
    if (manager) {
      setFormData({
        user_name: manager.user_name || "",
        f_name: manager.f_name || "",
        l_name: manager.l_name || "",
        email: manager.email || "",
        phone: manager.phone || "",
        password: "", // Don't pre-fill password for security
        city: manager.city || "Cairo",
        governorate: manager.governorate || "Cairo",
        country: manager.country || "Egypt",
      });
      
      // Set preview for existing image
      if (manager.profile_imge) {
        setPreviewUrl(manager.profile_imge);
      }
    }
  }, [manager]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    
    // Password is only required when adding new manager
    if (!isEditing && !formData.password) {
      alert("Password is required");
      return;
    }

    setLoading(true);

    try {
      if (isEditing && manager) {
        // Update existing manager
        const updateData: Partial<Manager> = {
          user_name: formData.user_name,
          f_name: formData.f_name,
          l_name: formData.l_name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          governorate: formData.governorate,
          country: formData.country,
        };
        
        const updatedManager = await adminService.updateAdmin(manager.id, updateData);
        
        // Update the manager in the store with the response from API
        dispatch(updateManager({
          id: manager.id,
          data: updatedManager
        }));
        
        showSuccessMessage("Manager updated successfully!");
      } else {
        // Add new manager with file upload
        const newAdminData = {
          user_name: formData.user_name,
          f_name: formData.f_name,
          l_name: formData.l_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "admin",
          city: formData.city,
          governorate: formData.governorate,
          country: formData.country,
          profile_imge: selectedFile,
        };
        
        const createdManager = await adminService.createAdmin(newAdminData);
        
        // Add the new manager to the front of the list
        dispatch(addManagerToFront(createdManager));
        
        showSuccessMessage("Manager added successfully!");
      }
      
      onSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    setShowSuccess(true);
    // Show success message for 3 seconds before closing
    setTimeout(() => {
      setShowSuccess(false);
      // Close form after showing success message
      setTimeout(() => {
        onClose();
      }, 500); // Small delay to ensure message is visible
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Manager' : 'Add New Manager'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Success Message - Fixed at top */}
        {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 mx-6 mt-4 rounded-r-lg flex items-center space-x-2 shadow-sm">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="font-medium">
              {isEditing ? 'Manager updated successfully!' : 'Manager added successfully!'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Image Upload */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Remove Image
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="user_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label
                htmlFor="f_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="f_name"
                name="f_name"
                value={formData.f_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label
                htmlFor="l_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="l_name"
                name="l_name"
                value={formData.l_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {!isEditing && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            )}
          </div>

          {/* Location Fields */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Location</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="governorate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Governorate
                </label>
                <input
                  type="text"
                  id="governorate"
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isEditing ? 'Update Manager' : 'Add Manager')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerForm;
