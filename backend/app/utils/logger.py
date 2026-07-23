"""
Centralized logging configuration.

The project standard is to always use the `logging` module instead of
`print()`. Call `configure_logging()` once at application startup, then
obtain module-level loggers anywhere via `get_logger(__name__)`.
"""

import logging
import sys

from app.config.settings import get_settings

_LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

_configured = False


def configure_logging() -> None:
    """
    Configure the root logger once for the entire application process.

    Idempotent: calling this multiple times has no additional effect.
    The log level is sourced from `settings.LOG_LEVEL`.
    """
    global _configured
    if _configured:
        return

    settings = get_settings()
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    handler = logging.StreamHandler(stream=sys.stdout)
    handler.setFormatter(logging.Formatter(fmt=_LOG_FORMAT, datefmt=_DATE_FORMAT))

    # Avoid duplicate handlers if reloaded (e.g. by uvicorn --reload)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    _configured = True


def get_logger(name: str) -> logging.Logger:
    """
    Return a named logger, ensuring logging has been configured first.

    Args:
        name: Typically `__name__` of the calling module.

    Returns:
        A standard library `Logger` instance.
    """
    configure_logging()
    return logging.getLogger(name)
