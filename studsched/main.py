"""Main function for running the API service."""

# mypy: ignore-errors
import uvicorn
from app import create_application

if __name__ == "__main__":
    uvicorn.run(
        "main:create_application", host="0.0.0.0", port=8080, reload=False
    )  # nosec
