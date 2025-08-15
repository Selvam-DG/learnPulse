from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Literal, List, Optional

level= Literal["basics", "intermediate","advanced"]

class TopicOut(BaseModel):
    name:str
    slug:str
    levels:List[level] = ["basics", "intermediate", "advanced"]
    order: int

class LessonBase(BaseModel):
    topic_slug: str = Field(..., examples=["python", "cpp"])
    level: level
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

class LessonCreate(LessonBase): ...
class LessonOut(LessonBase): ...

class FeedbackIn(BaseModel):
    name: Optional[str] = ""
    email: EmailStr
    topic: str
    message: str = ""