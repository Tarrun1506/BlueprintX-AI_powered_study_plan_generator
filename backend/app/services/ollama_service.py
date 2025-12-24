import httpx
import json
import logging
from app.core.config import settings
from app.models.syllabus import SyllabusAnalysisResponse, Topic

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def call_ollama(prompt: str, model: str) -> str:
    """Helper to call local Ollama API."""
    url = f"{settings.OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            raise ValueError(f"Failed to communicate with local Ollama: {str(e)}")

async def analyze_syllabus(text_content: str) -> SyllabusAnalysisResponse:
    """Analyze syllabus using local Llama 3.2."""
    prompt = f"""
    Analyze the following syllabus content. Extract:
    1. A hierarchical list of all topics and subtopics.
    2. The relative importance (High, Medium, Low).
    3. Estimated study hours for lowest-level topics.

    Format the response STRICTLY as a JSON object:
    {{
      "topics": [
        {{
          "name": "Topic Name",
          "importance": "High/Medium/Low",
          "estimated_hours": null, 
          "subtopics": [
            {{
              "name": "Subtopic Name",
              "importance": "High/Medium/Low",
              "estimated_hours": 3.5,
              "subtopics": []
            }}
          ]
        }}
      ]
    }}

    Syllabus content:
    ---
    {text_content}
    ---
    """
    
    raw_response = await call_ollama(prompt, settings.OLLAMA_ANALYSIS_MODEL)
    parsed_data = json.loads(raw_response)
    raw_topics = parsed_data.get('topics', [])

    # Reuse logic from other services for validation/calculation
    validated_topics, total_hours, priority_topics = await _recursive_topic_processor(raw_topics)
    
    return SyllabusAnalysisResponse(
        topics=validated_topics,
        total_study_hours=total_hours if total_hours > 0 else None,
        priority_topics=list({topic.name: topic for topic in priority_topics}.values())
    )

async def _recursive_topic_processor(topic_data_list: list) -> tuple[list[Topic], float, list[Topic]]:
    """Helper for topic tree construction."""
    validated_topics = []
    total_hours = 0.0
    priority_topics = []

    for topic_data in topic_data_list:
        subtopics, sub_hours, sub_priority = [], 0.0, []
        if topic_data.get('subtopics'):
            subtopics, sub_hours, sub_priority = await _recursive_topic_processor(topic_data['subtopics'])

        hours = topic_data.get('estimated_hours')
        if hours is not None:
            try: hours = float(hours)
            except: hours = None

        topic = Topic(
            name=topic_data.get('name', 'Unknown'),
            importance=topic_data.get('importance', 'Medium'),
            estimated_hours=hours,
            subtopics=subtopics
        )

        if not topic.subtopics and topic.estimated_hours:
            total_hours += topic.estimated_hours
        else:
            total_hours += sub_hours
            if topic.estimated_hours is None:
                topic.estimated_hours = sub_hours

        if topic.importance.lower() == "high":
            priority_topics.append(topic)
        priority_topics.extend(sub_priority)
        validated_topics.append(topic)

    return validated_topics, total_hours, priority_topics
