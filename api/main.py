#!/usr/bin/env python3
"""
SerenityOps API - FastAPI Backend
Provides REST endpoints for managing curriculum, opportunities, and finances
"""

import sys
from pathlib import Path
from typing import Dict, Any, Optional, List
import os
import json
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import yaml
import asyncio
import time

# Claude API
from anthropic import Anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory for the project
BASE_DIR = Path(__file__).parent.parent

# Import cv_builder functions
try:
    from scripts.cv_builder import (
        generate_cv as cv_builder_generate,
        generate_html_with_claude,
        load_curriculum as load_cv_data
    )
except ImportError:
    cv_builder_generate = None
    generate_html_with_claude = None
    load_cv_data = None

# Import PDF service
try:
    from services.pdf_service import generate_pdf_from_html_content, is_pdf_service_available
except ImportError:
    generate_pdf_from_html_content = None
    is_pdf_service_available = lambda: False

# Import audit logger
try:
    from services.audit_logger import get_audit_logger
    audit_logger = get_audit_logger()
except ImportError:
    audit_logger = None

# Import job service
try:
    from services.cv_job_service import get_job_service, JobStatus
    job_service = get_job_service()
except ImportError:
    job_service = None
    JobStatus = None

# ========================
# FastAPI App Setup
# ========================

app = FastAPI(
    title="SerenityOps API",
    description="Personal intelligence system for career and financial management",
    version="1.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================
# Helper Functions
# ========================

def generate_cv_html(curriculum_path: Path) -> str:
    """Generate HTML CV from curriculum data"""
    cv_data = load_cv_data(curriculum_path)
    return generate_html_with_claude(cv_data)


def log_action_execution(
    start_time: float,
    action_type: str,
    payload: Dict[str, Any],
    result: Optional[Dict[str, Any]] = None,
    success: bool = True,
    error: Optional[str] = None
):
    """Log action execution with timing"""
    if audit_logger:
        execution_time = time.time() - start_time
        audit_logger.log_action(
            action_type=action_type,
            payload=payload,
            result=result,
            success=success,
            error=error,
            execution_time=execution_time
        )


def run_cv_generation_with_tracking(job_id: str, opportunity: str):
    """
    Background task: Generate CV with progress tracking

    Args:
        job_id: Job identifier
        opportunity: Opportunity identifier
    """
    if not job_service:
        return

    try:
        # Update: Starting
        job_service.update_job(
            job_id,
            status=JobStatus.RUNNING.value,
            progress=10,
            stage="Compiling HTML from curriculum data"
        )

        # Generate HTML CV
        html_content = generate_cv_html(CURRICULUM_PATH)

        # Update: HTML generated
        job_service.update_job(
            job_id,
            progress=40,
            stage="Converting HTML to PDF"
        )

        # Generate PDF
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        pdf_filename = f"cv_{opportunity}_{timestamp}.pdf"
        pdf_path = CV_OUTPUT_DIR / pdf_filename
        pdf_path.parent.mkdir(parents=True, exist_ok=True)

        pdf_result = generate_pdf_from_html_content(
            html_content=html_content,
            output_path=pdf_path,
            format="A4",
            margin="medium"
        )

        # Update: Saving
        job_service.update_job(
            job_id,
            progress=80,
            stage="Saving output and finalizing"
        )

        # Audit logging
        if audit_logger:
            audit_logger.log_cv_generation(
                opportunity_id=opportunity,
                format="pdf",
                output_path=str(pdf_path),
                success=True,
                pdf_generated=True,
                file_size=pdf_result["size"]
            )

        # Update: Completed
        job_service.update_job(
            job_id,
            status=JobStatus.SUCCESS.value,
            progress=100,
            stage="Completed",
            output_path=str(pdf_path)
        )

    except Exception as e:
        import traceback
        error_message = f"{str(e)}\n{traceback.format_exc()}"

        job_service.update_job(
            job_id,
            status=JobStatus.ERROR.value,
            progress=0,
            stage="Failed",
            error_message=error_message
        )


# ========================
# Pydantic Models
# ========================

class Personal(BaseModel):
    full_name: str
    title: str
    tagline: Optional[str] = None
    location: str
    phone: str
    email: str
    website: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class Experience(BaseModel):
    company: str
    role: str
    location: str
    start_date: str
    end_date: Optional[str] = None
    current: bool
    description: str
    achievements: list[str]
    tech_stack: list[str]
    logo: Optional[str] = None

class Project(BaseModel):
    name: str
    tagline: str
    description: str
    role: str
    tech_stack: list[str]
    achievements: list[str]

class Language(BaseModel):
    name: str
    proficiency: str
    years: Optional[int] = None

class Database(BaseModel):
    name: str
    proficiency: str

class Skills(BaseModel):
    languages: list[Language]
    frameworks: dict
    databases: list[Database]
    cloud_devops: list[str]
    tools: list[str]
    domain_expertise: list[str]

class Education(BaseModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: str
    status: str

class SpokenLanguage(BaseModel):
    name: str
    proficiency: str

class Metadata(BaseModel):
    last_updated: str
    version: str
    source: str
    generated_by: str

class Curriculum(BaseModel):
    personal: Personal
    summary: str
    experience: list[Experience]
    projects: list[Project]
    skills: Skills
    education: list[Education]
    certifications: list
    languages: list[SpokenLanguage]
    metadata: Metadata

class CVGenerateRequest(BaseModel):
    format: str = "pdf"
    opportunity: Optional[str] = "general"

class ParseTextRequest(BaseModel):
    text: str

class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatCreateRequest(BaseModel):
    name: Optional[str] = None

class ChatRenameRequest(BaseModel):
    name: str

class ChatArchiveRequest(BaseModel):
    archived: bool

class MergeFieldsRequest(BaseModel):
    parsed_data: Dict[str, Any]

# ========================
# File Paths
# ========================

# Get project root (parent of api/)
PROJECT_ROOT = Path(__file__).parent.parent
CURRICULUM_PATH = PROJECT_ROOT / "curriculum/curriculum.yaml"
OPPORTUNITIES_PATH = PROJECT_ROOT / "opportunities/structure.yaml"
FINANCES_PATH = PROJECT_ROOT / "finances/structure.yaml"
CV_OUTPUT_DIR = PROJECT_ROOT / "curriculum/versions"
CONVERSATIONS_DIR = PROJECT_ROOT / "logs/conversations"

# Ensure directories exist
CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)

# Initialize Claude client
claude_client = None
try:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        claude_client = Anthropic(api_key=api_key)
except Exception as e:
    print(f"Warning: Claude API not configured: {e}")

# ========================
# API Endpoints
# ========================

@app.get("/")
def root():
    """API health check"""
    return {
        "status": "healthy",
        "service": "SerenityOps API",
        "version": "1.0.0"
    }

@app.get("/api/curriculum")
def get_curriculum() -> Dict[str, Any]:
    """
    Load current curriculum data from YAML.

    Returns:
        Dictionary with all curriculum sections
    """
    try:
        if not CURRICULUM_PATH.exists():
            raise FileNotFoundError(f"Curriculum file not found: {CURRICULUM_PATH}")

        with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        return data
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Curriculum file not found: {CURRICULUM_PATH} (cwd: {Path.cwd()})")
    except yaml.YAMLError as e:
        raise HTTPException(status_code=500, detail=f"YAML parsing error: {str(e)}")

@app.put("/api/curriculum")
def update_curriculum(curriculum: Curriculum):
    """
    Save updated curriculum data to YAML.

    Args:
        curriculum: Complete curriculum object with all sections

    Returns:
        Success confirmation with timestamp
    """
    try:
        # Convert Pydantic model to dict
        data = curriculum.model_dump()

        # Update last_updated timestamp
        from datetime import datetime
        data['metadata']['last_updated'] = datetime.now().strftime("%Y-%m-%d")

        # Write to YAML
        with open(CURRICULUM_PATH, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        return {
            "status": "saved",
            "path": str(CURRICULUM_PATH),
            "timestamp": data['metadata']['last_updated']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save curriculum: {str(e)}")

@app.post("/api/cv/generate")
def generate_cv_endpoint(request: CVGenerateRequest, background_tasks: BackgroundTasks):
    """
    Start CV generation job with progress tracking

    Args:
        request: CV generation request (opportunity, format)
        background_tasks: FastAPI background tasks

    Returns:
        Job ID and initial status
    """
    try:
        # Check if PDF service is available
        if not is_pdf_service_available():
            raise HTTPException(
                status_code=503,
                detail="PDF service unavailable. Install dependencies: cd api/services/pdf_generator && npm install"
            )

        if not job_service:
            raise HTTPException(
                status_code=503,
                detail="Job service unavailable"
            )

        # Extract opportunity from request or use "general"
        opportunity = getattr(request, 'opportunity', None) or "general"

        # Create job
        job = job_service.create_job(
            opportunity=opportunity,
            user_id="default"
        )

        # Start background task
        background_tasks.add_task(
            run_cv_generation_with_tracking,
            job_id=job["id"],
            opportunity=opportunity
        )

        return {
            "job_id": job["id"],
            "status": job["status"],
            "message": "CV generation started"
        }

    except Exception as e:
        import traceback
        error_detail = f"Failed to start CV generation: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)

@app.get("/api/cv/status/{job_id}")
def get_cv_job_status(job_id: str):
    """
    Get CV generation job status

    Args:
        job_id: Job identifier

    Returns:
        Job status with progress, stage, and result
    """
    if not job_service:
        raise HTTPException(status_code=503, detail="Job service unavailable")

    job = job_service.get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # If job is successful and has output_path, add download URL
    if job.get("status") == JobStatus.SUCCESS.value and job.get("output_path"):
        output_path = Path(job["output_path"])
        job["download_url"] = f"/api/cv/download/{output_path.name}"
        job["filename"] = output_path.name

        # Get file size if it exists
        if output_path.exists():
            job["size"] = output_path.stat().st_size

    return job

@app.get("/api/cv/file/{filename}")
def serve_cv_file(filename: str):
    """
    Serve CV file for preview in browser.

    Args:
        filename: Name of the generated CV file

    Returns:
        File response for browser display
    """
    file_path = CV_OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")

    # Determine media type based on extension
    if filename.endswith(".pdf"):
        media_type = "application/pdf"
    elif filename.endswith(".html"):
        media_type = "text/html"
    elif filename.endswith(".md"):
        media_type = "text/markdown"
    else:
        media_type = "application/octet-stream"

    return FileResponse(
        path=file_path,
        media_type=media_type
    )

@app.get("/api/cv/download/{filename}")
def download_cv(filename: str):
    """
    Download generated CV file.

    Args:
        filename: Name of the generated CV file

    Returns:
        File download response with Content-Disposition header
    """
    file_path = CV_OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")

    # Determine media type based on extension
    if filename.endswith(".pdf"):
        media_type = "application/pdf"
    elif filename.endswith(".html"):
        media_type = "text/html"
    elif filename.endswith(".md"):
        media_type = "text/markdown"
    else:
        media_type = "application/octet-stream"

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.delete("/api/cv/{filename}")
def delete_cv(filename: str):
    """
    Delete a generated CV file.

    Args:
        filename: Name of the CV file to delete

    Returns:
        Success confirmation
    """
    file_path = CV_OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")

    try:
        file_path.unlink()
        return {"status": "deleted", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

@app.get("/api/cv/list")
def list_generated_cvs():
    """
    List all generated CV files from versions folder.

    Returns:
        List of all CV files (PDF, HTML, MD) with metadata
    """
    try:
        if not CV_OUTPUT_DIR.exists():
            CV_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
            return {"count": 0, "files": []}

        # Get all CV files (pdf, html, md)
        all_files = []
        for pattern in ["cv_*.pdf", "cv_*.html", "cv_*.md"]:
            all_files.extend(CV_OUTPUT_DIR.glob(pattern))

        # Sort by modification time (most recent first)
        cv_files = sorted(all_files, key=lambda p: p.stat().st_mtime, reverse=True)

        from datetime import datetime

        files_data = []
        for f in cv_files:
            # Determine format from extension
            format_type = f.suffix[1:]  # Remove the dot

            files_data.append({
                "filename": f.name,
                "size_kb": round(f.stat().st_size / 1024, 1),
                "created_at": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
                "format": format_type,
                "download_url": f"/api/cv/download/{f.name}",
                "preview_url": f"/api/cv/file/{f.name}"
            })

        return {
            "count": len(files_data),
            "files": files_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list CVs: {str(e)}")

@app.get("/api/opportunities")
def get_opportunities():
    """
    Load opportunities data from YAML.

    Returns:
        Dictionary with opportunities pipeline
    """
    try:
        if not OPPORTUNITIES_PATH.exists():
            return {"opportunities": []}

        with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load opportunities: {str(e)}")

@app.get("/api/finances")
def get_finances():
    """
    Load finances data from YAML.

    Returns:
        Dictionary with financial structure
    """
    try:
        if not FINANCES_PATH.exists():
            return {"finances": {}}

        with open(FINANCES_PATH, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load finances: {str(e)}")

# ========================
# AI-Powered Endpoints
# ========================

@app.post("/api/ingest/parse")
async def parse_unstructured_text(request: ParseTextRequest):
    """
    Parse unstructured text using Claude API to extract CV information.

    Supports:
    - Memory packs from other bots
    - Project descriptions
    - GitHub repository info
    - Unstructured career information

    Returns:
        Structured data ready to merge into curriculum.yaml
    """
    if not claude_client:
        raise HTTPException(
            status_code=503,
            detail="Claude API not configured. Please set ANTHROPIC_API_KEY in .env file"
        )

    try:
        prompt = f"""Extract structured CV information from this text.

TEXT TO PARSE:
{request.text}

Return ONLY valid JSON with these fields (only include what you find):
{{
  "projects": [
    {{"name": "", "tagline": "", "description": "", "role": "", "tech_stack": [], "achievements": []}}
  ],
  "experience": [
    {{"company": "", "role": "", "location": "", "start_date": "", "end_date": "", "current": false, "description": "", "achievements": [], "tech_stack": []}}
  ],
  "skills": {{
    "languages": [{{"name": "", "proficiency": "", "years": 0}}],
    "frameworks": {{}},
    "databases": [{{"name": "", "proficiency": ""}}],
    "cloud_devops": [],
    "tools": [],
    "domain_expertise": []
  }},
  "achievements": []
}}

Rules:
1. Extract ALL technical skills mentioned
2. For projects, infer role if not explicit
3. For dates, use YYYY-MM format
4. Be comprehensive but accurate
5. If text mentions GitHub repos, extract repo names and technologies
6. Return ONLY the JSON object, no markdown formatting or explanations"""

        response = claude_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )

        # Extract JSON from response
        content = response.content[0].text.strip()
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]

        parsed_data = json.loads(content.strip())

        return {
            "status": "parsed",
            "parsed_data": parsed_data,
            "message": "Data extracted successfully. Review and accept to merge."
        }

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse Claude response as JSON: {str(e)}")
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"Parsing failed: {str(e)}\n{traceback.format_exc()}"
        )

@app.post("/api/ingest/merge")
async def merge_parsed_data(request: MergeFieldsRequest):
    """
    Merge parsed data into existing curriculum.yaml

    Args:
        parsed_data: Structured data from /api/ingest/parse

    Returns:
        Updated curriculum with merged data
    """
    try:
        # Load existing curriculum
        with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
            curriculum = yaml.safe_load(f)

        parsed = request.parsed_data

        # Merge projects (avoid duplicates by name)
        if "projects" in parsed:
            existing_project_names = {p.get("name", "").lower() for p in curriculum.get("projects", [])}
            for project in parsed["projects"]:
                if project.get("name", "").lower() not in existing_project_names:
                    curriculum.setdefault("projects", []).append(project)

        # Merge experience
        if "experience" in parsed:
            curriculum.setdefault("experience", []).extend(parsed["experience"])

        # Merge skills
        if "skills" in parsed:
            curr_skills = curriculum.setdefault("skills", {})
            parsed_skills = parsed["skills"]

            # Merge language lists
            if "languages" in parsed_skills:
                existing_langs = {lang.get("name", "").lower() for lang in curr_skills.get("languages", [])}
                for lang in parsed_skills["languages"]:
                    if lang.get("name", "").lower() not in existing_langs:
                        curr_skills.setdefault("languages", []).append(lang)

            # Merge other skill arrays
            for key in ["cloud_devops", "tools", "domain_expertise"]:
                if key in parsed_skills:
                    existing_items = set(curr_skills.get(key, []))
                    for item in parsed_skills[key]:
                        if item not in existing_items:
                            curr_skills.setdefault(key, []).append(item)

        # Update metadata
        curriculum["metadata"]["last_updated"] = datetime.now().strftime("%Y-%m-%d")

        # Save updated curriculum
        with open(CURRICULUM_PATH, 'w', encoding='utf-8') as f:
            yaml.dump(curriculum, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        return {
            "status": "merged",
            "message": "Data successfully merged into curriculum",
            "curriculum": curriculum
        }

    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"Merge failed: {str(e)}\n{traceback.format_exc()}"
        )

@app.post("/api/chat/message")
async def chat_message(request: ChatMessageRequest):
    """
    Conversational interface with context awareness.

    Maintains conversation history and provides career intelligence.
    """
    if not claude_client:
        raise HTTPException(
            status_code=503,
            detail="Claude API not configured. Please set ANTHROPIC_API_KEY in .env file"
        )

    try:
        # Load context
        with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
            curriculum = yaml.safe_load(f)

        with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
            opportunities = yaml.safe_load(f) or {}

        # Load or create conversation
        conversation_id = request.conversation_id or f"conv_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        conv_file = CONVERSATIONS_DIR / f"{conversation_id}.yaml"

        if conv_file.exists():
            with open(conv_file, 'r', encoding='utf-8') as f:
                conversation = yaml.safe_load(f) or {"session": {}, "messages": []}
        else:
            conversation = {
                "session": {
                    "id": conversation_id,
                    "date": datetime.now().isoformat(),
                    "type": "career_chat"
                },
                "messages": []
            }

        # Format conversation history
        conv_history = ""
        for msg in conversation["messages"][-10:]:  # Last 10 messages
            conv_history += f"{msg['role'].upper()}: {msg['content']}\n"

        # Build context-aware prompt
        personal = curriculum.get("personal", {})
        skills = curriculum.get("skills", {})
        recent_projects = curriculum.get("projects", [])[:3]

        system_prompt = f"""You are SerenityOps, {personal.get('full_name', 'Bernard')}'s career intelligence assistant.

CONTEXT:
- Current role: {curriculum.get('experience', [{}])[0].get('role', 'Unknown') if curriculum.get('experience') else 'Unknown'}
- Title: {personal.get('title', 'Developer')}
- Technical skills: {', '.join([lang.get('name', '') for lang in skills.get('languages', [])])}
- Recent projects: {', '.join([p.get('name', '') for p in recent_projects])}
- Active opportunities: {len(opportunities.get('opportunities', []))}

YOUR ROLE:
1. Help track career evolution
2. Suggest CV improvements based on new experiences
3. Analyze job opportunities and recommend CV tailoring
4. Maintain conversational memory across sessions
5. Be direct, technical, and actionable

CONVERSATION HISTORY:
{conv_history}

USER MESSAGE: {request.message}

Respond naturally and suggest concrete actions when relevant.
If the user mentions a new project, ask follow-up questions to extract:
- Technologies used
- Their specific role
- Quantifiable achievements
- Timeline

If you suggest updating the CV, include a clear JSON action in your response like this:
ACTION: {{"type": "cv_update_suggested", "field": "projects", "data": {{...}}}}"""

        response = claude_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": system_prompt}]
        )

        assistant_message = response.content[0].text

        # Store conversation
        conversation["messages"].append({
            "role": "user",
            "timestamp": datetime.now().isoformat(),
            "content": request.message
        })

        conversation["messages"].append({
            "role": "assistant",
            "timestamp": datetime.now().isoformat(),
            "content": assistant_message
        })

        # Save conversation
        with open(conv_file, 'w', encoding='utf-8') as f:
            yaml.dump(conversation, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        # Check if assistant suggests CV update
        action_suggested = None
        if "ACTION:" in assistant_message:
            try:
                action_part = assistant_message.split("ACTION:")[1].split("\n")[0].strip()
                action_suggested = json.loads(action_part)
            except:
                pass

        return {
            "conversation_id": conversation_id,
            "message": assistant_message,
            "action_suggested": action_suggested
        }

    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {str(e)}\n{traceback.format_exc()}"
        )

@app.get("/api/chat/conversations")
async def list_conversations():
    """
    List all saved conversations
    """
    try:
        conversations = []
        for conv_file in sorted(CONVERSATIONS_DIR.glob("*.yaml"), key=lambda p: p.stat().st_mtime, reverse=True):
            with open(conv_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                conversations.append({
                    "id": data["session"]["id"],
                    "date": data["session"]["date"],
                    "message_count": len(data.get("messages", [])),
                    "last_updated": datetime.fromtimestamp(conv_file.stat().st_mtime).isoformat()
                })

        return {
            "count": len(conversations),
            "conversations": conversations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list conversations: {str(e)}")

@app.get("/api/chat/conversation/{conversation_id}")
async def get_conversation(conversation_id: str):
    """
    Get full conversation history
    """
    try:
        conv_file = CONVERSATIONS_DIR / f"{conversation_id}.yaml"
        if not conv_file.exists():
            raise HTTPException(status_code=404, detail="Conversation not found")

        with open(conv_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load conversation: {str(e)}")

@app.get("/api/chat/last")
async def get_last_conversation():
    """
    Get the most recent conversation for auto-loading

    Returns:
        The latest conversation with full message history
    """
    try:
        if not CONVERSATIONS_DIR.exists():
            CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)
            return {"conversation": None}

        conv_files = sorted(CONVERSATIONS_DIR.glob("*.yaml"), key=lambda p: p.stat().st_mtime, reverse=True)

        if not conv_files:
            return {"conversation": None}

        # Load the most recent conversation
        with open(conv_files[0], 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        return {"conversation": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load last conversation: {str(e)}")

@app.get("/api/chat/list")
async def list_chats_with_metadata():
    """
    Enhanced conversation list with full metadata for Chat Manager
    Returns conversations with name, message_count, timestamps, archived status
    """
    try:
        chats = []
        for conv_file in CONVERSATIONS_DIR.glob("*.yaml"):
            with open(conv_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)

                session = data.get("session", {})
                chats.append({
                    "id": session.get("id", conv_file.stem),
                    "name": session.get("name", f"Conversation {conv_file.stem}"),
                    "message_count": len(data.get("messages", [])),
                    "created_at": session.get("date", datetime.fromtimestamp(conv_file.stat().st_ctime).isoformat()),
                    "last_updated": datetime.fromtimestamp(conv_file.stat().st_mtime).isoformat(),
                    "archived": session.get("archived", False)
                })

        # Sort by last_updated descending
        chats.sort(key=lambda x: x["last_updated"], reverse=True)

        return {"chats": chats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list chats: {str(e)}")

@app.post("/api/chat/create")
async def create_chat(request: ChatCreateRequest):
    """
    Create a new conversation with optional custom name
    """
    try:
        # Generate conversation ID
        conversation_id = f"conv_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"

        # Count existing conversations for auto-naming
        existing_count = len(list(CONVERSATIONS_DIR.glob("*.yaml")))
        default_name = request.name or f"Chat {existing_count + 1}"

        # Create conversation structure
        conversation = {
            "session": {
                "id": conversation_id,
                "name": default_name,
                "date": datetime.now().isoformat(),
                "type": "career_chat",
                "archived": False
            },
            "messages": []
        }

        # Save to file
        conv_file = CONVERSATIONS_DIR / f"{conversation_id}.yaml"
        with open(conv_file, 'w', encoding='utf-8') as f:
            yaml.dump(conversation, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        return {
            "id": conversation_id,
            "name": default_name,
            "message_count": 0,
            "created_at": conversation["session"]["date"],
            "last_updated": conversation["session"]["date"],
            "archived": False
        }
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Failed to create chat: {str(e)}\n{traceback.format_exc()}")

@app.patch("/api/chat/{conversation_id}/rename")
async def rename_chat(conversation_id: str, request: ChatRenameRequest):
    """
    Rename an existing conversation
    """
    try:
        conv_file = CONVERSATIONS_DIR / f"{conversation_id}.yaml"
        if not conv_file.exists():
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Load conversation
        with open(conv_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        # Update name
        data["session"]["name"] = request.name

        # Save back
        with open(conv_file, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        return {
            "id": conversation_id,
            "name": request.name,
            "last_updated": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rename chat: {str(e)}")

@app.delete("/api/chat/{conversation_id}")
async def delete_chat(conversation_id: str):
    """
    Delete a conversation permanently
    """
    try:
        conv_file = CONVERSATIONS_DIR / f"{conversation_id}.yaml"
        if not conv_file.exists():
            raise HTTPException(status_code=404, detail="Conversation not found")

        conv_file.unlink()

        return {"success": True, "deleted_id": conversation_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete chat: {str(e)}")

@app.post("/api/chat/{conversation_id}/duplicate")
async def duplicate_chat(conversation_id: str):
    """
    Duplicate an existing conversation
    """
    try:
        conv_file = CONVERSATIONS_DIR / f"{conversation_id}.yaml"
        if not conv_file.exists():
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Load original conversation
        with open(conv_file, 'r', encoding='utf-8') as f:
            original = yaml.safe_load(f)

        # Create new conversation with copied messages
        new_id = f"conv_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        original_name = original["session"].get("name", "Conversation")

        duplicated = {
            "session": {
                "id": new_id,
                "name": f"{original_name} (Copy)",
                "date": datetime.now().isoformat(),
                "type": "career_chat",
                "archived": False
            },
            "messages": original.get("messages", []).copy()
        }

        # Save duplicated conversation
        new_conv_file = CONVERSATIONS_DIR / f"{new_id}.yaml"
        with open(new_conv_file, 'w', encoding='utf-8') as f:
            yaml.dump(duplicated, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        return {
            "id": new_id,
            "name": duplicated["session"]["name"],
            "message_count": len(duplicated["messages"]),
            "created_at": duplicated["session"]["date"],
            "last_updated": duplicated["session"]["date"],
            "archived": False
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Failed to duplicate chat: {str(e)}\n{traceback.format_exc()}")

@app.patch("/api/chat/{conversation_id}/archive")
async def archive_chat(conversation_id: str, request: ChatArchiveRequest):
    """
    Archive or unarchive a conversation
    """
    try:
        conv_file = CONVERSATIONS_DIR / f"{conversation_id}.yaml"
        if not conv_file.exists():
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Load conversation
        with open(conv_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        # Update archived status
        data["session"]["archived"] = request.archived

        # Save back
        with open(conv_file, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        return {
            "id": conversation_id,
            "archived": request.archived,
            "last_updated": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to archive chat: {str(e)}")

# ========================
# Action Execution System
# ========================

class ActionRequest(BaseModel):
    type: str
    payload: Dict[str, Any] = {}

@app.post("/api/actions/execute")
async def execute_action(action: ActionRequest):
    """
    Universal action dispatcher for SerenityOps

    Handles execution of actions sent from CareerChat or other modules.
    Currently supports:
    - cv_generate: Generate CV with HTML + PDF export
    - opportunity_track: Track new opportunity

    Phase 2: Full audit logging and PDF generation via Puppeteer
    """
    import time
    start_time = time.time()

    try:
        action_type = action.type
        payload = action.payload

        if action_type == "cv_generate":
            # Generate PDF CV directly from HTML
            opportunity_id = payload.get("opportunity_id", "general")

            if not is_pdf_service_available():
                raise HTTPException(
                    status_code=503,
                    detail="PDF service unavailable. Install dependencies: cd api/services/pdf_generator && npm install"
                )

            # Generate HTML CV and convert to PDF
            html_content = generate_cv_html(CURRICULUM_PATH)

            timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
            pdf_filename = f"cv_{opportunity_id}_{timestamp}.pdf"
            pdf_path = CV_OUTPUT_DIR / pdf_filename
            pdf_path.parent.mkdir(parents=True, exist_ok=True)

            try:
                pdf_result = generate_pdf_from_html_content(
                    html_content=html_content,
                    output_path=pdf_path,
                    format="A4",
                    margin="medium"
                )

                result = {
                    "format": "pdf",
                    "pdf_path": str(pdf_path),
                    "pdf_filename": pdf_filename,
                    "pdf_download_url": f"/api/cv/download/{pdf_filename}",
                    "pdf_size": pdf_result["size"]
                }

                message = f"CV generated successfully (PDF) for {opportunity_id}"

            except Exception as pdf_error:
                raise HTTPException(
                    status_code=500,
                    detail=f"PDF generation failed: {str(pdf_error)}"
                )

            response = {
                "status": "success",
                "action": action_type,
                "message": message,
                "result": result
            }

            # Audit logging
            if audit_logger:
                audit_logger.log_cv_generation(
                    opportunity_id=opportunity_id,
                    format="pdf",
                    output_path=str(pdf_path),
                    success=True,
                    pdf_generated=True,
                    file_size=pdf_result["size"]
                )
            log_action_execution(start_time, action_type, payload, result)

            return response

        elif action_type == "opportunity_track":
            # Track new opportunity
            opportunity_data = payload.get("opportunity", {})

            # Load opportunities
            if OPPORTUNITIES_PATH.exists():
                with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
                    opportunities = yaml.safe_load(f) or {"opportunities": []}
            else:
                opportunities = {"opportunities": []}

            # Add new opportunity
            opportunities["opportunities"].append(opportunity_data)

            # Save
            with open(OPPORTUNITIES_PATH, 'w', encoding='utf-8') as f:
                yaml.dump(opportunities, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

            response = {
                "status": "success",
                "action": action_type,
                "message": f"Opportunity '{opportunity_data.get('company', 'Unknown')}' tracked successfully",
                "result": {
                    "opportunity_id": opportunity_data.get("id"),
                    "company": opportunity_data.get("company"),
                    "role": opportunity_data.get("role")
                }
            }

            # Audit logging
            log_action_execution(start_time, action_type, payload, response["result"])

            return response

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown action type: {action_type}. Supported: cv_generate, opportunity_track"
            )

    except Exception as e:
        import traceback
        error_response = {
            "status": "error",
            "action": action.type,
            "message": f"Action execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }

        # Audit logging
        log_action_execution(start_time, action.type, action.payload, success=False, error=str(e))

        return error_response

# ========================
# Phase 2: GitHub Sync & Job Matching
# ========================

class TailorCVRequest(BaseModel):
    job_description: str

@app.post("/api/projects/sync")
async def sync_projects_from_portfolio():
    """
    Sync projects from Bernard's portfolio API with Claude enrichment.

    Fetches projects from https://portfolio-spring-gmat.onrender.com/api/sync/projects
    Enriches generic descriptions with Claude
    Merges into curriculum.yaml without duplicates
    """
    if not claude_client:
        raise HTTPException(
            status_code=503,
            detail="Claude API not configured. Set ANTHROPIC_API_KEY in .env"
        )

    try:
        import requests
        import ssl

        # Fetch from portfolio API
        response = requests.get(
            "https://portfolio-spring-gmat.onrender.com/api/sync/projects",
            headers={"Accept": "application/json"},
            timeout=30,
            verify=False  # SSL verification disabled per user testing
        )
        response.raise_for_status()

        portfolio_projects = response.json()

        # Load current curriculum
        with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
            curriculum = yaml.safe_load(f)

        existing_project_names = {p.get("name", "").lower() for p in curriculum.get("projects", [])}

        synced_projects = []
        skipped_projects = []

        for proj in portfolio_projects:
            proj_name = proj.get("name", "")

            # Skip if already exists
            if proj_name.lower() in existing_project_names:
                skipped_projects.append(proj_name)
                continue

            # Map portfolio fields to curriculum format
            curriculum_project = {
                "name": proj_name,
                "tagline": proj.get("tagline", ""),
                "description": proj.get("description", ""),
                "role": proj.get("role", "Full Stack Developer"),
                "tech_stack": proj.get("technologies", []),
                "achievements": proj.get("achievements", [])
            }

            # Enrich description if it's generic
            if len(curriculum_project["description"]) < 50:
                try:
                    enrich_prompt = f"""Expand this project description based on the tech stack.

Project: {proj_name}
Tech Stack: {', '.join(curriculum_project['tech_stack'])}
Current Description: {curriculum_project['description']}

Write a compelling 2-3 sentence description highlighting technical complexity and impact.
Return ONLY the description text, no formatting."""

                    enrich_response = claude_client.messages.create(
                        model="claude-sonnet-4-20250514",
                        max_tokens=300,
                        messages=[{"role": "user", "content": enrich_prompt}]
                    )

                    curriculum_project["description"] = enrich_response.content[0].text.strip()
                except Exception as e:
                    print(f"Warning: Could not enrich {proj_name}: {e}")

            # Add to curriculum
            curriculum.setdefault("projects", []).append(curriculum_project)
            synced_projects.append(proj_name)

        # Save updated curriculum
        curriculum["metadata"]["last_updated"] = datetime.now().strftime("%Y-%m-%d")

        with open(CURRICULUM_PATH, 'w', encoding='utf-8') as f:
            yaml.dump(curriculum, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        return {
            "status": "success",
            "synced_count": len(synced_projects),
            "synced_projects": synced_projects,
            "skipped_count": len(skipped_projects),
            "skipped_projects": skipped_projects,
            "total_portfolio_projects": len(portfolio_projects)
        }

    except requests.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to fetch from portfolio API: {str(e)}"
        )
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"Sync failed: {str(e)}\n{traceback.format_exc()}"
        )

@app.post("/api/cv/tailor")
async def tailor_cv_to_job(request: TailorCVRequest):
    """
    Tailor CV to specific job posting using Claude analysis.

    Analyzes job description
    Calculates matching score
    Generates customized CV HTML
    Returns strategy and preview URL
    """
    if not claude_client:
        raise HTTPException(
            status_code=503,
            detail="Claude API not configured. Set ANTHROPIC_API_KEY in .env"
        )

    try:
        # Load curriculum
        with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
            curriculum = yaml.safe_load(f)

        personal = curriculum.get("personal", {})
        skills = curriculum.get("skills", {})
        experience = curriculum.get("experience", [])
        projects = curriculum.get("projects", [])

        # Extract candidate's skills
        my_languages = [lang.get("name", "") for lang in skills.get("languages", [])]
        my_tech_stack = list(skills.get("frameworks", {}).keys()) + my_languages

        # Analyze job with Claude
        analysis_prompt = f"""Analyze this job description and extract:

JOB DESCRIPTION:
{request.job_description}

CANDIDATE PROFILE:
- Languages: {', '.join(my_languages)}
- Tech Stack: {', '.join(my_tech_stack)}
- Experience: {len(experience)} positions
- Projects: {len(projects)} projects

Return ONLY valid JSON:
{{
  "required_skills": ["skill1", "skill2"],
  "matching_skills": ["skills_candidate_has"],
  "missing_skills": ["skills_candidate_lacks"],
  "matching_score": 0-100,
  "strategy": "Brief tailoring recommendation",
  "key_points_to_emphasize": ["point1", "point2"]
}}"""

        analysis_response = claude_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": analysis_prompt}]
        )

        # Parse analysis
        content = analysis_response.content[0].text.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]

        analysis = json.loads(content.strip())

        # Generate tailored CV HTML
        cv_prompt = f"""Generate a tailored CV in HTML for this job opportunity.

CANDIDATE:
{json.dumps(curriculum, indent=2)}

JOB ANALYSIS:
{json.dumps(analysis, indent=2)}

Create a professional HTML CV that:
1. Emphasizes: {', '.join(analysis.get('key_points_to_emphasize', []))}
2. Highlights matching skills: {', '.join(analysis.get('matching_skills', []))}
3. Uses clean, modern design with dark theme
4. Includes all experience and projects
5. Orders content to emphasize relevance

Return ONLY the complete HTML (<!DOCTYPE html> to </html>), no explanations."""

        cv_response = claude_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            messages=[{"role": "user", "content": cv_prompt}]
        )

        html_content = cv_response.content[0].text.strip()

        # Remove markdown if present
        if html_content.startswith("```"):
            html_content = html_content.split("```")[1]
            if html_content.startswith("html"):
                html_content = html_content[4:]
            html_content = html_content.strip()

        # Save tailored CV
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        score = analysis.get("matching_score", 0)
        filename = f"cv_tailored_{score}pct_{timestamp}.html"
        output_path = CV_OUTPUT_DIR / filename

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        return {
            "status": "success",
            "analysis": analysis,
            "matching_score": analysis.get("matching_score", 0),
            "matching_skills": analysis.get("matching_skills", []),
            "missing_skills": analysis.get("missing_skills", []),
            "strategy": analysis.get("strategy", ""),
            "filename": filename,
            "preview_url": f"/api/cv/file/{filename}",
            "download_url": f"/api/cv/download/{filename}"
        }

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse Claude analysis as JSON: {str(e)}"
        )
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"CV tailoring failed: {str(e)}\n{traceback.format_exc()}"
        )

# ========================
# Icon Service Endpoints
# ========================

try:
    from services.icon_service import (
        get_tech_icon,
        search_icons,
        get_all_tech_categories
    )
    icon_service_available = True
except ImportError:
    icon_service_available = False
    get_tech_icon = None
    search_icons = None
    get_all_tech_categories = None

@app.get("/api/icons")
async def get_icons(query: str):
    """
    Search for technology icons

    Query parameters:
        query: Technology name (e.g., "react", "python", "aws")

    Returns:
        List of matching icons with emoji, svg_url, color, and category
    """
    if not icon_service_available or not search_icons:
        raise HTTPException(
            status_code=503,
            detail="Icon service not available"
        )

    try:
        results = search_icons(query)
        return {
            "query": query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Icon search failed: {str(e)}"
        )

@app.get("/api/icons/categories")
async def get_icon_categories():
    """
    Get all available technology categories

    Returns:
        Dictionary of categories with their technologies
    """
    if not icon_service_available or not get_all_tech_categories:
        raise HTTPException(
            status_code=503,
            detail="Icon service not available"
        )

    try:
        categories = get_all_tech_categories()
        return {
            "categories": categories,
            "total_technologies": sum(len(techs) for techs in categories.values())
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve categories: {str(e)}"
        )

@app.get("/api/icons/{tech_name}")
async def get_single_icon(tech_name: str):
    """
    Get icon data for a specific technology

    Path parameters:
        tech_name: Technology name (e.g., "react", "python", "aws")

    Returns:
        Icon data with emoji, svg_url, color, and category
    """
    if not icon_service_available or not get_tech_icon:
        raise HTTPException(
            status_code=503,
            detail="Icon service not available"
        )

    try:
        icon_data = get_tech_icon(tech_name)
        return icon_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve icon: {str(e)}"
        )

# ========================
# Opportunities Endpoints
# ========================

# Path to opportunities structure
OPPORTUNITIES_PATH = BASE_DIR / "opportunities" / "structure.yaml"

# Pydantic models for opportunities
class OpportunityContact(BaseModel):
    name: str
    role: str
    email: Optional[str] = None
    linkedin: Optional[str] = None
    source: Optional[str] = None

class OpportunityTimeline(BaseModel):
    discovered: Optional[str] = None
    applied: Optional[str] = None
    first_interview: Optional[str] = None
    final_interview: Optional[str] = None
    offer_received: Optional[str] = None
    decision_deadline: Optional[str] = None
    closed: Optional[str] = None

class OpportunityNote(BaseModel):
    date: str
    content: str

class OpportunityFitAnalysis(BaseModel):
    technical_match: Optional[float] = None
    cultural_match: Optional[float] = None
    growth_potential: Optional[float] = None
    decline_reason: Optional[str] = None
    red_flags: List[str] = []
    green_flags: List[str] = []

class OpportunityDetails(BaseModel):
    description: str
    location: str
    salary_range: str
    work_schedule: Optional[str] = None
    sector: Optional[str] = None
    tech_stack: List[str] = []
    benefits: Optional[List[str]] = None
    requirements: Optional[List[str]] = None

class Opportunity(BaseModel):
    id: str
    company: str
    role: str
    stage: str  # discovered | applied | interviewing | offer | closed
    priority: str  # high | medium | low
    outcome: Optional[str] = None  # declined | rejected | accepted | withdrawn
    details: OpportunityDetails
    timeline: OpportunityTimeline
    contacts: List[OpportunityContact] = []
    notes: List[OpportunityNote] = []
    fit_analysis: OpportunityFitAnalysis

class CreateOpportunityRequest(BaseModel):
    company: str
    role: str
    stage: str = "discovered"
    priority: str = "medium"
    details: OpportunityDetails
    contacts: Optional[List[OpportunityContact]] = None
    notes: Optional[List[OpportunityNote]] = None


@app.get("/api/opportunities")
def get_opportunities():
    """
    Get all opportunities data from opportunities/structure.yaml

    Returns:
        Complete opportunities data including pipeline, active_count, and goals
    """
    try:
        if not OPPORTUNITIES_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Opportunities file not found: {OPPORTUNITIES_PATH}"
            )

        with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
            opportunities_data = yaml.safe_load(f)

        return opportunities_data

    except yaml.YAMLError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing YAML: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading opportunities: {str(e)}"
        )


@app.get("/api/opportunities/{opportunity_id}")
def get_opportunity_by_id(opportunity_id: str):
    """
    Get a specific opportunity by ID

    Path parameters:
        opportunity_id: Unique identifier for the opportunity

    Returns:
        Single opportunity object
    """
    try:
        with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
            opportunities_data = yaml.safe_load(f)

        # Find opportunity in pipeline
        for opportunity in opportunities_data.get('pipeline', []):
            if opportunity.get('id') == opportunity_id:
                return opportunity

        raise HTTPException(
            status_code=404,
            detail=f"Opportunity not found: {opportunity_id}"
        )

    except yaml.YAMLError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing YAML: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading opportunity: {str(e)}"
        )


@app.post("/api/opportunities")
def create_opportunity(request: CreateOpportunityRequest):
    """
    Create a new opportunity

    Request body:
        CreateOpportunityRequest with company, role, stage, priority, details, etc.

    Returns:
        Created opportunity object with generated ID
    """
    try:
        # Load existing data
        with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
            opportunities_data = yaml.safe_load(f)

        # Generate new ID
        existing_ids = [opp.get('id', '') for opp in opportunities_data.get('pipeline', [])]
        # Extract company prefix and number
        company_prefix = request.company.lower().replace(' ', '-')[:10]
        max_num = 0
        for existing_id in existing_ids:
            if existing_id.startswith(company_prefix):
                try:
                    num = int(existing_id.split('-')[-1])
                    max_num = max(max_num, num)
                except:
                    pass
        new_id = f"{company_prefix}-{max_num + 1:03d}"

        # Create new opportunity
        new_opportunity = {
            'id': new_id,
            'company': request.company,
            'role': request.role,
            'stage': request.stage,
            'priority': request.priority,
            'outcome': None,
            'details': request.details.model_dump(),
            'timeline': {
                'discovered': datetime.now().strftime('%Y-%m-%d'),
                'applied': None,
                'first_interview': None,
                'final_interview': None,
                'offer_received': None,
                'decision_deadline': None,
                'closed': None
            },
            'contacts': [contact.model_dump() for contact in (request.contacts or [])],
            'notes': [note.model_dump() for note in (request.notes or [])],
            'fit_analysis': {
                'technical_match': None,
                'cultural_match': None,
                'growth_potential': None,
                'decline_reason': None,
                'red_flags': [],
                'green_flags': []
            }
        }

        # Add to pipeline
        if 'pipeline' not in opportunities_data:
            opportunities_data['pipeline'] = []
        opportunities_data['pipeline'].append(new_opportunity)

        # Update active_count
        stage_counts = {}
        for opp in opportunities_data['pipeline']:
            stage = opp.get('stage', 'discovered')
            stage_counts[stage] = stage_counts.get(stage, 0) + 1

        opportunities_data['active_count'] = {
            'discovered': stage_counts.get('discovered', 0),
            'applied': stage_counts.get('applied', 0),
            'interviewing': stage_counts.get('interviewing', 0),
            'offer': stage_counts.get('offer', 0),
            'closed': stage_counts.get('closed', 0),
            'total': sum(1 for opp in opportunities_data['pipeline'] if opp.get('stage') != 'closed')
        }

        # Update last_updated
        opportunities_data['meta']['last_updated'] = datetime.now().strftime('%Y-%m-%d')

        # Save updated data
        with open(OPPORTUNITIES_PATH, 'w', encoding='utf-8') as f:
            yaml.dump(opportunities_data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

        return new_opportunity

    except yaml.YAMLError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error writing YAML: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating opportunity: {str(e)}"
        )


@app.put("/api/opportunities/{opportunity_id}")
def update_opportunity(opportunity_id: str, updates: Dict[str, Any]):
    """
    Update an existing opportunity

    Path parameters:
        opportunity_id: Unique identifier for the opportunity

    Request body:
        Partial opportunity object with fields to update

    Returns:
        Updated opportunity object
    """
    try:
        # Load existing data
        with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
            opportunities_data = yaml.safe_load(f)

        # Find and update opportunity
        found = False
        for i, opportunity in enumerate(opportunities_data.get('pipeline', [])):
            if opportunity.get('id') == opportunity_id:
                # Deep merge updates
                for key, value in updates.items():
                    if key in ['details', 'timeline', 'fit_analysis'] and isinstance(value, dict):
                        # Merge nested dicts
                        if key not in opportunity:
                            opportunity[key] = {}
                        opportunity[key].update(value)
                    elif key in ['contacts', 'notes'] and isinstance(value, list):
                        # Replace lists
                        opportunity[key] = value
                    else:
                        opportunity[key] = value

                opportunities_data['pipeline'][i] = opportunity
                found = True
                break

        if not found:
            raise HTTPException(
                status_code=404,
                detail=f"Opportunity not found: {opportunity_id}"
            )

        # Update active_count
        stage_counts = {}
        for opp in opportunities_data['pipeline']:
            stage = opp.get('stage', 'discovered')
            stage_counts[stage] = stage_counts.get(stage, 0) + 1

        opportunities_data['active_count'] = {
            'discovered': stage_counts.get('discovered', 0),
            'applied': stage_counts.get('applied', 0),
            'interviewing': stage_counts.get('interviewing', 0),
            'offer': stage_counts.get('offer', 0),
            'closed': stage_counts.get('closed', 0),
            'total': sum(1 for opp in opportunities_data['pipeline'] if opp.get('stage') != 'closed')
        }

        # Update last_updated
        opportunities_data['meta']['last_updated'] = datetime.now().strftime('%Y-%m-%d')

        # Save updated data
        with open(OPPORTUNITIES_PATH, 'w', encoding='utf-8') as f:
            yaml.dump(opportunities_data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

        # Return updated opportunity
        for opportunity in opportunities_data['pipeline']:
            if opportunity.get('id') == opportunity_id:
                return opportunity

    except yaml.YAMLError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error writing YAML: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating opportunity: {str(e)}"
        )


@app.delete("/api/opportunities/{opportunity_id}")
def delete_opportunity(opportunity_id: str):
    """
    Delete an opportunity

    Path parameters:
        opportunity_id: Unique identifier for the opportunity

    Returns:
        Success message
    """
    try:
        # Load existing data
        with open(OPPORTUNITIES_PATH, 'r', encoding='utf-8') as f:
            opportunities_data = yaml.safe_load(f)

        # Find and remove opportunity
        initial_count = len(opportunities_data.get('pipeline', []))
        opportunities_data['pipeline'] = [
            opp for opp in opportunities_data.get('pipeline', [])
            if opp.get('id') != opportunity_id
        ]

        if len(opportunities_data['pipeline']) == initial_count:
            raise HTTPException(
                status_code=404,
                detail=f"Opportunity not found: {opportunity_id}"
            )

        # Update active_count
        stage_counts = {}
        for opp in opportunities_data['pipeline']:
            stage = opp.get('stage', 'discovered')
            stage_counts[stage] = stage_counts.get(stage, 0) + 1

        opportunities_data['active_count'] = {
            'discovered': stage_counts.get('discovered', 0),
            'applied': stage_counts.get('applied', 0),
            'interviewing': stage_counts.get('interviewing', 0),
            'offer': stage_counts.get('offer', 0),
            'closed': stage_counts.get('closed', 0),
            'total': sum(1 for opp in opportunities_data['pipeline'] if opp.get('stage') != 'closed')
        }

        # Update last_updated
        opportunities_data['meta']['last_updated'] = datetime.now().strftime('%Y-%m-%d')

        # Save updated data
        with open(OPPORTUNITIES_PATH, 'w', encoding='utf-8') as f:
            yaml.dump(opportunities_data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

        return {"message": f"Opportunity {opportunity_id} deleted successfully"}

    except yaml.YAMLError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error writing YAML: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting opportunity: {str(e)}"
        )

# ========================
# Main Entry Point
# ========================

if __name__ == "__main__":
    import uvicorn

    print("=" * 60)
    print("SerenityOps API Server")
    print("=" * 60)
    print("Starting on http://localhost:8000")
    print("API docs: http://localhost:8000/docs")
    print("=" * 60)

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
