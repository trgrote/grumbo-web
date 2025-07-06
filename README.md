# RPG Character Sheet Tracker

A web application for tracking character sheets for tabletop RPGs. Built with React frontend and Python FastAPI backend.

## Features

- **Game-Agnostic**: Support for multiple RPG systems (D&D 5e included by default)
- **User Management**: Admin-only user creation with username/password authentication
- **Character Sheets**: Create, view, edit, and delete character sheets
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Secure**: JWT authentication with bcrypt password hashing

## Tech Stack

### Backend
- **Python 3.8+**
- **FastAPI** - Modern web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python start.py
```

Or manually:
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

The backend will be available at `http://localhost:8001`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Default Credentials

The application creates a default admin user on first startup:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## Usage

### For Users

1. **Login**: Use your username and password to access the application
2. **Dashboard**: View all your characters and create new ones
3. **Create Character**: Choose a game system and fill in character details
4. **Edit Character**: Update character information and stats
5. **Character Sheet**: View detailed character information

### For Administrators

1. **Admin Panel**: Access via the "Admin Panel" button on the dashboard
2. **Create Users**: Add new user accounts with optional admin privileges
3. **User Management**: Only admins can create new accounts

## API Documentation

Once the backend is running, visit `http://localhost:8001/docs` for interactive API documentation.

### Key Endpoints

- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user info
- `POST /admin/users` - Create new user (admin only)
- `GET /characters/` - Get user's characters
- `POST /characters/` - Create new character
- `GET /characters/{id}` - Get character details
- `PUT /characters/{id}` - Update character
- `DELETE /characters/{id}` - Delete character
- `GET /characters/games/` - List available game systems

## Game Systems

### D&D 5th Edition (Included)

The application comes with built-in support for D&D 5e character sheets including:
- Basic character information (name, class, level, race, background)
- Ability scores (STR, DEX, CON, INT, WIS, CHA) with automatic modifier calculation
- Combat stats (AC, HP, Speed)
- Skills, equipment, spells, and notes

### Adding New Game Systems

To add support for additional RPG systems:

1. Create a new game entry in the database with appropriate template data
2. The template defines the structure and validation rules for character sheets
3. The frontend dynamically renders forms based on the template

## Development

### Project Structure

```
rpg-character-tracker/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── database.py         # Database configuration
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── auth.py             # Authentication logic
│   ├── crud.py             # Database operations
│   ├── routers/            # API route handlers
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── index.css           # Global styles
├── package.json            # Node.js dependencies
└── README.md              # This file
```

### Running in Development

1. Start the backend server (port 8001)
2. Start the frontend dev server (port 5173)
3. Both servers support hot reloading for development

### Building for Production

Frontend:
```bash
npm run build
```

Backend:
```bash
# Use a production WSGI server like gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Security Considerations

- Change default admin credentials
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Regularly update dependencies
- Consider implementing rate limiting
- Use a production database (PostgreSQL, MySQL) instead of SQLite for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

