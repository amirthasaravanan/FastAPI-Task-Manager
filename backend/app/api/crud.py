from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

#  View all their tasks + Pagination + Filtering
def get_tasks(db: Session, owner_id: int, skip: int = 0, limit: int = 10, completed: bool = None):
    query = db.query(models.Task).filter(models.Task.owner_id == owner_id)
    
    # Filtering (?completed=true)
    if completed is not None:
        query = query.filter(models.Task.completed == completed)
    
    # Pagination
    return query.offset(skip).limit(limit).all()

# Create a task
def create_user_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.dict(), owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# Delete a task
def delete_task(db: Session, task_id: int, owner_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == owner_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False