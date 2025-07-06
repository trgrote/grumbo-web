import { User, Character, Game, LoginCredentials, CreateUserData, CreateCharacterData, UpdateCharacterData, AuthToken, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:8001';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'An error occurred');
    }
    return response.json();
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    const token = await this.handleResponse<AuthToken>(response);
    localStorage.setItem('access_token', token.access_token);
    return token;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  // Admin - User Management
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse<User>(response);
  }

  // Characters
  async getCharacters(): Promise<Character[]> {
    const response = await fetch(`${API_BASE_URL}/characters/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Character[]>(response);
  }

  async getCharacter(id: number): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Character>(response);
  }

  async createCharacter(characterData: CreateCharacterData): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/characters/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(characterData),
    });
    return this.handleResponse<Character>(response);
  }

  async updateCharacter(id: number, characterData: UpdateCharacterData): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(characterData),
    });
    return this.handleResponse<Character>(response);
  }

  async deleteCharacter(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  // Games
  async getGames(): Promise<Game[]> {
    const response = await fetch(`${API_BASE_URL}/characters/games/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Game[]>(response);
  }

  async getGameTemplate(gameId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/characters/games/${gameId}/template`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }
}

export const apiService = new ApiService();
