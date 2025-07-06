from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import schemas
import crud
import models

router = APIRouter(prefix="/characters", tags=["characters"])

@router.get("/", response_model=List[schemas.Character])
async def read_characters(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    characters = crud.get_characters_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return characters

@router.post("/", response_model=schemas.Character)
async def create_character(
    character: schemas.CharacterCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify game exists
    game = crud.get_game(db, game_id=character.game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    
    return crud.create_character(db=db, character=character, user_id=current_user.id)

@router.get("/{character_id}", response_model=schemas.Character)
async def read_character(
    character_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    character = crud.get_character(db, character_id=character_id, user_id=current_user.id)
    if character is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    return character

@router.put("/{character_id}", response_model=schemas.Character)
async def update_character(
    character_id: int,
    character_update: schemas.CharacterUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    character = crud.update_character(
        db, character_id=character_id, character_update=character_update, user_id=current_user.id
    )
    if character is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    return character

@router.delete("/{character_id}")
async def delete_character(
    character_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    success = crud.delete_character(db, character_id=character_id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    return {"message": "Character deleted successfully"}

@router.get("/games/", response_model=List[schemas.Game])
async def read_games(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    games = crud.get_games(db, skip=skip, limit=limit)
    return games

@router.get("/games/{game_id}/template")
async def get_game_template(
    game_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    game = crud.get_game(db, game_id=game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    return {"template": game.template_data}
