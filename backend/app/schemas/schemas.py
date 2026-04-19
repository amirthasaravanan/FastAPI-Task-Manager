from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

# --- Task Schemas ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    
    password: str = Field(..., max_length=72)

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# --- Token Schemas (For JWT Authentication) ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False # Ensure this is here [cite: 90]

class TaskCreate(TaskBase):
    pass    