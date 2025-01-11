"""Module containing FastAPI instance related functions and classes."""

# mypy: ignore-errors
import logging.config
import pathlib

from fastapi import FastAPI
from sqlmodel import SQLModel, text
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware

from .api import api_router
from .events.base import logger
from .chat.chat import create_chat_service
from .configs import get_settings
from .db import engine
from .middlewares import log_time
from .version import __version__
from contextlib import asynccontextmanager
from authlib.integrations.starlette_client import OAuth

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    oauth = OAuth()
    oauth.register(
        name="usos",
        client_id="TQbmzC4s3FSSBLd5gWkq",
        client_secret="nhmmmJezLgkp6jk3LaF2nEtEvZFuKwWtN9FGwsqA",
        api_base_url="https://apps.usos.pw.edu.pl/",
        request_token_url="https://apps.usos.pw.edu.pl/services/oauth/request_token?scopes=email|studies",
        authorize_url="https://apps.usos.pw.edu.pl/services/oauth/authorize",
        access_token_url="https://apps.usos.pw.edu.pl/services/oauth/access_token"
    )
    app.oauth = oauth
    app.state.chat_service = create_chat_service(settings.REDIS_URL)
    logger.info("Starting up ...")
    yield
    logger.info("Shutting down ...")
    app.state.chat_service.close()


def create_db_tables():
    """Create all tables in database."""
    SQLModel.metadata.create_all(engine)


def load_example_data(path: str):
    """Load example data to database."""
    with engine.connect() as con:
        with open((pathlib.Path(__file__).parent) / path, encoding="utf-8") as file:
            query = text(file.read())
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

    # Set all CORS enabled origins
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # add defined routers
    application.include_router(api_router, prefix=settings.API_STR)


    # load logging config
    logging.config.dictConfig(settings.LOGGING_CONFIG)

    # add defined middleware functions
    application.add_middleware(BaseHTTPMiddleware, dispatch=log_time)
    application.add_middleware(
        SessionMiddleware,
        secret_key="nhmmmJezLgkp6jk3LaF2nEtEvZFuKwWtN9FGwsqA",
    )

    # create tables in db
    create_db_tables()

    # load example data
    if settings.LOAD_EXAMPLE_DATA:
        load_example_data(settings.DUMP_SQL_FILE)

    return application
