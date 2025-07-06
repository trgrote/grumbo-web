import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { CreateUserData } from '../types';

export default function AdminPanel() {
  const [userData, setUserData] = useState<CreateUserData>({
    username: '',
    password: '',
    is_admin: false
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.username.trim() || !userData.password.trim()) {
      setError('Username and password are required');
      return;
    }

    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await apiService.createUser(userData);
      setSuccess(`User "${userData.username}" created successfully!`);
      setUserData({
        username: '',
        password: '',
        is_admin: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Panel
            </h1>
            <Link
              to="/dashboard"
              className="btn btn-secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Create User Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New User
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Only administrators can create new user accounts
              </p>
            </div>
            <div className="card-body">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="form-label">
                    Username *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    value={userData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Username must be unique and will be used for login
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Choose a strong password for the user
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_admin"
                    name="is_admin"
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    checked={userData.is_admin}
                    onChange={handleChange}
                  />
                  <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                    Grant administrator privileges
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Administrators can create new users and access the admin panel
                </p>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setUserData({ username: '', password: '', is_admin: false })}
                    className="btn btn-secondary"
                    disabled={creating}
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn btn-primary"
                  >
                    {creating ? 'Creating User...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Admin Information */}
          <div className="mt-8 card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">
                Administrator Information
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">User Management</h3>
                  <p className="text-sm text-gray-600">
                    As an administrator, you can create new user accounts. Users cannot register themselves - 
                    all accounts must be created by an administrator.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Authentication</h3>
                  <p className="text-sm text-gray-600">
                    The system uses username and password authentication only. No email addresses are required 
                    or stored.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Character Sheets</h3>
                  <p className="text-sm text-gray-600">
                    Users can create and manage character sheets for different tabletop RPG systems. 
                    Currently supports D&D 5th Edition with plans for additional systems.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Security</h3>
                  <p className="text-sm text-gray-600">
                    All passwords are securely hashed. Users can only access their own character sheets. 
                    Administrators have additional privileges for user management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
