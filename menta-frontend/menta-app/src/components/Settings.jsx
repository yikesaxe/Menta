import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from './AuthContext';

const loadGoogleMapsScript = (apiKey, callback) => {
  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.id = 'googleMaps';
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};

function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState('profile');
  const { isLoggedIn, user, getToken } = useAuth();

  useEffect(() => {
    loadGoogleMapsScript(process.env.REACT_APP_GOOGLE_API_KEY);
  }, []);

  const handleProfileUpdate = async (updatedUser) => {
    try {
      const token = getToken();
      const formData = new FormData();
      const BASE_URL = 'http://127.0.0.1:8000';

      // Upload profile and cover photos if changed
      if (updatedUser.profile_picture && typeof updatedUser.profile_picture !== 'string') {
        const profileFormData = new FormData();
        profileFormData.append('files', updatedUser.profile_picture);
        const profileResponse = await axios.post(`${BASE_URL}/upload-images`, profileFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        updatedUser.profile_picture = profileResponse.data[0]; // No need to replace leading slashes
      }

      if (updatedUser.cover_photo && typeof updatedUser.cover_photo !== 'string') {
        const coverFormData = new FormData();
        coverFormData.append('files', updatedUser.cover_photo);
        const coverResponse = await axios.post(`${BASE_URL}/upload-images`, coverFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        updatedUser.cover_photo = coverResponse.data[0]; // No need to replace leading slashes
      }

      // Append all form data fields
      for (const key in updatedUser) {
        formData.append(key, updatedUser[key]);
      }

      // Add missing fields if not present
      const requiredFields = ['first_name', 'last_name', 'email', 'dob', 'interests', 'profile_picture', 'location', 'bio', 'cover_photo'];
      requiredFields.forEach(field => {
        if (!formData.has(field)) {
          formData.append(field, user[field] || '');
        }
      });

      await axios.put(`${BASE_URL}/users/${user.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'profile':
        return <ProfileSection user={user} onUpdate={handleProfileUpdate} />;
      case 'notifications':
        return <NotificationsSection />;
      case 'account':
        return <AccountSection user={user} onUpdate={handleProfileUpdate} />;
      default:
        return <ProfileSection user={user} onUpdate={handleProfileUpdate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pt-16 pl-16 pr-12">
      <nav className="w-1/4 p-4 pt-6 sticky top-16 h-full font-inter">
        <ul>
          <li
            className={`p-2 rounded-lg ${selectedSection === 'profile' ? 'bg-blue-500 text-white' : ' hover:bg-gray-300'}`}
            onClick={() => setSelectedSection('profile')}
          >
            My Profile
          </li>
          <li
            className={`p-2 rounded-lg cursor-pointer ${selectedSection === 'notifications' ? 'bg-blue-500 text-white' : ' hover:bg-gray-300'}`}
            onClick={() => setSelectedSection('notifications')}
          >
            My Notifications
          </li>
          <li
            className={`p-2 rounded-lg cursor-pointer ${selectedSection === 'account' ? 'bg-blue-500 text-white' : ' hover:bg-gray-300'}`}
            onClick={() => setSelectedSection('account')}
          >
            My Account
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

const ProfileSection = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profile_picture: null,
    cover_photo: null
  });

  const { getToken } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || null,
        cover_photo: user.cover_photo || null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await axios.post('http://127.0.0.1:8000/upload-images', formData, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data[0]; // No need to replace leading slashes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedData = { ...formData };

    if (formData.profile_picture && typeof formData.profile_picture !== 'string') {
      updatedData.profile_picture = await uploadImage(formData.profile_picture);
    }

    if (formData.cover_photo && typeof formData.cover_photo !== 'string') {
      updatedData.cover_photo = await uploadImage(formData.cover_photo);
    }

    onUpdate(updatedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">menta.com/</span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={user ? user.username : 'janesmith'}
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">Bio</label>
              <div className="mt-2">
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder={user ? user.bio : 'Write a few sentences about yourself.'}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
            </div>

            <div className="col-span-full">
              <label htmlFor="profile_picture" className="block text-sm font-medium leading-6 text-gray-900">Profile Photo</label>
              <div className="mt-2 flex items-center gap-x-3">
                {formData.profile_picture ? (
                  <img src={typeof formData.profile_picture === 'string' ? formData.profile_picture : URL.createObjectURL(formData.profile_picture)} alt="Profile" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <UserCircleIcon aria-hidden="true" className="h-12 w-12 text-gray-300 " />
                )}
                <label
                  htmlFor="profile_picture_upload"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Change
                  <input
                    id="profile_picture_upload"
                    name="profile_picture"
                    type="file"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover_photo" className="block text-sm font-medium leading-6 text-gray-900">Cover photo</label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="cover_photo_upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-400"
                    >
                      <span>Upload a file</span>
                      <input
                        id="cover_photo_upload"
                        name="cover_photo"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const AccountSection = ({ user, onUpdate }) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location: '',
    dob: '',  // Added dob field
    interests: ''  // Changed to string
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        location: user.location || '',
        dob: user.dob || '',  // Set initial value for dob
        interests: user.interests.join(',') || ''  // Convert interests array to comma-separated string
      });
      setAddress(user.location || '');
    }
  }, [user]);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      location: address,
      interests: formData.interests.split(',')  // Convert interests string to array before sending to backend
    };
    onUpdate(updatedFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">First name</label>
            <div className="mt-2">
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                placeholder={user ? user.first_name : 'John'}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
            <div className="mt-2">
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                placeholder={user ? user.last_name : 'Doe'}
                autoComplete="family-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={user ? user.email : 'john.doe@example.com'}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">Date of Birth</label>
            <div className="mt-2">
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                placeholder={user ? user.dob : 'YYYY-MM-DD'}
                autoComplete="bday"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="interests" className="block text-sm font-medium leading-6 text-gray-900">Interests</label>
            <div className="mt-2">
              <input
                id="interests"
                name="interests"
                type="text"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Enter interests separated by commas"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">Location</label>
            <div className="mt-2">
              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div className="relative">
                    <input
                      {...getInputProps({
                        placeholder: 'Search Places ...',
                        className: 'location-search-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                      })}
                    />
                    <div className="autocomplete-dropdown-container absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const { placeId, ...rest } = getSuggestionItemProps(suggestion);
                        const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                        const style = suggestion.active
                          ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                          : { backgroundColor: '#ffffff', cursor: 'pointer' };
                        return (
                          <div
                            key={placeId}
                            className={className}
                            style={style}
                            {...rest}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const NotificationsSection = () => (
  <form>
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">We'll always let you know about important changes, but you pick what else you want to hear about.</p>

      <div className="mt-10 space-y-10">
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
          <div className="mt-6 space-y-6">
            <div className="relative flex gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  id="comments"
                  name="comments"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="comments" className="font-medium text-gray-900">Comments</label>
                <p className="text-gray-500">Get notified when someone posts a comment on your posts.</p>
              </div>
            </div>
            <div className="relative flex gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  id="likes"
                  name="likes"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="likes" className="font-medium text-gray-900">Likes</label>
                <p className="text-gray-500">Get notified when someone likes on your posts.</p>
              </div>
            </div>
            <div className="relative flex gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  id="follows"
                  name="follows"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="follows" className="font-medium text-gray-900">Follows</label>
                <p className="text-gray-500">Get notified when someone new starts following you.</p>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
          <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-x-3">
              <input
                id="push-everything"
                name="push-notifications"
                type="radio"
                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">Everything</label>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                id="push-email"
                name="push-notifications"
                type="radio"
                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">Same as email</label>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                id="push-nothing"
                name="push-notifications"
                type="radio"
                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">No push notifications</label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
      <button
        type="submit"
        className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        Save
      </button>
    </div>
  </form>
);

export default SettingsPage;
