from authlib.integrations.starlette_client.apps import StarletteOAuth1App
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from datetime import datetime, timedelta
from typing import Annotated
from jose import jwt

from ..configs import get_settings
from ..db.models import models
from ..db.queries import queries
from .base import DatabaseDep

settings = get_settings()


authorization_router = APIRouter()


def get_usos(request: Request):
    return request.app.oauth.create_client("usos")


UsosDep = Annotated[StarletteOAuth1App, Depends(get_usos)]


@authorization_router.get("/login")
async def login(request: Request, usos: UsosDep):

    request.session.clear()

    redirect_uri = request.url_for("auth")
    sth = await usos.authorize_redirect(
        request, redirect_uri)
    return sth


async def get_user_data(token, usos: StarletteOAuth1App) -> dict:
    usos_user = await usos.get(
        "services/users/user",
        params={"fields": "student_number|first_name|middle_names|last_name|email"},
        token=token,
    )
    return usos_user.json()


async def get_courses_data(token, usos: StarletteOAuth1App) -> dict:
    usos_courses = await usos.get(
        "services/courses/user",
        params={"fields": "course_editions[course_id|course_name]"},
        token=token,
    )
    return usos_courses.json()


def parse_usos_data(usos_user: dict, usos_courses: dict) -> models.UserInfo:
    usos_user["index"] = usos_user.pop("student_number")
    usos_user["last_login"] = datetime.now()

    current_term = max(usos_courses["course_editions"])

    usos_courses = [
        {"name": c["course_name"]["pl"], "code": c["course_id"]}
        for c in usos_courses["course_editions"][current_term]
    ]

    return models.UserInfo(user=usos_user, courses=usos_courses)


def create_jwt_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ENCODE_ALGORITHM)
    return encoded_jwt


@authorization_router.get("/auth")
async def auth(request: Request, db: DatabaseDep, usos: UsosDep):
    token = await usos.authorize_access_token(request)

    usos_user = await get_user_data(token, usos)
    usos_courses = await get_courses_data(token, usos)

    user_info = parse_usos_data(usos_user, usos_courses)
    db_user = queries.add_user_info(db, user_info)

    token_data = {"id": db_user.id}
    jwt_token = create_jwt_token(token_data)

    response = RedirectResponse(url="http://localhost:3000/courses", status_code=307)
    response.set_cookie(
        key="token", value=jwt_token, httponly=True, secure=False, samesite="lax"
    )
    return response
