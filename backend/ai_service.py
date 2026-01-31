"""
AI Service - OpenRouter Integration for Intent Parsing
Maps natural language to structured JSON actions
"""
import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# System prompt that strictly maps user intent to one of 10 JSON actions
SYSTEM_PROMPT = """You are an AI assistant for a SaaS Analytics Dashboard. Your ONLY job is to interpret user commands and return a structured JSON action.

You must ONLY return valid JSON - no explanations, no markdown, no additional text.

## Available Actions (Choose EXACTLY one):

### 1. FILTER_SEGMENT - Filter data table
Intent: User wants to filter/show specific user segments
Response format: { "action": "FILTER_SEGMENT", "params": { "segment": "<string>", "location": "<string|null>", "time_range": "<string|null>" } }
Example: "Show me enterprise users from Japan" → { "action": "FILTER_SEGMENT", "params": { "segment": "enterprise", "location": "Japan", "time_range": null } }

### 2. COMPARE_METRICS - Compare analytics metrics
Intent: User wants to compare metrics across time periods
Response format: { "action": "COMPARE_METRICS", "params": { "metric": "<string>", "period_a": "<string>", "period_b": "<string>" } }
Example: "Compare churn rate this month vs last November" → { "action": "COMPARE_METRICS", "params": { "metric": "churn", "period_a": "current_month", "period_b": "2023-11" } }

### 3. BULK_TAG - Tag multiple records
Intent: User wants to tag/label users based on criteria
Response format: { "action": "BULK_TAG", "params": { "criteria": "<string>", "tag": "<string>" } }
Example: "Tag all users with > $5k spend as 'VIP'" → { "action": "BULK_TAG", "params": { "criteria": "spend > 5000", "tag": "VIP" } }

### 4. REVOKE_ACCESS - Revoke user access (DANGEROUS)
Intent: User wants to revoke access for certain users
Response format: { "action": "REVOKE_ACCESS", "params": { "role": "<string>", "condition": "<string>" } }
Example: "Revoke admin access for anyone who hasn't logged in for 30 days" → { "action": "REVOKE_ACCESS", "params": { "role": "admin", "condition": "last_login > 30days" } }

### 5. SIMULATE_PROJECTION - Run revenue/metric simulation
Intent: User wants to see what-if projections
Response format: { "action": "SIMULATE_PROJECTION", "params": { "variable": "<string>", "change_percentage": <number>, "target": "<string>" } }
Example: "What happens to revenue if we increase pricing by 20%?" → { "action": "SIMULATE_PROJECTION", "params": { "variable": "price", "change_percentage": 20, "target": "revenue" } }

### 6. SCAN_ANOMALIES - Scan for security anomalies
Intent: User wants to detect suspicious activity
Response format: { "action": "SCAN_ANOMALIES", "params": { "type": "<string>" } }
Example: "Scan the logs for any suspicious login attempts" → { "action": "SCAN_ANOMALIES", "params": { "type": "login_logs" } }

### 7. SCHEDULE_JOB - Schedule recurring tasks
Intent: User wants to schedule exports/reports
Response format: { "action": "SCHEDULE_JOB", "params": { "job_type": "<string>", "recurrence": "<string>", "day": "<string|null>", "time": "<string>" } }
Example: "Email me a PDF of this report every Monday at 9 AM" → { "action": "SCHEDULE_JOB", "params": { "job_type": "export_pdf", "recurrence": "weekly", "day": "monday", "time": "09:00" } }

### 8. TRIGGER_WEBHOOK - Trigger external integrations
Intent: User wants to sync data to external services
Response format: { "action": "TRIGGER_WEBHOOK", "params": { "destination": "<string>", "data_scope": "<string>" } }
Example: "Sync these 50 leads to HubSpot immediately" → { "action": "TRIGGER_WEBHOOK", "params": { "destination": "hubspot", "data_scope": "current_view" } }

### 9. DATA_TRANSFORMATION - Transform/normalize data
Intent: User wants to format/fix data fields
Response format: { "action": "DATA_TRANSFORMATION", "params": { "field": "<string>", "format": "<string>" } }
Example: "Fix all the phone numbers to match the E.164 format" → { "action": "DATA_TRANSFORMATION", "params": { "field": "phone_number", "format": "E.164" } }

### 10. MERGE_DUPLICATES - Deduplicate records
Intent: User wants to merge duplicate entries
Response format: { "action": "MERGE_DUPLICATES", "params": { "match_key": "<string>" } }
Example: "Merge duplicate user accounts based on email" → { "action": "MERGE_DUPLICATES", "params": { "match_key": "email" } }

## CRITICAL RULES:
1. ONLY return raw JSON - no markdown code blocks, no explanations
2. If the user's request doesn't match ANY of the above actions, return: { "action": "UNKNOWN" }
3. Parse user intent liberally - similar phrasings should map to the correct action
4. Always include ALL required params for the chosen action"""


async def parse_command(user_prompt: str) -> dict:
    """
    Send user prompt to OpenRouter and get structured action JSON.
    Returns parsed action dict or UNKNOWN action on failure.
    """
    if not OPENROUTER_API_KEY:
        # Fallback for demo without API key - simple keyword matching
        return _fallback_parse(user_prompt)
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "Pro Semantic Command Palette"
                },
                json={
                    "model": "google/gemini-2.0-flash-001",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.1,
                    "max_tokens": 500
                }
            )
            
            if response.status_code != 200:
                print(f"OpenRouter error: {response.status_code} - {response.text}")
                return {"action": "UNKNOWN", "error": "AI service error"}
            
            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            # Parse JSON from response
            try:
                # Clean up potential markdown code blocks
                content = content.strip()
                if content.startswith("```"):
                    content = content.split("```")[1]
                    if content.startswith("json"):
                        content = content[4:]
                content = content.strip()
                
                return json.loads(content)
            except json.JSONDecodeError:
                print(f"Failed to parse AI response: {content}")
                return {"action": "UNKNOWN", "error": "Failed to parse response"}
                
    except Exception as e:
        print(f"OpenRouter request failed: {e}")
        return {"action": "UNKNOWN", "error": str(e)}


def _fallback_parse(prompt: str) -> dict:
    """
    Simple keyword-based fallback when no API key is configured.
    Good enough for demo purposes.
    """
    prompt_lower = prompt.lower()
    
    # FILTER_SEGMENT
    if any(kw in prompt_lower for kw in ["show me", "filter", "display", "users from"]):
        segment = "enterprise" if "enterprise" in prompt_lower else "all"
        location = None
        for loc in ["japan", "usa", "europe", "asia", "germany", "france", "uk"]:
            if loc in prompt_lower:
                location = loc.capitalize()
                break
        time_range = None
        if "last week" in prompt_lower:
            time_range = "last_week"
        elif "this month" in prompt_lower:
            time_range = "current_month"
        elif "today" in prompt_lower:
            time_range = "today"
        return {"action": "FILTER_SEGMENT", "params": {"segment": segment, "location": location, "time_range": time_range}}
    
    # COMPARE_METRICS
    if any(kw in prompt_lower for kw in ["compare", "vs", "versus"]):
        metric = "revenue"
        if "churn" in prompt_lower:
            metric = "churn"
        elif "growth" in prompt_lower:
            metric = "growth"
        return {"action": "COMPARE_METRICS", "params": {"metric": metric, "period_a": "current_month", "period_b": "2023-11"}}
    
    # BULK_TAG
    if any(kw in prompt_lower for kw in ["tag", "label", "mark as"]):
        tag = "VIP" if "vip" in prompt_lower else "tagged"
        return {"action": "BULK_TAG", "params": {"criteria": "spend > 5000", "tag": tag}}
    
    # REVOKE_ACCESS
    if any(kw in prompt_lower for kw in ["revoke", "remove access", "disable"]):
        return {"action": "REVOKE_ACCESS", "params": {"role": "admin", "condition": "last_login > 30days"}}
    
    # SIMULATE_PROJECTION
    if any(kw in prompt_lower for kw in ["simulate", "what if", "what happens", "projection", "forecast"]):
        change = 20
        if "10%" in prompt_lower:
            change = 10
        elif "30%" in prompt_lower:
            change = 30
        elif "50%" in prompt_lower:
            change = 50
        return {"action": "SIMULATE_PROJECTION", "params": {"variable": "price", "change_percentage": change, "target": "revenue"}}
    
    # SCAN_ANOMALIES
    if any(kw in prompt_lower for kw in ["scan", "detect", "suspicious", "anomal", "security"]):
        return {"action": "SCAN_ANOMALIES", "params": {"type": "login_logs"}}
    
    # SCHEDULE_JOB
    if any(kw in prompt_lower for kw in ["schedule", "email me", "send me", "every monday", "weekly"]):
        return {"action": "SCHEDULE_JOB", "params": {"job_type": "export_pdf", "recurrence": "weekly", "day": "monday", "time": "09:00"}}
    
    # TRIGGER_WEBHOOK
    if any(kw in prompt_lower for kw in ["sync", "hubspot", "salesforce", "webhook", "integration"]):
        dest = "hubspot"
        if "salesforce" in prompt_lower:
            dest = "salesforce"
        return {"action": "TRIGGER_WEBHOOK", "params": {"destination": dest, "data_scope": "current_view"}}
    
    # DATA_TRANSFORMATION
    if any(kw in prompt_lower for kw in ["fix", "format", "normalize", "phone", "e.164"]):
        return {"action": "DATA_TRANSFORMATION", "params": {"field": "phone_number", "format": "E.164"}}
    
    # MERGE_DUPLICATES
    if any(kw in prompt_lower for kw in ["merge", "duplicate", "dedupe", "dedup"]):
        return {"action": "MERGE_DUPLICATES", "params": {"match_key": "email"}}
    
    return {"action": "UNKNOWN"}
