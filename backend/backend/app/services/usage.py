from sqlmodel import Session, select
from app.models.usage_bucket import UsageBucket
from app.models.package_catalog import PackageCatalog
from app.models.usage_app_stats import UsageAppStats
from datetime import datetime
from typing import List, Optional
import uuid

class UsageService:
    @staticmethod
    def submit_usage(user_id: uuid.UUID, data, session: Session):
        # 1. Ensure bucket exists (by user_id and bucket_start)
        bucket = session.exec(
            select(UsageBucket).where(
                UsageBucket.user_id == user_id,
                UsageBucket.bucket_start == data.bucket_start
            )
        ).first()
        if not bucket:
            bucket = UsageBucket(
                user_id=user_id,
                bucket_start=data.bucket_start,
                bucket_end=data.bucket_end
            )
            session.add(bucket)
            session.commit()
            session.refresh(bucket)
        # 2. For each app_stat, ensure package exists and store stats
        for app in data.app_stats:
            pkg = session.exec(
                select(PackageCatalog).where(PackageCatalog.package_name == app.package_name)
            ).first()
            if not pkg:
                pkg = PackageCatalog(package_name=app.package_name)
                session.add(pkg)
                session.commit()
                session.refresh(pkg)
            # 3. Store usage_app_stats (reference usage_bucket_id)
            usage_stat = UsageAppStats(
                usage_bucket_id=bucket.id,
                package_id=pkg.package_id,
                foreground_ms=app.foreground_ms
            )
            session.add(usage_stat)
        session.commit()
        return {"status": "ok"}

    @staticmethod
    def get_last_bucket(user_id: uuid.UUID, session: Session):
        return session.exec(
            select(UsageBucket)
            .where(UsageBucket.user_id == user_id)
            .order_by(UsageBucket.bucket_start.desc())
        ).first()
