import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Github, Edit, Star, GitFork } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import { formatDistanceToNow } from '../utils/dateUtils';

const Profile = () => {
  const { user } = useAuth();
  const { getPostsByUser } = usePost();
  const { fetchGitHubRepos } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const posts = getPostsByUser(user.id);
      setUserPosts(posts);

      if (user.githubUsername) {
        fetchRepos();
      }
    }
  }, [user, getPostsByUser]);

  const fetchRepos = async () => {
    if (!user?.githubUsername) return;

    setLoading(true);
    try {
      const repos = await fetchGitHubRepos(user.githubUsername);
      setGithubRepos(repos);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full border-4 border-gray-300"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 text-lg">@{user.username}</p>
                {user.bio && (
                  <p className="text-gray-700 mt-2">{user.bio}</p>
                )}
                <div className="flex items-center space-x-4 mt-3 text-gray-600">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDistanceToNow(new Date(user.createdAt))} ago</span>
                  </div>
                  {user.githubUsername && (
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>{user.githubUsername}</span>
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-6 mt-4">
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{user.followers.length}</span> followers
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{user.following.length}</span> following
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{userPosts.length}</span> posts
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-gray-900 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </div>

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
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
        {user.githubUsername && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">GitHub Repositories</h3>
              <button
                onClick={fetchRepos}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {githubRepos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {githubRepos.map((repo) => (
                  <div key={repo.id} className="bg-gray-100 rounded-lg p-4 hover:bg-gray-600 transition-colors">
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
                          <p className="text-gray-700 text-sm mt-1">{repo.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-600">{repo.language}</span>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Star className="h-3 w-3" />
                            <span className="text-xs">{repo.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
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
              <p className="text-gray-600">No repositories found or GitHub username not set.</p>
            )}
          </div>
        )}

        {/* User Posts */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Posts</h3>
          {userPosts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-lg">
              <p className="text-gray-600">You haven't posted anything yet.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} onPostUpdate={() => {
                const updated = getPostsByUser(user.id);
                setUserPosts(updated);
              }} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;