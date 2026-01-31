"""
Pro Semantic Command Palette - FastAPI Backend
"""
import os
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rate_limiter import check_rate_limit
from ai_service import parse_command


app = FastAPI(
    title="Pro Semantic Command Palette API",
    description="AI-powered command parsing for enterprise workflows",
    version="1.0.0"
)

# CORS configuration for frontend
# CORS Configuration
# Allow specific origins for production and local development
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CommandRequest(BaseModel):
    prompt: str


class CommandResponse(BaseModel):
    action: str
    params: dict | None = None
    rate_limit: dict | None = None
    error: str | None = None


@app.get("/")
async def root():
    return {
        "name": "Pro Semantic Command Palette API",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/command", response_model=CommandResponse)
async def process_command(
    request: Request,
    body: CommandRequest,
    rate_info: dict = Depends(check_rate_limit)
):
    """
    Process a natural language command and return structured action JSON.
    Rate limited to 10 commands per day per IP.
    """
    result = await parse_command(body.prompt)
    
    return CommandResponse(
        action=result.get("action", "UNKNOWN"),
        params=result.get("params"),
        rate_limit=rate_info,
        error=result.get("error")
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
