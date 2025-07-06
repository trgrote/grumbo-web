from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import crud
from database import SessionLocal, engine, get_db
from routers import auth, users, characters

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RPG Character Sheet Tracker", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(characters.router)

@app.get("/")
async def root():
    return {"message": "RPG Character Sheet Tracker API"}

@app.on_event("startup")
async def startup_event():
    """Initialize database with default data"""
    db = SessionLocal()
    try:
        # Create default admin user if it doesn't exist
        admin_user = crud.get_user_by_username(db, "admin")
        if not admin_user:
            admin_create = schemas.UserCreate(
                username="admin",
                password="admin123",
                is_admin=True
            )
            crud.create_user(db, admin_create)
            print("Default admin user created: username='admin', password='admin123'")
        
        # Create D&D 5e game system if it doesn't exist
        dnd5e_game = db.query(models.Game).filter(models.Game.name == "D&D 5e").first()
        if not dnd5e_game:
            dnd5e_template = {
                "basic_info": {
                    "name": {"type": "string", "required": True},
                    "class": {"type": "string", "required": True},
                    "level": {"type": "number", "required": True, "min": 1, "max": 20},
                    "race": {"type": "string", "required": True},
                    "background": {"type": "string", "required": True},
                    "alignment": {"type": "string", "required": False}
                },
                "abilities": {
                    "strength": {"type": "number", "required": True, "min": 1, "max": 30},
                    "dexterity": {"type": "number", "required": True, "min": 1, "max": 30},
                    "constitution": {"type": "number", "required": True, "min": 1, "max": 30},
                    "intelligence": {"type": "number", "required": True, "min": 1, "max": 30},
                    "wisdom": {"type": "number", "required": True, "min": 1, "max": 30},
                    "charisma": {"type": "number", "required": True, "min": 1, "max": 30}
                },
                "combat": {
                    "armor_class": {"type": "number", "required": False},
                    "hit_points": {"type": "number", "required": False},
                    "hit_point_maximum": {"type": "number", "required": False},
                    "speed": {"type": "number", "required": False}
                },
                "skills": {
                    "type": "object",
                    "properties": {
                        "acrobatics": {"type": "boolean"},
                        "animal_handling": {"type": "boolean"},
                        "arcana": {"type": "boolean"},
                        "athletics": {"type": "boolean"},
                        "deception": {"type": "boolean"},
                        "history": {"type": "boolean"},
                        "insight": {"type": "boolean"},
                        "intimidation": {"type": "boolean"},
                        "investigation": {"type": "boolean"},
                        "medicine": {"type": "boolean"},
                        "nature": {"type": "boolean"},
                        "perception": {"type": "boolean"},
                        "performance": {"type": "boolean"},
                        "persuasion": {"type": "boolean"},
                        "religion": {"type": "boolean"},
                        "sleight_of_hand": {"type": "boolean"},
                        "stealth": {"type": "boolean"},
                        "survival": {"type": "boolean"}
                    }
                },
                "equipment": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "quantity": {"type": "number"},
                            "description": {"type": "string"}
                        }
                    }
                },
                "spells": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "level": {"type": "number"},
                            "school": {"type": "string"},
                            "description": {"type": "string"}
                        }
                    }
                },
                "notes": {"type": "string", "required": False}
            }
            
            dnd5e_game_create = schemas.GameCreate(
                name="D&D 5e",
                description="Dungeons & Dragons 5th Edition",
                template_data=dnd5e_template
            )
            crud.create_game(db, dnd5e_game_create)
            print("D&D 5e game system created")
            
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
