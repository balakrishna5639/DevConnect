import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, CreatePostData, Comment } from '../types';
import { useAuth } from './AuthContext';

interface PostContextType {
  posts: Post[];
  createPost: (data: CreatePostData) => void;
  updatePost: (id: string, data: Partial<Post>) => void;
  deletePost: (id: string) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  getPostsByUser: (userId: string) => Post[];
  refreshPosts: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    refreshPosts();
  }, []);

  const refreshPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('devconnect_posts') || '[]');
    setPosts(storedPosts);
  };

  const createPost = (data: CreatePostData) => {
    if (!user) return;

    const newPost: Post = {
      id: Date.now().toString(),
      content: data.content,
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar
      },
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const storedPosts = JSON.parse(localStorage.getItem('devconnect_posts') || '[]');
    const updatedPosts = [newPost, ...storedPosts];
    localStorage.setItem('devconnect_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const updatePost = (id: string, data: Partial<Post>) => {
    const storedPosts = JSON.parse(localStorage.getItem('devconnect_posts') || '[]');
    const updatedPosts = storedPosts.map((post: Post) => 
      post.id === id ? { ...post, ...data, updatedAt: new Date().toISOString() } : post
    );
    localStorage.setItem('devconnect_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const deletePost = (id: string) => {
    const storedPosts = JSON.parse(localStorage.getItem('devconnect_posts') || '[]');
    const updatedPosts = storedPosts.filter((post: Post) => post.id !== id);
    localStorage.setItem('devconnect_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const likePost = (id: string) => {
    if (!user) return;

    const storedPosts = JSON.parse(localStorage.getItem('devconnect_posts') || '[]');
    const updatedPosts = storedPosts.map((post: Post) => {
      if (post.id === id) {
        const isLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: isLiked
            ? post.likes.filter(userId => userId !== user.id)
            : [...post.likes, user.id]
        };
      }
      return post;
    });
    localStorage.setItem('devconnect_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar
      },
      createdAt: new Date().toISOString()
    };

    const storedPosts = JSON.parse(localStorage.getItem('devconnect_posts') || '[]');
    const updatedPosts = storedPosts.map((post: Post) => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    localStorage.setItem('devconnect_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const deleteComment = (postId: string, commentId: string) => {
    const storedPosts = JSON.parse(localStorage.getItem('devconnect_posts') || '[]');
    const updatedPosts = storedPosts.map((post: Post) => 
      post.id === postId 
        ? { ...post, comments: post.comments.filter(comment => comment.id !== commentId) }
        : post
    );
    localStorage.setItem('devconnect_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const getPostsByUser = (userId: string) => {
    return posts.filter(post => post.authorId === userId);
  };

  return (
    <PostContext.Provider value={{
      posts,
      createPost,
      updatePost,
      deletePost,
      likePost,
      addComment,
      deleteComment,
      getPostsByUser,
      refreshPosts
    }}>
      {children}
    </PostContext.Provider>
  );
};