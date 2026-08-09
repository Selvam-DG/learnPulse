from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

Level = Literal["basics", "intermediate", "advanced"]


class TopicOut(BaseModel):
    name: str
    slug: str
    levels: List[Level] = ["basics", "intermediate", "advanced"]
    order: int


class LessonBase(BaseModel):
    topic_slug: str = Field(..., examples=["python", "cpp"])
    level: Level
    order: int = Field(..., ge=1, le=9999)
    title: str
    slug: str
    summary: str = ""
    content_markdown: str = Field(..., min_length=40)
    code_blocks: List[dict] = []
    tags: List[str] = []

    @field_validator("slug")
    @classmethod
    def no_spaces(cls, v):
        if " " in v:
            raise ValueError("slug must not contain spaces")
        return v


class LessonCreate(LessonBase):
    pass


class LessonOut(LessonBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class FeedbackIn(BaseModel):
    name: Optional[str] = ""
    email: EmailStr
    topic: str
    message: str = ""

InterviewSection = Literal[
    "technical",
    "general",
    "personal",
    "hr",
    "behavioral",
    "project",
]

InterviewVisibility = Literal[
    "public",
    "admin",
]
class InterviewQuestionBase(BaseModel):
    slug: str
    topic_slug: Optional[str] = None
    project_slug: Optional[str] = None

    section: InterviewSection
    visibility: InterviewVisibility

    level: Optional[Level] = None

    title: str
    question: str
    summary: str = ""

    content_markdown: str = Field(..., min_length=20)

    tags: List[str] = Field(default_factory=list)

    order: int = Field(default=1, ge=1, le=9999)
    
class InterviewQuestionCreate(InterviewQuestionBase):
    pass


class InterviewQuestionOut(InterviewQuestionBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None