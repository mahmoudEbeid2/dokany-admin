import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit, Shield, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoaderSpinner from '../ui/Loader';

interface ProfileData {
  id: string;
  user_name: string;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  city: string;
  governorate: string;
  country: string;
  role: string;
  profile_imge: string | null;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Generate consistent avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-teal-500 to-teal-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getProfile();
      setProfileData(data);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle edit button click
  const handleEditClick = () => {
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccess(null);
    fetchProfile(); // Reset to original data
  };

  // Handle form submission (only when saving)
  const handleSubmit = async () => {
    if (!profileData) return;

    // Validate required fields
    if (!profileData.user_name || !profileData.f_name || !profileData.l_name || 
        !profileData.email || !profileData.phone || !profileData.city || 
        !profileData.governorate || !profileData.country) {
      setError('All fields are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      console.log('Starting profile update...');
      console.log('Profile data to update:', profileData);

      const formData = new FormData();
      formData.append('user_name', profileData.user_name);
      formData.append('f_name', profileData.f_name);
      formData.append('l_name', profileData.l_name);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      formData.append('city', profileData.city);
      formData.append('governorate', profileData.governorate);
      formData.append('country', profileData.country);

      if (selectedFile) {
        formData.append('profile_imge', selectedFile);
        console.log('File selected:', selectedFile.name);
      }

      console.log('FormData created, calling updateProfile...');
      const updatedProfile = await adminService.updateProfile(formData);
      console.log('Profile updated successfully:', updatedProfile);
      
      setProfileData(updatedProfile);
      setEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (profileData) {
      setProfileData({ ...profileData, [field]: value });
    }
  };

  if (loading) {
    return (
      <LoaderSpinner 
        size="lg" 
        color="blue" 
        text="Loading profile..." 
        fullScreen={true}
      />
    );
  }

  if (!profileData) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-4">Failed to load profile data</p>
          <button
            onClick={fetchProfile}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const initials = getInitials(profileData.f_name, profileData.l_name);
  const avatarColor = getAvatarColor(profileData.f_name + profileData.l_name);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <User className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  Manage your account information and settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-6 flex items-center shadow-lg">
            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <p className="font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center shadow-lg">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4">
                  {/* Profile Image */}
                  <div className="relative">
                    {profileData.profile_imge || previewUrl ? (
                      <img
                        src={previewUrl || profileData.profile_imge || ''}
                        alt="Profile"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white/30 shadow-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    
                    {(!profileData.profile_imge && !previewUrl) && (
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ${avatarColor} flex items-center justify-center border-4 border-white/30 shadow-xl`}>
                        <span className="text-white text-xl sm:text-2xl font-bold">{initials}</span>
                      </div>
                    )}
                    
                    {editing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        <Camera className="h-4 w-4 text-blue-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                      {profileData.f_name} {profileData.l_name}
                    </h2>
                    <p className="text-blue-100 text-lg mb-2">@{profileData.user_name}</p>
                    <div className="flex items-center justify-center lg:justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="text-sm capitalize">{profileData.role}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
                  {editing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {saving ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelClick}
                        className="bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.user_name}
                      onChange={(e) => handleInputChange('user_name', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.f_name}
                        onChange={(e) => handleInputChange('f_name', e.target.value)}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.l_name}
                        onChange={(e) => handleInputChange('l_name', e.target.value)}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="+201012345678"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Location Information
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Governorate
                    </label>
                    <input
                      type="text"
                      value={profileData.governorate}
                      onChange={(e) => handleInputChange('governorate', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    />
                  </div>

                  {/* Account Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Account Information
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="font-bold capitalize text-gray-900">{profileData.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="bg-gray-500 p-2 rounded-lg">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">User ID</p>
                          <p className="font-bold text-gray-900 text-sm">{profileData.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 