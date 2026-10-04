from fastapi import APIRouter, Request

ap = APIRouter(prefix="/api/metadata", tags=["Metadata"])

@ap.get("/ip")
async def get_serv_ip (request : Request):
    serv_ip = request.headers.get("X-Forwarded-For")
    if not serv_ip:
        serv_ip = request.client.host
    return {"ip": serv_ip}

@ap.get('/port')
async def get_serv_port (request : Request):
    serv_port = request.url.port
    return {"port": serv_port}