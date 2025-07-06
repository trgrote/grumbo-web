import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Character, User, Game } from '../types';
import { logout } from '../utils/auth';

export default function Dashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, charactersResponse, gamesResponse] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getCharacters(),
        apiService.getGames()
      ]);
      
      setUser(userResponse);
      setCharacters(charactersResponse);
      setGames(gamesResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharacter = async (id: number) => {
    if (!confirm('Are you sure you want to delete this character?')) return;
    
    try {
      await apiService.deleteCharacter(id);
      setCharacters(characters.filter(char => char.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete character');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              RPG Character Tracker
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              {user?.is_admin && (
                <Link
                  to="/admin"
                  className="btn btn-secondary"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="btn btn-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Create Character Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Your Characters</h2>
            <Link
              to="/character/new"
              className="btn btn-primary"
            >
              Create New Character
            </Link>
          </div>
        </div>

        {/* Characters Grid */}
        {characters.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No characters yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first character to get started!
            </p>
            <Link
              to="/character/new"
              className="btn btn-primary"
            >
              Create Character
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div key={character.id} className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {character.name}
                  </h3>
                  <p className="text-sm text-gray-600">{character.game.name}</p>
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(character.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/character/${character.id}`}
                        className="text-black hover:text-gray-700 font-medium"
                      >
                        View
                      </Link>
                      <Link
                        to={`/character/${character.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCharacter(character.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Game Systems */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Available Game Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <div key={game.id} className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {game.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
