import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addManager,
  updateManager,
  Manager,
} from "../../store/slices/managersSlice";
import { AppDispatch, RootState } from "../../store/store";
import { X, AlertCircle } from "lucide-react";
import { unwrapResult } from "@reduxjs/toolkit";

interface ManagerFormProps {
  manager?: Manager | null;
  onClose: (refresh?: boolean) => void;
}

const ManagerForm: React.FC<ManagerFormProps> = ({ manager, onClose }) => {
  const { loading } = useSelector((state: RootState) => state.managers);
  const dispatch = useDispatch<AppDispatch>();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    user_name: "",
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (manager) {
      setFormData({
        user_name: manager.user_name || "",
        f_name: manager.f_name || "",
        l_name: manager.l_name || "",
        email: manager.email || "",
        phone: manager.phone || "",
        password: "", // Always clear password for security
      });
    }
  }, [manager]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const apiFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) apiFormData.append(key, value);
    });

    if (profileImageFile) {
      apiFormData.append("profile_imge", profileImageFile);
    }

    try {
      if (manager) {
        if (!formData.password) {
          apiFormData.delete("password");
        }
        await dispatch(
          updateManager({ id: manager.id, managerData: apiFormData })
        ).unwrap();
      } else {
        await dispatch(addManager(apiFormData)).unwrap();
      }
      onClose(true); // Close and signal to refresh the list
    } catch (error: any) {
      if (error.errors) {
        setFormErrors(error.errors);
      } else {
        setFormErrors({
          form: error.message || "An unexpected error occurred.",
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {manager ? "Edit Admin" : "Add New Admin"}
          </h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
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
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="f_name"
                value={formData.f_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {manager ? "(leave blank)" : ""}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required={!manager}
              />
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
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
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
