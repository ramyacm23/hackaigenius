"""JSON schema passed to Gemini to force structured output."""

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "problem_analysis": {
            "type": "object",
            "properties": {
                "summary": {"type": "string"},
                "pain_points": {"type": "array", "items": {"type": "string"}},
                "stakeholders": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["summary", "pain_points", "stakeholders"],
        },
        "solution": {
            "type": "object",
            "properties": {
                "idea": {"type": "string"},
                "key_features": {"type": "array", "items": {"type": "string"}},
                "value_proposition": {"type": "string"},
            },
            "required": ["idea", "key_features", "value_proposition"],
        },
        "architecture": {
            "type": "object",
            "properties": {
                "overview": {"type": "string"},
                "components": {"type": "array", "items": {"type": "string"}},
                "data_flow": {"type": "string"},
            },
            "required": ["overview", "components", "data_flow"],
        },
        "tech_stack": {
            "type": "object",
            "properties": {
                "frontend": {"type": "array", "items": {"type": "string"}},
                "backend": {"type": "array", "items": {"type": "string"}},
                "database": {"type": "array", "items": {"type": "string"}},
                "ai": {"type": "array", "items": {"type": "string"}},
                "infra": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["frontend", "backend", "database", "ai", "infra"],
        },
        "roadmap": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "phase": {"type": "string"},
                    "goals": {"type": "array", "items": {"type": "string"}},
                    "deliverables": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["phase", "goals", "deliverables"],
            },
        },
        "ppt_content": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "slide": {"type": "integer"},
                    "title": {"type": "string"},
                    "bullets": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["slide", "title", "bullets"],
            },
        },
        "innovation_highlights": {"type": "array", "items": {"type": "string"}},
    },
    "required": [
        "problem_analysis",
        "solution",
        "architecture",
        "tech_stack",
        "roadmap",
        "ppt_content",
        "innovation_highlights",
    ],
}
