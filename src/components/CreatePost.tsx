import React, { useState, useRef } from 'react';
import { Send, Image, Code, X, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'code'>('text');
  const [image, setImage] = useState<{ url: string; publicId: string } | null>(null);
  const [codeSnippet, setCodeSnippet] = useState({ language: 'javascript', code: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && postType === 'text') return;

    setLoading(true);
    try {
      const postData = {
        content: content.trim(),
        type: postType,
        ...(postType === 'image' && image && { image }),
        ...(postType === 'code' && codeSnippet.code && { codeSnippet })
      };

      await apiService.createPost(postData);
      
      // Reset form
      setContent('');
      setPostType('text');
      setImage(null);
      setCodeSnippet({ language: 'javascript', code: '' });
      
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await apiService.uploadImage(file);
      setImage(result);
      setPostType('image');
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPostType('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleCodeMode = () => {
    if (postType === 'code') {
      setPostType('text');
      setCodeSnippet({ language: 'javascript', code: '' });
    } else {
      setPostType('code');
      setImage(null);
    }
  };

  return (
    <div className="bg-white dark:bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-300">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-gray-200 dark:border-gray-300 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === 'code' 
                  ? "Describe your code snippet..." 
                  : postType === 'image'
                  ? "What's this image about?"
                  : "What's on your mind? Share your thoughts, ask questions, or start a discussion..."
              }
              className="w-full p-3 bg-gray-50 dark:bg-gray-100 border border-gray-300 dark:border-gray-300 rounded-lg text-gray-900 dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              rows={postType === 'text' ? 3 : 2}
            />

            {/* Image Upload */}
            {postType === 'image' && (
              <div className="space-y-3">
                {!image ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-600 mb-2">
                      {uploading ? 'Uploading...' : 'Click to upload an image'}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-3 py-2 sm:px-4 text-sm sm:text-base bg-blue-600 text-gray-900 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={image.url}
                      alt="Upload preview"
                      className="w-full max-h-48 sm:max-h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-gray-900 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Code Snippet */}
            {postType === 'code' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-700 sm:hidden">
                    Language:
                  </label>
                  <select
                    value={codeSnippet.language}
                    onChange={(e) => setCodeSnippet({ ...codeSnippet, language: e.target.value })}
                    className="w-full sm:w-auto px-3 py-2 bg-gray-50 dark:bg-gray-100 border border-gray-300 dark:border-gray-300 rounded-md text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="sql">SQL</option>
                    <option value="bash">Bash</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <textarea
                  value={codeSnippet.code}
                  onChange={(e) => setCodeSnippet({ ...codeSnippet, code: e.target.value })}
                  placeholder="Paste your code here..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-green-400 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={postType === 'code'}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-sm rounded-md transition-colors ${
                    postType === 'image'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Photo</span>
                </button>
                <button
                  type="button"
                  onClick={toggleCodeMode}
                  disabled={postType === 'image'}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-sm rounded-md transition-colors ${
                    postType === 'code'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'text-gray-500 dark:text-gray-600 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Code</span>
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || (!content.trim() && postType === 'text') || (postType === 'image' && !image) || (postType === 'code' && !codeSnippet.code.trim())}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-gray-900 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? 'Posting...' : 'Post'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;