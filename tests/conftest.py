from sqlmodel import Session, SQLModel
from fastapi.testclient import TestClient
from datetime import datetime
from freezegun import freeze_time
import pytest

from studsched.app.application import create_application
from studsched.app.db.session import engine
from studsched.app.db.models import models


@pytest.fixture
def app():
    return create_application()


@pytest.fixture
def test_client(app):
    test_client = TestClient(app)
    return test_client


@pytest.fixture
def empty_db():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
        session.close()
    SQLModel.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
@freeze_time("1970-01-01")
def user():
    return models.User(
        index="312836",
        first_name="Bob",
        last_name="Rob",
        email="bob@rob.com",
        last_login=datetime.now(),
    )


@pytest.fixture
def course():
    return models.Course(
        name="Zaawansowane Programowanie w Pythonie",
        code="103A-INSZI-ISP-ZPRP",
    )


@pytest.fixture
def db_with_user(
    empty_db: Session,
    user: models.User,
):
    empty_db.add(user)
    empty_db.commit()
    yield empty_db


@pytest.fixture
def linked_course(
    user: models.User,
    course: models.Course,
):
    return models.LinkedCourse(user=user, course=course)


@pytest.fixture
def requirement(linked_course: models.LinkedCourse):
    return models.Requirement(
        task_type=models.TaskType.LAB,
        requirement_type=models.RequirementType.TOTAL,
        threshold=5,
        threshold_type=models.ThresholdType.POINTS,
        linked_course=linked_course,
    )


@pytest.fixture
def db_with_courses(
    db_with_user: Session,
    course: models.Course,
    linked_course: models.LinkedCourse,
    requirement: models.Requirement,
):
    db_with_user.add(course)
    db_with_user.add(linked_course)
    db_with_user.add(requirement)
    db_with_user.commit()

    yield db_with_user
