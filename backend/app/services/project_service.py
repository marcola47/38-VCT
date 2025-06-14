from fastapi import HTTPException, UploadFile
from typing import List
from supabase import Client
import httpx
import base64

from app.models.project import (
    ProjectListItem,
    ProjectOut,
    RagRequest,
    RagResponse,
    ChatContextRequest,
    ChatContextResponse,
    ProjectCreate
)

N8N_RAG_URL = "https://leodaveiga.site/webhook/message-post"
N8N_ROADMAP_URL = "https://leodaveiga.site/webhook/roadmap-maker"
N8N_POPULATE_RAG_URL = "https://leodaveiga.site/webhook/populate-rag"
N8N_SATISFACTION_URL = "https://leodaveiga.site/webhook/satisfaction"

N8N_AUTH_HEADER = {
    "Authorization": "Basic " + base64.b64encode(b"app_name:vct123").decode("utf-8")
}

def list_projects_service(db: Client):
    try:
        result = db.table("project").select("id, project_name, initial_description").execute()
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

def create_project_service(project: ProjectCreate, db: Client):
    try:
        project_result = db.table("project").insert({
            "project_name": project.project_name,
            "initial_description": project.initial_description
        }).execute()

        if not project_result.data:
            raise HTTPException(status_code=500, detail="Erro ao criar o projeto.")

        created_project = project_result.data[0]
        project_id = created_project["id"]

        for chan in project.channels:
            integ_result = db.table("integration").select("id").eq("type", chan.type).execute()
            if not integ_result.data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Não existe integração cadastrada para o tipo '{chan.type}'."
                )
            integration_id = integ_result.data[0]["id"]

            channel_result = db.table("channel").insert({
                "type": chan.channel_type,
                "channel_name": chan.channel_name,
                "project_id": project_id,
                "integration_id": integration_id,
                "channel_slack_id": chan.channel_slack_id if chan.type == "slack" else None
            }).execute()

            if not channel_result.data:
                raise HTTPException(status_code=500, detail="Erro ao criar canal.")

            channel_id = channel_result.data[0]["id"]

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

async def upload_files_service(project_id: int, files: List[UploadFile], db: Client):
    try:
        async with httpx.AsyncClient() as client:
            for upload_file in files:
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

                n8n_response = await client.post(
                    N8N_POPULATE_RAG_URL,
                    files={"data": (upload_file.filename, file_bytes, upload_file.content_type)},
                    data={"type": file_type, "project_id": str(project_id)},
                    headers=N8N_AUTH_HEADER,
                    timeout=60
                )
                n8n_response.raise_for_status()
                data = n8n_response.json()

                db.table("file").insert({
                    "file_name": data["file_name"],
                    "path": data["path"],
                    "project_id": project_id
                }).execute()
        return {"message": "Arquivos salvos com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivos: {e}")

async def get_project_service(project_id: int, db: Client):
    try:
        proj_result = db.table("project").select("*").eq("id", project_id).execute()
        if not proj_result.data:
            raise HTTPException(status_code=404, detail="Projeto não encontrado.")
        project = proj_result.data[0]

        channels_result = db.table("channel").select("*, integration(type), channel_email(email)").eq("project_id", project_id).execute()
        channels = [{
            "id": chan["id"],
            "type": chan["type"],
            "channel_name": chan["channel_name"],
            "integration_type": chan["integration"]["type"] if chan["integration"] else None,
            "channel_slack_id": chan["channel_slack_id"],
            "emails": [e["email"] for e in chan.get("channel_email", [])]
        } for chan in channels_result.data]

        messages_result = db.table("messages").select("id, user_message, ai_response").eq("project_id", project_id).order("id", desc=True).limit(10).execute()
        messages = [{
            "id": msg["id"],
            "user_message": msg["user_message"],
            "ai_response": msg["ai_response"]
        } for msg in messages_result.data]

        files_result = db.table("file").select("id, file_name, path").eq("project_id", project_id).execute()
        files = [{
            "id": f["id"],
            "file_name": f["file_name"],
            "path": f["path"]
        } for f in files_result.data]

        roadmap_result = db.table("roadmap").select("roadmap").eq("project_id", project_id).execute()
        roadmap = roadmap_result.data[0]["roadmap"] if roadmap_result.data else None

        async with httpx.AsyncClient() as client:
            n8n_response = await client.post(
                N8N_SATISFACTION_URL,
                json={"project_id": project_id},
                headers=N8N_AUTH_HEADER,
                timeout=30
            )
            n8n_response.raise_for_status()
            n8n_data = n8n_response.json()

        return {
            "id": project["id"],
            "project_name": project["project_name"],
            "initial_description": project["initial_description"],
            "channels": channels,
            "messages": messages,
            "files": files,
            "roadmap": roadmap,
            "satisfaction_score": n8n_data.get("number"),
            "justification": n8n_data.get("justificativa")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar projeto: {e}")

async def chat_with_rag_service(rag_request: RagRequest, db: Client):
    try:
        async with httpx.AsyncClient() as client:
            n8n_response = await client.post(
                N8N_RAG_URL,
                json={
                    "project_id": rag_request.project_id,
                    "user_message": rag_request.user_message
                },
                headers=N8N_AUTH_HEADER,
                timeout=30
            )
            n8n_response.raise_for_status()
            data = n8n_response.json()
        return RagResponse(ai_response=data["ai_response"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar chat com RAG: {e}")

async def send_chat_context_service(payload: ChatContextRequest, db: Client):
    try:
        async with httpx.AsyncClient() as client:
            n8n_response = await client.post(
                N8N_ROADMAP_URL,
                json={
                    "project_id": payload.project_id,
                    "user_message": payload.user_message
                },
                headers=N8N_AUTH_HEADER,
                timeout=30
            )
            n8n_response.raise_for_status()
            data = n8n_response.json()
        return ChatContextResponse(markdown=data["roadmap"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar contexto do chat: {e}")