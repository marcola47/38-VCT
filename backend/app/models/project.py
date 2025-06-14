from pydantic import BaseModel
from typing import List, Optional

class ProjectListItem(BaseModel):
    id: int
    project_name: str
    initial_description: Optional[str]

class ProjectOut(BaseModel):
    id: int
    project_name: str
    initial_description: Optional[str]

class IntegrationCreate(BaseModel):
    type: str
    token: str

class ChannelCreate(BaseModel):
    type: str
    channel_name: str
    channel_type: str
    channel_slack_id: Optional[str] = None
    emails: Optional[List[str]] = None

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
