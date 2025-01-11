from sqlmodel import SQLModel, Field
from typing import Optional


class DummyTable(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, nullable=False)
    fullname: str = Field(nullable=True)


def test_tablename():
    assert DummyTable.__tablename__ == "dummytable"


def test_asdict():
    d = DummyTable(id=1, username="dummy username", fullname="dummy fullname")
    assert dict(d) == dict(
        id=1, username="dummy username", fullname="dummy fullname"
    )
