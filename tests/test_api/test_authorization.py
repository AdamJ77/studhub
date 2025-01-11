from studsched.app.api.authorization import parse_usos_data
from studsched.app.db.models import models
from freezegun import freeze_time


usos_user = {
    "first_name": "Bob",
    "last_name": "Rob",
    "middle_names": None,
    "email": "bob@rob.com",
    "student_number": "312836",
}

usos_courses = {
    "course_editions": {
        "2024Z": [
            {
                "course_id": "103A-INSZI-ISP-ZPRP",
                "course_name": {
                    "pl": "Zaawansowane Programowanie w Pythonie",
                    "en": "Advanced Programming in Python",
                },
            },
        ],
        "2024L": [
            {
                "course_id": "103A-INxxx-ISP-ZPR",
                "course_name": {
                    "pl": "Zaawansowane programowanie w C++",
                    "en": "Advanced C++ Programming",
                },
            },
        ],
    }
}


@freeze_time("1970-01-01")
def test_parse_usos_data(user: models.User, course: models.Course):
    user_info: models.UserInfo = parse_usos_data(usos_user, usos_courses)
    assert user_info.user == models.UserCreate(**user.model_dump())
    assert user_info.courses == [models.CourseCreate(**course.model_dump())]
