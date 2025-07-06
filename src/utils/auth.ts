import { User } from '../types';
import { apiService } from '../services/api';

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (!isAuthenticated()) {
    return null;
  }

  try {
    return await apiService.getCurrentUser();
  } catch (error) {
    // Token might be expired
    apiService.logout();
    return null;
  }
};

export const logout = (): void => {
  apiService.logout();
  window.location.href = '/login';
};
