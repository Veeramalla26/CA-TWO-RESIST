"""Increase length of hotel link column

Revision ID: 8ad1c5374310
Revises: 7ee2d00b0284
Create Date: 2024-12-06 03:37:28.419038

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8ad1c5374310'
down_revision = '7ee2d00b0284'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('hotel', schema=None) as batch_op:
        batch_op.alter_column('link',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=1000),
               existing_nullable=False,
               existing_server_default=sa.text("''::character varying"))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('hotel', schema=None) as batch_op:
        batch_op.alter_column('link',
               existing_type=sa.String(length=1000),
               type_=sa.VARCHAR(length=255),
               existing_nullable=False,
               existing_server_default=sa.text("''::character varying"))

    # ### end Alembic commands ###