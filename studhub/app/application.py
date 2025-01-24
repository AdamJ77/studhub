# mypy: ignore-errors
import logging.config
import secrets
from contextlib import asynccontextmanager
from pathlib import Path

from authlib.integrations.starlette_client import OAuth
from fastapi import FastAPI
from sqlmodel import SQLModel, text
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .api import api_router
from .chat.chat import create_chat_service
from .configs import get_settings
from .db import engine
from .middlewares import log_time
from .version import __version__

settings = get_settings()
logger = logging.getLogger(settings.PROJECT_SLUG)


@asynccontextmanager
async def lifespan(app: FastAPI):
    oauth = OAuth()
    oauth.register(
        name="usos",
        client_id=settings.USOS_CLIENT_ID,
        client_secret=settings.USOS_CLIENT_KEY,
        api_base_url="https://apps.usos.pw.edu.pl/",
        request_token_url="https://apps.usos.pw.edu.pl/services/oauth/request_token?scopes=email%7Cstudies",
        authorize_url="https://apps.usos.pw.edu.pl/services/oauth/authorize",
        access_token_url="https://apps.usos.pw.edu.pl/services/oauth/access_token",
    )
    app.oauth = oauth
    app.state.chat_service = create_chat_service(settings.REDIS_URL)
    logger.info("Starting up studhub=%s...", __version__)
    yield
    logger.info("Shutting down studhub=%s...", __version__)
    app.state.chat_service.close()


def create_db_tables():
    """Create all tables in database."""
    SQLModel.metadata.create_all(engine)


def load_example_data(path: str):
    """Load example data to database."""
    with engine.connect() as con:
        with (Path(__file__).parent / path).open() as f:
            query = text(f.read())
            con.execute(query)
            con.commit()


def create_application() -> FastAPI:
    """Create a FastAPI instance.

    Returns:
        object of FastAPI: the fastapi application instance.
    """

    application = FastAPI(
        title=settings.PROJECT_NAME,
        debug=settings.DEBUG,
        version=__version__,
        openapi_url=f"{settings.API_STR}/openapi.json",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix=settings.API_STR)

    logging.config.dictConfig(settings.LOGGING_CONFIG)

    application.add_middleware(BaseHTTPMiddleware, dispatch=log_time)
    application.add_middleware(
        SessionMiddleware,
        secret_key=secrets.token_hex(32),
    )

    create_db_tables()

    if settings.LOAD_EXAMPLE_DATA:
        load_example_data(settings.DUMP_SQL_FILE)

    return application
