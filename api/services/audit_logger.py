"""
Audit Logging Service

Structured logging for all SerenityOps actions and events.
Provides traceability, debugging, and compliance tracking.
"""

import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional
from enum import Enum


class AuditEventType(str, Enum):
    """Types of auditable events"""
    ACTION_EXECUTE = "action.execute"
    ACTION_SUCCESS = "action.success"
    ACTION_ERROR = "action.error"
    CV_GENERATE = "cv.generate"
    CV_DOWNLOAD = "cv.download"
    OPPORTUNITY_TRACK = "opportunity.track"
    CHAT_MESSAGE = "chat.message"
    API_REQUEST = "api.request"
    PDF_GENERATE = "pdf.generate"
    PDF_ERROR = "pdf.error"


class AuditLogger:
    """
    Structured audit logger for SerenityOps

    Logs are written to both:
    1. Standard Python logging (for console/monitoring)
    2. Structured JSON files (for audit trail/analysis)
    """

    def __init__(self, log_dir: Optional[Path] = None):
        """
        Initialize audit logger

        Args:
            log_dir: Directory for structured audit logs (default: logs/audit/)
        """
        if log_dir is None:
            log_dir = Path(__file__).parent.parent.parent / "logs" / "audit"

        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)

        # Setup Python logger
        self.logger = logging.getLogger("serenity.audit")
        self.logger.setLevel(logging.INFO)

        # Add file handler if not already present
        if not self.logger.handlers:
            handler = logging.FileHandler(self.log_dir / "audit.log")
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log_event(
        self,
        event_type: AuditEventType,
        data: Dict[str, Any],
        success: bool = True,
        error: Optional[str] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Log an audit event

        Args:
            event_type: Type of event being logged
            data: Event-specific data
            success: Whether the event succeeded
            error: Error message if failed
            user_id: User identifier (if applicable)
            session_id: Session identifier (if applicable)

        Returns:
            The complete audit record
        """
        timestamp = datetime.now()

        audit_record = {
            "timestamp": timestamp.isoformat(),
            "date": timestamp.strftime("%Y-%m-%d"),
            "time": timestamp.strftime("%H:%M:%S.%f")[:-3],
            "event_type": event_type.value,
            "success": success,
            "data": data,
            "metadata": {
                "user_id": user_id,
                "session_id": session_id
            }
        }

        if error:
            audit_record["error"] = error

        # Log to Python logger
        log_msg = f"[{event_type.value}] {data.get('action', 'event')} - {'SUCCESS' if success else 'FAILED'}"
        if error:
            self.logger.error(f"{log_msg}: {error}")
        else:
            self.logger.info(log_msg)

        # Write to structured JSON log
        self._write_json_log(timestamp, audit_record)

        return audit_record

    def log_action(
        self,
        action_type: str,
        payload: Dict[str, Any],
        result: Optional[Dict[str, Any]] = None,
        success: bool = True,
        error: Optional[str] = None,
        execution_time: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Log an action execution

        Args:
            action_type: Type of action (cv_generate, opportunity_track, etc.)
            payload: Action payload
            result: Action result data
            success: Whether action succeeded
            error: Error message if failed
            execution_time: Time taken to execute (seconds)

        Returns:
            The complete audit record
        """
        data = {
            "action": action_type,
            "payload": payload,
            "execution_time_ms": round(execution_time * 1000, 2) if execution_time else None
        }

        if result:
            data["result"] = result

        event_type = AuditEventType.ACTION_SUCCESS if success else AuditEventType.ACTION_ERROR

        return self.log_event(
            event_type=event_type,
            data=data,
            success=success,
            error=error
        )

    def log_cv_generation(
        self,
        opportunity_id: str,
        format: str,
        output_path: str,
        success: bool = True,
        error: Optional[str] = None,
        pdf_generated: bool = False,
        file_size: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Log CV generation event

        Args:
            opportunity_id: ID of opportunity CV was generated for
            format: Output format (html, pdf)
            output_path: Path to generated file
            success: Whether generation succeeded
            error: Error message if failed
            pdf_generated: Whether PDF was successfully generated
            file_size: Size of generated file in bytes

        Returns:
            The complete audit record
        """
        data = {
            "opportunity_id": opportunity_id,
            "format": format,
            "output_path": output_path,
            "pdf_generated": pdf_generated,
            "file_size_bytes": file_size
        }

        return self.log_event(
            event_type=AuditEventType.CV_GENERATE,
            data=data,
            success=success,
            error=error
        )

    def _write_json_log(self, timestamp: datetime, record: Dict[str, Any]):
        """
        Write audit record to daily JSON log file

        Args:
            timestamp: Event timestamp
            record: Audit record to write
        """
        # Create daily log file
        log_file = self.log_dir / f"audit_{timestamp.strftime('%Y-%m-%d')}.jsonl"

        try:
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(record) + '\n')
        except Exception as e:
            self.logger.error(f"Failed to write JSON audit log: {str(e)}")

    def get_recent_events(
        self,
        limit: int = 100,
        event_type: Optional[AuditEventType] = None,
        date: Optional[str] = None
    ) -> list[Dict[str, Any]]:
        """
        Retrieve recent audit events

        Args:
            limit: Maximum number of events to return
            event_type: Filter by event type
            date: Filter by date (YYYY-MM-DD format)

        Returns:
            List of audit records
        """
        if date:
            log_file = self.log_dir / f"audit_{date}.jsonl"
            files = [log_file] if log_file.exists() else []
        else:
            # Get all log files, sorted by date (most recent first)
            files = sorted(
                self.log_dir.glob("audit_*.jsonl"),
                key=lambda p: p.stat().st_mtime,
                reverse=True
            )

        events = []

        for log_file in files:
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        if len(events) >= limit:
                            break

                        try:
                            record = json.loads(line)

                            # Filter by event type if specified
                            if event_type and record.get("event_type") != event_type.value:
                                continue

                            events.append(record)
                        except json.JSONDecodeError:
                            continue

                if len(events) >= limit:
                    break
            except Exception as e:
                self.logger.error(f"Error reading log file {log_file}: {str(e)}")

        return events[:limit]


# Global audit logger instance
_audit_logger: Optional[AuditLogger] = None


def get_audit_logger() -> AuditLogger:
    """Get or create the global audit logger instance"""
    global _audit_logger
    if _audit_logger is None:
        _audit_logger = AuditLogger()
    return _audit_logger
