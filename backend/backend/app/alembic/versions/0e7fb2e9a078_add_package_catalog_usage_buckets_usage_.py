"""add package_catalog, usage_buckets, usage_app_stats tables

Revision ID: 0e7fb2e9a078
Revises: 2c0516590c18
Create Date: 2025-05-27 19:22:03.163037

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0e7fb2e9a078'
down_revision: Union[str, None] = '2c0516590c18'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) Catálogo de pacotes (aplicativos)
    op.create_table(
        'package_catalog',
        sa.Column('package_id', sa.SmallInteger, primary_key=True, autoincrement=True),
        sa.Column('package_name', sa.Text, nullable=False, unique=True),
    )

    # 2) Janela de 5 min (igual antes, sem RLS)
    op.create_table(
        'usage_buckets',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['auth.users.id'], ondelete='CASCADE'),
        sa.Column('bucket_start', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('bucket_end', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text('now()')),
    )

    # 3) Estatísticas por app x bucket
    op.create_table(
        'usage_app_stats',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('usage_bucket_id', sa.Integer, sa.ForeignKey('usage_buckets.id'), nullable=False),
        sa.Column('package_id', sa.SmallInteger, sa.ForeignKey('package_catalog.package_id'), nullable=False),
        sa.Column('foreground_ms', sa.Integer, nullable=False),
        sa.CheckConstraint('foreground_ms >= 0'),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    op.drop_table('usage_app_stats')
    op.drop_table('usage_buckets')
    op.drop_table('package_catalog')
    # ### end Alembic commands ###
