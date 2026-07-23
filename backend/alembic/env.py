"""
Alembic migration environment.

Migrations run synchronously (via `psycopg2`) even though the
application itself uses an async engine at runtime — this keeps the
migration tooling simple and avoids the extra complexity of async
migration drivers, which is a standard and widely recommended pattern.

Model metadata is imported from `app.database.base.Base`. Every new
model added under `app/models/` must be imported below so Alembic's
`--autogenerate` can detect it.
"""

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.config.settings import get_settings
from app.database.base import Base

# Import all models here so Base.metadata is fully populated.
from app.models import user  # noqa: F401

config = context.config
settings = get_settings()

# Inject the real (sync) database URL from application settings instead
# of hardcoding it in alembic.ini.
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL_SYNC)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generates SQL without a live DB connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode against a live database connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
