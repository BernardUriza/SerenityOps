#!/usr/bin/env python3
"""
SerenityOps System Validation Script

Validates the integrity and functionality of all core SerenityOps files.
Run this after initial setup or before committing changes to ensure system health.

Usage:
    python scripts/validate.py
    python scripts/validate.py --verbose
"""

import sys
from pathlib import Path
from typing import List, Tuple

import yaml


# ========================
# Validation Tests
# ========================

def validate_yaml_syntax(file_path: Path) -> Tuple[bool, str]:
    """Validate YAML file can be parsed without errors."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        return True, f"OK: {file_path}"
    except FileNotFoundError:
        return False, f"MISSING: {file_path}"
    except yaml.YAMLError as e:
        return False, f"YAML ERROR in {file_path}: {e}"
    except Exception as e:
        return False, f"ERROR in {file_path}: {e}"


def validate_python_syntax(file_path: Path) -> Tuple[bool, str]:
    """Validate Python file compiles without syntax errors."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            compile(f.read(), file_path, 'exec')
        return True, f"OK: {file_path}"
    except FileNotFoundError:
        return False, f"MISSING: {file_path}"
    except SyntaxError as e:
        return False, f"SYNTAX ERROR in {file_path} line {e.lineno}: {e.msg}"
    except Exception as e:
        return False, f"ERROR in {file_path}: {e}"


def validate_directory_structure() -> Tuple[bool, str]:
    """Validate required directories exist."""
    required_dirs = [
        "foundations",
        "finances",
        "opportunities",
        "curriculum",
        "curriculum/templates",
        "curriculum/versions",
        "rituals",
        "logs",
        "logs/sessions",
        "logs/insights",
        "scripts"
    ]

    missing = []
    for dir_name in required_dirs:
        if not Path(dir_name).exists():
            missing.append(dir_name)

    if missing:
        return False, f"MISSING DIRECTORIES: {', '.join(missing)}"
    return True, "OK: All required directories exist"


def validate_required_files() -> Tuple[bool, str]:
    """Validate required files exist."""
    required_files = [
        "ethics_contract.md",
        "README.md",
        "requirements.txt",
        "foundations/axioms.yaml",
        "finances/structure.yaml",
        "opportunities/structure.yaml",
        "curriculum/curriculum.yaml",
        "scripts/cv_builder.py"
    ]

    missing = []
    for file_name in required_files:
        if not Path(file_name).exists():
            missing.append(file_name)

    if missing:
        return False, f"MISSING FILES: {', '.join(missing)}"
    return True, "OK: All required files exist"


def run_cv_builder_test() -> Tuple[bool, str]:
    """Test cv_builder.py can execute without errors."""
    import subprocess

    try:
        result = subprocess.run(
            [sys.executable, "scripts/cv_builder.py", "--help"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            return True, "OK: cv_builder.py --help executes successfully"
        else:
            return False, f"ERROR: cv_builder.py exited with code {result.returncode}"
    except subprocess.TimeoutExpired:
        return False, "ERROR: cv_builder.py timed out"
    except Exception as e:
        return False, f"ERROR running cv_builder.py: {e}"


# ========================
# Main Validation Runner
# ========================

def main(verbose: bool = False) -> int:
    """
    Run all validation tests.

    Returns:
        0 if all tests pass, 1 if any test fails
    """
    print("="*60)
    print("SerenityOps System Validation")
    print("="*60)
    print()

    tests: List[Tuple[str, callable]] = [
        ("Directory Structure", validate_directory_structure),
        ("Required Files", validate_required_files),
        ("YAML: foundations/axioms.yaml", lambda: validate_yaml_syntax(Path("foundations/axioms.yaml"))),
        ("YAML: finances/structure.yaml", lambda: validate_yaml_syntax(Path("finances/structure.yaml"))),
        ("YAML: opportunities/structure.yaml", lambda: validate_yaml_syntax(Path("opportunities/structure.yaml"))),
        ("YAML: curriculum/curriculum.yaml", lambda: validate_yaml_syntax(Path("curriculum/curriculum.yaml"))),
        ("Python: scripts/cv_builder.py", lambda: validate_python_syntax(Path("scripts/cv_builder.py"))),
        ("CV Builder Execution", run_cv_builder_test),
    ]

    results = []
    passed = 0
    failed = 0

    for test_name, test_func in tests:
        success, message = test_func()
        results.append((test_name, success, message))

        status = "[PASS]" if success else "[FAIL]"
        print(f"{status} {test_name}")

        if verbose or not success:
            print(f"      {message}")

        if success:
            passed += 1
        else:
            failed += 1

    print()
    print("="*60)
    print(f"Results: {passed} passed, {failed} failed out of {len(tests)} tests")
    print("="*60)

    if failed > 0:
        print("\n[VALIDATION FAILED] Fix errors above before committing.")
        return 1
    else:
        print("\n[VALIDATION PASSED] System integrity verified.")
        return 0


if __name__ == "__main__":
    verbose = "--verbose" in sys.argv or "-v" in sys.argv
    sys.exit(main(verbose=verbose))
