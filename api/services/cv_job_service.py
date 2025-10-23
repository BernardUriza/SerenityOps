"""
CV Generation Job Tracking Service

Manages persistent state for CV generation processes with progress tracking.
"""

import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from enum import Enum
from uuid import uuid4


class JobStatus(str, Enum):
    """Status of a CV generation job"""
    QUEUED = "queued"
    RUNNING = "running"
    ERROR = "error"
    SUCCESS = "success"


class CVJobService:
    """
    Service for tracking CV generation jobs

    Stores job state in JSON files for persistence across restarts.
    """

    def __init__(self, jobs_dir: Optional[Path] = None):
        """
        Initialize job service

        Args:
            jobs_dir: Directory for storing job state (default: logs/cv_jobs/)
        """
        if jobs_dir is None:
            jobs_dir = Path(__file__).parent.parent.parent / "logs" / "cv_jobs"

        self.jobs_dir = Path(jobs_dir)
        self.jobs_dir.mkdir(parents=True, exist_ok=True)

    def create_job(
        self,
        opportunity: str,
        user_id: str = "default"
    ) -> Dict[str, Any]:
        """
        Create a new CV generation job

        Args:
            opportunity: Opportunity identifier
            user_id: User identifier

        Returns:
            Job record with ID and initial state
        """
        job_id = str(uuid4())

        job = {
            "id": job_id,
            "opportunity": opportunity,
            "user_id": user_id,
            "status": JobStatus.QUEUED.value,
            "progress": 0,
            "stage": "Queued",
            "error_message": None,
            "output_path": None,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }

        self._save_job(job)
        return job

    def update_job(
        self,
        job_id: str,
        status: Optional[str] = None,
        progress: Optional[int] = None,
        stage: Optional[str] = None,
        error_message: Optional[str] = None,
        output_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update job state

        Args:
            job_id: Job identifier
            status: New status (queued, running, error, success)
            progress: Progress percentage (0-100)
            stage: Current stage description
            error_message: Error message if failed
            output_path: Path to generated file if successful

        Returns:
            Updated job record
        """
        job = self.get_job(job_id)
        if not job:
            raise ValueError(f"Job not found: {job_id}")

        if status is not None:
            job["status"] = status
        if progress is not None:
            job["progress"] = progress
        if stage is not None:
            job["stage"] = stage
        if error_message is not None:
            job["error_message"] = error_message
        if output_path is not None:
            job["output_path"] = output_path

        job["updated_at"] = datetime.now().isoformat()

        self._save_job(job)
        return job

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Get job by ID

        Args:
            job_id: Job identifier

        Returns:
            Job record or None if not found
        """
        job_file = self.jobs_dir / f"{job_id}.json"

        if not job_file.exists():
            return None

        try:
            with open(job_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return None

    def list_jobs(
        self,
        user_id: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        List recent jobs

        Args:
            user_id: Filter by user ID
            limit: Maximum number of jobs to return

        Returns:
            List of job records, sorted by creation time (most recent first)
        """
        jobs = []

        for job_file in sorted(
            self.jobs_dir.glob("*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True
        ):
            if len(jobs) >= limit:
                break

            try:
                with open(job_file, 'r', encoding='utf-8') as f:
                    job = json.load(f)

                    # Filter by user_id if specified
                    if user_id and job.get("user_id") != user_id:
                        continue

                    jobs.append(job)
            except Exception:
                continue

        return jobs

    def cleanup_old_jobs(self, max_age_hours: int = 24):
        """
        Delete jobs older than max_age_hours

        Args:
            max_age_hours: Maximum age in hours
        """
        cutoff = datetime.now() - timedelta(hours=max_age_hours)

        for job_file in self.jobs_dir.glob("*.json"):
            try:
                with open(job_file, 'r', encoding='utf-8') as f:
                    job = json.load(f)
                    created_at = datetime.fromisoformat(job["created_at"])

                    if created_at < cutoff:
                        job_file.unlink()
            except Exception:
                continue

    def _save_job(self, job: Dict[str, Any]):
        """
        Save job to disk

        Args:
            job: Job record to save
        """
        job_file = self.jobs_dir / f"{job['id']}.json"

        try:
            with open(job_file, 'w', encoding='utf-8') as f:
                json.dump(job, f, indent=2)
        except Exception as e:
            raise RuntimeError(f"Failed to save job: {str(e)}")


# Global job service instance
_job_service: Optional[CVJobService] = None


def get_job_service() -> CVJobService:
    """Get or create the global job service instance"""
    global _job_service
    if _job_service is None:
        _job_service = CVJobService()
    return _job_service
