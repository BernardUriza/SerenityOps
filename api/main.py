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

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import yaml

# Claude API
from anthropic import Anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import cv_builder functions
try:
    from scripts.cv_builder import generate_cv as cv_builder_generate
except ImportError:
    # If running from api/ directory, adjust path
    cv_builder_generate = None

# Import PDF service
try:
    from services.pdf_service import generate_pdf_from_html, is_pdf_service_available
except ImportError:
    generate_pdf_from_html = None
    is_pdf_service_available = lambda: False

# Import audit logger
try:
    from services.audit_logger import get_audit_logger
    audit_logger = get_audit_logger()
except ImportError:
    audit_logger = None

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
    format: str = "html"

class ParseTextRequest(BaseModel):
    text: str

class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

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
def generate_cv_endpoint(request: CVGenerateRequest):
    """
    Generate CV using Claude API.

    Args:
        request: Format specification (html or pdf)

    Returns:
        Generated file path and download URL
    """
    try:
        # Load curriculum and generate HTML with Claude
        from datetime import datetime
        import sys
        sys.path.insert(0, str(PROJECT_ROOT))

        from scripts.cv_builder import generate_html_with_claude, load_curriculum as load_cv_data

        cv_data = load_cv_data(CURRICULUM_PATH)
        html_content = generate_html_with_claude(cv_data)

        # Save HTML file
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        filename = f"cv_{timestamp}.html"
        output_path = CV_OUTPUT_DIR / filename

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        return {
            "status": "success",
            "format": "html",
            "path": str(output_path),
            "filename": output_path.name,
            "download_url": f"/api/cv/download/{output_path.name}"
        }
    except Exception as e:
        import traceback
        error_detail = f"CV generation failed: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)

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

    return FileResponse(
        path=file_path,
        media_type="text/html" if filename.endswith(".html") else "application/pdf"
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

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="text/html" if filename.endswith(".html") else "application/pdf",
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
    List all generated CV files.

    Returns:
        List of generated CV files with metadata
    """
    try:
        if not CV_OUTPUT_DIR.exists():
            CV_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
            return {"count": 0, "files": []}

        cv_files = sorted(CV_OUTPUT_DIR.glob("cv_*.html"), key=lambda p: p.stat().st_mtime, reverse=True)

        from datetime import datetime

        return {
            "count": len(cv_files),
            "files": [
                {
                    "filename": f.name,
                    "size_kb": round(f.stat().st_size / 1024, 1),
                    "created_at": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
                    "format": "html",
                    "download_url": f"/api/cv/download/{f.name}",
                    "preview_url": f"/api/cv/file/{f.name}"
                }
                for f in cv_files
            ]
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
            # Phase 2: Generate HTML + PDF CV
            opportunity_id = payload.get("opportunity_id", "general")
            export_pdf = payload.get("export_pdf", True)  # Default to PDF export

            # Load curriculum
            with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
                curriculum = yaml.safe_load(f)

            # Generate HTML using Claude
            from scripts.cv_builder import generate_html_with_claude, load_curriculum as load_cv_data

            cv_data = load_cv_data(CURRICULUM_PATH)
            html_content = generate_html_with_claude(cv_data)

            # Save HTML
            timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
            html_filename = f"cv_{opportunity_id}_{timestamp}.html"
            html_path = CV_OUTPUT_DIR / html_filename

            html_path.parent.mkdir(parents=True, exist_ok=True)
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)

            result = {
                "format": "html",
                "html_path": str(html_path),
                "html_filename": html_filename,
                "html_download_url": f"/api/cv/download/{html_filename}",
                "preview_url": f"/api/cv/file/{html_filename}"
            }

            # Phase 2: Generate PDF if requested and service available
            if export_pdf and is_pdf_service_available():
                try:
                    pdf_filename = f"cv_{opportunity_id}_{timestamp}.pdf"
                    pdf_path = CV_OUTPUT_DIR / pdf_filename

                    pdf_result = generate_pdf_from_html(
                        html_path=html_path,
                        output_path=pdf_path,
                        format="A4",
                        margin="medium"
                    )

                    result.update({
                        "format": "pdf",
                        "pdf_path": str(pdf_path),
                        "pdf_filename": pdf_filename,
                        "pdf_download_url": f"/api/cv/download/{pdf_filename}",
                        "pdf_size": pdf_result["size"]
                    })

                    message = f"CV generated successfully (HTML + PDF) for {opportunity_id}"
                except Exception as pdf_error:
                    # PDF generation failed, but HTML succeeded
                    result["pdf_error"] = str(pdf_error)
                    message = f"CV generated (HTML only) for {opportunity_id}. PDF conversion failed: {str(pdf_error)}"
            else:
                if not is_pdf_service_available():
                    result["pdf_note"] = "PDF service unavailable. Install dependencies: cd api/services/pdf_generator && npm install"
                message = f"CV generated successfully (HTML) for {opportunity_id}"

            response = {
                "status": "success",
                "action": action_type,
                "message": message,
                "result": result
            }

            # Audit log CV generation
            if audit_logger:
                execution_time = time.time() - start_time
                audit_logger.log_cv_generation(
                    opportunity_id=opportunity_id,
                    format=result.get("format", "html"),
                    output_path=result.get("pdf_path") or result.get("html_path", ""),
                    success=True,
                    pdf_generated=bool(result.get("pdf_path")),
                    file_size=result.get("pdf_size") or (Path(result["html_path"]).stat().st_size if result.get("html_path") else None)
                )
                audit_logger.log_action(
                    action_type=action_type,
                    payload=payload,
                    result=result,
                    success=True,
                    execution_time=execution_time
                )

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

            # Audit log opportunity tracking
            if audit_logger:
                execution_time = time.time() - start_time
                audit_logger.log_action(
                    action_type=action_type,
                    payload=payload,
                    result=response["result"],
                    success=True,
                    execution_time=execution_time
                )

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

        # Audit log error
        if audit_logger:
            execution_time = time.time() - start_time
            audit_logger.log_action(
                action_type=action.type,
                payload=action.payload,
                success=False,
                error=str(e),
                execution_time=execution_time
            )

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
