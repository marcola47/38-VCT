import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .usage_app_stats import UsageAppStats

class PackageCatalog(SQLModel, table=True):
    __tablename__ = "package_catalog"
    package_id: Optional[int] = Field(default=None, primary_key=True)
    package_name: str = Field(nullable=False, unique=True, index=True)
    usage_app_stats: List["UsageAppStats"] = Relationship(back_populates="package_catalog")
