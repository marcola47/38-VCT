from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pydantic import BaseModel
from typing import List
import httpx
from supabase import Client
from app.core.auth import get_current_user
from app.core.db import get_supabase_client

router = APIRouter(
    tags=["Projects"]
)

# ==============================
# Schemas
# ==============================


from pydantic import BaseModel
from typing import List, Optional

class ProjectOut(BaseModel):
    id: int
    project_name: str
    initial_description: str | None

class IntegrationCreate(BaseModel):
    type: str                  # "slack" ou outro tipo
    token: str

class ChannelCreate(BaseModel):
    type: str  # "slack" ou "email"
    channel_name: str
    channel_type: str  # "externo" ou "interno"
    channel_slack_id: Optional[str] = None  # se slack
    emails: Optional[List[str]] = None  # lista simples de e-mails se email

class ProjectCreate(BaseModel):
    project_name: str
    initial_description: Optional[str] = None
    channels: List[ChannelCreate]

class RagRequest(BaseModel):
    project_id: int
    user_message: str

class RagResponse(BaseModel):
    ai_response: str


class ChatContextRequest(BaseModel):
    project_id: int
    user_message: Optional[str] = ""

class ChatContextResponse(BaseModel):
    markdown: str

class ClientSatisfactionResponse(BaseModel):
    project_id: int
    satisfaction_score: float


# ==============================
# Endpoints
# ==============================

class ProjectListItem(BaseModel):
    id: int
    project_name: str
    initial_description: Optional[str]

@router.get(
    "/",
    response_model=List[ProjectListItem],
    summary="Listar todos os projetos do sistema"
)
async def list_projects(
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    try:
        result = (
            db.table("project")
            .select("id, project_name, initial_description")
            .execute()
        )

        projects = result.data or []

        return [
            ProjectListItem(
                id=proj["id"],
                project_name=proj["project_name"],
                initial_description=proj.get("initial_description")
            )
            for proj in projects
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar projetos: {e}")


@router.post(
    "/",
    response_model=ProjectOut,
    status_code=status.HTTP_201_CREATED,
    summary="Criar projeto e associar canais com integrações existentes"
)
async def create_project(
    project: ProjectCreate,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    try:
        # 1️⃣ Criar projeto
        project_result = (
            db.table("project")
            .insert({
                "project_name": project.project_name,
                "initial_description": project.initial_description
            })
            .execute()
        )
        if not project_result.data:
            raise HTTPException(status_code=500, detail="Erro ao criar o projeto.")

        created_project = project_result.data[0]
        project_id = created_project["id"]

        # 2️⃣ Criar canais
        for chan in project.channels:
            # Busca integração pelo tipo
            integ_result = (
                db.table("integration")
                .select("id")
                .eq("type", chan.type)
                .execute()
            )
            if not integ_result.data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Não existe integração cadastrada para o tipo '{chan.type}'."
                )
            integration_id = integ_result.data[0]["id"]

            # Cria o canal
            channel_result = (
                db.table("channel")
                .insert({
                    "type": chan.channel_type,
                    "channel_name": chan.channel_name,
                    "project_id": project_id,
                    "integration_id": integration_id,
                    "channel_slack_id": chan.channel_slack_id if chan.type == "slack" else None
                })
                .execute()
            )
            if not channel_result.data:
                raise HTTPException(status_code=500, detail="Erro ao criar canal.")

            channel_id = channel_result.data[0]["id"]

            # Se for email, salva os emails
            if chan.type == "email" and chan.emails:
                for email in chan.emails:
                    db.table("channel_email").insert({
                        "email": email,
                        "channel_id": channel_id
                    }).execute()

        return ProjectOut(**created_project)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar projeto: {e}")


@router.put(
    "/{project_id}/files",
    status_code=status.HTTP_200_OK,
    summary="Enviar arquivos para um projeto existente e registrar no RAG"
)
async def upload_files_to_project(
    project_id: int,
    files: List[UploadFile] = File(...),
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    N8N_URL = "https://leodaveiga.site/webhook/populate-rag"

    try:
        async with httpx.AsyncClient() as client:
            for upload_file in files:
                try:
                    file_bytes = await upload_file.read()

                    filename_lower = upload_file.filename.lower()
                    if filename_lower.endswith(".pdf"):
                        file_type = "pdf"
                    elif filename_lower.endswith(".txt"):
                        file_type = "txt"
                    elif filename_lower.endswith(".csv"):
                        file_type = "csv"
                    elif filename_lower.endswith(".xlsx"):
                        file_type = "xlsx"
                    else:
                        raise HTTPException(status_code=400, detail=f"Tipo de arquivo não suportado: {upload_file.filename}")

                    # Envia para o n8n
                    n8n_response = await client.post(
                        N8N_URL,
                        files={"data": (upload_file.filename, file_bytes, upload_file.content_type)},
                        data={"type": file_type, "project_id": str(project_id)},
                        timeout=60
                    )
                    n8n_response.raise_for_status()

                    data = n8n_response.json()
                    if "path" not in data or "file_name" not in data:
                        raise ValueError("Resposta do n8n não contém path ou file_name.")

                    path = data["path"]
                    file_name = data["file_name"]

                    # Salva no banco
                    db.table("file").insert({
                        "file_name": file_name,
                        "path": path,
                        "project_id": project_id
                    }).execute()

                except Exception as file_err:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Erro ao processar arquivo {upload_file.filename}: {file_err}"
                    )

        return {"message": "Arquivos salvos com sucesso."}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivos: {e}")


@router.get(
    "/{project_id}",
    status_code=200,
    summary="Obter detalhes do projeto com canais, mensagens, arquivos e satisfação"
)
async def get_project(
    project_id: int,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    N8N_SATISFACTION_URL = "https://leodaveiga.site/webhook/satisfaction"

    try:
        # 1️⃣ Buscar projeto
        proj_result = (
            db.table("project")
            .select("*")
            .eq("id", project_id)
            .execute()
        )
        if not proj_result.data:
            raise HTTPException(status_code=404, detail="Projeto não encontrado.")

        project = proj_result.data[0]

        # 2️⃣ Buscar canais + integração + emails
        channels_result = (
            db.table("channel")
            .select("*, integration(type), channel_email(email)")
            .eq("project_id", project_id)
            .execute()
        )

        channels = []
        for chan in channels_result.data:
            channels.append({
                "id": chan["id"],
                "type": chan["type"],
                "channel_name": chan["channel_name"],
                "integration_type": chan["integration"]["type"] if chan["integration"] else None,
                "channel_slack_id": chan["channel_slack_id"],
                "emails": [e["email"] for e in chan.get("channel_email", [])]
            })

        # 3️⃣ Buscar últimas 10 mensagens
        messages_result = (
            db.table("messages")
            .select("id, user_message, ai_response")
            .eq("project_id", project_id)
            .order("id", desc=True)
            .limit(10)
            .execute()
        )

        messages = []
        for msg in messages_result.data:
            messages.append({
                "id": msg["id"],
                "user_message": msg["user_message"],
                "ai_response": msg["ai_response"]
            })

        # 4️⃣ Buscar arquivos anexados
        files_result = (
            db.table("file")
            .select("id, file_name, path")
            .eq("project_id", project_id)
            .execute()
        )

        files = []
        for f in files_result.data:
            files.append({
                "id": f["id"],
                "file_name": f["file_name"],
                "path": f["path"]
            })

        # 5️⃣ Buscar satisfação do cliente no n8n
        async with httpx.AsyncClient() as client:
            n8n_response = await client.post(
                N8N_SATISFACTION_URL,
                json={"project_id": project_id},
                timeout=30
            )
            n8n_data = n8n_response.json()

            satisfaction_score = n8n_data["number"]
            justification = n8n_data["justificativa"]

        return {
            "id": project["id"],
            "project_name": project["project_name"],
            "initial_description": project["initial_description"],
            "channels": channels,
            "messages": messages,
            "files": files,
            "satisfaction_score": satisfaction_score,
            "justification": justification
        }

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Erro ao consultar n8n: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar projeto: {e}")




@router.post(
    "/chat",
    response_model=RagResponse,
    summary="Enviar mensagem ao chat com RAG via n8n e obter resposta"
)
async def chat_with_rag(
    rag_request: RagRequest,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    try:
        async with httpx.AsyncClient() as client:
            n8n_response = await client.post(
                "https://leodaveiga.site/webhook/message-post",
                json={
                    "project_id": rag_request.project_id,
                    "user_message": rag_request.user_message
                },
                timeout=30
            )
            n8n_response.raise_for_status()

            full_data = n8n_response.json()

            ai_response = full_data["ai_response"]
            if ai_response is None:
                raise HTTPException(status_code=500, detail="Sem response.")

            return RagResponse(ai_response=ai_response)


    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Erro ao chamar n8n: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar chat com RAG: {e}")


@router.post(
    "/roadmap",
    response_model=ChatContextResponse,
    summary="Enviar contexto do chat ao n8n e retornar o markdown"
)
async def send_chat_context(
    payload: ChatContextRequest,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    N8N_URL = "https://leodaveiga.site/webhook/roadmap-maker"

    try:
        async with httpx.AsyncClient() as client:
            n8n_response = await client.post(
                N8N_URL,
                json={
                    "project_id": payload.project_id,
                    "user_message": payload.user_message
                },
                timeout=30
            )
            n8n_response.raise_for_status()

            data = n8n_response.json()

            markdown = data["roadmap"]

            return ChatContextResponse(markdown=markdown)

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Erro ao chamar n8n: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar contexto do chat: {e}")

