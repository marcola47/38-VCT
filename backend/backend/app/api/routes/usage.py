from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api.deps import CurrentUser, SessionDep
from app.models.usage_bucket import UsageBucket
from app.models.package_catalog import PackageCatalog
from app.models.usage_app_stats import UsageAppStats
from app.services.usage import UsageService
from datetime import datetime
from typing import List, Optional
import uuid

from pydantic import BaseModel

class AppStatIn(BaseModel):
    package_name: str
    foreground_ms: int
    launch_count: Optional[int] = None

class UsageStatsIn(BaseModel):
    bucket_start: datetime
    bucket_end: datetime
    device_tz: Optional[str] = None
    app_stats: List[AppStatIn]

router = APIRouter(prefix="/usage", tags=["usage"])

@router.post("/submit-usage")
async def submit_usage(
    data: UsageStatsIn,
    user: CurrentUser,
    session: SessionDep
):
    return UsageService.submit_usage(user.id, data, session)

@router.get("/last_bucket")
async def last_bucket(user: CurrentUser, session: SessionDep):
    bucket = UsageService.get_last_bucket(user.id, session)
    return bucket
