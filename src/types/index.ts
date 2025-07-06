export interface User {
  id: number;
  username: string;
  is_admin: boolean;
  created_at: string;
}

export interface Game {
  id: number;
  name: string;
  description?: string;
  template_data?: any;
  created_at: string;
}

export interface Character {
  id: number;
  name: string;
  user_id: number;
  game_id: number;
  data?: any;
  created_at: string;
  updated_at: string;
  game: Game;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  is_admin?: boolean;
}

export interface CreateCharacterData {
  name: string;
  game_id: number;
  data?: any;
}

export interface UpdateCharacterData {
  name?: string;
  data?: any;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}
