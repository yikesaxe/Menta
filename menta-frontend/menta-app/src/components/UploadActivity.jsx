import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const { isLoggedIn, user, getToken } = useAuth();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [images, setImages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('Select an activity');
  const [selectedPrivacy, setSelectedPrivacy] = useState('Select privacy');
  const [isPrivacyDropdownOpen, setIsPrivacyDropdownOpen] = useState(false);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [errors, setErrors] = useState({ hours: '', minutes: '', seconds: '' });

  const perceivedPerformanceRef = useRef(null);
  const descriptionRef = useRef(null);
  const privateNotesRef = useRef(null);
  const titleRef = useRef(null);

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
    setImages((prevImages) => [...prevImages, ...files]);
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

  const validateDuration = (name, value) => {
    if (name === 'hours') {
      return value >= 0 && value <= 99 ? '' : 'Please enter a value between 0 and 99.';
    } else {
      return value >= 0 && value <= 59 ? '' : 'Please enter a value between 0 and 59.';
    }
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value);
    const errorMessage = validateDuration(name, intValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setDuration((prevDuration) => ({
      ...prevDuration,
      [name]: intValue,
    }));
  };

  const handleFocus = () => {
    setErrors({ hours: '', minutes: '', seconds: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const description = descriptionRef.current.value;
    const perceived_performance = perceivedPerformanceRef.current.value;
    const private_notes = privateNotesRef.current.value;
    const title = titleRef.current.value;

    if (!description || !perceived_performance || !private_notes || !title) {
      alert('Please fill in all required fields.');
      return;
    }

    const durationInSeconds = (parseInt(duration.hours) * 3600) + (parseInt(duration.minutes) * 60) + parseInt(duration.seconds);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('activity', selectedActivity);
    formData.append('date', currentDate);
    formData.append('start_time', currentTime);
    formData.append('duration', durationInSeconds);
    formData.append('private_notes', private_notes);
    formData.append('privacy_type', selectedPrivacy);
    formData.append('perceived_performance', parseInt(perceived_performance));

    images.forEach((image, index) => {
      formData.append('files', image);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/activities', formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Activity uploaded successfully:', response.data);
      navigate('/feed'); // Redirect to feed after successful upload
    } catch (error) {
      console.error('Error uploading activity:', error);
    }
  };

  const handleCancel = () => {
    navigate('/feed'); // Redirect to feed when cancel is clicked
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-start pt-22 pb-8'>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
        <h1 className='w-full h-10 text-3xl mb-2 font-inter'>Upload Activity</h1>
        <form className='w-full space-y-6' onSubmit={handleSubmit}>
          <div className="border-b border-gray-900/10 pb-12 grid grid-cols-1 md:grid-cols-3 gap-7">
            <div className="space-y-4 col-span-2">
              <div className="flex space-x-7">
                <div className="w-1/3 relative">
                  <label htmlFor="activity" className="block text-sm font-medium leading-6 text-gray-900">
                    Activity
                  </label>
                  <div className="mt-2">
                    <div
                      className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 cursor-pointer"
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
                  <div className="mt-2 flex space-x-0">
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={currentDate}
                      autoComplete="date"
                      className="block w-1/2 rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      onChange={(e) => setCurrentDate(e.target.value)}
                    />
                    <input
                      id="time"
                      name="time"
                      type="time"
                      value={currentTime}
                      autoComplete="time"
                      className="block w-1/2 rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      onChange={(e) => setCurrentTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className='w-full flex space-x-7'>
                <div className="w-1/2">
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
                      ref={titleRef}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="w-1/2 flex space-x-4">
                  <div className="relative flex-1">
                    <label htmlFor="hours" className="block text-sm font-medium leading-6 text-gray-900">
                      Duration
                    </label>
                    <div className="mt-2 flex space-x-0 relative">
                      <div className="relative w-1/3">
                        <input
                          id="hours"
                          name="hours"
                          type="number"
                          value={duration.hours}
                          onChange={handleDurationChange}
                          onFocus={handleFocus}
                          placeholder="00"
                          className={`block w-full text-center border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                            errors.hours ? 'ring-red-500' : 'focus:ring-blue-500'
                          } sm:text-sm sm:leading-6`}
                        />
                        <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400">hr</span>
                      </div>
                      <div className="relative w-1/3">
                        <input
                          id="minutes"
                          name="minutes"
                          type="number"
                          value={duration.minutes}
                          onChange={handleDurationChange}
                          onFocus={handleFocus}
                          placeholder="00"
                          className={`block w-full text-center border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                            errors.minutes ? 'ring-red-500' : 'focus:ring-blue-500'
                          } sm:text-sm sm:leading-6`}
                        />
                        <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">min</span>
                      </div>
                      <div className="relative w-1/3">
                        <input
                          id="seconds"
                          name="seconds"
                          type="number"
                          value={duration.seconds}
                          onChange={handleDurationChange}
                          onFocus={handleFocus}
                          placeholder="00"
                          className={`block w-full text-center border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                            errors.seconds ? 'ring-red-500' : 'focus:ring-blue-500'
                          } sm:text-sm sm:leading-6`}
                        />
                        <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400">s</span>
                      </div>
                    </div>
                    {errors.hours && (
                      <div className="relative mt-1">
                        <p className="absolute z-20 mt-1 w-full text-sm bg-white p-2 text-blue-600 border border-blue-600 rounded-md shadow-lg">{errors.hours}</p>
                      </div>
                    )}
                    {errors.minutes && (
                      <div className="relative mt-1">
                        <p className="absolute z-20 mt-1 w-full text-sm bg-white p-2 text-blue-600 border border-blue-600 rounded-md shadow-lg">{errors.minutes}</p>
                      </div>
                    )}
                    {errors.seconds && (
                      <div className="relative mt-1">
                        <p className="absolute z-20 mt-1 w-full text-sm bg-white p-2 text-blue-600 border border-blue-600 rounded-md shadow-lg">{errors.seconds}</p>
                      </div>
                    )}
                  </div>
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
                    ref={descriptionRef}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
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
                      src={URL.createObjectURL(image)}
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
                      className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 cursor-pointer"
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
                      ref={perceivedPerformanceRef}
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
                    ref={privateNotesRef}
                    rows={3}
                    className="block w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadActivity;
