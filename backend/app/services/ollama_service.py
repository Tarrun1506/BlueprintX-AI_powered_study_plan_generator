import httpx
import json
import logging
from app.core.config import settings
from app.models.syllabus import SyllabusAnalysisResponse, Topic

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def call_ollama(prompt: str, model: str, json_mode: bool = True) -> str:
    """Helper to call local Ollama API."""
    url = f"{settings.OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }
    if json_mode:
        payload["format"] = "json"
    
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

async def generate_quiz(topic_name: str, context: str, difficulty: str = "Medium") -> dict:
    """Generate a quiz for a specific topic."""
    prompt = f"""
    Generate a 5-question quiz for the topic '{topic_name}'.
    Context: {context[:500]}... (truncated)
    Difficulty: {difficulty}

    Format STRICTLY as JSON:
    {{
        "questions": [
            {{
                "id": 1,
                "text": "Question text?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A",
                "explanation": "Why A is correct."
            }}
        ]
    }}
    """
    response = await call_ollama(prompt, settings.OLLAMA_ANALYSIS_MODEL)
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        # Fallback if model outputs text frame
        return {"questions": [], "error": "Failed to parse quiz format"}

async def chat_with_context(user_query: str, topic_context: str) -> str:
    """Chat with AI about a specific topic."""
    
    # Parse context to clean text to prevent model from hallucinating JSON
    try:
        topic_data = json.loads(topic_context)
        topic_name = topic_data.get('name', 'Unknown Topic')
        subtopics = ", ".join([st['name'] if isinstance(st, dict) else st for st in topic_data.get('subtopics', [])])
        
        context_str = f"Topic: {topic_name}\n"
        if subtopics:
            context_str += f"Subtopics: {subtopics}\n"
    except:
        # Fallback if text is not JSON
        context_str = f"Topic Context: {topic_context}"

    prompt = f"""
    You are a specialized AI tutor restricted to teaching ONLY the current topic.
    
    TOPIC CONTEXT:
    {context_str}
    
    STRICT INSTRUCTIONS:
    1. Analyze the Student Question. Is it directly asking about "{topic_name}"?
    2. IF YES: Explain the concept clearly and educationally.
    3. IF NO (e.g. asking about a different topic, general knowledge, or off-topic):
       - YOU MUST REFUSE.
       - DO NOT explain the unrelated concept. Do not try to relate it.
       - REPLY ONLY: "I can only answer questions strictly related to **{topic_name}**. Please ask a question about this topic."
    
    Student Question: {user_query}
    
    AI Tutor Answer:
    """
    # Use a faster model for chat if available, or same analysis model
    return await call_ollama(prompt, settings.OLLAMA_ANALYSIS_MODEL, json_mode=False)
