from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas import schemas
from app.api import crud
from app.models import models
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.Task)
def create_task(
    task: schemas.TaskCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    return crud.create_user_task(db=db, task=task, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Task])
def read_tasks(
    completed: Optional[bool] = None, 
    skip: int = Query(0, ge=0), 
    limit: int = Query(10, ge=1, le=100), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # rule to ensure users must only access their own tasks 
    query = db.query(models.Task).filter(models.Task.owner_id == current_user.id)
    
    if completed is not None:
        query = query.filter(models.Task.completed == completed)
    
    return query.offset(skip).limit(limit).all()

# to GET specific task 
@router.get("/{task_id}", response_model=schemas.Task)
def read_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id, 
        models.Task.owner_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: int, 
    task_update: schemas.TaskCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id, 
        models.Task.owner_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.title = task_update.title
    task.description = task_update.description
    task.completed = task_update.completed
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    
    success = crud.delete_task(db, task_id=task_id, owner_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return {"message": "Task deleted successfully"}