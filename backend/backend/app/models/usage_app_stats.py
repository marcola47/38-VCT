from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .usage_bucket import UsageBucket
    from .package_catalog import PackageCatalog

class UsageAppStats(SQLModel, table=True):
    __tablename__ = "usage_app_stats"
    id: int = Field(default=None, primary_key=True)
    usage_bucket_id: int = Field(foreign_key="usage_buckets.id")
    package_id: int = Field(foreign_key="package_catalog.package_id")
    foreground_ms: int = Field(nullable=False, ge=0)
    usage_bucket: Optional["UsageBucket"] = Relationship(back_populates="usage_app_stats")
    package_catalog: Optional["PackageCatalog"] = Relationship(back_populates="usage_app_stats")
