import fastapi
import sys
import json
import importlib
import pkgutil
import traceback
import os
import datetime
from bson import ObjectId
import pydantic
import contextvars
import jwt
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
import context
from redispool import get_redis_connection
from fastapi.middleware.cors import CORSMiddleware
from websocket import sockets
from websocket import router as websocket_router

app = fastapi.FastAPI(version='1.0.0',
    description="RestAPI for Message App Platform",
    openapi_url="/openapi.json",
    title="RestApi for Message App Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

app.include_router(websocket_router)

package_dir = os.getcwd()
mongo_client = AsyncIOMotorClient("mongodb://admin:admin@localhost:27017")
mongo_db = mongo_client["message_app"]
user_collection = mongo_db["messages-users"]
message_collection = mongo_db["messages"]
chat_collection = mongo_db["chat-rooms"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "message-app-key"
ALGORITHM = "HS256"

async def create_jwt_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(hours=24) 
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

async def decode_jwt_token(token: str) -> dict:
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
    
async def hash_password(password: str) -> str:
    return pwd_context.hash(password)


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@app.on_event("startup")
def onStart():
    for module_info in pkgutil.iter_modules([str(package_dir)]):
        module = importlib.import_module(f'{module_info.name}')
        if hasattr(module, 'router'):
            app.include_router(module.router, prefix="/api")


@app.middleware('http')
async def authMiddleware(request: fastapi.Request, call_next):
    no_auth_urls = ['/docs', '/openapi.json', '/api/login', '/ping', "/api/me",
        "/api/register", "/api/me"
    ]
    if request.url.path in  no_auth_urls:
        return await call_next(request)
    if not request.headers.get('authtoken'):
        redirect_url = f'https://{request.base_url.hostname}/api/login'
        response = fastapi.responses.JSONResponse({'url': redirect_url}, 401)
        return response
    auth_user = context.context.get('auth_user', {})
    if not auth_user:
        response = fastapi.Response(None, 403)
    else:
        response: fastapi.responses.Response  = await call_next(request)   
    return response

async def authenticate(authtoken):
    decoded = await decode_jwt_token(authtoken)
    email = decoded["email"]
    user = await user_collection.find_one({"email": email})
    return user

@app.middleware('http')
async def contextMiddleware(request: fastapi.Request, call_next):
    data = {}
    data['domain'] = request.base_url
    data['oauth_redirect'] = f'{request.base_url}api/login'
    authtoken = request.headers.get('authtoken')
    if authtoken:
        userdata = await authenticate(authtoken)
        if userdata:
            rcon = await get_redis_connection()
            if not await rcon.exists(authtoken) and not await rcon.get(authtoken):
                data["auth_user"] = {"user_data": userdata}
            else:
                user_data = await rcon.get(authtoken)
                user = json.loads(user_data)
                data["auth_user"] = {"user_data": user}

    _starlette_context_token: contextvars.Token = context._request_scope_context_storage.set(data)
    try:
        resp = await call_next(request)
        response_body = b""
        async for chunk in resp.body_iterator:
            response_body += chunk

        return fastapi.Response(content=response_body, status_code=resp.status_code, headers=dict(resp.headers))

    except Exception as error:
        """
        Exception error
        """
        # errFormat = error
        errFormat = '''Error: 
        Stack Trace:
        %s
        ''' % (traceback.format_exc())
        print(errFormat)
        return fastapi.responses.JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred.", "error": str(errFormat)}
        )
    
class loginData(pydantic.BaseModel):
    email: str
    password: str

@app.post("/api/login" , tags=["Users"])
async def login(data: loginData, response: fastapi.Response):
    data = data.model_dump()
    rcon = await get_redis_connection()
    email, password = data["email"], data["password"]
    user = await user_collection.find_one({"email": email})
    user_id = str(user["_id"])
    rcon = await get_redis_connection()
    hash_password = await rcon.get(user_id)
    validate_password = await verify_password(password, hash_password)
    if not validate_password:
        return fastapi.responses.JSONResponse(
            status_code=401,
            content={"detail": "User password is wrong"}
        )
    jwt_data = {
        "user_id": user_id,
        "email": email,
        "name": user["name"]
    }
    token = await create_jwt_token(jwt_data)
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "email": email,
            "name": user["name"],
            "id": user_id
        }
    }

class registerData(pydantic.BaseModel):
    email: str
    password: str
    name: str

@app.post("/api/register", tags=["Users"])
async def login(data: registerData, response: fastapi.Response):
    data = data.model_dump()
    rcon = await get_redis_connection()
    email, password, name = data["email"], data["password"], data["name"]
    existing = await user_collection.find_one({"email": email})
    if existing:
        return fastapi.responses.JSONResponse(
            status_code=409,
            content={"detail": "User already exists"}
        )
    user_doc = {
        "email": email,
        "name": name,
        "created_at": datetime.datetime.utcnow()
    }
    result = await user_collection.insert_one(user_doc)
    print(result)
    mongo_id = str(result.inserted_id)
    hashed_password = await hash_password(password)
    await rcon.set(mongo_id, hashed_password)
    jwt_data = {
        "user_id": mongo_id,
        "email": email,
        "name": name
    }
    token = await create_jwt_token(jwt_data)
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "email": email,
            "name": name,
            "id": mongo_id
        }
    }


@app.get("/api/me", tags=["Users"])
async def me(request: fastapi.Request):
    auth_user = context.context.get('auth_user', {})
    if not auth_user.get("user_data", {}):
        redirect_url = f"https://{request.base_url.hostname}/login"
        response = fastapi.responses.JSONResponse({'url': redirect_url}, 403)
        return response
    return auth_user["user_data"]



@app.get("/api/all-users", tags=["Users"])
async def getAllUsers():
    auth_user = context.context.get('auth_user', {})
    user_id = str(auth_user["user_data"].get("_id"))
    query = {"_id": {"$ne": ObjectId(user_id)}}
    users_cursor = user_collection.find(query)
    users = []
    async for usr in users_cursor:
        usr["_id"] = str(usr["_id"])
        users.append(usr)
    return users

