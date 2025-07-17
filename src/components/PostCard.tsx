import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Trash2, Edit, Copy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  type: 'text' | 'image' | 'code';
  image?: {
    url: string;
    publicId: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
  };
  likes: string[];
  comments: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      name: string;
      username: string;
      avatar: string;
    };
    createdAt: string;
  }>;
  tags: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  onPostUpdate: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      setIsLiked(post.likes.includes(user.id));
    }
  }, [post.likes, user]);

  const handleLike = async () => {
    if (!user) return;

    try {
      const result = await apiService.likePost(post._id);
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setLoading(true);
    try {
      const newComment = await apiService.addComment(post._id, commentContent.trim());
      setComments([...comments, newComment]);
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      await apiService.deletePost(post._id);
      onPostUpdate();
      setShowMenu(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await apiService.deleteComment(post._id, commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const copyCode = () => {
    if (post.codeSnippet) {
      navigator.clipboard.writeText(post.codeSnippet.code);
    }
  };

  const isAuthor = user && post.author._id === user.id;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <Link to={`/user/${post.author.username}`} className="flex-shrink-0">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <Link 
                to={`/user/${post.author.username}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              >
                {post.author.name}
              </Link>
              {post.author.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>@{post.author.username}</span>
              <span>•</span>
              <time dateTime={post.createdAt}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </time>
              {post.isEdited && (
                <>
                  <span>•</span>
                  <span className="text-xs">edited</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                <button
                  onClick={handleDeletePost}
                  className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {post.content && (
          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        )}

        {/* Image Post */}
        {post.type === 'image' && post.image && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={post.image.url}
              alt="Post image"
              className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Code Post */}
        {post.type === 'code' && post.codeSnippet && (
          <div className="mt-3 bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-300 font-medium">
                {post.codeSnippet.language}
              </span>
              <button
                onClick={copyCode}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 text-sm text-green-400 font-mono overflow-x-auto">
              <code>{post.codeSnippet.code}</code>
            </pre>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
              isLiked 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="flex items-start space-x-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-600 flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentContent.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <Link to={`/user/${comment.author.username}`} className="flex-shrink-0">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <Link 
                      to={`/user/${comment.author.username}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {comment.author.name}
                    </Link>
                    <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </time>
                    {user && comment.author._id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;