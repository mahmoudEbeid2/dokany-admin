import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit, Shield } from 'lucide-react';
import { adminService } from '../../services/adminService';

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
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile data</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Image */}
              <div className="relative">
                {profileData.profile_imge || previewUrl ? (
                  <img
                    src={previewUrl || profileData.profile_imge || ''}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                {(!profileData.profile_imge && !previewUrl) && (
                  <div className={`w-24 h-24 rounded-full ${avatarColor} flex items-center justify-center border-4 border-white shadow-lg`}>
                    <span className="text-white text-xl font-bold">{initials}</span>
                  </div>
                )}
                
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg">
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
              
              <div>
                <h2 className="text-2xl font-bold">
                  {profileData.f_name} {profileData.l_name}
                </h2>
                <p className="text-blue-100">@{profileData.user_name}</p>
                <div className="flex items-center mt-2">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm capitalize">{profileData.role}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.user_name}
                  onChange={(e) => handleInputChange('user_name', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.f_name}
                  onChange={(e) => handleInputChange('f_name', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="+201012345678"
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Location
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Account Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium capitalize">{profileData.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-medium text-sm">{profileData.id}</p>
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