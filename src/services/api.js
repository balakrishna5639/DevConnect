const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('devconnect_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    // Simulate login using localStorage
    const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      const token = 'fake-jwt-token';
      localStorage.setItem('devconnect_token', token);
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          bio: user.bio,
          location: user.location,
          skills: user.skills,
          githubUsername: user.githubUsername,
          avatar: user.avatar,
          followers: user.followers || [],
          following: user.following || []
        }
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUsers(page = 1, limit = 10) {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async getUserByUsername(username) {
    return this.request(`/users/${username}`);
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async followUser(userId) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST'
    });
  }

  async unfollowUser(userId) {
    return this.request(`/users/${userId}/follow`, {
      method: 'DELETE'
    });
  }

  async getUserPosts(username, page = 1, limit = 10) {
    return this.request(`/users/${username}/posts?page=${page}&limit=${limit}`);
  }

  // Post endpoints
  async getFeedPosts(page = 1, limit = 10) {
    return this.request(`/posts/feed?page=${page}&limit=${limit}`);
  }

  async getAllPosts(page = 1, limit = 10) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  }

  async updatePost(postId, postData) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE'
    });
  }

  async likePost(postId) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST'
    });
  }

  async addComment(postId, content) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  async deleteComment(postId, commentId) {
    return this.request(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    });
  }

  // Upload endpoints
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('devconnect_token');
    const response = await fetch(`${this.baseURL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  // GitHub API
  async fetchGitHubRepos(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (!response.ok) return [];
      
      const repos = await response.json();
      return repos.map(repo => ({
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
  }
}

export default new ApiService();