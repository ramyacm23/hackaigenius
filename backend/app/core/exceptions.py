class AppError(Exception):
    """Base application error."""

    status_code: int = 500
    detail: str = "Internal server error"

    def __init__(self, detail: str | None = None):
        if detail:
            self.detail = detail
        super().__init__(self.detail)


class NotFoundError(AppError):
    status_code = 404
    detail = "Resource not found"


class GeminiError(AppError):
    status_code = 502
    detail = "AI generation failed"


class GeminiQuotaError(GeminiError):
    status_code = 429
    detail = "AI rate limit exceeded. Please wait a minute and try again."


class ValidationError(AppError):
    status_code = 422
    detail = "Invalid input"
