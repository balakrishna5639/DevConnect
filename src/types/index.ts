export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  skills: string[];
  location: string;
  githubUsername: string;
  avatar: string;
  followers: string[];
  following: string[];
  createdAt: string;
  githubRepos: GitHubRepo[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface CreatePostData {
  content: string;
}