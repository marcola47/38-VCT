# app/core/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import Client
from typing import Dict

from app.core.db import get_supabase_client

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/docs")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Client = Depends(get_supabase_client)
) -> Dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação não fornecido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        user_response = db.auth.get_user(token)
        if user_response and user_response.user:
            return user_response.user.model_dump()
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas ou sessão expirada",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Falha na validação do token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )