# book-review

# Python / FastAPI
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv/
*.egg-info/
.pytest_cache/
.mypy_cache/
.ruff_cache/

# SQLite (DB 파일은 커밋하지 않음)
*.db
*.sqlite
*.sqlite3
backend/data/*.db

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Docker
# docker-compose.override.yml  # 필요시 주석 해제

# Build outputs
frontend/dist/
backend/dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Claude Code (선택)
.claude/