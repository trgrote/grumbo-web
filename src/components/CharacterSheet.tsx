import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Character, Game, UpdateCharacterData } from '../types';

export default function CharacterSheet() {
  const { id, mode } = useParams<{ id: string; mode?: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [characterData, setCharacterData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = mode === 'edit';

  useEffect(() => {
    if (id && id !== 'new') {
      loadCharacter();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadCharacter = async () => {
    try {
      const response = await apiService.getCharacter(parseInt(id!));
      setCharacter(response);
      setCharacterData(response.data || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load character');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!character) return;
    
    setSaving(true);
    try {
      const updateData: UpdateCharacterData = {
        data: characterData
      };
      
      await apiService.updateCharacter(character.id, updateData);
      navigate(`/character/${character.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save character');
    } finally {
      setSaving(false);
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

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Character not found</h2>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {character.name}
              </h1>
              <p className="text-gray-600">{character.game.name} Character Sheet</p>
            </div>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link
                    to={`/character/${character.id}`}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={`/character/${character.id}/edit`}
                    className="btn btn-primary"
                  >
                    Edit Character
                  </Link>
                  <Link
                    to="/dashboard"
                    className="btn btn-secondary"
                  >
                    Back to Dashboard
                  </Link>
                </>
              )}
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

        <div className="character-sheet">
          {/* Basic Information */}
          <div className="character-section">
            <h3>Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Character Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={getFieldValue('basic_info.name')}
                    onChange={(e) => updateField('basic_info.name', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{getFieldValue('basic_info.name') || character.name}</p>
                )}
              </div>
              <div>
                <label className="form-label">Class</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={getFieldValue('basic_info.class')}
                    onChange={(e) => updateField('basic_info.class', e.target.value)}
                  />
                ) : (
                  <p className="text-lg">{getFieldValue('basic_info.class')}</p>
                )}
              </div>
              <div>
                <label className="form-label">Level</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-input"
                    value={getFieldValue('basic_info.level')}
                    onChange={(e) => updateField('basic_info.level', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-lg">{getFieldValue('basic_info.level')}</p>
                )}
              </div>
              <div>
                <label className="form-label">Race</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={getFieldValue('basic_info.race')}
                    onChange={(e) => updateField('basic_info.race', e.target.value)}
                  />
                ) : (
                  <p className="text-lg">{getFieldValue('basic_info.race')}</p>
                )}
              </div>
              <div>
                <label className="form-label">Background</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={getFieldValue('basic_info.background')}
                    onChange={(e) => updateField('basic_info.background', e.target.value)}
                  />
                ) : (
                  <p className="text-lg">{getFieldValue('basic_info.background')}</p>
                )}
              </div>
              <div>
                <label className="form-label">Alignment</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={getFieldValue('basic_info.alignment')}
                    onChange={(e) => updateField('basic_info.alignment', e.target.value)}
                  />
                ) : (
                  <p className="text-lg">{getFieldValue('basic_info.alignment')}</p>
                )}
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
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        max="30"
                        className="w-full text-center text-xl font-bold border rounded"
                        value={score}
                        onChange={(e) => updateField(`abilities.${ability}`, parseInt(e.target.value))}
                      />
                    ) : (
                      <div className="ability-score-value">{score}</div>
                    )}
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
                {isEditing ? (
                  <input
                    type="number"
                    className="form-input"
                    value={getFieldValue('combat.armor_class')}
                    onChange={(e) => updateField('combat.armor_class', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-xl font-bold">{getFieldValue('combat.armor_class')}</p>
                )}
              </div>
              <div>
                <label className="form-label">Hit Points</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-input"
                    value={getFieldValue('combat.hit_points')}
                    onChange={(e) => updateField('combat.hit_points', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-xl font-bold">{getFieldValue('combat.hit_points')}</p>
                )}
              </div>
              <div>
                <label className="form-label">Hit Point Maximum</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-input"
                    value={getFieldValue('combat.hit_point_maximum')}
                    onChange={(e) => updateField('combat.hit_point_maximum', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-xl font-bold">{getFieldValue('combat.hit_point_maximum')}</p>
                )}
              </div>
              <div>
                <label className="form-label">Speed</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-input"
                    value={getFieldValue('combat.speed')}
                    onChange={(e) => updateField('combat.speed', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-xl font-bold">{getFieldValue('combat.speed')} ft</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="character-section">
            <h3>Notes</h3>
            {isEditing ? (
              <textarea
                className="form-input h-32"
                value={getFieldValue('notes')}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Character notes, backstory, etc..."
              />
            ) : (
              <div className="bg-white p-4 rounded border min-h-32">
                {getFieldValue('notes') ? (
                  <p className="whitespace-pre-wrap">{getFieldValue('notes')}</p>
                ) : (
                  <p className="text-gray-500 italic">No notes added yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
