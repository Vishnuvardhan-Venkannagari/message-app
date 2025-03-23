from server import app
from websocket import router as websocket_router
import uvicorn

# app.include_router(websocket_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)