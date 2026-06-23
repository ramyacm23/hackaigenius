import json

import google.generativeai as genai
from tenacity import (
    retry,
    retry_if_exception_type,
    retry_if_not_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.ai.prompts import SYSTEM_INSTRUCTION, build_generation_prompt
from app.ai.schema_spec import RESPONSE_SCHEMA
from app.core.config import settings
from app.core.exceptions import GeminiError, GeminiQuotaError
from app.core.logging import get_logger

logger = get_logger(__name__)


class GeminiClient:
    def __init__(self) -> None:
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not set; generation will fail.")
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL
        self._model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=SYSTEM_INSTRUCTION,
        )
        self._generation_config = {
            "temperature": 0.7,
            "response_mime_type": "application/json",
            "response_schema": RESPONSE_SCHEMA,
        }

    @retry(
        reraise=True,
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(GeminiError)
        & retry_if_not_exception_type(GeminiQuotaError),
    )
    def generate_solution(self, problem_statement: str, title: str | None) -> dict:
        prompt = build_generation_prompt(problem_statement, title)
        try:
            response = self._model.generate_content(
                prompt,
                generation_config=self._generation_config,
                request_options={"timeout": 120},
            )
        except Exception as exc:  # noqa: BLE001
            logger.error("Gemini API call failed: %s", exc)
            message = str(exc)
            if "429" in message or "quota" in message.lower() or "rate limit" in message.lower():
                raise GeminiQuotaError(f"Gemini request failed: {message}") from exc
            raise GeminiError(f"Gemini request failed: {message}") from exc

        raw = (response.text or "").strip()
        if not raw:
            raise GeminiError("Gemini returned an empty response.")

        try:
            return json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse Gemini JSON: %s", exc)
            raise GeminiError("Gemini returned malformed JSON.") from exc


_client: GeminiClient | None = None


def get_gemini_client() -> GeminiClient:
    global _client
    if _client is None:
        _client = GeminiClient()
    return _client
