import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Github, Star, GitFork, Users, MessageSquare } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import { User } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const { getPostsByUser } = usePost();
  const { getUserByUsername, followUser, unfollowUser, fetchGitHubRepos } = useUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (username) {
      const user = getUserByUsername(username);
      setProfileUser(user || null);
      
      if (user) {
        const posts = getPostsByUser(user.id);
        setUserPosts(posts);
        
        if (user.githubUsername) {
          fetchRepos(user.githubUsername);
        }
      }
    }
  }, [username, getUserByUsername, getPostsByUser]);

  const fetchRepos = async (githubUsername: string) => {
    setLoading(true);
    try {
      const repos = await fetchGitHubRepos(githubUsername);
      setGithubRepos(repos);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = currentUser && profileUser && currentUser.following.includes(profileUser.id);
  const isCurrentUser = currentUser?.id === profileUser?.id;

  const handleFollow = () => {
    if (profileUser) {
      if (isFollowing) {
        unfollowUser(profileUser.id);
      } else {
        followUser(profileUser.id);
      }
    }
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-900 pt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
            <p className="text-gray-400">The user you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="h-24 w-24 rounded-full border-4 border-gray-600"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">{profileUser.name}</h1>
                <p className="text-gray-400 text-lg">@{profileUser.username}</p>
                {profileUser.bio && (
                  <p className="text-gray-300 mt-2">{profileUser.bio}</p>
                )}
                <div className="flex items-center space-x-4 mt-3 text-gray-400">
                  {profileUser.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDistanceToNow(new Date(profileUser.createdAt))} ago</span>
                  </div>
                  {profileUser.githubUsername && (
                    <a
                      href={`https://github.com/${profileUser.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>{profileUser.githubUsername}</span>
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-6 mt-4">
                  <span className="text-gray-400">
                    <span className="font-semibold text-white">{profileUser.followers.length}</span> followers
                  </span>
                  <span className="text-gray-400">
                    <span className="font-semibold text-white">{profileUser.following.length}</span> following
                  </span>
                  <span className="text-gray-400">
                    <span className="font-semibold text-white">{userPosts.length}</span> posts
                  </span>
                </div>
              </div>
            </div>
            {!isCurrentUser && (
              <button
                onClick={handleFollow}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
              </button>
            )}
          </div>
          
          {/* Skills */}
          {profileUser.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GitHub Repositories */}
        {profileUser.githubUsername && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">GitHub Repositories</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading repositories...</p>
              </div>
            ) : githubRepos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {githubRepos.map((repo) => (
                  <div key={repo.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          {repo.name}
                        </a>
                        {repo.description && (
                          <p className="text-gray-300 text-sm mt-1">{repo.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-400">{repo.language}</span>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Star className="h-3 w-3" />
                            <span className="text-xs">{repo.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <GitFork className="h-3 w-3" />
                            <span className="text-xs">{repo.forks}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No repositories found.</p>
            )}
          </div>
        )}

        {/* User Posts */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Posts</h3>
          {userPosts.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center shadow-lg">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No posts yet.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;