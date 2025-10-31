#!/usr/bin/env python3
"""
CV Template Engine - Modular Template System

Manages CV template loading, rendering, and customization using
template configuration files and structured CV data.

Architecture:
- Template configs define styling, layout, and sections
- CV data comes from curriculum.yaml
- Engine combines config + data → rendered HTML
- Support for multiple templates (classic, compact, modern)
"""

import yaml
import html
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime


class TemplateEngine:
    """
    Core template engine for CV generation

    Handles template loading, data injection, and HTML generation
    based on modular template configurations.
    """

    def __init__(self, templates_dir: Optional[Path] = None):
        """
        Initialize template engine

        Args:
            templates_dir: Directory containing template configs (default: curriculum/templates/)
        """
        if templates_dir is None:
            templates_dir = Path(__file__).parent.parent / "curriculum" / "templates"

        self.templates_dir = Path(templates_dir)
        self.templates_config_path = self.templates_dir / "templates.yaml"

        # Load templates configuration
        self.config = self._load_templates_config()
        self.templates = self.config.get("templates", {})
        self.metadata = self.config.get("metadata", {})
        self.global_settings = self.config.get("global", {})

    @staticmethod
    def _safe_html(text: Any) -> str:
        """
        Escape HTML special characters to prevent XSS attacks.

        Args:
            text: Text to escape (any type, will be converted to string)

        Returns:
            HTML-escaped string safe for rendering

        Security:
            - Prevents XSS injection via user-controlled CV data
            - Escapes: <, >, &, ", '
            - Returns empty string for None values
        """
        if text is None:
            return ""
        return html.escape(str(text))

    @staticmethod
    def _validate_custom_css(custom_css: str) -> str:
        """
        Validate and sanitize custom CSS to prevent CSS injection attacks.

        Args:
            custom_css: User-provided custom CSS string

        Returns:
            Sanitized CSS string (only safe properties allowed)

        Security:
            - Blocks @import, @keyframes, url() functions (data exfiltration risk)
            - Whitelists only safe CSS properties (margins, padding, colors, fonts)
            - Prevents CSS-based attacks (keyloggers, data exfiltration)

        Raises:
            ValueError: If CSS contains dangerous constructs
        """
        if not custom_css:
            return ""

        # Whitelist of allowed CSS properties (styling only, no behavior)
        ALLOWED_PROPERTIES = {
            'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
            'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
            'font-size', 'font-family', 'font-weight', 'font-style',
            'color', 'background-color',
            'line-height', 'letter-spacing', 'text-align',
            'border-radius', 'box-shadow'
        }

        # Dangerous patterns to reject outright
        DANGEROUS_PATTERNS = ['@import', '@keyframes', 'url(', 'expression(', 'behavior:', '<', '>']

        # Check for dangerous patterns
        css_lower = custom_css.lower()
        for pattern in DANGEROUS_PATTERNS:
            if pattern in css_lower:
                raise ValueError(
                    f"Custom CSS contains dangerous pattern '{pattern}'. "
                    f"Only styling properties are allowed (margins, fonts, colors)."
                )

        # Parse CSS line by line and validate properties
        validated_lines = []
        for line in custom_css.split('\n'):
            line = line.strip()
            if not line or line.startswith('/*'):
                continue

            # Extract property name (before colon)
            if ':' in line:
                prop_name = line.split(':')[0].strip()
                if prop_name in ALLOWED_PROPERTIES:
                    validated_lines.append(line)
                # Silently skip non-whitelisted properties

        return '\n'.join(validated_lines)

    def _load_templates_config(self) -> Dict[str, Any]:
        """
        Load templates configuration from YAML

        Returns:
            Templates configuration dictionary
        """
        if not self.templates_config_path.exists():
            raise FileNotFoundError(
                f"Templates config not found: {self.templates_config_path}"
            )

        with open(self.templates_config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

    def get_template_config(self, template_id: str) -> Dict[str, Any]:
        """
        Get configuration for a specific template

        Args:
            template_id: Template identifier (classic, compact, modern)

        Returns:
            Template configuration dictionary

        Raises:
            ValueError: If template not found
        """
        if template_id not in self.templates:
            available = ", ".join(self.templates.keys())
            raise ValueError(
                f"Template '{template_id}' not found. Available: {available}"
            )

        return self.templates[template_id]

    def list_templates(self) -> List[Dict[str, Any]]:
        """
        List all available templates with metadata

        Returns:
            List of template info dictionaries
        """
        templates_list = []
        for template_id, config in self.templates.items():
            templates_list.append({
                "id": template_id,
                "name": config.get("name"),
                "description": config.get("description"),
                "category": config.get("category"),
                "features": config.get("features", [])
            })
        return templates_list

    def render_html(
        self,
        cv_data: Dict[str, Any],
        template_id: str = "classic",
        custom_css: Optional[str] = None
    ) -> str:
        """
        Render CV as HTML using specified template

        Args:
            cv_data: CV data from curriculum.yaml
            template_id: Template to use (classic, compact, modern)
            custom_css: Optional custom CSS to inject

        Returns:
            Complete HTML document as string
        """
        template_config = self.get_template_config(template_id)

        # Generate CSS based on template config
        css = self._generate_css(template_config)
        if custom_css:
            # Validate and sanitize custom CSS before injecting
            safe_custom_css = self._validate_custom_css(custom_css)
            if safe_custom_css:
                css += f"\n\n/* Custom CSS (validated) */\n{safe_custom_css}"

        # Generate HTML structure based on template sections
        html_content = self._generate_html_structure(cv_data, template_config)

        # Combine into complete HTML document
        # Escape personal data for meta tags and title
        full_name_safe = self._safe_html(cv_data.get('personal', {}).get('full_name', 'Unknown'))

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="{full_name_safe}">
    <title>{full_name_safe} - Curriculum Vitae</title>
    <style>
{css}
    </style>
</head>
<body>
    <div class="cv-container">
{html_content}
    </div>

    <footer class="cv-footer">
        <p>Generated by SerenityOps CV Engine | Template: {template_config.get('name')} | {datetime.now().strftime('%Y-%m-%d')}</p>
    </footer>
</body>
</html>"""

        return html

    def _generate_css(self, template_config: Dict[str, Any]) -> str:
        """
        Generate CSS based on template configuration

        Args:
            template_config: Template configuration dict

        Returns:
            CSS string
        """
        colors = template_config.get("colors", {})
        typography = template_config.get("typography", {})
        layout = template_config.get("layout", {})

        css = f"""
/* ===== RESET & BASE ===== */
* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: {typography.get('body_font', 'Arial, sans-serif')};
    font-size: {typography.get('body_size', '14px')};
    line-height: {typography.get('line_height', '1.6')};
    color: {colors.get('text', '#1e293b')};
    background-color: {colors.get('background', '#ffffff')};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}}

.cv-container {{
    max-width: {layout.get('max_width', '800px')};
    margin: 0 auto;
    padding: {layout.get('margins', '2cm')};
}}

/* ===== TYPOGRAPHY ===== */
h1, h2, h3, h4 {{
    font-family: {typography.get('heading_font', 'Georgia, serif')};
    color: {colors.get('primary', '#2563eb')};
    margin-bottom: 0.5em;
}}

h1 {{
    font-size: {typography.get('heading_size', '24px')};
    font-weight: 700;
}}

h2 {{
    font-size: calc({typography.get('heading_size', '24px')} * 0.85);
    font-weight: 600;
    border-bottom: 2px solid {colors.get('accent', '#3b82f6')};
    padding-bottom: 0.3em;
    margin-top: 1.5em;
}}

h3 {{
    font-size: calc({typography.get('heading_size', '24px')} * 0.75);
    font-weight: 600;
}}

p {{
    margin-bottom: 0.8em;
}}

a {{
    color: {colors.get('accent', '#3b82f6')};
    text-decoration: none;
}}

a:hover {{
    text-decoration: underline;
}}

/* ===== SECTIONS ===== */
.cv-section {{
    margin-bottom: 2em;
}}

.cv-section-header {{
    margin-bottom: 1em;
}}

/* ===== PERSONAL INFO ===== */
.personal-info {{
    text-align: center;
    margin-bottom: 2em;
}}

.personal-info h1 {{
    margin-bottom: 0.2em;
}}

.personal-info .title {{
    font-size: 1.1em;
    color: {colors.get('secondary', '#64748b')};
    margin-bottom: 0.5em;
}}

.personal-info .contact {{
    display: flex;
    justify-content: center;
    gap: 1em;
    flex-wrap: wrap;
    font-size: 0.9em;
    color: {colors.get('secondary', '#64748b')};
}}

/* ===== EXPERIENCE ===== */
.experience-item {{
    margin-bottom: 1.5em;
}}

.experience-header {{
    margin-bottom: 0.5em;
}}

.experience-title {{
    font-weight: 600;
    color: {colors.get('primary', '#2563eb')};
}}

.experience-company {{
    font-weight: 600;
}}

.experience-meta {{
    color: {colors.get('secondary', '#64748b')};
    font-size: 0.9em;
    margin-bottom: 0.5em;
}}

.experience-description {{
    margin-bottom: 0.5em;
}}

.achievements-list {{
    list-style: none;
    padding-left: 1em;
}}

.achievements-list li {{
    margin-bottom: 0.3em;
    padding-left: 1.2em;
    position: relative;
}}

.achievements-list li:before {{
    content: "▸";
    position: absolute;
    left: 0;
    color: {colors.get('accent', '#3b82f6')};
}}

.tech-stack {{
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin-top: 0.5em;
}}

.tech-tag {{
    background-color: {colors.get('accent', '#3b82f6')}15;
    color: {colors.get('accent', '#3b82f6')};
    padding: 0.2em 0.6em;
    border-radius: 4px;
    font-size: 0.85em;
}}

/* ===== SKILLS ===== */
.skills-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1em;
}}

.skill-category {{
    margin-bottom: 1em;
}}

.skill-category-name {{
    font-weight: 600;
    color: {colors.get('primary', '#2563eb')};
    margin-bottom: 0.5em;
}}

.skill-list {{
    list-style: none;
}}

.skill-list li {{
    padding: 0.2em 0;
    color: {colors.get('text', '#1e293b')};
}}

/* ===== FOOTER ===== */
.cv-footer {{
    text-align: center;
    margin-top: 3em;
    padding-top: 1em;
    border-top: 1px solid {colors.get('secondary', '#64748b')}30;
    font-size: 0.8em;
    color: {colors.get('secondary', '#64748b')};
}}

/* ===== PRINT STYLES ===== */
@media print {{
    body {{
        background-color: white;
    }}

    .cv-container {{
        max-width: 100%;
        padding: 0;
    }}

    .cv-footer {{
        page-break-inside: avoid;
    }}

    .experience-item {{
        page-break-inside: avoid;
    }}
}}
"""
        return css

    def _generate_html_structure(
        self,
        cv_data: Dict[str, Any],
        template_config: Dict[str, Any]
    ) -> str:
        """
        Generate HTML structure based on template sections order

        Args:
            cv_data: CV data dictionary
            template_config: Template configuration

        Returns:
            HTML content string
        """
        sections_order = template_config.get("sections", [])
        html_parts = []

        for section in sections_order:
            if section == "personal":
                html_parts.append(self._render_personal(cv_data.get("personal", {})))
            elif section == "summary":
                html_parts.append(self._render_summary(cv_data.get("summary", "")))
            elif section == "experience":
                html_parts.append(self._render_experience(cv_data.get("experience", [])))
            elif section == "projects":
                html_parts.append(self._render_projects(cv_data.get("projects", [])))
            elif section == "skills":
                html_parts.append(self._render_skills(cv_data.get("skills", {})))
            elif section == "education":
                html_parts.append(self._render_education(cv_data.get("education", [])))
            elif section == "certifications":
                html_parts.append(self._render_certifications(cv_data.get("certifications", [])))

        return "\n".join(html_parts)

    def _render_personal(self, personal: Dict[str, Any]) -> str:
        """
        Render personal info section with XSS protection.

        Args:
            personal: Dict with keys: full_name, title, phone, email, location, website

        Returns:
            HTML string for personal info section (all data HTML-escaped)
        """
        contact_items = []

        if personal.get("phone"):
            phone = self._safe_html(personal["phone"])
            contact_items.append(f'<span>{phone}</span>')
        if personal.get("email"):
            email = self._safe_html(personal["email"])
            contact_items.append(f'<a href="mailto:{email}">{email}</a>')
        if personal.get("location"):
            location = self._safe_html(personal["location"])
            contact_items.append(f'<span>{location}</span>')
        if personal.get("website"):
            website = self._safe_html(personal["website"])
            contact_items.append(f'<a href="{website}" target="_blank" rel="noopener noreferrer">{website}</a>')

        contact_html = " | ".join(contact_items)

        full_name = self._safe_html(personal.get('full_name', ''))
        title = self._safe_html(personal.get('title', ''))

        return f"""
        <div class="cv-section personal-info">
            <h1>{full_name}</h1>
            <div class="title">{title}</div>
            <div class="contact">{contact_html}</div>
        </div>
        """

    def _render_summary(self, summary: str) -> str:
        """
        Render summary section with XSS protection.

        Args:
            summary: Professional summary text

        Returns:
            HTML string for summary section (HTML-escaped)
        """
        if not summary:
            return ""

        summary_safe = self._safe_html(summary)

        return f"""
        <div class="cv-section">
            <h2>Professional Summary</h2>
            <p>{summary_safe}</p>
        </div>
        """

    def _render_experience(self, experience: List[Dict[str, Any]]) -> str:
        """
        Render experience section with XSS protection.

        Args:
            experience: List of dicts with keys: role, company, start_date, end_date,
                        location, description, achievements, tech_stack

        Returns:
            HTML string for experience section (all data HTML-escaped)
        """
        if not experience:
            return ""

        items_html = []
        for exp in experience:
            achievements = exp.get("achievements", [])
            achievements_html = ""
            if achievements:
                achievements_items = "\n".join(
                    f'<li>{self._safe_html(ach)}</li>' for ach in achievements
                )
                achievements_html = f'<ul class="achievements-list">\n{achievements_items}\n</ul>'

            tech_stack = exp.get("tech_stack", [])
            tech_html = ""
            if tech_stack:
                tech_tags = "\n".join(
                    f'<span class="tech-tag">{self._safe_html(tech)}</span>' for tech in tech_stack
                )
                tech_html = f'<div class="tech-stack">\n{tech_tags}\n</div>'

            start_date = self._safe_html(exp.get('start_date', ''))
            end_date = self._safe_html(exp.get('end_date', 'Present'))
            date_range = f"{start_date} - {end_date}"

            role = self._safe_html(exp.get('role', ''))
            company = self._safe_html(exp.get('company', ''))
            location = self._safe_html(exp.get('location', ''))
            description = self._safe_html(exp.get('description', ''))

            items_html.append(f"""
            <div class="experience-item">
                <div class="experience-header">
                    <div class="experience-title">{role}</div>
                    <div class="experience-company">{company}</div>
                    <div class="experience-meta">{date_range} | {location}</div>
                </div>
                <div class="experience-description">{description}</div>
                {achievements_html}
                {tech_html}
            </div>
            """)

        return f"""
        <div class="cv-section">
            <h2>Professional Experience</h2>
            {"".join(items_html)}
        </div>
        """

    def _render_projects(self, projects: List[Dict[str, Any]]) -> str:
        """Render projects section"""
        # Similar structure to experience
        # Implementation here...
        return ""

    def _render_skills(self, skills: Dict[str, List[str]]) -> str:
        """
        Render skills section with XSS protection.

        Args:
            skills: Dict mapping category names to lists of skills

        Returns:
            HTML string for skills section (all data HTML-escaped)
        """
        if not skills:
            return ""

        categories_html = []
        for category, skill_list in skills.items():
            category_safe = self._safe_html(category)
            skills_items = "\n".join(
                f'<li>{self._safe_html(skill)}</li>' for skill in skill_list
            )
            categories_html.append(f"""
            <div class="skill-category">
                <div class="skill-category-name">{category_safe}</div>
                <ul class="skill-list">
                    {skills_items}
                </ul>
            </div>
            """)

        return f"""
        <div class="cv-section">
            <h2>Skills</h2>
            <div class="skills-grid">
                {"".join(categories_html)}
            </div>
        </div>
        """

    def _render_education(self, education: List[Dict[str, Any]]) -> str:
        """Render education section"""
        # Implementation here...
        return ""

    def _render_certifications(self, certifications: List[Dict[str, Any]]) -> str:
        """Render certifications section"""
        # Implementation here...
        return ""


# ===== USAGE EXAMPLE =====

if __name__ == "__main__":
    # Example usage
    engine = TemplateEngine()

    # List available templates
    print("Available templates:")
    for template in engine.list_templates():
        print(f"  - {template['id']}: {template['name']}")
        print(f"    {template['description']}")
        print()
