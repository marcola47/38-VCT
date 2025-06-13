from typing import List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
import uuid

if TYPE_CHECKING:
    from .usage_app_stats import UsageAppStats

class UsageBucket(SQLModel, table=True):
    __tablename__ = "usage_buckets"
    id: int = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="auth.users.id")
    bucket_start: datetime = Field(nullable=False)
    bucket_end: datetime = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    usage_app_stats: List["UsageAppStats"] = Relationship(back_populates="usage_bucket")
