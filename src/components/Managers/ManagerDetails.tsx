import React from 'react';
import { X, User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { Manager } from '../../store/slices/managersSlice';

interface ManagerDetailsProps {
  manager: Manager;
  onClose: () => void;
  onEdit?: (manager: Manager) => void;
}

const ManagerDetails: React.FC<ManagerDetailsProps> = ({ manager, onClose, onEdit }) => {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(manager);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manager Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Profile Image or Fallback Avatar */}
              {manager.profile_imge && manager.profile_imge.trim() !== '' ? (
                <img 
                  src={manager.profile_imge} 
                  alt={`${manager.f_name} ${manager.l_name}`} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  onError={(e) => {
                    // If image fails to load, hide it and show fallback
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              
              {/* Fallback Avatar - always render but hide if image exists */}
              <div 
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center border-4 border-gray-200 shadow-lg ${
                  manager.profile_imge && manager.profile_imge.trim() !== '' ? 'hidden' : ''
                }`}
              >
                <span className="text-white font-bold text-3xl">{initials}</span>
              </div>
              
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">
              {manager.f_name} {manager.l_name}
            </h3>
            <p className="text-gray-600 text-lg">@{manager.user_name}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{manager.f_name} {manager.l_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">@{manager.user_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{manager.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{manager.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Location
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{manager.city}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Governorate</p>
                    <p className="font-medium">{manager.governorate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium">{manager.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Role</span>
                </div>
                <p className="text-lg font-semibold text-purple-600 capitalize">{manager.role}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">ID</span>
                </div>
                <p className="text-sm font-mono text-blue-600 truncate">{manager.id}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetails; 