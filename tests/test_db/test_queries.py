from sqlmodel import Session, select
from studsched.app.db.queries.queries import (
    get_subjects,
    replace_requirements,
    add_user_info,
)
from studsched.app.db.models import models
import pytest
from sqlalchemy.orm.exc import NoResultFound


@pytest.mark.usefixtures("db_with_user")
def test_get_subjects_empty(user: models.User):
    res = get_subjects(user)
    assert len(res) == 0


@pytest.mark.usefixtures("db_with_courses")
def test_get_subjects(user: models.User):
    res = get_subjects(user)
    assert len(res) == 1


@pytest.mark.usefixtures("empty_db")
def test_get_subjects_nonexistent_user(user: models.User):
    res = get_subjects(user)
    assert len(res) == 0


def test_replace_requirements(
    db_with_courses: Session,
    linked_course: models.LinkedCourse,
    requirement: models.Requirement,
    user: models.User,
):
    subjects = get_subjects(user)
    requirements = subjects[0].requirements
    assert len(requirements) == 1

    requirement_update = models.RequirementCreate(**requirement.model_dump())
    replace_requirements(
        db_with_courses, linked_course.id, [requirement_update] * 2
    )

    subjects = get_subjects(user)
    requirements = subjects[0].requirements
    assert len(requirements) == 2


def test_delete_requirements(
    user: models.User,
    db_with_courses: Session,
    linked_course: models.LinkedCourse,
):
    subjects = get_subjects(user)
    requirements = subjects[0].requirements
    assert len(requirements) == 1

    replace_requirements(db_with_courses, linked_course.id, [])

    subjects = get_subjects(user)
    requirements = subjects[0].requirements
    assert len(requirements) == 0


def test_replace_requirements_invalid_linked_course(
    empty_db: Session,
):
    invalid_linked_course_id = 234

    with pytest.raises(NoResultFound):
        replace_requirements(empty_db, invalid_linked_course_id, [])


def test_add_user_info(
    empty_db: Session,
    user: models.User,
    course: models.Course,
):
    user_info = models.UserInfo(
        user=user,
        courses=[course],
    )

    db_user = add_user_info(empty_db, user_info)
    subjects = get_subjects(db_user)

    assert len(subjects) == 1
    subject = subjects[0]
    assert subject.name == "Zaawansowane Programowanie w Pythonie"
    assert subject.status == models.SubjectStatus.IN_PROGRESS
    assert len(subject.requirements) == 0


def test_add_user_info_to_existing_one(
    db_with_courses: Session,
    user: models.User,
    course: models.Course,
):
    user_info = models.UserInfo(
        user=user,
        courses=[course],
    )

    add_user_info(db_with_courses, user_info)

    db_users = db_with_courses.exec(select(models.User)).all()
    assert len(db_users) == 1

    db_courses = db_with_courses.exec(select(models.Course)).all()
    assert len(db_courses) == 1

    db_linked_courses = db_with_courses.exec(select(models.LinkedCourse)).all()
    assert len(db_linked_courses) == 1
