from fastapi import FastAPI

from routers.atualizacoes import router as atualizacoes_router

app = FastAPI()

app.include_router(atualizacoes_router)