FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Environment variables
ENV PORT=8000
# Allow CORS for the frontend domain
ENV ALLOWED_ORIGINS="https://search-poc.anuragkurmi.dev,http://localhost:5173,http://localhost:5174,http://localhost:5175"

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
