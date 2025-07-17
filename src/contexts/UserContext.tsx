import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, GitHubRepo } from '../types';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  updateUser: (userData: Partial<User>) => void;
  getUserById: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
  fetchGitHubRepos: (githubUsername: string) => Promise<GitHubRepo[]>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    setUsers(storedUsers);
  }, []);

  const followUser = (userId: string) => {
    if (!user) return;

    const storedUsers = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const updatedUsers = storedUsers.map((u: User) => {
      if (u.id === user.id) {
        return { ...u, following: [...u.following, userId] };
      }
      if (u.id === userId) {
        return { ...u, followers: [...u.followers, user.id] };
      }
      return u;
    });

    localStorage.setItem('devconnect_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Update current user in auth context
    const updatedCurrentUser = updatedUsers.find((u: User) => u.id === user.id);
    if (updatedCurrentUser) {
      localStorage.setItem('devconnect_user', JSON.stringify(updatedCurrentUser));
    }
  };

  const unfollowUser = (userId: string) => {
    if (!user) return;

    const storedUsers = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const updatedUsers = storedUsers.map((u: User) => {
      if (u.id === user.id) {
        return { ...u, following: u.following.filter(id => id !== userId) };
      }
      if (u.id === userId) {
        return { ...u, followers: u.followers.filter(id => id !== user.id) };
      }
      return u;
    });

    localStorage.setItem('devconnect_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Update current user in auth context
    const updatedCurrentUser = updatedUsers.find((u: User) => u.id === user.id);
    if (updatedCurrentUser) {
      localStorage.setItem('devconnect_user', JSON.stringify(updatedCurrentUser));
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const storedUsers = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const updatedUsers = storedUsers.map((u: User) => 
      u.id === user.id ? { ...u, ...userData } : u
    );

    localStorage.setItem('devconnect_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Update current user in auth context
    const updatedCurrentUser = updatedUsers.find((u: User) => u.id === user.id);
    if (updatedCurrentUser) {
      localStorage.setItem('devconnect_user', JSON.stringify(updatedCurrentUser));
    }
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  const getUserByUsername = (username: string) => {
    return users.find(u => u.username === username);
  };

  const fetchGitHubRepos = async (githubUsername: string): Promise<GitHubRepo[]> => {
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
      if (!response.ok) return [];
      
      const repos = await response.json();
      return repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at
      }));
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      return [];
    }
  };

  return (
    <UserContext.Provider value={{
      users,
      followUser,
      unfollowUser,
      updateUser,
      getUserById,
      getUserByUsername,
      fetchGitHubRepos
    }}>
      {children}
    </UserContext.Provider>
  );
};