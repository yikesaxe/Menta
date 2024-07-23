import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const interestsList = [
  'Reading', 'Writing', 'Chess', 'Coding', 'Mathematics', 'Science', 'History', 'Philosophy', 'Debating', 'Public Speaking',
  'Critical Thinking', 'Puzzles', 'Board Games', 'Music', 'Art', 'Photography', 'Creative Writing', 'Programming', 'Robotics',
  'Astronomy', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Economics', 'Psychology', 'Sociology', 'Political Science',
  'Linguistics', 'Computer Science', 'Artificial Intelligence', 'Machine Learning', 'Data Science'
];

const privacyOptions = [
  {
    value: 'everyone',
    label: 'Everyone',
    description: 'Anyone on Menta can see this activity.'
  },
  {
    value: 'followers',
    label: 'Followers',
    description: "Only your followers will be able to view and access this activity's details. This activity will still count toward your goals and progress."
  },
  {
    value: 'only_you',
    label: 'Only You',
    description: "This activity is private and only visible to you and on My Feed. This activity will still count toward your goals and progress."
  }
];

function UploadActivity() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [images, setImages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('Select an activity');
  const [selectedPrivacy, setSelectedPrivacy] = useState('Select privacy');
  const [isPrivacyDropdownOpen, setIsPrivacyDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if the user is not authenticated
    }

    // Set the current date and time
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    setCurrentDate(date);
    setCurrentTime(time);
  }, [isLoggedIn, navigate]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.slice(0, 5 - images.length).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (image) => {
    setImages((prevImages) => prevImages.filter((img) => img !== image));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setIsDropdownOpen(false);
  };

  const togglePrivacyDropdown = () => {
    setIsPrivacyDropdownOpen(!isPrivacyDropdownOpen);
  };

  const handlePrivacySelect = (privacy) => {
    setSelectedPrivacy(privacy);
    setIsPrivacyDropdownOpen(false);
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className='min-h-screen bg-white pl-32 pr-32 mt-24 ml-1 mr-1'>
      <h1 className='w-full h-10 text-3xl mb-2 font-inter'>Upload Activity</h1>
      <form className='w-full space-y-6'>
        <div className="border-b border-gray-900/10 pb-12 grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="space-y-4 col-span-2">
            <div className="flex space-x-7">
              <div className="w-1/3 relative">
                <label htmlFor="activity" className="block text-sm font-medium leading-6 text-gray-900">
                  Activity
                </label>
                <div className="mt-2">
                  <div
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    {selectedActivity}
                  </div>
                  {isDropdownOpen && (
                    <div
                      className="rounded-lg absolute z-10 w-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-auto max-h-48"
                      style={{ top: '100%' }}
                    >
                      <div>
                        {interestsList.map((interest, index) => (
                          <div
                            key={index}
                            className="rounded-lg block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleActivitySelect(interest)}
                          >
                            {interest}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-1/2">
                <label htmlFor="dateTime" className="block text-sm font-medium leading-6 text-gray-900">
                  Date & Time
                </label>
                <div className="mt-2 flex space-x-1">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={currentDate}
                    autoComplete="date"
                    className="block w-1/2 rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={currentTime}
                    autoComplete="time"
                    className="block w-1/2 rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className='w-full'>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder='Book Club Night!!'
                  autoComplete="title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  placeholder='How was it? Share more details about your activity!'
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
              Image Upload
            </label>
            <div className="mt-2 flex flex-col items-start">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Upload Image
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 overflow-auto h-48">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`upload-${index}`}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <div className="space-y-4">
            <div className="flex space-x-7">
              <div className="w-1/3 relative">
                <label htmlFor="privacy-control" className="block text-sm font-medium leading-6 text-gray-900">
                  Privacy Control
                </label>
                <div className="mt-2">
                  <div
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer"
                    onClick={togglePrivacyDropdown}
                  >
                    {selectedPrivacy}
                  </div>
                  {isPrivacyDropdownOpen && (
                    <div
                      className="rounded-lg absolute z-10 w-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-auto max-h-48"
                      style={{ top: '100%' }}
                    >
                      <div>
                        {privacyOptions.map((option, index) => (
                          <div
                            key={index}
                            className="rounded-lg block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                            onClick={() => handlePrivacySelect(option.label)}
                          >
                            <div className="font-bold">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-1/3">
                <label htmlFor="perceived-performance" className="block text-sm font-medium leading-6 text-gray-900">
                  Perceived Performance
                </label>
                <div className="mt-2">
                  <input
                    id="perceived-performance"
                    name="perceived-performance"
                    type="range"
                    min="1"
                    max="10"
                    className="block w-full"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>Ok</span>
                  <span>Good</span>
                  <span>Great</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="private-notes" className="block text-sm font-medium leading-6 text-gray-900">
                Private Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="private-notes"
                  name="private-notes"
                  placeholder="Write down private notes here. How did you feel? Don't worry only you can see these."
                  rows={3}
                  className="block w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadActivity;
