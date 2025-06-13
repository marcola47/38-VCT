# Vote Or Die Trying – Backend
**WSL (Windows Subsystem for Linux) Quick-Start Guide**

These instructions reproduce every step we followed in this chat to get the project running from a clean Windows 10/11 box using **WSL Ubuntu 22.04**.  
Copy-paste or adapt as needed for other distros.

---

## 1. Set up WSL + Ubuntu

### 1. Enable WSL & install Ubuntu

```powershell
wsl --install -d Ubuntu-22.04   # run in an elevated Windows PowerShell
```
Restart when prompted, create your Linux user, then open Ubuntu from the Start menu.

### 2. Upgrade core packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Essential tooling

| What              | Why                          | Install Command                          |
|-------------------|------------------------------|------------------------------------------|
| Git               | clone/pull repo              | `sudo apt install git -y`                |
| Build tools       | compile Python extensions    | `sudo apt install build-essential python3-dev -y` |
| PostgreSQL headers| required by psycopg          | `sudo apt install libpq-dev -y`          |
| dos2unix          | fix CRLF → LF in shell scripts | `sudo apt install dos2unix -y`         |

If you already have these, just skip the lines.

### 4. Python 3 + virtual-env

Ubuntu ships with Python 3; we install the venv helper and create a local environment:

```bash
sudo apt install python3-venv -y

# inside the project root (clone first if you haven’t)
python3 -m venv .venv
source .venv/bin/activate
```

(Optional but convenient) make `python` alias `python3`:

```bash
echo 'alias python=python3' >> ~/.bashrc && source ~/.bashrc
```

### 5. uv – ultra-fast dependency manager

#### 5.1 Download pre-built binary (recommended)

```bash
curl -LO https://github.com/astral-sh/uv/releases/latest/download/uv-x86_64-unknown-linux-gnu.tar.gz
tar -xzf uv-x86_64-unknown-linux-gnu.tar.gz
chmod +x uv
sudo mv uv /usr/local/bin/
uv --version   # sanity check
```
(If you prefer to build from source you’ll need Rust; see https://github.com/astral-sh/uv.)

#### 5.2 Install project deps

```bash
uv venv               # ensures .venv exists (no-op if already created)
source .venv/bin/activate
uv sync --all-groups --dev
```

### 6. Optional: Homebrew + Supabase CLI
Only required if you’ll run Supabase locally.

```bash
# Homebrew on Linux
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# Supabase CLI
brew install supabase/tap/supabase
# (Alternative: npm install -g supabase)
```

### 7. Fix Windows line endings in scripts (once)

```bash
dos2unix scripts/*.sh
chmod +x scripts/*.sh
```
Add this to enforce LF in future commits:

```bash
echo '*.sh text eol=lf' >> .gitattributes
```

### 8. Configure environment

Create a `.env` (or export vars) with at least:

```env
# Example:
DATABASE_URL=postgresql://postgres:password@localhost:5432/voteordie
# Anything else your settings module expects
```

For local Postgres you can:

```bash
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres psql -c "CREATE DATABASE voteordie;"
```

### 9. Database migrations & seed data

With the venv activated:

```bash
scripts/pre-start.sh     # runs: tests → Alembic upgrade → seed init data
```
If you changed the script’s Python calls to python3 & sourced the venv at the top, this will just work.
Otherwise run the steps manually:

```bash
python -m app.utils.test_pre_start
alembic upgrade head
python -m app.utils.init_data
```

### 10. Run the application

```bash
uvicorn app.main:app --reload
```
Or via your Docker compose if provided.

### 11. Everyday workflow

```bash
# open WSL terminal in project root
source .venv/bin/activate
uv sync          # install new deps added to pyproject.toml
pytest           # run tests
uvicorn app.main:app --reload
```

---

## Troubleshooting checklist

| Symptom                                 | Fix                                                                 |
|------------------------------------------|---------------------------------------------------------------------|
| `bash\r: No such file or directory`      | run dos2unix on the script                                          |
| `python: command not found`              | use python3 or create symlink `sudo ln -s /usr/bin/python3 /usr/bin/python` |
| `ModuleNotFoundError: fastapi`           | ensure venv is activated and uv sync succeeded                      |
| `ImportError: libpq`                     | `sudo apt install libpq-dev python3-dev build-essential` then `pip install --force-reinstall psycopg` |

Happy hacking!

Feel free to open an issue or ping the team if you hit a step that isn’t covered here.
