from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.core import security

router = APIRouter()

from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2Password
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if db_user:
        
        raise HTTPException(
            status_code=400, 
            detail="Email already registered. Please login instead."
        )
    
    try:
        hashed_password = security.get_password_hash(user.password)
        new_user = models.User(email=user.email, hashed_password=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during registration")