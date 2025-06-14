# main.py
from fastapi import FastAPI
from app.api.v1.enpoints import project

app = FastAPI(
    title="FastAPI Project Management API (Basic Example)",
    description="Exemplo básico de API FastAPI para gerenciamento de projetos com autenticação Supabase.",
    version="1.0.0"
)

# Inclui o roteador de projetos com um prefixo e tags
app.include_router(project.router, prefix="/api/v1/projects", tags=["Projects"])

# Rota de teste simples (não requer autenticação)
@app.get("/")
async def root():
    return {"message": "Bem-vindo à sua API de Gerenciamento de Projetos!"}