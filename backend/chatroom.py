from fastapi import APIRouter
import context
import datetime
from server import chat_collection, user_collection
from websocket import sockets
import pydantic
import json

router = APIRouter(prefix="/chats",  tags=["Chats"])




@router.get("")
async def getChats():
    auth_user = context.context.get('auth_user', {})
    user_id = str(auth_user["user_data"].get("_id"))
    user_name = auth_user["user_data"].get("name")
    chat_cursor = chat_collection.find({"participants": { "$in": [user_id] }}).sort("timestamp", -1).limit(50)
    chats = []
    async for msg in chat_cursor:
        msg["_id"] = str(msg["_id"])
        for name in msg["participant_names"]:
            if name != user_name:
                msg["receiver_name"] = name
        if user_id == msg["_id"]:
            continue
        chats.append(msg)
    return chats


class chatroomData(pydantic.BaseModel):
    to_user_id: str
    receiver_name: str

@router.post("/create-room")
async def createChatRoom(data: chatroomData):
    data = data.model_dump()
    auth_user = context.context.get('auth_user', {})
    user_id = str(auth_user["user_data"].get("_id"))
    user = await user_collection.find_one({"_id": user_id})
    participants = sorted([user_id, data["to_user_id"]])
    # existing_room = await chat_collection.find_one({"sender_id": user_id, "receiver_id": data["to_user_id"]})
    existing_room = await chat_collection.find_one({"participants": participants})
    if existing_room:
        existing_room["_id"] = str(existing_room["_id"])
        return existing_room
    chat_room_doc = {
       "user_id": user_id,
       "participants": participants,  
       "participant_names": [data["receiver_name"], auth_user["user_data"].get("name")],
       "sender_id": user_id,
       "receiver_id": data["to_user_id"],
       "receiver_name": data["receiver_name"],
       "created_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
    await chat_collection.insert_one(chat_room_doc)
    chat_room_doc["_id"] = str(chat_room_doc["_id"])
    return  chat_room_doc