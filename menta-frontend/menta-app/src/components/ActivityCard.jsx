import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes, faChevronLeft, faChevronRight, faSearchPlus, faSearchMinus, faThumbsUp, faShare, faComment } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ActivityCard = ({ activity }) => {
  const {
    user_id,
    date = '',
    title = '',
    description = '',
    location = '',
    duration = 0, // in seconds
    activity: activityName = '', // Rename the variable locally
    images = [], // These should be URLs
    comments = [] // New field for comments
  } = activity;

  const [user, setUser] = useState({ profile_picture: '', first_name: '', last_name: '' });
  const [userNotFound, setUserNotFound] = useState(false);
  const { getToken, user: authUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState(comments);
  const [commentUsers, setCommentUsers] = useState({});
  const [streak, setStreak] = useState(0);

  const BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${user_id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setUserNotFound(true);
        } else {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, [user_id, getToken]);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/progress/${user_id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const progressData = response.data.find(prog => prog.activity === activityName);
        if (progressData) {
          setStreak(progressData.streak);
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
      }
    };

    fetchStreak();
  }, [user_id, activityName, getToken]);

  useEffect(() => {
    const fetchCommentUsers = async () => {
      const usersToFetch = commentList
        .filter(comment => !commentUsers[comment.user_id])
        .map(comment => comment.user_id);

      if (usersToFetch.length > 0) {
        const responses = await Promise.all(
          usersToFetch.map(userId =>
            axios.get(`${BASE_URL}/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            })
          )
        );

        const newCommentUsers = responses.reduce((acc, response, index) => {
          acc[usersToFetch[index]] = response.data;
          return acc;
        }, {});

        setCommentUsers(prevCommentUsers => ({ ...prevCommentUsers, ...newCommentUsers }));
      }
    };

    fetchCommentUsers();
  }, [commentList, getToken, commentUsers]);

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatStreak = (streak) => {
    if (streak > 7) {
      return `${Math.floor(streak / 7)} wks`;
    }
    return `${streak} days`;
  };

  const renderImages = () => {
    if (images.length === 1) {
      return (
        <div className="w-full h-64">
          <img
            src={images[0]}
            alt="Activity"
            className="w-full h-full object-cover rounded-sm cursor-pointer"
            onClick={() => openModal(0)}
          />
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-2">
        {images.map((url, index) => (
          <div key={index} className="relative w-full h-48">
            <img
              src={url}
              alt={`Activity ${index}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => openModal(index)}
            />
          </div>
        ))}
      </div>
    );
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(0);
    setZoomLevel(1);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setZoomLevel(1);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  const zoomIn = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.2, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.2, 1));
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleCommentSection = () => {
    setShowCommentSection(!showCommentSection);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const postComment = async () => {
    const newComment = {
      user_id: authUser.id,
      text: commentText,
      timestamp: new Date().toISOString() // Ensure this is in UTC
    };

    try {
      await axios.post(
        `${BASE_URL}/activities/${activity.id}/comments`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCommentList([newComment, ...commentList]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const convertToUserTimezone = (utcDate) => {
    const localDate = new Date(utcDate);
    return localDate.toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  };

  return (
    <div className="relative bg-white shadow-sm pr-8 pt-4 pl-7 pb-10 mx-auto rounded-sm mb-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
            </div>
          )}
          <div className="ml-4">
            {userNotFound ? (
              <div className="font-bold">User not found</div>
            ) : (
              <>
                <div className="font-bold text-sm">{user.first_name} {user.last_name}</div>
                <div className="text-gray-600 text-xs flex justify-between items-center w-full">
                  <span>{new Date(date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
                  <div className="ml-1 border-l border-gray-300 h-4"></div>
                  <span className="ml-1">{user.location}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="-mt-1 ml-18">
        <div className="font-semibold font-inter text-xl">{title}</div>
        <div className="text-sm text-gray-700 mt-2">{description}</div>
        <div className="flex items-center mt-4 space-x-6">
          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-xs uppercase">Activity</div>
            <div className="font-medium">{activityName}</div>
          </div>
          <div className="border-l border-gray-300 h-8"></div>
          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-xs uppercase">Time</div>
            <div className="font-medium">{formatDuration(duration)}</div>
          </div>
          <div className="border-l border-gray-300 h-8"></div>
          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-xs uppercase">Streak</div>
            <div className="font-medium">{formatStreak(streak)}</div>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="mt-4">
          {renderImages()}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-screen-md p-4 mx-auto">
            <div className="relative w-full mx-auto flex items-center justify-center">
              <img
                src={images[currentImageIndex]}
                alt="Activity"
                className="rounded-lg transition-transform duration-300 max-h-screen max-w-full"
                style={{ transform: `scale(${zoomLevel})`, maxWidth: '80%', maxHeight: '80%' }}
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button onClick={zoomOut} className="text-white text-3xl">
                  <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <button onClick={zoomIn} className="text-white text-3xl">
                  <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button onClick={closeModal} className="text-white text-3xl">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            {images.length > 1 && (
              <>
                <button onClick={showPreviousImage} className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-3xl">
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button onClick={showNextImage} className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-3xl">
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Comment Section */}
      {showCommentSection && (
        <div className="pt-4 pb-0 pr-4 pl-4 mt-4 border-t border-gray-200">
          <div className="">
            {commentList.map((comment, index) => {
              const commentUser = commentUsers[comment.user_id];
              return (
                <div key={index} className="mb-2 flex items-start justify-between">
                  <div className="flex items-start">
                    {commentUser?.profile_picture ? (
                      <img src={commentUser.profile_picture} alt="Profile" className="w-8 h-8 rounded-full mr-2 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold">{commentUser ? `${commentUser.first_name} ${commentUser.last_name}` : 'Unknown User'}</div>
                      <div className="text-xs">{comment.text}</div>
                    </div>
                  </div>
                  <small className="text-gray-500">{convertToUserTimezone(comment.timestamp)}</small>
                </div>
              );
            })}
          </div>
          <div className="flex items-center mt-4">
            {authUser?.profile_picture ? (
              <img src={authUser.profile_picture} alt="Profile" className="w-10 h-10 rounded-full mr-2 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 -ml-1">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              </div>
            )}
            <input
              type="text"
              className="flex-grow bg-gray-100 p-2 rounded-lg"
              placeholder="Add a comment, @ to mention"
              value={commentText}
              onChange={handleCommentChange}
            />
            <button onClick={postComment} className="ml-2 text-blue-600 hover:text-blue-800">
              Post
            </button>
          </div>
        </div>
      )}

      {/* Button Bar */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex bg-blue-600 rounded-full shadow-lg transition-transform duration-300`}>
        <button
          className={`px-4 py-2 text-sm rounded-l-full ${isLiked ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
          onClick={toggleLike}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <button className="px-4 py-2 text-white text-sm hover:bg-blue-700 border-l border-r border-blue-700">
          <FontAwesomeIcon icon={faShare} />
        </button>
        <button className="px-4 py-2 text-white text-sm hover:bg-blue-700 rounded-r-full" onClick={toggleCommentSection}>
          <FontAwesomeIcon icon={faComment} />
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
