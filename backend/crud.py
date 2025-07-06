from sqlalchemy.orm import Session
from sqlalchemy import and_
import models
import schemas
from auth import get_password_hash

# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        password_hash=hashed_password,
        is_admin=user.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Game CRUD operations
def get_games(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Game).offset(skip).limit(limit).all()

def get_game(db: Session, game_id: int):
    return db.query(models.Game).filter(models.Game.id == game_id).first()

def create_game(db: Session, game: schemas.GameCreate):
    db_game = models.Game(**game.dict())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

# Character CRUD operations
def get_characters_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Character).filter(
        models.Character.user_id == user_id
    ).offset(skip).limit(limit).all()

def get_character(db: Session, character_id: int, user_id: int = None):
    query = db.query(models.Character).filter(models.Character.id == character_id)
    if user_id:
        query = query.filter(models.Character.user_id == user_id)
    return query.first()

def create_character(db: Session, character: schemas.CharacterCreate, user_id: int):
    db_character = models.Character(
        **character.dict(),
        user_id=user_id
    )
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

def update_character(db: Session, character_id: int, character_update: schemas.CharacterUpdate, user_id: int):
    db_character = db.query(models.Character).filter(
        and_(models.Character.id == character_id, models.Character.user_id == user_id)
    ).first()
    
    if db_character:
        update_data = character_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_character, field, value)
        db.commit()
        db.refresh(db_character)
    
    return db_character

def delete_character(db: Session, character_id: int, user_id: int):
    db_character = db.query(models.Character).filter(
        and_(models.Character.id == character_id, models.Character.user_id == user_id)
    ).first()
    
    if db_character:
        db.delete(db_character)
        db.commit()
        return True
    return False
