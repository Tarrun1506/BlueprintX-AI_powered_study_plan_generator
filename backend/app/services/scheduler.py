from datetime import datetime, timedelta
from typing import List, Dict, Tuple
from app.models.syllabus import Topic

def generate_study_schedule(
    topics: List[Topic], 
    start_date: datetime, 
    daily_hours: float = 2.0,
    days_off: List[int] = [] # 0=Monday, 6=Sunday
) -> Tuple[List[Topic], datetime]:
    """
    Distributes topics across available days based on estimated hours.
    Returns the updated topic list (with dates) and the projected completion date.
    """
    current_date = start_date
    current_day_hours_filled = 0.0
    
    # Flatten priorities if needed, but here we just iterate deeply
    # We need a recursive helper or a flat list to assign dates efficiently.
    # For simplicity in v1, we'll traverse and assign.
    
    updated_topics, completion_date = _assign_dates_recursive(
        topics, 
        current_date, 
        daily_hours, 
        days_off,
        current_day_hours_filled
    )
    
    return updated_topics, completion_date

def _assign_dates_recursive(
    topics: List[Topic], 
    current_date: datetime, 
    daily_hours: float, 
    days_off: List[int],
    current_day_hours_filled: float
) -> Tuple[List[Topic], datetime]:
    
    # Helper to advance date if needed
    def advance_to_next_valid_day(date_obj):
        next_day = date_obj + timedelta(days=1)
        while next_day.weekday() in days_off:
            next_day += timedelta(days=1)
        return next_day

    # Ensure start date is valid
    while current_date.weekday() in days_off:
        current_date = advance_to_next_valid_day(current_date - timedelta(days=1))

    for topic in topics:
        # If topic has subtopics, recurse first (bottom-up often better, but for planning we usually go top-down or sequential)
        # Actually, for study plans, we usually study the subtopics. 
        # So we assign time to the LEAF nodes.
        
        if topic.subtopics:
            topic.subtopics, current_date = _assign_dates_recursive(
                topic.subtopics, 
                current_date, 
                daily_hours, 
                days_off,
                current_day_hours_filled
            )
            # Parent gets range? For now, mainly leaves matter for the calendar.
            # We could set parent date = start of first child.
            if topic.subtopics:
                 # Check if Topic has attribute 'scheduled_date' - we will likely add this.
                 # For now, let's assume we are adding it to the dict or object.
                 pass
        else:
            # Leaf node: Assign time
            topic_hours = topic.estimated_hours or 0.5 # Default 30 mins if missing
            
            # If this topic fits in today
            if current_day_hours_filled + topic_hours <= daily_hours:
                schedule_date = current_date
                current_day_hours_filled += topic_hours
            else:
                # Doesn't fit, move to next valid day
                # (Simple logic: if it doesn't fit at all, move to tomorrow. 
                # Improvement: Split topics across days? Keep simple for v1)
                current_date = advance_to_next_valid_day(current_date)
                schedule_date = current_date
                current_day_hours_filled = topic_hours # New day started with this topic

            # Assign date to topic (We will need to add this field to the Pydantic model)
            # Using ISO format for JSON serialization
            topic.scheduled_date = schedule_date.strftime("%Y-%m-%d")

    return topics, current_date
