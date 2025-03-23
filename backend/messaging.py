from fastapi import APIRouter
import context
import datetime
from server import message_collection
from websocket import sockets
import pydantic
import json

router = APIRouter(prefix="/messages",  tags=["Message"])



@router.get("/{room_id}")
async def getMessages(room_id: str):
    auth_user = context.context.get('auth_user', {})
    user_id = str(auth_user["user_data"].get("_id"))
    messages_cursor = message_collection.find({"room_id": room_id}).sort("timestamp", -1).limit(50)
    messages = []
    async for msg in messages_cursor:
        msg["_id"] = str(msg["_id"])
        messages.append(msg)
    return messages

class messgaeData(pydantic.BaseModel):
    msg: str

@router.post("/send-message")
async def sendMessage(data: messgaeData):
    data = data.model_dump()
    auth_user = context.context.get('auth_user', {})
    message_doc = {
        "user_id" : str(auth_user["user_data"].get("_id")),
        "message": data["msg"],
        "created_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
    await message_collection.insert_one(message_doc)
    message_doc["_id"] = str(message_doc["_id"])
    await sockets.broadcast(json.dumps(message_doc))
    return  message_doc