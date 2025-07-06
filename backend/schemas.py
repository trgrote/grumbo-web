from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    is_admin: Optional[bool] = False

class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Game schemas
class GameBase(BaseModel):
    name: str
    description: Optional[str] = None

class GameCreate(GameBase):
    template_data: Optional[Dict[str, Any]] = None

class Game(GameBase):
    id: int
    template_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Character schemas
class CharacterBase(BaseModel):
    name: str
    game_id: int

class CharacterCreate(CharacterBase):
    data: Optional[Dict[str, Any]] = None

class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class Character(CharacterBase):
    id: int
    user_id: int
    data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    game: Game

    class Config:
        from_attributes = True
