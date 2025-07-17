import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, MessageSquare, Sparkles } from 'lucide-react';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState<'feed' | 'discover'>('feed');

  useEffect(() => {
    loadData();
  }, [feedType]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        feedType === 'feed' ? apiService.getFeedPosts() : apiService.getAllPosts(),
        apiService.getUsers(1, 5)
      ]);

      setPosts(postsResponse.posts || []);
      setSuggestedUsers(usersResponse.users || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadData();
  };

  const stats = [
    {
      title: 'Following',
      value: user?.following.length || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Followers',
      value: user?.followers.length || 0,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Posts',
      value: posts.filter(p => p.author._id === user?.id).length,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-20 space-y-6">
              {/* User Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Stats</h3>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:space-y-0 lg:gap-0 lg:space-y-4">
                  {stats.map((stat) => (
                    <div key={stat.title} className="flex flex-col lg:flex-row items-center lg:space-x-3 text-center lg:text-left">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div className="mt-2 lg:mt-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                        <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Users */}
              <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested for you</h3>
                </div>
                <div className="space-y-4">
                  {suggestedUsers.slice(0, 3).map((suggestedUser) => (
                    <UserCard key={suggestedUser._id} user={suggestedUser} compact />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="space-y-6">
              {/* Feed Toggle */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setFeedType('feed')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      feedType === 'feed'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Following
                  </button>
                  <button
                    onClick={() => setFeedType('discover')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      feedType === 'discover'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Discover
                  </button>
                </div>
              </div>

              {/* Create Post */}
              <CreatePost onPostCreated={handlePostCreated} />
              
              {/* Mobile Suggested Users */}
              <div className="lg:hidden bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested for you</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestedUsers.slice(0, 4).map((suggestedUser) => (
                    <UserCard key={suggestedUser._id} user={suggestedUser} compact />
                  ))}
                </div>
              </div>
              
              {/* Posts Feed */}
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feedType === 'feed' ? 'No posts in your feed' : 'No posts to discover'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feedType === 'feed' 
                      ? 'Start following other developers to see their posts here!'
                      : 'Be the first to share something with the community!'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} onPostUpdate={loadData} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;