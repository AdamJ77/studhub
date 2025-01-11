from fastapi.testclient import TestClient
from fastapi import FastAPI, status
from sqlmodel import Session
import pytest

from studsched.app.api.base import get_db, get_current_user
from studsched.app.version import __version__
from studsched.app.db.models import models


@pytest.fixture
def mock_current_user(
    app: FastAPI,
    user: models.User,
):
    app.dependency_overrides[get_current_user] = lambda: user


@pytest.fixture
def mock_db_with_user(
    app: FastAPI,
    db_with_user: Session,
):
    app.dependency_overrides[get_db] = lambda: db_with_user


@pytest.fixture
def mock_db_with_courses(
    app: FastAPI,
    db_with_courses: Session,
):
    app.dependency_overrides[get_db] = lambda: db_with_courses


def test_get_version(test_client: TestClient):
    response = test_client.get("/api/v1/version")
    assert response.status_code == 200
    assert response.json() == {"version": __version__}


@pytest.mark.usefixtures("mock_db_with_user", "mock_current_user")
def test_get_subjects_empty(
    test_client: TestClient,
):
    response = test_client.get("/api/v1/subjects")
    assert response.status_code == 200
    res = response.json()
    assert len(res) == 0


@pytest.mark.usefixtures("mock_db_with_courses", "mock_current_user")
def test_get_subjects(
    test_client: TestClient,
):
    response = test_client.get("/api/v1/subjects")
    assert response.status_code == 200
    res = response.json()
    assert len(res) == 1

    subject = res[0]
    assert subject["id"] == 1
    assert subject["name"] == "Zaawansowane Programowanie w Pythonie"
    assert subject["status"] == models.SubjectStatus.IN_PROGRESS
    assert len(subject["requirements"]) == 1

    requirement = subject["requirements"][0]
    assert requirement["task_type"] == models.TaskType.LAB
    assert requirement["requirement_type"] == models.RequirementType.TOTAL
    assert requirement["threshold"] == 5
    assert requirement["threshold_type"] == models.ThresholdType.POINTS


@pytest.mark.usefixtures("mock_db_with_courses")
def test_get_subjects_no_current_user(
    test_client: TestClient,
):
    response = test_client.get("/api/v1/subjects")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.usefixtures("mock_db_with_courses", "mock_current_user")
def test_replace_requirements(
    test_client: TestClient,
    linked_course: models.LinkedCourse,
    requirement: models.Requirement,
):
    subjects = test_client.get("/api/v1/subjects").json()
    requirements = subjects[0]["requirements"]
    assert len(requirements) == 1

    requirement_update = models.RequirementCreate(**requirement.model_dump())
    res = test_client.put(
        f"/api/v1/subjects/{linked_course.id}/requirements",
        json=[requirement_update.model_dump()] * 2,
    )
    assert res.status_code == status.HTTP_200_OK

    subjects = test_client.get("/api/v1/subjects").json()
    requirements = subjects[0]["requirements"]
    assert len(requirements) == 2

    for requirement in requirements:
        assert requirement["task_type"] == models.TaskType.LAB
        assert requirement["requirement_type"] == models.RequirementType.TOTAL
        assert requirement["threshold"] == 5
        assert requirement["threshold_type"] == models.ThresholdType.POINTS


@pytest.mark.usefixtures("mock_db_with_courses")
@pytest.mark.parametrize("endpoint", {"requirements", "tasks"})
def test_replace_invalid_subject(
    app: FastAPI, test_client: TestClient, endpoint
):
    invalid_linked_course_id = 234

    res = test_client.put(
        f"/api/v1/subjects/{invalid_linked_course_id}/{endpoint}", json=[]
    )
    assert res.status_code == status.HTTP_404_NOT_FOUND
