# controllers/atualizacoes_controller.py
from fastapi import APIRouter, File, HTTPException, UploadFile

from services.unidades_service import importar_unidades

router = APIRouter(
    prefix="/api/atualizacoes",
    tags=["Atualizações"],
)

@router.post("/unidades")
def importar_unidades_endpoint(
    dgp_csv: UploadFile = File(...),
    dicionario_csv: UploadFile = File(...),
):
    try:
        return importar_unidades(dgp_csv, dicionario_csv)
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro