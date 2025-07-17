import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  skills: string[];
  followers: string[];
  following: string[];
  isVerified: boolean;
}

interface UserCardProps {
  user: User;
  compact?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user: profileUser, compact = false }) => {
  const { user: currentUser, updateUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following.includes(profileUser._id) || false
  );
  const [loading, setLoading] = useState(false);

  const isCurrentUser = currentUser?.id === profileUser._id;

  const handleFollow = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await apiService.unfollowUser(profileUser._id);
        setIsFollowing(false);
        updateUser({
          ...currentUser,
          following: currentUser.following.filter(id => id !== profileUser._id)
        });
      } else {
        await apiService.followUser(profileUser._id);
        setIsFollowing(true);
        updateUser({
          ...currentUser,
          following: [...currentUser.following, profileUser._id]
        });
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <Link to={`/user/${profileUser.username}`} className="flex-shrink-0">
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <Link 
              to={`/user/${profileUser.username}`}
              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {profileUser.name}
            </Link>
            {profileUser.isVerified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{profileUser.username}</p>
        </div>
        {!isCurrentUser && (
          <button
            onClick={handleFollow}
            disabled={loading}
            className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
              isFollowing
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing ? <UserMinus className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
            <span>{loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <Link to={`/user/${profileUser.username}`} className="flex-shrink-0">
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="h-16 w-16 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Link 
              to={`/user/${profileUser.username}`}
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {profileUser.name}
            </Link>
            {profileUser.isVerified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">@{profileUser.username}</p>
          
          {profileUser.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{profileUser.bio}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            {profileUser.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{profileUser.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{profileUser.followers.length} followers</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {profileUser.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {profileUser.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {profileUser.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                    +{profileUser.skills.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {!isCurrentUser && (
              <button
                onClick={handleFollow}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-md transition-colors disabled:opacity-50 ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                <span>{loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;