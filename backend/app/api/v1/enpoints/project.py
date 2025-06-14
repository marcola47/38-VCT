from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List
import httpx
from supabase import Client

from app.core.auth import get_current_user
from app.core.db import get_supabase_client
from app.models.project import (
    ProjectListItem,
    ProjectOut,
    ProjectCreate,
    RagRequest,
    RagResponse,
    ChatContextRequest,
    ChatContextResponse
)
from app.services.project_service import (
    list_projects_service,
    create_project_service,
    upload_files_service,
    get_project_service,
    chat_with_rag_service,
    send_chat_context_service
)

router = APIRouter(tags=["Projects"])

@router.get("/", response_model=List[ProjectListItem])
async def list_projects(
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    return list_projects_service(db)

@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    return create_project_service(project, db)

@router.put("/{project_id}/files", status_code=status.HTTP_200_OK)
async def upload_files_to_project(
    project_id: int,
    files: List[UploadFile] = File(...),
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    return await upload_files_service(project_id, files, db)

@router.get("/{project_id}", status_code=200)
async def get_project(
    project_id: int,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    return await get_project_service(project_id, db)

@router.post("/chat", response_model=RagResponse)
async def chat_with_rag(
    rag_request: RagRequest,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    return await chat_with_rag_service(rag_request, db)

@router.post("/roadmap", response_model=ChatContextResponse)
async def send_chat_context(
    payload: ChatContextRequest,
    db: Client = Depends(get_supabase_client),
    user: dict = Depends(get_current_user)
):
    return await send_chat_context_service(payload, db)
