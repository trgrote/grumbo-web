import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Game, CreateCharacterData } from '../types';

export default function CreateCharacter() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [characterData, setCharacterData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await apiService.getGames();
      setGames(response);
      if (response.length > 0) {
        setSelectedGameId(response[0].id);
        initializeCharacterData(response[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const initializeCharacterData = (game: Game) => {
    // Initialize with default D&D 5e character data
    const defaultData = {
      basic_info: {
        name: '',
        class: '',
        level: 1,
        race: '',
        background: '',
        alignment: ''
      },
      abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      combat: {
        armor_class: 10,
        hit_points: 8,
        hit_point_maximum: 8,
        speed: 30
      },
      skills: {},
      equipment: [],
      spells: [],
      notes: ''
    };
    setCharacterData(defaultData);
  };

  const handleGameChange = (gameId: number) => {
    setSelectedGameId(gameId);
    const game = games.find(g => g.id === gameId);
    if (game) {
      initializeCharacterData(game);
    }
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...characterData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setCharacterData(newData);
  };

  const getFieldValue = (path: string) => {
    const keys = path.split('.');
    let current = characterData;
    
    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key];
      } else {
        return '';
      }
    }
    
    return current || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameId || !characterName.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const createData: CreateCharacterData = {
        name: characterName,
        game_id: selectedGameId,
        data: {
          ...characterData,
          basic_info: {
            ...characterData.basic_info,
            name: characterName
          }
        }
      };

      const character = await apiService.createCharacter(createData);
      navigate(`/character/${character.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setCreating(false);
    }
  };

  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
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
              Create New Character
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="character-sheet">
          {/* Game Selection */}
          <div className="character-section">
            <h3>Game System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Select Game System *</label>
                <select
                  className="form-input"
                  value={selectedGameId || ''}
                  onChange={(e) => handleGameChange(parseInt(e.target.value))}
                  required
                >
                  <option value="">Choose a game system...</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Character Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter character name"
                  required
                />
              </div>
            </div>
          </div>

          {selectedGameId && (
            <>
              {/* Basic Information */}
              <div className="character-section">
                <h3>Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Class</label>
                    <input
                      type="text"
                      className="form-input"
                      value={getFieldValue('basic_info.class')}
                      onChange={(e) => updateField('basic_info.class', e.target.value)}
                      placeholder="e.g., Fighter, Wizard, Rogue"
                    />
                  </div>
                  <div>
                    <label className="form-label">Level</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      className="form-input"
                      value={getFieldValue('basic_info.level')}
                      onChange={(e) => updateField('basic_info.level', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Race</label>
                    <input
                      type="text"
                      className="form-input"
                      value={getFieldValue('basic_info.race')}
                      onChange={(e) => updateField('basic_info.race', e.target.value)}
                      placeholder="e.g., Human, Elf, Dwarf"
                    />
                  </div>
                  <div>
                    <label className="form-label">Background</label>
                    <input
                      type="text"
                      className="form-input"
                      value={getFieldValue('basic_info.background')}
                      onChange={(e) => updateField('basic_info.background', e.target.value)}
                      placeholder="e.g., Soldier, Noble, Criminal"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Alignment</label>
                    <input
                      type="text"
                      className="form-input"
                      value={getFieldValue('basic_info.alignment')}
                      onChange={(e) => updateField('basic_info.alignment', e.target.value)}
                      placeholder="e.g., Lawful Good, Chaotic Neutral"
                    />
                  </div>
                </div>
              </div>

              {/* Ability Scores */}
              <div className="character-section">
                <h3>Ability Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => {
                    const score = parseInt(getFieldValue(`abilities.${ability}`)) || 10;
                    const modifier = calculateModifier(score);
                    
                    return (
                      <div key={ability} className="ability-score">
                        <div className="text-sm font-medium text-gray-600 uppercase mb-1">
                          {ability.slice(0, 3)}
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          className="w-full text-center text-xl font-bold border rounded"
                          value={score}
                          onChange={(e) => updateField(`abilities.${ability}`, parseInt(e.target.value))}
                        />
                        <div className="ability-score-modifier">
                          {formatModifier(modifier)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Combat Stats */}
              <div className="character-section">
                <h3>Combat</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="form-label">Armor Class</label>
                    <input
                      type="number"
                      className="form-input"
                      value={getFieldValue('combat.armor_class')}
                      onChange={(e) => updateField('combat.armor_class', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Hit Points</label>
                    <input
                      type="number"
                      className="form-input"
                      value={getFieldValue('combat.hit_points')}
                      onChange={(e) => updateField('combat.hit_points', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Hit Point Maximum</label>
                    <input
                      type="number"
                      className="form-input"
                      value={getFieldValue('combat.hit_point_maximum')}
                      onChange={(e) => updateField('combat.hit_point_maximum', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Speed</label>
                    <input
                      type="number"
                      className="form-input"
                      value={getFieldValue('combat.speed')}
                      onChange={(e) => updateField('combat.speed', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="character-section">
                <h3>Notes</h3>
                <textarea
                  className="form-input h-32"
                  value={getFieldValue('notes')}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Character backstory, personality traits, goals, etc..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  to="/dashboard"
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary"
                >
                  {creating ? 'Creating...' : 'Create Character'}
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
}
