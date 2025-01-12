"""Define a session instance for doing all database related operations inside
the app."""

# mypy: ignore-errors
from sqlmodel import create_engine, Session
from contextlib import contextmanager
from ..configs import get_settings

settings = get_settings()
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
