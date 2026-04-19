# official python image
FROM python:3.11-slim

# working directory inside the container setup
WORKDIR /app

# to install dependencies

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# to copy the remaining backend code
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# as main.py is inside the 'app' folder:
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]