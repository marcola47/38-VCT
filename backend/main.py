# main.py
from fastapi import FastAPI
from app.api.v1.enpoints import project
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FastAPI Project Management API (Basic Example)",
    description="Exemplo básico de API FastAPI para gerenciamento de projetos com autenticação Supabase.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inclui o roteador de projetos com um prefixo e tags
app.include_router(project.router, prefix="/api/v1/projects", tags=["Projects"])

# Rota de teste simples (não requer autenticação)
@app.get("/")
async def root():
    return {"message": "Bem-vindo à sua API de Gerenciamento de Projetos!"}