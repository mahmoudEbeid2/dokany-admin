import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Users, 
  MapPin, 
  Palette, 
  Target,
  Mail,
  Globe,
  Building,
  Map,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { campaignService, Theme, Location, CreateCampaignData } from '../../services/campaignService';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateCampaignData>({
    title: '',
    content: '',
    targetType: 'all', // 'all', 'theme', 'location'
    targetThemeIds: [],
    targetLocations: []
  });

  // Form validation state
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchThemes();
    fetchLocations();
  }, []);

  const fetchThemes = async () => {
    try {
      console.log('Fetching themes...');
      const response = await campaignService.getThemes();
      console.log('Themes response in component:', response);
      console.log('Themes array length:', response.length);
      setThemes(response);
    } catch (error) {
      console.error('Error fetching themes:', error);
      setError('Failed to fetch themes. Please try again.');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await campaignService.getLocations();
      setLocations(response);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Campaign title is required';
    } else if (formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    // Content validation
    if (!formData.content.trim()) {
      errors.content = 'Campaign content is required';
    } else if (formData.content.trim().length < 20) {
      errors.content = 'Content must be at least 20 characters long';
    } else if (formData.content.trim().length > 2000) {
      errors.content = 'Content cannot exceed 2000 characters';
    }

    // Theme validation
    if (formData.targetType === 'theme' && (!formData.targetThemeIds || formData.targetThemeIds.length === 0)) {
      errors.targetThemeIds = 'Please select at least one theme';
    }

    // Location validation
    if (formData.targetType === 'location' && (!formData.targetLocations || formData.targetLocations.length === 0)) {
      errors.targetLocations = 'Please select at least one location';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof CreateCampaignData, value: any) => {
    console.log('handleInputChange called with field:', field, 'value:', value);
    setFormData(prev => {
      const newData = {
      ...prev,
      [field]: value
      };
      console.log('New form data:', newData);
      return newData;
    });

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Reset related fields when target type changes
    if (field === 'targetType') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        targetThemeIds: value === 'theme' ? prev.targetThemeIds : [],
        targetLocations: value === 'location' ? prev.targetLocations : []
      }));
      
      // Clear related validation errors
      setValidationErrors(prev => ({
        ...prev,
        targetThemeIds: '',
        targetLocations: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data according to API specification
      let campaignData: any = {
        title: formData.title.trim(),
        content: formData.content.trim()
      };

      // Only add theme or location data, not both
      if (formData.targetType === 'theme' && formData.targetThemeIds && formData.targetThemeIds.length > 0) {
        campaignData.target_theme_id = formData.targetThemeIds[0];
        console.log('Adding theme ID:', formData.targetThemeIds[0]);
      } else if (formData.targetType === 'location' && formData.targetLocations && formData.targetLocations.length > 0) {
        const locationData = formData.targetLocations.map(locName => {
          const location = locations.find(l => l.name === locName);
          console.log('Processing location:', locName, 'Type:', location?.type);
          
          if (location?.type === 'country') {
            return { country: locName };
          }
          if (location?.type === 'governorate') {
            return { governorate: locName };
          }
          if (location?.type === 'city') {
            return { city: locName };
          }
          return { country: locName }; // fallback
        });
        
        campaignData.target_locations = locationData;
        console.log('Location data prepared:', locationData);
      }
      // If targetType is 'all', don't add any targeting data



      console.log('=== CAMPAIGN DATA DEBUG ===');
      console.log('Form Data:', formData);
      console.log('Locations:', locations);
      console.log('Themes:', themes);
      console.log('Final API Data:', JSON.stringify(campaignData, null, 2));
      console.log('API Endpoint: /admin/campaigns');
      console.log('Request Method: POST');
      
      // Validate data before sending
      if (!campaignData.title || !campaignData.content) {
        throw new Error('Title and content are required');
      }

      if (formData.targetType === 'theme' && (!campaignData.target_theme_id)) {
        throw new Error('Theme ID is required for theme targeting');
      }

      if (formData.targetType === 'location' && (!campaignData.target_locations || campaignData.target_locations.length === 0)) {
        throw new Error('Locations are required for location targeting');
                }
      
      console.log('=== END DEBUG ===');

      // Create campaign
      const newCampaign = await campaignService.createCampaign(campaignData);
      
      console.log('Campaign created successfully:', newCampaign);
      setSuccess('Campaign created successfully! Redirecting to campaigns list...');
      
      // Navigate back to campaigns list after a short delay
      setTimeout(() => {
        navigate('/campaigns');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      
      // Handle different error response formats
      let errorMessage = 'Failed to create campaign. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationToggle = (locationName: string) => {
    const currentLocations = formData.targetLocations || [];
    console.log('handleLocationToggle called with:', locationName);
    console.log('Current locations before:', currentLocations);
    
    if (currentLocations.includes(locationName)) {
      const newLocations = currentLocations.filter(loc => loc !== locationName);
      console.log('Removing location, new locations:', newLocations);
      handleInputChange('targetLocations', newLocations);
    } else {
      const newLocations = [...currentLocations, locationName];
      console.log('Adding location, new locations:', newLocations);
      handleInputChange('targetLocations', newLocations);
    }
  };

  const getEstimatedRecipients = () => {
    if (formData.targetType === 'all') {
      return locations.reduce((total, loc) => total + loc.seller_count, 0);
    } else if (formData.targetType === 'theme') {
      return 'Theme-based targeting';
    } else if (formData.targetType === 'location') {
      const targetLocations = formData.targetLocations || [];
      return targetLocations.reduce((total, locName) => {
        const location = locations.find(loc => loc.name === locName);
        return total + (location?.seller_count || 0);
      }, 0);
    }
    return 0;
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/campaigns')}
            className="p-3 hover:bg-white/80 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg bg-white/60 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New Campaign
            </h1>
            <p className="text-gray-600 mt-2">Create and send advertising campaigns to sellers</p>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
              <button
              onClick={clearMessages}
              className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100"
              >
                ✕
              </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-green-800 font-medium">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {/* Campaign Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Mail className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                Campaign Details
              </h3>
              
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      validationErrors.title 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Enter campaign title..."
                  />
                  {validationErrors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Campaign Content *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                      validationErrors.content 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Enter campaign content..."
                  />
                  {validationErrors.content && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.content}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-gray-500 text-right">
                    {formData.content.length}/2000 characters
                  </div>
                </div>
              </div>
            </div>

            {/* Targeting Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Target className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                Targeting Options
              </h3>
              
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Targeting Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                    <label className={`flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                      formData.targetType === 'all' 
                        ? 'border-blue-500 bg-blue-50 shadow-lg' 
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}>
                      <input
                        type="radio"
                        name="targetType"
                        value="all"
                        checked={formData.targetType === 'all'}
                        onChange={(e) => handleInputChange('targetType', e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">All Sellers</div>
                          <div className="text-xs text-gray-600">All users</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                      formData.targetType === 'theme' 
                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}>
                      <input
                        type="radio"
                        name="targetType"
                        value="theme"
                        checked={formData.targetType === 'theme'}
                        onChange={(e) => handleInputChange('targetType', e.target.value)}
                        className="mr-3 text-purple-600"
                      />
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Theme</div>
                          <div className="text-xs text-gray-600">By theme</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                      formData.targetType === 'location' 
                        ? 'border-green-500 bg-green-50 shadow-lg' 
                        : 'border-gray-300 hover:border-green-300 hover:bg-green-50/50'
                    }`}>
                      <input
                        type="radio"
                        name="targetType"
                        value="location"
                        checked={formData.targetType === 'location'}
                        onChange={(e) => handleInputChange('targetType', e.target.value)}
                        className="mr-3 text-green-600"
                      />
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Location</div>
                          <div className="text-xs text-gray-600">By location</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Theme Selection */}
                {formData.targetType === 'theme' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Theme *
                    </label>
                    
                    <div className="max-h-48 overflow-y-auto sidebar-scrollbar border border-gray-300 rounded-lg p-3 bg-white">
                      {themes && themes.length > 0 ? (
                        themes.map(theme => (
                          <label key={theme.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.targetThemeIds || []).includes(theme.id)}
                              onChange={() => {
                                const currentThemeIds = formData.targetThemeIds || [];
                                if (currentThemeIds.includes(theme.id)) {
                                  handleInputChange('targetThemeIds', currentThemeIds.filter(id => id !== theme.id));
                                } else {
                                  handleInputChange('targetThemeIds', [...currentThemeIds, theme.id]);
                                }
                              }}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{theme.name}</span>
                    </label>
                        ))
                      ) : (
                        <div className="text-gray-500 text-center py-4">No themes available</div>
                      )}
                    </div>
                    
                    {validationErrors.targetThemeId && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {validationErrors.targetThemeId}
                      </p>
                    )}
                  </div>
                )}

                {/* Location Selection */}
                {formData.targetType === 'location' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select Location *
                      </label>
                      {validationErrors.targetLocations && (
                        <p className="mb-3 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.targetLocations}
                        </p>
                      )}
                      
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Countries Dropdown */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🌍 Countries
                          </label>
                          <div className="max-h-48 overflow-y-auto sidebar-scrollbar border border-gray-300 rounded-lg p-3 bg-white">
                            {locations.filter(loc => loc.type === 'country').map(country => (
                              <label key={country.name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(formData.targetLocations || []).includes(country.name)}
                                  onChange={() => handleLocationToggle(country.name)}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">{country.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Governorates Dropdown */}
                    <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🏛️ Governorates
                      </label>
                          <div className="max-h-48 overflow-y-auto sidebar-scrollbar border border-gray-300 rounded-lg p-3 bg-white">
                            {locations.filter(loc => loc.type === 'governorate').map(governorate => (
                              <label key={governorate.name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                          <input
                                type="checkbox"
                                  checked={(formData.targetLocations || []).includes(governorate.name)}
                                  onChange={() => handleLocationToggle(governorate.name)}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">{governorate.name}</span>
                              </label>
                            ))}
                          </div>
                            </div>

                        {/* Cities Dropdown */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🏙️ Cities
                          </label>
                          <div className="max-h-48 overflow-y-auto sidebar-scrollbar border border-gray-300 rounded-lg p-3 bg-white">
                            {locations.filter(loc => loc.type === 'city').map(city => (
                              <label key={city.name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(formData.targetLocations || []).includes(city.name)}
                                  onChange={() => handleLocationToggle(city.name)}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">{city.name}</span>
                          </label>
                        ))}
                      </div>
                        </div>
                      </div>

                      {/* Selected Locations Summary */}
                      {(formData.targetLocations || []).length > 0 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">Selected Locations:</h4>
                          <div className="flex flex-wrap gap-2">
                            {(formData.targetLocations || []).map(locationName => {
                              const location = locations.find(l => l.name === locationName);
                              return (
                                <span
                                  key={locationName}
                                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                >
                                  {location?.type === 'country' && '🌍'}
                                  {location?.type === 'governorate' && '🏛️'}
                                  {location?.type === 'city' && '🏙️'}
                                  {locationName}
                                  <button
                                    onClick={() => handleLocationToggle(locationName)}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                  >
                                    ✕
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Campaign Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                Campaign Preview
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-100 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">
                    {formData.title || 'Campaign Title'}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {formData.content || 'Campaign content will appear here...'}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Targeting Type:</span>
                    <span className="font-bold text-blue-700">
                      {formData.targetType === 'all' && '🌍 All Sellers'}
                      {formData.targetType === 'theme' && '🎨 Specific Theme'}
                      {formData.targetType === 'location' && '📍 Specific Location'}
                    </span>
                  </div>
                  
                  {formData.targetType === 'theme' && (formData.targetThemeIds || []).length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Selected Themes:</span>
                      <span className="font-bold text-purple-700">
                        {(formData.targetThemeIds || []).length} theme(s)
                      </span>
                    </div>
                  )}
                  
                  {formData.targetType === 'location' && (formData.targetLocations || []).length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Selected Locations:</span>
                      <span className="font-bold text-green-700">
                        {(formData.targetLocations || []).length} location(s)
                      </span>
                    </div>
                  )}


                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Actions</h3>
              
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || !formData.title || !formData.content}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg font-semibold"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Create Campaign
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/campaigns')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:scale-105 shadow-lg font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Cancel
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 text-center">
                  💡 <strong>Tip:</strong> Review your campaign details carefully before creating. 
                  You can edit campaigns after creation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
