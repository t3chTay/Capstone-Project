import logging
from logging.config import fileConfig

from alembic import context
from flask import current_app

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

logger = logging.getLogger("alembic.env")


def get_engine():
    """
    Return the SQLAlchemy engine from Flask-Migrate.

    Flask-Migrate exposes the db object under:
      current_app.extensions['migrate'].db
    """
    try:
        return current_app.extensions["migrate"].db.get_engine()
    except (TypeError, AttributeError):
        return current_app.extensions["migrate"].db.engine


def get_engine_url() -> str:
    """
    Return the database URL as a string usable by Alembic.

    We escape '%' to '%%' because Alembic treats '%' as interpolation.
    """
    engine = get_engine()
    try:
        url = engine.url.render_as_string(hide_password=False)
    except AttributeError:
        url = str(engine.url)
    return url.replace("%", "%%")


config.set_main_option("sqlalchemy.url", get_engine_url())


target_db = current_app.extensions["migrate"].db


def get_metadata():
    """
    Return SQLAlchemy MetaData for autogenerate support.

    Flask-SQLAlchemy may expose metadatas (plural) or metadata (singular).
    """
    if hasattr(target_db, "metadatas"):
        return target_db.metadatas[None]
    return target_db.metadata


def _skip_empty_autogenerate(context_, revision, directives):
    """
    Prevents creation of empty migration files when no schema changes exist.
    """
    if getattr(config.cmd_opts, "autogenerate", False):
        script = directives[0]
        if script.upgrade_ops.is_empty():
            directives[:] = []
            logger.info("No changes in schema detected.")


def run_migrations_offline():
    """
    Run migrations in offline mode.

    Offline mode configures the context with a URL only (no Engine),
    and emits SQL statements to the script output.
    """
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=get_metadata(),
        literal_binds=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """
    Run migrations in online mode.

    Online mode creates a database connection and runs migrations directly.
    """
    conf_args = current_app.extensions["migrate"].configure_args

    conf_args.setdefault("process_revision_directives", _skip_empty_autogenerate)

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            compare_type=True,
            **conf_args,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()